import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { useQuizStore } from '@/store/quizStore'
import { getQuestionBank } from '@/utils/storage'

export default function QuizPage() {
  const navigate = useNavigate()
  const {
    bankId,
    mode,
    questionPool,
    currentIndex,
    selectedAnswers,
    submitted,
    toggleAnswer,
    submitAnswer,
    nextQuestion,
    getCurrentQuestion,
    isLastQuestion,
  } = useQuizStore()

  const question = getCurrentQuestion()
  const bank = bankId ? getQuestionBank(bankId) : undefined

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">暂无题目</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-white rounded-lg">
            返回首页
          </button>
        </div>
      </div>
    )
  }

  const typeLabel = question.type === 'single' ? '单选题' : question.type === 'multiple' ? '多选题' : '判断题'
  const typeColor = question.type === 'single' ? 'bg-blue-100 text-blue-700' : question.type === 'multiple' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'

  const isOptionCorrect = (label: string) => {
    if (!submitted) return false
    if (question.type === 'judge') {
      return label === question.answer
    }
    return question.answer.includes(label)
  }

  const isOptionWrong = (label: string) => {
    if (!submitted) return false
    return selectedAnswers.includes(label) && !isOptionCorrect(label)
  }

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) {
      alert('请至少选择一个答案！')
      return
    }
    submitAnswer()
  }

  const handleNext = () => {
    if (isLastQuestion()) {
      navigate('/result')
    } else {
      nextQuestion()
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
          <div className="text-sm text-gray-500 text-right">
            <div>{bank?.name || '复习中'}</div>
            <div>{mode === 'full' ? '完整复习' : '错题强化'} · 第 {currentIndex + 1} / {questionPool.length} 题</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questionPool.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}>{typeLabel}</span>
            <span className="text-sm text-gray-500">第 {question.id} 题</span>
          </div>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">{question.content}</p>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt) => {
              const isSelected = selectedAnswers.includes(opt.label)
              const correct = isOptionCorrect(opt.label)
              const wrong = isOptionWrong(opt.label)

              let className = 'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 '

              if (submitted) {
                if (correct) {
                  className += 'border-green-500 bg-green-50 text-green-800'
                } else if (wrong) {
                  className += 'border-red-500 bg-red-50 text-red-800'
                } else {
                  className += 'border-gray-200 bg-gray-50 text-gray-600'
                }
              } else {
                if (isSelected) {
                  className += 'border-primary bg-primary/5 text-primary font-medium'
                } else {
                  className += 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                }
              }

              return (
                <button key={opt.label} onClick={() => toggleAnswer(opt.label)} className={className} disabled={submitted}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        borderColor: submitted ? (correct ? '#10b981' : wrong ? '#ef4444' : '#d1d5db') : isSelected ? '#1e3a5f' : '#d1d5db',
                        backgroundColor: submitted ? (correct ? '#d1fae5' : wrong ? '#fee2e2' : '#f9fafb') : isSelected ? '#1e3a5f' : 'transparent',
                        color: submitted ? (correct ? '#065f46' : wrong ? '#991b1b' : '#6b7280') : isSelected ? 'white' : '#6b7280',
                      }}
                    >
                      {opt.label}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {submitted && correct && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                    {submitted && wrong && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Answer Result */}
          {submitted && (
            <div className={`mt-6 p-4 rounded-xl ${selectedAnswers.join('') === (question.type === 'judge' ? question.answer : question.answer.split('').sort().join('')) ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswers.join('') === (question.type === 'judge' ? question.answer : question.answer.split('').sort().join('')) ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800">回答正确！</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-800">回答错误</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">正确答案：</span>
                <span className="font-bold">{question.answer}</span>
              </p>
              {question.analysis && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">解析：</span>
                  {question.analysis}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers.length === 0}
              className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交答案
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-light transition-colors flex items-center gap-2"
            >
              {isLastQuestion() ? '查看结果' : '下一题'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
