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
  toggleAnswer: (label: string) => void
  submitAnswer: () => void
  nextQuestion: () => void
  getCurrentQuestion: () => Question | null
  isLastQuestion: () => boolean
  refreshWrongBook: () => void
  reset: () => void
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
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
    const { selectedAnswers, getCurrentQuestion, results, bankId } = get()
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
    if (!isCorrect) {
      addWrongQuestion(bankId, q, userAnswer)
    } else if (get().mode === 'wrong') {
      removeWrongQuestion(bankId, q.id)
    }

    const newResult: QuizResult = {
      questionId: q.id,
      userAnswer,
      correctAnswer: q.answer,
      isCorrect,
    }

    set({
      submitted: true,
      results: [...results, newResult],
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
