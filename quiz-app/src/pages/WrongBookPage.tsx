import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react'
import {
  getWrongQuestions,
  removeWrongQuestion,
  clearWrongQuestions,
  getQuestionBanks,
  type WrongQuestion,
} from '@/utils/storage'
import { useState, useEffect } from 'react'

export default function WrongBookPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const bankParam = searchParams.get('bank')

  const banks = getQuestionBanks()
  const [selectedBankId, setSelectedBankId] = useState(bankParam || (banks.length > 0 ? banks[0].id : ''))
  const [wrongList, setWrongList] = useState<WrongQuestion[]>([])
  const [filter, setFilter] = useState<'all' | 'single' | 'multiple' | 'judge'>('all')
  const [bankWrongCounts, setBankWrongCounts] = useState<Record<string, number>>({})

  // 初始化时计算各题库错题数（只执行一次）
  useEffect(() => {
    const countsMap: Record<string, number> = {}
    banks.forEach((bank) => {
      countsMap[bank.id] = getWrongQuestions(bank.id).length
    })
    setBankWrongCounts(countsMap)
  }, [])

  // 切换题库时加载错题列表
  useEffect(() => {
    if (selectedBankId) {
      setWrongList(getWrongQuestions(selectedBankId))
    }
  }, [selectedBankId])

  const selectedBank = banks.find((b) => b.id === selectedBankId)
  const filteredList = filter === 'all' ? wrongList : wrongList.filter((w) => w.type === filter)

  const handleRemove = (questionId: number) => {
    if (confirm('确定要从错题库中移除这道题吗？')) {
      removeWrongQuestion(selectedBankId, questionId)
      setWrongList(getWrongQuestions(selectedBankId))
    }
  }

  const handleClearAll = () => {
    if (confirm(`确定要清空"${selectedBank?.name}"的错题库吗？此操作不可恢复！`)) {
      clearWrongQuestions(selectedBankId)
      setWrongList([])
    }
  }

  const typeLabel = (type: WrongQuestion['type']) => {
    if (type === 'single') return '单选'
    if (type === 'multiple') return '多选'
    return '判断'
  }

  const typeColor = (type: WrongQuestion['type']) => {
    if (type === 'single') return 'bg-blue-100 text-blue-700'
    if (type === 'multiple') return 'bg-purple-100 text-purple-700'
    return 'bg-orange-100 text-orange-700'
  }

  if (banks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">暂无题库</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-white rounded-lg">返回首页</button>
        </div>
      </div>
    )
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
          {wrongList.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">清空错题库</span>
            </button>
          )}
        </div>

        {/* Bank Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {banks.map((b) => {
            const count = bankWrongCounts[b.id] || 0
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBankId(b.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedBankId === b.id ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {b.name} ({count})
              </button>
            )
          })}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            错题库 - {selectedBank?.name}
          </h1>
          <p className="text-gray-600">共 {wrongList.length} 道错题</p>
        </div>

        {/* Filter */}
        {wrongList.length > 0 && (
          <div className="flex justify-center gap-2 mb-6">
            {(['all', 'single', 'multiple', 'judge'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === t ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t === 'all' ? '全部' : t === 'single' ? '单选' : t === 'multiple' ? '多选' : '判断'}
              </button>
            ))}
          </div>
        )}

        {/* Wrong Questions List */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">
              {wrongList.length === 0 ? '该题库暂无错题' : '该题型暂无错题'}
            </p>
            <p className="text-gray-400 text-sm">
              {wrongList.length === 0 ? '使用该题库做题后，错题会自动加入错题库' : '尝试切换其他题型筛选'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredList.map((w) => (
              <div key={w.questionId} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor(w.type)}`}>
                      {typeLabel(w.type)}
                    </span>
                    <span className="text-sm text-gray-500">第 {w.questionId} 题</span>
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                      错 {w.wrongCount} 次
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(w.questionId)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="移除此题"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-gray-800 mb-3 leading-relaxed">{w.content}</p>

                <div className="space-y-2 mb-3">
                  {w.options.map((opt) => {
                    const isCorrect = w.type === 'judge' ? opt.label === w.answer : w.answer.includes(opt.label)
                    const isWrong = w.wrongAnswer.includes(opt.label)
                    return (
                      <div
                        key={opt.label}
                        className={`p-3 rounded-lg text-sm ${
                          isCorrect ? 'bg-green-50 border border-green-200 text-green-800' : isWrong ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        <span className="font-medium">{opt.label}.</span> {opt.text}
                        {isCorrect && <span className="ml-2 text-green-600 font-medium">(正确答案)</span>}
                        {isWrong && !isCorrect && <span className="ml-2 text-red-600 font-medium">(你的错误答案)</span>}
                      </div>
                    )
                  })}
                </div>

                {w.analysis && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                    <span className="font-medium">解析：</span>
                    {w.analysis}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
