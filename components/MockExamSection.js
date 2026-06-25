'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const TOPICS = [
  '土地法規（總則、地籍、地權）',
  '土地登記（程序、效力、特殊登記）',
  '土地稅法（地價稅、土地增值稅）',
  '遺產及贈與稅',
  '民法物權（所有權、共有、他物權）',
  '不動產估價',
  '不動產經紀業管理',
  '都市計畫法規',
  '農地法規',
  '信託法',
  '隨機混合（全科）',
]

const TIME_OPTIONS = [
  { label: '30 分鐘', value: 30 },
  { label: '60 分鐘', value: 60 },
  { label: '90 分鐘', value: 90 },
]

const COUNT_OPTIONS = [10, 20, 30]

function useTimer(seconds, active, onEnd) {
  const [left, setLeft] = useState(seconds)
  const ref = useRef(null)
  useEffect(() => {
    if (!active) return
    setLeft(seconds)
    ref.current = setInterval(() => {
      setLeft(prev => {
        if (prev <= 1) { clearInterval(ref.current); onEnd(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [active, seconds])
  return left
}

function fmtTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export default function MockExamSection({ isPaid }) {
  const [view, setView]         = useState('setup')   // setup | loading | exam | result
  const [topic, setTopic]       = useState('隨機混合（全科）')
  const [timeMin, setTimeMin]   = useState(30)
  const [count, setCount]       = useState(10)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers]   = useState({})
  const [current, setCurrent]   = useState(0)
  const [error, setError]       = useState('')
  const [timerActive, setTimerActive] = useState(false)
  const [timeUp, setTimeUp]     = useState(false)

  const handleTimeUp = useCallback(() => {
    setTimeUp(true)
    setView('result')
    setTimerActive(false)
  }, [])

  const secondsLeft = useTimer(timeMin * 60, timerActive, handleTimeUp)

  const generate = async () => {
    setError('')
    setView('loading')
    try {
      const prompt = `你是台灣地政士與不動產經紀人考試出題老師。
請出 ${count} 題關於「${topic}」的四選一單選題，考試難度：中等至困難。
只回傳 JSON，格式如下（不要加任何其他文字或 Markdown）：
{"questions":[{"q":"題目","opts":["(A) ...","(B) ...","(C) ...","(D) ..."],"ans":"A","exp":"解析說明，引用具體法條"}]}`

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          isPaid,
          mode: 'exam_gen',
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.message || data.error)

      const text = data.content || ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('AI 回傳格式異常，請重試')
      const parsed = JSON.parse(jsonMatch[0])
      if (!parsed.questions || !Array.isArray(parsed.questions)) throw new Error('題目解析失敗')

      setQuestions(parsed.questions)
      setAnswers({})
      setCurrent(0)
      setTimeUp(false)
      setView('exam')
      setTimerActive(true)
    } catch (e) {
      setError(e.message || '出題失敗，請稍後再試')
      setView('setup')
    }
  }

  const selectAnswer = (qIdx, opt) => {
    if (answers[qIdx] !== undefined) return  // 已作答不可更改
    setAnswers(prev => ({ ...prev, [qIdx]: opt }))
  }

  const submit = () => {
    setTimerActive(false)
    setView('result')
  }

  const answered = Object.keys(answers).length
  const correct  = questions.filter((q, i) => answers[i] === q.ans).length
  const score    = questions.length > 0 ? Math.round(correct / questions.length * 100) : 0

  // ── Setup ─────────────────────────────────────
  if (view === 'setup') return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', color: 'white' }}>
        <div style={{ fontSize: '28px', marginBottom: '6px' }}>⏱️</div>
        <h2 style={{ fontWeight: 900, fontSize: '18px', marginBottom: '4px' }}>模擬考試模式</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>AI 出題 × 限時作答 × 詳解說明 — 還原真實考試壓力</p>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '16px' }}>
        <h3 style={{ fontWeight: 800, fontSize: '15px', color: '#0f1f3d', marginBottom: '20px' }}>⚙️ 考試設定</h3>

        {/* 主題 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>📚 考試科目</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {TOPICS.map(t => (
              <button key={t} onClick={() => setTopic(t)}
                style={{ padding: '5px 12px', borderRadius: '20px', border: `1px solid ${topic === t ? '#7c3aed' : '#e2e8f0'}`, cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  background: topic === t ? '#f5f3ff' : 'white', color: topic === t ? '#7c3aed' : '#374151' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 題數 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>🃏 題數</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {COUNT_OPTIONS.map(n => (
              <button key={n} onClick={() => setCount(n)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${count === n ? '#0f1f3d' : '#e2e8f0'}`, cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                  background: count === n ? '#0f1f3d' : 'white', color: count === n ? 'white' : '#374151' }}>
                {n} 題
              </button>
            ))}
          </div>
        </div>

        {/* 時間 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>⏱️ 限制時間</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {TIME_OPTIONS.map(t => (
              <button key={t.value} onClick={() => setTimeMin(t.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${timeMin === t.value ? '#7c3aed' : '#e2e8f0'}`, cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                  background: timeMin === t.value ? '#f5f3ff' : 'white', color: timeMin === t.value ? '#7c3aed' : '#374151' }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
            每題平均 {Math.round(timeMin * 60 / count)} 秒
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={generate}
          style={{ width: '100%', padding: '14px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}>
          🚀 開始模擬考試（AI 出 {count} 題）
        </button>
      </div>

      <div style={{ background: '#f5f3ff', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: '#5b21b6', lineHeight: 1.8 }}>
        <strong>💡 使用說明</strong>：AI 會出 {count} 道四選一選擇題 → 限時作答 → 時間到或提前交卷 → 詳細解析每一題
      </div>
    </div>
  )

  // ── Loading ────────────────────────────────────
  if (view === 'loading') return (
    <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
      <h3 style={{ fontWeight: 800, fontSize: '18px', color: '#0f1f3d', marginBottom: '8px' }}>AI 正在出題中...</h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
        科目：{topic}　題數：{count} 題<br />請稍候約 10～20 秒
      </p>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7c3aed', animation: `pulse 1.2s ${i * 0.3}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  )

  // ── Exam ──────────────────────────────────────
  if (view === 'exam' && questions.length > 0) {
    const q = questions[current]
    const pct = Math.round(secondsLeft / (timeMin * 60) * 100)
    const urgent = secondsLeft <= 60
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* 頂部狀態列 */}
        <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>作答進度　{answered}/{questions.length}</div>
            <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
              <div style={{ background: '#7c3aed', height: '100%', borderRadius: '99px', width: `${answered / questions.length * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '22px', fontWeight: 900, color: urgent ? '#dc2626' : '#0f1f3d', fontVariantNumeric: 'tabular-nums' }}>
              {fmtTime(secondsLeft)}
            </div>
            <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '4px', width: '80px', overflow: 'hidden', marginTop: '3px' }}>
              <div style={{ background: urgent ? '#dc2626' : '#7c3aed', height: '100%', borderRadius: '99px', width: `${pct}%`, transition: 'width 1s linear' }} />
            </div>
          </div>
          <button onClick={submit}
            style={{ padding: '7px 14px', background: '#0f1f3d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
            交卷
          </button>
        </div>

        {/* 題號列 */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: '32px', height: '32px', borderRadius: '6px', border: `2px solid ${current === i ? '#7c3aed' : answers[i] !== undefined ? '#0f1f3d' : '#e2e8f0'}`, cursor: 'pointer', fontWeight: 700, fontSize: '12px',
                background: current === i ? '#f5f3ff' : answers[i] !== undefined ? '#f0f4ff' : 'white',
                color: current === i ? '#7c3aed' : answers[i] !== undefined ? '#0f1f3d' : '#374151' }}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* 題目卡 */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <span style={{ background: '#7c3aed', color: 'white', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, flexShrink: 0 }}>
              第 {current + 1} 題
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8', paddingTop: '4px' }}>{topic}</span>
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f1f3d', lineHeight: 1.7, marginBottom: '20px' }}>{q.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {q.opts.map((opt, oi) => {
              const letter = opt[1]  // (A) → A
              const selected = answers[current] === letter
              return (
                <button key={oi} onClick={() => selectAnswer(current, letter)}
                  style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', cursor: answers[current] !== undefined ? 'default' : 'pointer', fontSize: '14px', fontWeight: selected ? 700 : 400, transition: 'all 0.15s',
                    border: `2px solid ${selected ? '#7c3aed' : '#e2e8f0'}`,
                    background: selected ? '#f5f3ff' : 'white',
                    color: selected ? '#7c3aed' : '#374151' }}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        {/* 上下題 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
            style={{ flex: 1, padding: '10px', background: current === 0 ? '#f1f5f9' : '#e2e8f0', color: current === 0 ? '#94a3b8' : '#374151', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: current === 0 ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
            ← 上一題
          </button>
          <button onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))} disabled={current === questions.length - 1}
            style={{ flex: 1, padding: '10px', background: current === questions.length - 1 ? '#f1f5f9' : '#7c3aed', color: current === questions.length - 1 ? '#94a3b8' : 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: current === questions.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
            下一題 →
          </button>
        </div>
      </div>
    )
  }

  // ── Result ────────────────────────────────────
  if (view === 'result') return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* 成績卡 */}
      <div style={{ background: 'linear-gradient(135deg, #0f1f3d, #1a3a6e)', borderRadius: '16px', padding: '32px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
        {timeUp && <div style={{ background: '#dc2626', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 700, display: 'inline-block', marginBottom: '12px' }}>⏰ 時間到</div>}
        <div style={{ fontSize: '56px', fontWeight: 900, color: score >= 60 ? '#4ade80' : '#f87171', marginBottom: '4px' }}>{score}</div>
        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>分（{correct}/{questions.length} 題答對）</div>
        <div style={{ fontSize: '13px', color: score >= 60 ? '#4ade80' : '#f87171', fontWeight: 700 }}>
          {score >= 80 ? '優秀！繼續保持 🎉' : score >= 60 ? '及格！還有進步空間 👍' : '未及格，需加強複習 📕'}
        </div>
      </div>

      {/* 詳解 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {questions.map((q, i) => {
          const ua = answers[i]
          const correct_q = ua === q.ans
          const notAnswered = ua === undefined
          return (
            <div key={i} style={{ background: 'white', borderRadius: '10px', border: `2px solid ${notAnswered ? '#e2e8f0' : correct_q ? '#16a34a' : '#dc2626'}`, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: notAnswered ? '#f8fafc' : correct_q ? '#f0fdf4' : '#fef2f2', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 900, fontSize: '14px', flexShrink: 0, color: notAnswered ? '#94a3b8' : correct_q ? '#16a34a' : '#dc2626' }}>
                  {notAnswered ? '—' : correct_q ? '✅' : '❌'} 第{i + 1}題
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f1f3d', flex: 1, lineHeight: 1.4 }}>{q.q}</span>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px', fontSize: '12px' }}>
                  <span>你的答案：<strong style={{ color: notAnswered ? '#94a3b8' : correct_q ? '#16a34a' : '#dc2626' }}>{notAnswered ? '未作答' : `(${ua})`}</strong></span>
                  <span>正確答案：<strong style={{ color: '#16a34a' }}>({q.ans})</strong></span>
                </div>
                {q.opts.map((opt, oi) => {
                  const letter = opt[1]
                  const isCorrect = letter === q.ans
                  const isUser    = letter === ua
                  return (
                    <div key={oi} style={{ padding: '6px 10px', borderRadius: '6px', marginBottom: '4px', fontSize: '13px', fontWeight: isCorrect ? 700 : 400,
                      background: isCorrect ? '#f0fdf4' : isUser && !correct_q ? '#fef2f2' : '#f8fafc',
                      color: isCorrect ? '#15803d' : isUser && !correct_q ? '#dc2626' : '#374151',
                      border: `1px solid ${isCorrect ? '#86efac' : isUser && !correct_q ? '#fca5a5' : '#f1f5f9'}` }}>
                      {opt} {isCorrect && '✓'}
                    </div>
                  )
                })}
                {q.exp && (
                  <div style={{ marginTop: '10px', background: '#f0f4ff', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#1e40af', lineHeight: 1.7 }}>
                    <strong>📖 解析：</strong>{q.exp}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => { setView('setup'); setTimerActive(false) }}
          style={{ flex: 1, padding: '12px', background: '#0f1f3d', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          🔄 重新設定
        </button>
        <button onClick={generate}
          style={{ flex: 1, padding: '12px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          ⚡ 再考一次（同設定）
        </button>
      </div>
    </div>
  )

  return null
}
