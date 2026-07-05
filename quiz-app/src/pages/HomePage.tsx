import { useNavigate } from 'react-router-dom'
import { BookOpen, AlertCircle, BarChart3, Upload, Trash2, Edit3, Check, X } from 'lucide-react'
import { useQuizStore } from '@/store/quizStore'
import {
  getQuestionBanks,
  getWrongQuestions,
  getStudyStats,
  deleteQuestionBank,
  renameQuestionBank,
  addQuestionBank,
  type QuestionBank,
} from '@/utils/storage'
import { useState, useEffect, useMemo } from 'react'
import { defaultQuestions } from '@/data/questions'
import { motorQuestions } from '@/data/motorQuestions'

interface BankStats {
  wrongCount: number
  stats: { totalAnswered: number; correctCount: number; wrongCount: number }
}

export default function HomePage() {
  const navigate = useNavigate()
  const startQuiz = useQuizStore((s) => s.startQuiz)
  const [banks, setBanks] = useState<QuestionBank[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [bankStats, setBankStats] = useState<Record<string, BankStats>>({})

  useEffect(() => {
    // 初始化默认题库
    const existing = getQuestionBanks()
    if (existing.length === 0) {
      addQuestionBank({
        id: 'default',
        name: '思政复习题',
        questions: defaultQuestions,
        createdAt: new Date().toISOString(),
      })
    }
    // 确保电机题库存在
    const hasMotor = getQuestionBanks().some(b => b.id === 'motor')
    if (!hasMotor) {
      addQuestionBank({
        id: 'motor',
        name: '电机',
        questions: motorQuestions,
        createdAt: new Date().toISOString(),
      })
    }
    const loadedBanks = getQuestionBanks()
    setBanks(loadedBanks)

    // 异步加载统计数据，避免阻塞渲染
    const statsMap: Record<string, BankStats> = {}
    loadedBanks.forEach((bank) => {
      statsMap[bank.id] = {
        wrongCount: getWrongQuestions(bank.id).length,
        stats: getStudyStats(bank.id),
      }
    })
    setBankStats(statsMap)
  }, [])

  const refreshBanks = () => setBanks(getQuestionBanks())

  const handleStart = (bankId: string, mode: 'full' | 'wrong') => {
    const wrongCount = getWrongQuestions(bankId).length
    if (mode === 'wrong' && wrongCount === 0) {
      alert('该题库的错题库为空，请先进行完整复习！')
      return
    }
    startQuiz(bankId, mode)
    navigate('/quiz')
  }

  const handleDelete = (bankId: string, bankName: string) => {
    if (bankId === 'default') {
      alert('默认题库不能删除！')
      return
    }
    if (confirm(`确定要删除题库"${bankName}"及其错题库吗？此操作不可恢复！`)) {
      deleteQuestionBank(bankId)
      refreshBanks()
    }
  }

  const handleRenameStart = (bank: QuestionBank) => {
    setEditingId(bank.id)
    setEditName(bank.name)
  }

  const handleRenameConfirm = (bankId: string) => {
    if (editName.trim()) {
      renameQuestionBank(bankId, editName.trim())
      refreshBanks()
    }
    setEditingId(null)
  }

  const handleRenameCancel = () => {
    setEditingId(null)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-3">题库复习系统</h1>
          <p className="text-gray-600 text-lg">多题库管理 · 智能错题强化</p>
        </div>

        {/* Import Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/import')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-light transition-all shadow-md hover:shadow-lg"
          >
            <Upload className="w-5 h-5" />
            导入题库
          </button>
        </div>

        {/* Bank Cards */}
        <div className="space-y-6">
          {banks.map((bank) => {
            const stats = bankStats[bank.id]?.stats || { totalAnswered: 0, correctCount: 0, wrongCount: 0 }
            const wrongCount = bankStats[bank.id]?.wrongCount || 0
            const accuracy = stats.totalAnswered > 0 ? Math.round((stats.correctCount / stats.totalAnswered) * 100) : 0

            return (
              <div key={bank.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                {/* Bank Header */}
                <div className="flex items-center justify-between mb-4">
                  {editingId === bank.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-1.5 border-2 border-primary rounded-lg focus:outline-none text-lg font-bold text-primary"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameConfirm(bank.id)
                          if (e.key === 'Escape') handleRenameCancel()
                        }}
                      />
                      <button onClick={() => handleRenameConfirm(bank.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={handleRenameCancel} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-primary">{bank.name}</h2>
                        <p className="text-sm text-gray-500">共 {bank.questions.length} 题</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRenameStart(bank)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="重命名"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {bank.id !== 'default' && (
                      <button
                        onClick={() => handleDelete(bank.id, bank.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{stats.totalAnswered}</p>
                    <p className="text-xs text-gray-500">已答</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                    <p className="text-xs text-gray-500">正确率</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-red-600">{wrongCount}</p>
                    <p className="text-xs text-gray-500">错题</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStart(bank.id, 'full')}
                    className="py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    完整复习
                  </button>
                  <button
                    onClick={() => handleStart(bank.id, 'wrong')}
                    disabled={wrongCount === 0}
                    className="py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-light transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    错题强化
                  </button>
                </div>

                {/* Wrong Book Link */}
                {wrongCount > 0 && (
                  <div className="mt-3 text-center">
                    <button
                      onClick={() => navigate(`/wrong?bank=${bank.id}`)}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      查看错题库 →
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
