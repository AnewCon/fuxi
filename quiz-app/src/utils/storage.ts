import type { Question, QuestionType } from '@/data/questions'

// ==================== 题库存储 ====================
const BANKS_KEY = 'quiz_banks_v2'

export interface QuestionBank {
  id: string
  name: string
  questions: Question[]
  createdAt: string
}

export function getQuestionBanks(): QuestionBank[] {
  const raw = localStorage.getItem(BANKS_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) as QuestionBank[] } catch { return [] }
}

export function saveQuestionBanks(banks: QuestionBank[]): void {
  localStorage.setItem(BANKS_KEY, JSON.stringify(banks))
}

export function addQuestionBank(bank: QuestionBank): void {
  const banks = getQuestionBanks()
  banks.push(bank)
  saveQuestionBanks(banks)
}

export function getQuestionBank(id: string): QuestionBank | undefined {
  return getQuestionBanks().find((b) => b.id === id)
}

export function deleteQuestionBank(id: string): void {
  saveQuestionBanks(getQuestionBanks().filter((b) => b.id !== id))
  // 同时删除对应的错题库
  localStorage.removeItem(`wrong_${id}`)
  localStorage.removeItem(`stats_${id}`)
}

export function renameQuestionBank(id: string, newName: string): void {
  const banks = getQuestionBanks()
  const bank = banks.find((b) => b.id === id)
  if (bank) {
    bank.name = newName
    saveQuestionBanks(banks)
  }
}

// ==================== 错题库存储 ====================
export interface WrongQuestion {
  questionId: number
  type: QuestionType
  content: string
  options: { label: string; text: string }[]
  answer: string
  analysis?: string
  wrongAnswer: string
  wrongCount: number
  addedAt: string
}

export function getWrongQuestions(bankId: string): WrongQuestion[] {
  const raw = localStorage.getItem(`wrong_${bankId}`)
  if (!raw) return []
  try { return JSON.parse(raw) as WrongQuestion[] } catch { return [] }
}

export function saveWrongQuestions(bankId: string, list: WrongQuestion[]): void {
  localStorage.setItem(`wrong_${bankId}`, JSON.stringify(list))
}

export function addWrongQuestion(bankId: string, q: Question, wrongAnswer: string): void {
  const list = getWrongQuestions(bankId)
  const existing = list.find((w) => w.questionId === q.id)
  if (existing) {
    existing.wrongCount += 1
    existing.wrongAnswer = wrongAnswer
  } else {
    list.push({
      questionId: q.id,
      type: q.type,
      content: q.content,
      options: q.options,
      answer: q.answer,
      analysis: q.analysis,
      wrongAnswer,
      wrongCount: 1,
      addedAt: new Date().toISOString(),
    })
  }
  saveWrongQuestions(bankId, list)
}

export function removeWrongQuestion(bankId: string, questionId: number): void {
  const list = getWrongQuestions(bankId).filter((w) => w.questionId !== questionId)
  saveWrongQuestions(bankId, list)
}

export function clearWrongQuestions(bankId: string): void {
  localStorage.removeItem(`wrong_${bankId}`)
}

// ==================== 学习统计 ====================
export interface StudyStats {
  totalAnswered: number
  correctCount: number
  wrongCount: number
}

export function getStudyStats(bankId: string): StudyStats {
  const raw = localStorage.getItem(`stats_${bankId}`)
  if (!raw) return { totalAnswered: 0, correctCount: 0, wrongCount: 0 }
  try { return JSON.parse(raw) as StudyStats } catch { return { totalAnswered: 0, correctCount: 0, wrongCount: 0 } }
}

export function updateStudyStats(bankId: string, correct: boolean): void {
  const stats = getStudyStats(bankId)
  stats.totalAnswered += 1
  if (correct) stats.correctCount += 1
  else stats.wrongCount += 1
  localStorage.setItem(`stats_${bankId}`, JSON.stringify(stats))
}

export function resetStudyStats(bankId: string): void {
  localStorage.removeItem(`stats_${bankId}`)
}

// ==================== 题库解析器（含自动格式纠正） ====================

/**
 * 检查一行是否是题号行（更灵活的模式匹配）
 * 如果题号后面跟着内容，也会被识别并返回
 */
function isQuestionNumberLine(line: string): { id: number; restContent?: string } | null {
  const cleaned = line.replace(/[\r\t]/g, '').trim()
  if (!cleaned) return null

  // 模式1：第 N 题 / 第N题 / **第N题**
  let match = cleaned.match(/^(?:\*{0,2})第\s*(\d+)\s*题(?:\*{0,2})\s*(.*)/)
  if (match && match[1]) {
    return { id: parseInt(match[1], 10), restContent: match[2].trim() || undefined }
  }

  // 模式2：N. 或 N、（行首纯数字+点/顿号，数字至少2位或后跟中文）
  // 限制：避免把 "1. xxx" 这种小数字误识别为题号
  match = cleaned.match(/^(\d{2,})[.、]\s*(.*)/)
  if (match) {
    return { id: parseInt(match[1], 10), restContent: match[2].trim() || undefined }
  }

  return null
}

/**
 * 检查一行是否是正确答案行
 */
function isAnswerLine(line: string): { answer: string; inlineAnalysis?: string } | null {
  let cleaned = line.replace(/[\r\t]/g, '').trim()
  // 去掉前导的 ** 粗体标记
  cleaned = cleaned.replace(/^\*{0,2}/, '')
  // 匹配：正确答案：X / 答案：X / 参考答案：X
  // 支持多选题答案（如ABC）和判断题答案（对/错）
  // 答案后面可能有 ** 粗体标记和括号中的解析
  const match = cleaned.match(/^(?:正确|参考)?答案[：:]\s*([对错A-Da-d]+)\*{0,2}(?:[（(](.+)[）)])?/)
  if (match) {
    return { answer: match[1].toUpperCase(), inlineAnalysis: match[2]?.trim() || undefined }
  }
  return null
}

