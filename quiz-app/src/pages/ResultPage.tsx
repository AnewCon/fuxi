import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Home } from 'lucide-react'
import { useQuizStore } from '@/store/quizStore'
import { getQuestionBank } from '@/utils/storage'

export default function ResultPage() {
  const navigate = useNavigate()
  const { results, mode, bankId, reset } = useQuizStore()

  const correctCount = results.filter((r) => r.isCorrect).length
  const wrongCount = results.filter((r) => !r.isCorrect).length
  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0
  const bank = bankId ? getQuestionBank(bankId) : undefined

  const getQuestion = (id: number) => bank?.questions.find((q) => q.id === id)

  const handleRestart = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">答题结果</h1>
          <p className="text-gray-600">{bank?.name || ''} · {mode === 'full' ? '完整复习' : '错题强化'} · 共 {results.length} 题</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-primary">{results.length}</p>
            <p className="text-sm text-gray-500 mt-1">总题数</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-green-600">{correctCount}</p>
            <p className="text-sm text-gray-500 mt-1">正确</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-red-600">{wrongCount}</p>
            <p className="text-sm text-gray-500 mt-1">错误</p>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 text-center">
          <p className="text-sm text-gray-500 mb-2">正确率</p>
          <p className={`text-5xl font-bold ${accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-accent' : 'text-red-600'}`}>
            {accuracy}%
          </p>
          <p className="text-gray-600 mt-4">
            {accuracy >= 80 ? '太棒了！继续保持！' : accuracy >= 60 ? '不错，还有提升空间！' : '加油，多复习错题！'}
          </p>
        </div>

        {/* Results List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="font-bold text-lg text-primary mb-4">答题详情</h2>
          <div className="space-y-3">
            {results.map((r, idx) => {
              const q = getQuestion(r.questionId)
              if (!q) return null
              return (
                <div key={idx} className={`p-4 rounded-xl border-2 ${r.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-3">
                    {r.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">第 {q.id} 题 ({q.type === 'single' ? '单选' : q.type === 'multiple' ? '多选' : '判断'})</p>
                      <p className="text-sm text-gray-800 line-clamp-2 mb-2">{q.content}</p>
                      <div className="text-xs">
                        <span className="text-gray-600">你的答案：</span>
                        <span className={`font-medium ${r.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{r.userAnswer}</span>
                        {!r.isCorrect && (
                          <>
                            <span className="text-gray-600 ml-3">正确答案：</span>
                            <span className="font-medium text-green-700">{r.correctAnswer}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
