import { create } from 'zustand'
import type { Question } from '@/data/questions'
import {
  getWrongQuestions,
  addWrongQuestion,
  removeWrongQuestion,
  updateStudyStats,
  type WrongQuestion,
  type QuestionBank,
  getQuestionBank,
} from '@/utils/storage'

export type QuizMode = 'full' | 'wrong'

export interface QuizResult {
  questionId: number
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

interface QuizState {
  bankId: string
  mode: QuizMode
  questionPool: Question[]
  currentIndex: number
  selectedAnswers: string[]
  submitted: boolean
  results: QuizResult[]
  wrongBook: WrongQuestion[]

  startQuiz: (bankId: string, mode: QuizMode) => void
  resumeQuiz: () => void
  hasSavedProgress: () => boolean
  clearSavedProgress: () => void
  toggleAnswer: (label: string) => void
  submitAnswer: () => void
  nextQuestion: () => void
  getCurrentQuestion: () => Question | null
  isLastQuestion: () => boolean
  refreshWrongBook: () => void
  reset: () => void
}

const PROGRESS_KEY = 'quiz_progress'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function saveProgress(state: { bankId: string; mode: QuizMode; questionPool: Question[]; currentIndex: number; results: QuizResult[] }) {
  if (state.bankId && state.questionPool.length > 0) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      bankId: state.bankId,
      mode: state.mode,
      currentIndex: state.currentIndex,
      results: state.results,
      questionIds: state.questionPool.map(q => q.id),
    }))
  }
}

export const useQuizStore = create<QuizState>((set, get) => ({
  bankId: '',
  mode: 'full',
  questionPool: [],
  currentIndex: 0,
  selectedAnswers: [],
  submitted: false,
  results: [],
  wrongBook: [],

  startQuiz: (bankId: string, mode: QuizMode) => {
    const bank = getQuestionBank(bankId)
    if (!bank) return

    let pool: Question[]
    if (mode === 'wrong') {
      const wrongList = getWrongQuestions(bankId)
      const wrongIds = new Set(wrongList.map((w) => w.questionId))
      pool = bank.questions.filter((q) => wrongIds.has(q.id))
    } else {
      pool = [...bank.questions]
    }
    pool = shuffleArray(pool)

    // Clear any saved progress when starting fresh
    localStorage.removeItem(PROGRESS_KEY)

    set({
      bankId,
      mode,
      questionPool: pool,
      currentIndex: 0,
      selectedAnswers: [],
      submitted: false,
      results: [],
    })
    get().refreshWrongBook()
  },

  resumeQuiz: () => {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return
    try {
      const saved = JSON.parse(raw)
      const bank = getQuestionBank(saved.bankId)
      if (!bank) return

      // Rebuild question pool from saved IDs
      const idMap = new Map(bank.questions.map(q => [q.id, q]))
      const pool = saved.questionIds.map((id: number) => idMap.get(id)).filter(Boolean)
      if (pool.length === 0) return

      set({
        bankId: saved.bankId,
        mode: saved.mode,
        questionPool: pool,
        currentIndex: saved.currentIndex,
        selectedAnswers: [],
        submitted: false,
        results: saved.results || [],
      })
      get().refreshWrongBook()
    } catch {
      localStorage.removeItem(PROGRESS_KEY)
    }
  },

  hasSavedProgress: () => {
    return !!localStorage.getItem(PROGRESS_KEY)
  },

  clearSavedProgress: () => {
    localStorage.removeItem(PROGRESS_KEY)
  },

  toggleAnswer: (label: string) => {
    const { selectedAnswers, submitted, getCurrentQuestion } = get()
    if (submitted) return
    const q = getCurrentQuestion()
    if (!q) return

    if (q.type === 'single' || q.type === 'judge') {
      set({ selectedAnswers: [label] })
    } else {
      const idx = selectedAnswers.indexOf(label)
      if (idx >= 0) {
        set({ selectedAnswers: selectedAnswers.filter((a) => a !== label) })
      } else {
        set({ selectedAnswers: [...selectedAnswers, label].sort() })
      }
    }
  },

  submitAnswer: () => {
    const { selectedAnswers, getCurrentQuestion, results, bankId, mode } = get()
    const q = getCurrentQuestion()
    if (!q || selectedAnswers.length === 0) return

    const userAnswer = selectedAnswers.join('')
    let isCorrect = false

    if (q.type === 'judge') {
      isCorrect = userAnswer === q.answer
    } else if (q.type === 'single') {
      isCorrect = userAnswer === q.answer
    } else {
      isCorrect = userAnswer === q.answer.split('').sort().join('')
    }

    updateStudyStats(bankId, isCorrect)

    // Wrong question logic:
    // - Always add to wrong book if answered incorrectly
    // - Only remove from wrong book if in 'full' mode AND answered correctly
    // - In 'wrong' mode, correct answers stay in the wrong book (user needs to keep practicing)
    if (!isCorrect) {
      addWrongQuestion(bankId, q, userAnswer)
    } else if (mode === 'full') {
      // In full review mode, if answered correctly, remove from wrong book
      removeWrongQuestion(bankId, q.id)
    }
    // In 'wrong' mode, correct answers are NOT removed from wrong book

    const newResult: QuizResult = {
      questionId: q.id,
      userAnswer,
      correctAnswer: q.answer,
      isCorrect,
    }

    const newResults = [...results, newResult]
    set({
      submitted: true,
      results: newResults,
    })

    // Save progress after each answer
    const state = get()
    saveProgress({
      bankId: state.bankId,
      mode: state.mode,
      questionPool: state.questionPool,
      currentIndex: state.currentIndex,
      results: newResults,
    })

    get().refreshWrongBook()
  },

  nextQuestion: () => {
    const { currentIndex, questionPool } = get()
    if (currentIndex < questionPool.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        selectedAnswers: [],
        submitted: false,
      })
    }
  },

  getCurrentQuestion: () => {
    const { questionPool, currentIndex } = get()
    return questionPool[currentIndex] ?? null
  },

  isLastQuestion: () => {
    const { currentIndex, questionPool } = get()
    return currentIndex >= questionPool.length - 1
  },

  refreshWrongBook: () => {
    const { bankId } = get()
    if (bankId) {
      set({ wrongBook: getWrongQuestions(bankId) })
    }
  },

  reset: () => {
    localStorage.removeItem(PROGRESS_KEY)
    set({
      bankId: '',
      mode: 'full',
      questionPool: [],
      currentIndex: 0,
      selectedAnswers: [],
      submitted: false,
      results: [],
    })
  },
}))