/**
 * 检查一行是否是选项行
 */
function isOptionLine(line: string): { label: string; text: string } | null {
  const cleaned = line.replace(/[\r\t]/g, '').trim()
  // 匹配：A. xxx / A、xxx
  const match = cleaned.match(/^([A-Da-d])[.、]\s*(.*)$/)
  if (match) {
    return { label: match[1].toUpperCase(), text: match[2].trim() }
  }
  return null
}

/**
 * 检查一行是否是解析行
 */
function isAnalysisLine(line: string): string | null {
  const cleaned = line.replace(/[\r\t]/g, '').trim()
  const match = cleaned.match(/^解析[：:]\s*(.+)$/)
  if (match) {
    return match[1].trim()
  }
  return null
}

/**
 * 判断题型
 */
function detectQuestionType(options: { label: string; text: string }[], answer: string): QuestionType {
  // 根据答案判断
  if (answer === '对' || answer === '错') return 'judge'
  if (answer.length > 1) return 'multiple'

  // 根据选项内容判断
  if (options.length === 2) {
    const texts = options.map((o) => o.text)
    if (texts.includes('对') && texts.includes('错')) return 'judge'
  }

  return 'single'
}

/**
 * 预处理原始文本：处理各种不规范格式
 * 1. 处理单行格式（多道题在一行）
 * 2. 处理题号行格式（确保题号标记独占一行）
 */
function preprocessRawText(rawText: string): string {
  let text = rawText

  // 统一换行符
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // 统计题号标记数量
  const questionMarkers = (text.match(/第\s*\d+\s*题/g) || []).length

  // 只要有题号标记就进行格式规范化
  if (questionMarkers >= 1) {
    // 1. 在题号标记前后插入换行（确保题号行独立）
    text = text.replace(/\s*(第\s*\d+\s*题)\s*/g, '\n$1\n')

    // 2. 在答案标记前插入换行
    text = text.replace(/\s*((?:正确|参考)?答案[：:])/g, '\n$1')

    // 3. 在解析标记前插入换行
    text = text.replace(/\s*(解析[：:])/g, '\n$1')

    // 4. 在选项标记前插入换行
    // 只在选项标记前有非换行的空白时才插入换行
    text = text.replace(/([^\n])\s+([A-Da-d])[.、]/g, '$1\n$2. ')

    // 5. 清理多余的连续换行
    text = text.replace(/\n{3,}/g, '\n\n')

    // 6. 清理每行开头和结尾的空白
    text = text.split('\n').map(line => line.trim()).join('\n')
  }

  return text
}

export function parseQuestionText(rawText: string): Question[] {
  // 预处理：处理单行/少行格式
  const processedText = preprocessRawText(rawText)

  // Split by various line ending formats
  const lines = processedText.split(/\r?\n|\r/)
  const questions: Question[] = []
  
  let currentId = 0
  let currentContent = ''
  let currentOptions: { label: string; text: string }[] = []
  let currentAnswer = ''
  let currentAnalysis: string | undefined

  function flushQuestion() {
    if (currentId > 0 && currentContent && currentAnswer && currentOptions.length > 0) {
      const type = detectQuestionType(currentOptions, currentAnswer)
      questions.push({
        id: currentId,
        type,
        content: currentContent.trim(),
        options: currentOptions,
        answer: currentAnswer,
        analysis: currentAnalysis,
      })
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // 1. 检测题号（优先级最高）
    const questionNum = isQuestionNumberLine(trimmed)
    if (questionNum) {
      // 保存上一题
      flushQuestion()
      // 重置状态
      currentId = questionNum.id
      currentContent = questionNum.restContent || ''
      currentOptions = []
      currentAnswer = ''
      currentAnalysis = undefined
      continue
    }

    // 2. 检测正确答案
    const answerResult = isAnswerLine(trimmed)
    if (answerResult) {
      currentAnswer = answerResult.answer
      if (answerResult.inlineAnalysis && !currentAnalysis) {
        currentAnalysis = answerResult.inlineAnalysis
      }
      continue
    }

    // 3. 检测解析
    const analysis = isAnalysisLine(trimmed)
    if (analysis) {
      currentAnalysis = analysis
      continue
    }

    // 4. 检测选项
    const option = isOptionLine(trimmed)
    if (option && currentId > 0) {
      currentOptions.push(option)
      continue
    }

    // 5. 其他内容 → 题目内容
    if (currentId > 0) {
      if (!currentContent) {
        currentContent = trimmed
      } else if (currentOptions.length === 0) {
        // 题目内容可能有多行，拼接
        currentContent += ' ' + trimmed
      }
    }
  }

  // 保存最后一题
  flushQuestion()

  return questions
}

/**
 * 预览格式化后的文本（用于展示给用户看纠正效果）
 */
export function previewNormalizedText(rawText: string): string {
  const questions = parseQuestionText(rawText)
  return questions.map((q) => {
    let text = `**第${q.id}题**\n${q.content}\n`
    q.options.forEach((opt) => {
      text += `${opt.label}. ${opt.text}\n`
    })
    text += `**正确答案：${q.answer}**`
    if (q.analysis) {
      text += `\n解析：${q.analysis}`
    }
    return text
  }).join('\n\n---\n\n')
}
