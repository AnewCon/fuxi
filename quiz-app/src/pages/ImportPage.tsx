import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { parseQuestionText, previewNormalizedText, addQuestionBank, type QuestionBank } from '@/utils/storage'

type ImportStep = 'format' | 'input' | 'preview' | 'naming' | 'success'

export default function ImportPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<ImportStep>('format')
  const [rawText, setRawText] = useState('')
  const [normalizedText, setNormalizedText] = useState('')
  const [bankName, setBankName] = useState('')
  const [parsedCount, setParsedCount] = useState(0)
  const [error, setError] = useState('')

  const handleParse = () => {
    if (!rawText.trim()) {
      setError('请输入题库内容')
      return
    }

    // 先做格式纠正预览
    const normalized = previewNormalizedText(rawText)
    setNormalizedText(normalized)

    const questions = parseQuestionText(rawText)
    if (questions.length === 0) {
      setError('未能识别到题目，请检查输入内容是否包含有效题目')
      return
    }

    setParsedCount(questions.length)
    setError('')
    setStep('preview')
  }

  const handleConfirmName = () => {
    if (!bankName.trim()) {
      setError('请输入题库名称')
      return
    }

    const questions = parseQuestionText(rawText)
    const bank: QuestionBank = {
      id: `bank_${Date.now()}`,
      name: bankName.trim(),
      questions,
      createdAt: new Date().toISOString(),
    }

    addQuestionBank(bank)
    setStep('success')
  }

  const stepLabels: Record<ImportStep, string> = {
    format: '格式说明',
    input: '粘贴内容',
    preview: '格式预览',
    naming: '命名题库',
    success: '导入成功',
  }

  const stepOrder: ImportStep[] = ['format', 'input', 'preview', 'naming', 'success']

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
          <div className="text-sm text-gray-500">
            步骤 {stepOrder.indexOf(step) + 1}/{stepOrder.length}：{stepLabels[step]}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto pb-2">
          {stepOrder.map((s, idx) => (
            <div key={s} className="flex items-center gap-1 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                step === s ? 'bg-primary text-white scale-110' :
                (stepOrder.indexOf(step) > idx) ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {(stepOrder.indexOf(step) > idx) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < stepOrder.length - 1 && <div className={`w-8 h-0.5 ${stepOrder.indexOf(step) > idx ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* ===== Step 1: Format Guide ===== */}
          {step === 'format' && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <FileText className="w-7 h-7" />
                题库格式说明
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900">
                    <p className="font-bold mb-1">自动格式纠正已开启</p>
                    <p>系统会自动识别并纠正不规范的格式，包括：</p>
                    <ul className="mt-1 space-y-0.5 ml-4 list-disc">
                      <li>"第 3 题" → "**第3题**"</li>
                      <li>"正确答案：A" → "**正确答案：A**"</li>
                      <li>"A、对" → "A. 对"</li>
                      <li>"答案：B" / "参考答案：B" → "**正确答案：B**"</li>
                      <li>自动识别判断题、多选题类型</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-blue-900 mb-3">标准格式要求：</h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• 每道题以 <code className="bg-blue-100 px-1 rounded">**第N题**</code> 开头</li>
                  <li>• 题目内容紧跟在题号后面</li>
                  <li>• 选项以 <code className="bg-blue-100 px-1 rounded">A.</code> <code className="bg-blue-100 px-1 rounded">B.</code> <code className="bg-blue-100 px-1 rounded">C.</code> <code className="bg-blue-100 px-1 rounded">D.</code> 开头</li>
                  <li>• 正确答案以 <code className="bg-blue-100 px-1 rounded">**正确答案：X**</code> 格式标注</li>
                  <li>• 判断题选项为 <code className="bg-blue-100 px-1 rounded">A. 对</code> <code className="bg-blue-100 px-1 rounded">B. 错</code></li>
                  <li>• 多选题答案为多个字母组合，如 <code className="bg-blue-100 px-1 rounded">**正确答案：ABC**</code></li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-700 mb-2 text-sm">标准格式示例：</h4>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
{`**第1题**
题目内容...
A. 选项A
B. 选项B
**正确答案：B**`}
                  </pre>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-2 text-sm flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    不规范格式（可自动纠正）：
                  </h4>
                  <pre className="text-xs text-amber-700 whitespace-pre-wrap font-mono">
{`第 3 题
直流发电机的主要缺点是换向问题
A. 对
B. 错
正确答案：A`}
                  </pre>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">提示：</p>
                    <ul className="space-y-1">
                      <li>• 题库内容可以直接从 txt/Word/PDF 文件复制粘贴</li>
                      <li>• 系统会自动纠正格式，并在下一步展示纠正效果</li>
                      <li>• 支持自动识别单选题、多选题、判断题</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('input')}
                className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors"
              >
                下一步：粘贴题库内容
              </button>
            </div>
          )}

          {/* ===== Step 2: Input ===== */}
          {step === 'input' && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
                <Upload className="w-7 h-7" />
                粘贴题库内容
              </h2>
              <p className="text-gray-500 text-sm mb-6">支持各种格式，系统会自动纠正不规范的内容</p>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="请在此处粘贴题库内容...&#10;&#10;支持以下格式：&#10;第 3 题&#10;直流发电机的主要缺点是换向问题&#10;A. 对&#10;B. 错&#10;正确答案：A&#10;&#10;或标准格式：&#10;**第1题**&#10;题目内容...&#10;A. 选项A&#10;B. 选项B&#10;**正确答案：B**"
                className="w-full h-80 p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none font-mono text-sm leading-relaxed"
              />

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <span>已输入 {rawText.length} 字符</span>
                {rawText.length > 0 && <span>·</span>}
                {rawText.length > 0 && <span>点击"解析并预览"查看纠正效果</span>}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep('format')}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={handleParse}
                  disabled={!rawText.trim()}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  解析并预览
                </button>
              </div>
            </div>
          )}

          {/* ===== Step 3: Preview ===== */}
          {step === 'preview' && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-accent" />
                格式纠正预览
              </h2>
              <p className="text-gray-500 text-sm mb-6">系统已自动纠正格式，请确认以下内容是否正确</p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-green-800 font-medium text-sm">
                  <CheckCircle className="w-5 h-5" />
                  成功识别 {parsedCount} 道题目
                </div>
              </div>

              <div className="relative mb-4">
                <div className="absolute top-2 right-3 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">纠正后</div>
                <pre className="w-full h-72 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl overflow-auto text-sm font-mono leading-relaxed whitespace-pre-wrap">
                  {normalizedText}
                </pre>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-800">
                <span className="font-medium">提示：</span>
                如果纠正结果不正确，可以返回上一步修改原始内容。
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('input')}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  返回修改
                </button>
                <button
                  onClick={() => setStep('naming')}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors"
                >
                  确认格式，下一步
                </button>
              </div>
            </div>
          )}

          {/* ===== Step 4: Naming ===== */}
          {step === 'naming' && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <CheckCircle className="w-7 h-7 text-green-600" />
                为题库命名
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-green-900">成功识别 {parsedCount} 道题目</span>
                </div>
                <p className="text-sm text-green-800">请为本次导入的题库命名：</p>
              </div>

              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="例如：电机学题库、期末考试题库..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg mb-2"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmName()
                }}
              />
              <p className="text-xs text-gray-400 mb-4">按 Enter 键可快速确认</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('preview')}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={handleConfirmName}
                  className="flex-1 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-light transition-colors"
                >
                  确认导入
                </button>
              </div>
            </div>
          )}

          {/* ===== Step 5: Success ===== */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-primary mb-3">导入成功！</h2>
              <p className="text-gray-600 mb-2">题库名称：<span className="font-bold text-primary">{bankName}</span></p>
              <p className="text-gray-600 mb-8">共 {parsedCount} 道题目</p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">提示：</span>
                  使用该题库做题时，产生的错题将自动保存到对应的错题库中。
                  例如使用"{bankName}"做题，错题将保存到"错题库 - {bankName}"。
                </p>
              </div>

              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors"
              >
                返回首页开始复习
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
