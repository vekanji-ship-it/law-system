'use client'
import DarkModeToggle from './DarkModeToggle'
import { FULL_LAW_ARTICLES } from '../lib/full-law-data'
import { SUPPLEMENT_LAW_ARTICLES_1 } from '../lib/supplement-law-data-1'
import { SUPPLEMENT_LAW_ARTICLES_2 } from '../lib/supplement-law-data-2'
import { SUPPLEMENT_LAW_ARTICLES_3 } from '../lib/supplement-law-data-3'
import { SUPPLEMENT_LAW_ARTICLES_4 } from '../lib/supplement-law-data-4'
import { SUPPLEMENT_LAW_ARTICLES_5 } from '../lib/supplement-law-data-5'
import { SUPPLEMENT_LAW_ARTICLES_6 } from '../lib/supplement-law-data-6'
import { SUPPLEMENT_LAW_ARTICLES_7 } from '../lib/supplement-law-data-7'
import { SUPPLEMENT_LAW_ARTICLES_8 } from '../lib/supplement-law-data-8'
import { SUPPLEMENT_LAW_ARTICLES_9 } from '../lib/supplement-law-data-9'
import { SUPPLEMENT_LAW_ARTICLES_10 } from '../lib/supplement-law-data-10'
import { SUPPLEMENT_LAW_ARTICLES_11 } from '../lib/supplement-law-data-11'
import { SUPPLEMENT_LAW_ARTICLES_12 } from '../lib/supplement-law-data-12'
import { SUPPLEMENT_LAW_ARTICLES_13 } from '../lib/supplement-law-data-13'
import { SUPPLEMENT_LAW_ARTICLES_14 } from '../lib/supplement-law-data-14'
import { SUPPLEMENT_LAW_ARTICLES_15 } from '../lib/supplement-law-data-15'
import { SUPPLEMENT_LAW_ARTICLES_16 } from '../lib/supplement-law-data-16'
import { SUPPLEMENT_LAW_ARTICLES_17 } from '../lib/supplement-law-data-17'
import { SUPPLEMENT_LAW_ARTICLES_18 } from '../lib/supplement-law-data-18'
import { SUPPLEMENT_LAW_ARTICLES_19 } from '../lib/supplement-law-data-19'
import { SUPPLEMENT_LAW_ARTICLES_20 } from '../lib/supplement-law-data-20'
import { SUPPLEMENT_LAW_ARTICLES_21 } from '../lib/supplement-law-data-21'
import { SUPPLEMENT_LAW_ARTICLES_22 } from '../lib/supplement-law-data-22'
import { SUPPLEMENT_LAW_ARTICLES_23 } from '../lib/supplement-law-data-23'
import { SUPPLEMENT_LAW_ARTICLES_24 } from '../lib/supplement-law-data-24'
import { SUPPLEMENT_LAW_ARTICLES_25 } from '../lib/supplement-law-data-25'
import { SUPPLEMENT_LAW_ARTICLES_26 } from '../lib/supplement-law-data-26'
import { SUPPLEMENT_LAW_ARTICLES_27 } from '../lib/supplement-law-data-27'
import { SUPPLEMENT_LAW_ARTICLES_28 } from '../lib/supplement-law-data-28'
import { SUPPLEMENT_LAW_ARTICLES_29 } from '../lib/supplement-law-data-29'
import { SUPPLEMENT_LAW_ARTICLES_30 } from '../lib/supplement-law-data-30'
import { SUPPLEMENT_LAW_ARTICLES_31 } from '../lib/supplement-law-data-31'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '../lib/supabase-client'
import { CASES, EXAM_QUESTIONS, SOPS } from '../lib/data'
import { REAL_CASES } from '../lib/content-data-v2'
import { SUPPLEMENT_CASES } from '../lib/supplement-cases'
import { SUPPLEMENT_EXAMS } from '../lib/supplement-exams'
import LawSection from './LawSection'
import RealCasesSection from './RealCasesSection'
import ExamAppendixSection from './ExamAppendixSection'
import PracticeModeSection from './PracticeModeSection'
// ── FIX: 加入新功能元件 ──
import CalcPracticeSection from './CalcPracticeSection'
import MockExamSection from './MockExamSection'
import Link from 'next/link'

const CHECKOUT_MONTHLY = '/checkout'
const CHECKOUT_YEARLY = '/checkout'

export default function DashboardClient({ user, isPaid, plan, expiresAt }) {
  // ── FIX: 修正 totalLaws（原本 SUPPLEMENT_LAW_ARTICLES_20 重複計算了兩次）──
  const totalLaws =
    FULL_LAW_ARTICLES.length +
    SUPPLEMENT_LAW_ARTICLES_1.length +
    SUPPLEMENT_LAW_ARTICLES_2.length +
    SUPPLEMENT_LAW_ARTICLES_3.length +
    SUPPLEMENT_LAW_ARTICLES_4.length +
    SUPPLEMENT_LAW_ARTICLES_5.length +
    SUPPLEMENT_LAW_ARTICLES_6.length +
    SUPPLEMENT_LAW_ARTICLES_7.length +
    SUPPLEMENT_LAW_ARTICLES_8.length +
    SUPPLEMENT_LAW_ARTICLES_9.length +
    SUPPLEMENT_LAW_ARTICLES_10.length +
    SUPPLEMENT_LAW_ARTICLES_11.length +
    SUPPLEMENT_LAW_ARTICLES_12.length +
    SUPPLEMENT_LAW_ARTICLES_13.length +
    SUPPLEMENT_LAW_ARTICLES_14.length +
    SUPPLEMENT_LAW_ARTICLES_15.length +
    SUPPLEMENT_LAW_ARTICLES_16.length +
    SUPPLEMENT_LAW_ARTICLES_17.length +
    SUPPLEMENT_LAW_ARTICLES_18.length +
    SUPPLEMENT_LAW_ARTICLES_19.length +
    SUPPLEMENT_LAW_ARTICLES_20.length +
    SUPPLEMENT_LAW_ARTICLES_21.length + // ← 原本這行寫成 _20 了
    SUPPLEMENT_LAW_ARTICLES_22.length +
    SUPPLEMENT_LAW_ARTICLES_23.length +
    SUPPLEMENT_LAW_ARTICLES_24.length +
    SUPPLEMENT_LAW_ARTICLES_25.length +
    SUPPLEMENT_LAW_ARTICLES_26.length +
    SUPPLEMENT_LAW_ARTICLES_27.length +
    SUPPLEMENT_LAW_ARTICLES_28.length +
    SUPPLEMENT_LAW_ARTICLES_29.length +
    SUPPLEMENT_LAW_ARTICLES_30.length +
    SUPPLEMENT_LAW_ARTICLES_30.length
  
  const allCases = [...CASES, ...SUPPLEMENT_CASES]
  const allExams = [...EXAM_QUESTIONS, ...SUPPLEMENT_EXAMS]

  const [tab, setTab] = useState('cases')
  const [caseSub, setCaseSub] = useState('cases')
  const [examSub, setExamSub] = useState('exam_questions')
  const [caseCategory, setCaseCategory] = useState('全部')
  const [examCategory, setExamCategory] = useState('全部')
  const [expandedId, setExpandedId] = useState(null)
  const supabase = createClient()

  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiMode, setAiMode] = useState('chat')
  const [quizTopic, setQuizTopic] = useState('隨機混合')
  const chatEndRef = useRef(null)

  const [examDate, setExamDate] = useState(() => {
    try { return localStorage.getItem('exam_date') || '' } catch { return '' }
  })
  const [editingDate, setEditingDate] = useState(false)

  const daysLeft = examDate
    ? Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  const saveExamDate = (val) => {
    setExamDate(val)
    try { localStorage.setItem('exam_date', val) } catch {}
    setEditingDate(false)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  const caseCategories = ['全部', '繼承', '買賣', '稅務', '其他']
  const examCategories = ['全部', '土地法規', '土地登記', '地政士法', '土地稅法', '民法物權', '不動產估價', '不動產經紀業管理法']

  const filteredCases = allCases.filter(c => caseCategory === '全部' || c.category === caseCategory)
  const filteredExams = allExams.filter(q => examCategory === '全部' || q.category === examCategory)

  const freeQuestions = messages.filter(m => m.role === 'user').length
  const freeLimit = 3

  const handleSendMessage = async (overrideMessages) => {
    const msgToSend = overrideMessages || messages
    if (!overrideMessages && (!inputText.trim() || aiLoading)) return
    setAiError('')
    let newMessages
    if (overrideMessages) {
      newMessages = overrideMessages
    } else {
      const userMessage = { role: 'user', content: inputText.trim() }
      newMessages = [...messages, userMessage]
      setMessages(newMessages)
      setInputText('')
    }
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, isPaid, mode: aiMode, topic: quizTopic })
      })
      const data = await res.json()
      if (data.error === 'FREE_LIMIT') setAiError(data.message)
      else if (data.error) setAiError(data.error)
      else setMessages([...newMessages, { role: 'assistant', content: data.content }])
    } catch (e) { setAiError('網路錯誤，請稍後再試') }
    setAiLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() }
  }

  const handleStartQuiz = () => {
    const quizMsg = [{ role: 'user', content: `請出一道關於「${quizTopic}」的模擬考選擇題` }]
    setMessages(quizMsg)
    handleSendMessage(quizMsg)
  }

  const SUGGESTED_QUESTIONS = [
    '共有土地要賣掉，其中一人不同意怎麼辦？',
    '買房後發現有最高限額抵押，過戶前要怎麼處理？',
    '父母賣房子給子女，稅務上要注意什麼？',
    '預告登記怎麼辦理？費用是多少？',
    '繼承的農地想出售，有什麼限制？',
  ]

  const PaidBadge = ({ isPaidContent }) => {
    if (!isPaidContent) return <span className="badge badge-free">✓ 免費</span>
    if (isPaid) return <span className="badge" style={{ background: '#dcfce7', color: '#16a34a' }}>✓ 已解鎖</span>
    return <span className="badge badge-paid">🔒 付費</span>
  }

  const LockWall = () => (
    <div style={{ background: '#fef9ec', border: '2px dashed #fbbf24', borderRadius: '12px', padding: '32px', textAlign: 'center', marginTop: '12px' }}>
      <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
      <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px', color: '#0f1f3d' }}>付費會員限定內容</h3>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>解鎖全部案例、法條、考古題庫、SOP流程和 AI 無限問答</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={CHECKOUT_MONTHLY} className="btn btn-gold">💳 NT$799/月 立即訂閱</a>
        <Link href="/activate" className="btn btn-outline">🔑 已有授權碼？點此輸入</Link>
      </div>
    </div>
  )

  const subTabStyle = (active) => ({
    padding: '7px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: 700,
    background: active ? '#0f1f3d' : '#f1f5f9',
    color: active ? 'white' : '#374151',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f3' }}>
      {/* 頂部導覽 */}
      <div style={{ background: '#0f1f3d', padding: '0 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <div style={{ color: 'white', fontWeight: 900, fontSize: '18px' }}>
            🏡 <span style={{ color: '#c9973a' }}>Kmoji</span> 地政X經紀同根生
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isPaid ? (
              <span style={{ background: 'rgba(201,151,58,0.2)', color: '#e8b95a', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(201,151,58,0.4)' }}>
                ✓ {plan === 'yearly' ? '年費版' : '月費版'} 已啟用
              </span>
            ) : (
              <a href={CHECKOUT_MONTHLY} className="btn btn-gold btn-sm">💳 升級付費版</a>
            )}
            <DarkModeToggle />
            <button onClick={handleLogout} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>登出</button>
          </div>
        </div>
      </div>

      {/* 免費版提示 */}
      {!isPaid && (
        <div style={{ background: '#fff8e1', borderBottom: '1px solid #fbbf24', padding: '10px 24px', textAlign: 'center', fontSize: '13px', color: '#92400e' }}>
          🔑 免費版：<Link href="/activate" style={{ color: '#0f1f3d', fontWeight: 700 }}>輸入授權碼</Link> 或 <a href={CHECKOUT_MONTHLY} style={{ color: '#0f1f3d', fontWeight: 700 }}>升級付費版</a> 解鎖法條 + AI無限問答
        </div>
      )}

      {/* 考試倒數計時器 */}
      <div style={{ background: daysLeft !== null && daysLeft <= 30 ? '#fef2f2' : '#f0f4ff', borderBottom: '1px solid #e2e8f0', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '13px' }}>
        {editingDate ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#374151', fontWeight: 600 }}>📅 設定考試日期：</span>
            <input type="date" autoFocus defaultValue={examDate}
              onBlur={e => saveExamDate(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveExamDate(e.target.value)}
              style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '3px 8px', fontSize: '13px' }} />
            <button onClick={() => setEditingDate(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>取消</button>
          </div>
        ) : daysLeft === null ? (
          <button onClick={() => setEditingDate(true)}
            style={{ background: 'none', border: '1px dashed #94a3b8', color: '#64748b', borderRadius: '6px', padding: '4px 14px', fontSize: '13px', cursor: 'pointer' }}>
            📅 設定考試倒數日期
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>{daysLeft <= 7 ? '🔥' : daysLeft <= 30 ? '⚡' : '📅'}</span>
            <span style={{ color: '#374151' }}>距離考試還有</span>
            <span style={{ fontWeight: 900, fontSize: '20px', color: daysLeft <= 7 ? '#dc2626' : daysLeft <= 30 ? '#d97706' : '#0f1f3d' }}>
              {daysLeft > 0 ? daysLeft : 0}
            </span>
            <span style={{ color: '#374151' }}>天</span>
            {daysLeft <= 0 && <span style={{ color: '#dc2626', fontWeight: 700 }}>（考試日到了！加油！）</span>}
            <button onClick={() => setEditingDate(true)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}>修改</button>
            <button onClick={() => { setExamDate(''); try { localStorage.removeItem('exam_date') } catch {} }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }}>✕</button>
          </div>
        )}
      </div>

      <div className="page-container">
        {/* ── FIX: 主 Tab 列（7個，新增計算題 + 模擬考）── */}
        <div className="tab-bar">
          {[
            { id: 'cases',    label: '📂 實務案例庫', count: allCases.length + SOPS.length + 19 },
            { id: 'exams',    label: '📝 考古題庫',   count: allExams.length + 38 },
            { id: 'laws',     label: '⚖️ 法條解析',   count: totalLaws },
            { id: 'practice', label: '🎯 練習模式',   count: null },
            { id: 'calc',     label: '🧮 計算題',     count: null },
            { id: 'mock',     label: '⏱️ 模擬考',     count: null },
            { id: 'ai',       label: '🤖 AI問答',     count: null },
          ].map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}
              style={t.id === 'ai' ? { position: 'relative' } : {}}>
              {t.label}
              {t.count && <span style={{ fontSize: '11px', opacity: 0.6 }}> ({t.count})</span>}
              {t.id === 'ai' && !isPaid && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '9px', borderRadius: '10px', padding: '1px 5px' }}>FREE 3次</span>}
            </button>
          ))}
        </div>

        {/* ── 📂 實務案例庫（合併） ── */}
        {tab === 'cases' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', padding: '12px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <button style={subTabStyle(caseSub === 'cases')} onClick={() => setCaseSub('cases')}>
                📂 案例庫 ({allCases.length})
              </button>
              <button style={subTabStyle(caseSub === 'sops')} onClick={() => setCaseSub('sops')}>
                📋 實務SOP ({SOPS.length})
              </button>
              <button style={subTabStyle(caseSub === 'real')} onClick={() => setCaseSub('real')}>
                🏠 實務案例庫 (19)
              </button>
            </div>

            {caseSub === 'cases' && (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {caseCategories.map(cat => (
                    <button key={cat} onClick={() => setCaseCategory(cat)} className="btn btn-sm"
                      style={{ background: caseCategory === cat ? '#0f1f3d' : '#e2e8f0', color: caseCategory === cat ? 'white' : '#374151' }}>{cat}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredCases.map(c => (
                    <div key={c.id} className="card" style={{ cursor: 'pointer' }}>
                      <div onClick={() => toggle(c.id)} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span className="badge badge-navy">{c.category}</span>
                            <PaidBadge isPaidContent={c.isPaid} />
                            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{c.title}</h3>
                          </div>
                          <p style={{ color: '#64748b', fontSize: '14px' }}>{c.summary}</p>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '20px', flexShrink: 0 }}>{expandedId === c.id ? '▲' : '▼'}</span>
                      </div>
                      {expandedId === c.id && (
                        c.isPaid && !isPaid ? <LockWall /> : (
                          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                            <Section title="💼 情境描述" content={c.situation} />
                            <Section title="✅ 處理方式" content={c.solution} />
                            <div style={{ marginBottom: '16px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>⚖️ 引用法條</div>
                              {c.laws.map((l, i) => (
                                <div key={i} style={{ background: '#f0f4ff', borderLeft: '3px solid #0f1f3d', padding: '10px 14px', borderRadius: '0 6px 6px 0', fontSize: '13px', color: '#1e40af', marginBottom: '6px' }}>{l}</div>
                              ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                                <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>🏛️ 地政士視角</div>
                                <div style={{ color: '#374151' }}>{c.agentView}</div>
                              </div>
                              <div style={{ background: '#fef9ec', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                                <div style={{ fontWeight: 700, color: '#d97706', marginBottom: '4px' }}>🏡 房仲視角</div>
                                <div style={{ color: '#374151' }}>{c.brokerView}</div>
                              </div>
                            </div>
                            <Section title="💡 實務小提醒" content={c.tips} bg="#f8fafc" />
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {caseSub === 'sops' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {SOPS.map(s => (
                  <div key={s.id} className="card">
                    <div onClick={() => toggle(s.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{s.title}</h3>
                        <PaidBadge isPaidContent={s.isPaid} />
                      </div>
                      <span style={{ color: '#94a3b8', fontSize: '20px', flexShrink: 0 }}>{expandedId === s.id ? '▲' : '▼'}</span>
                    </div>
                    {expandedId === s.id && (
                      s.isPaid && !isPaid ? <LockWall /> : (
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                          {s.steps.map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                              <div style={{ flexShrink: 0, width: '36px', height: '36px', background: '#0f1f3d', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px' }}>{step.step}</div>
                              <div style={{ flex: 1, paddingTop: '6px' }}>
                                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{step.title}</div>
                                <div style={{ fontSize: '14px', color: '#374151', marginBottom: '6px' }}>{step.detail}</div>
                                <div style={{ fontSize: '12px', color: '#c9973a', fontWeight: 600 }}>💡 {step.tip}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}

            {caseSub === 'real' && <RealCasesSection isPaid={isPaid} />}
          </div>
        )}

        {/* ── 📝 考古題庫（合併） ── */}
        {tab === 'exams' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', padding: '12px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <button style={subTabStyle(examSub === 'exam_questions')} onClick={() => setExamSub('exam_questions')}>
                📝 考古題庫 ({allExams.length})
              </button>
              <button style={subTabStyle(examSub === 'exam_appendix')} onClick={() => setExamSub('exam_appendix')}>
                📅 考古題附錄（含113模考）(38)
              </button>
            </div>

            {examSub === 'exam_questions' && (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {examCategories.map(cat => (
                    <button key={cat} onClick={() => setExamCategory(cat)} className="btn btn-sm"
                      style={{ background: examCategory === cat ? '#0f1f3d' : '#e2e8f0', color: examCategory === cat ? 'white' : '#374151' }}>{cat}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredExams.map(q => (
                    <div key={q.id} className="card">
                      <div onClick={() => toggle(q.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span className="badge badge-navy">{q.category}</span>
                            <span className="badge" style={{ background: '#f0f4ff', color: '#1e40af' }}>{q.year}</span>
                            <PaidBadge isPaidContent={q.isPaid} />
                          </div>
                          <p style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e' }}>{q.question}</p>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '20px', flexShrink: 0 }}>{expandedId === q.id ? '▲' : '▼'}</span>
                      </div>
                      {expandedId === q.id && (
                        q.isPaid && !isPaid ? <LockWall /> : (
                          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                              {q.options.map((opt, i) => (
                                <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
                                  background: opt.startsWith(q.answer) ? '#f0fdf4' : '#f8fafc',
                                  border: opt.startsWith(q.answer) ? '2px solid #16a34a' : '1px solid #e2e8f0',
                                  fontWeight: opt.startsWith(q.answer) ? 700 : 400,
                                  color: opt.startsWith(q.answer) ? '#16a34a' : '#374151' }}>
                                  {opt.startsWith(q.answer) ? '✓ ' : ''}{opt}
                                </div>
                              ))}
                            </div>
                            <div style={{ background: '#f0f4ff', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                              <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: '6px', fontSize: '13px' }}>📖 解題說明</div>
                              <div style={{ fontSize: '14px', color: '#1e3a8a', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{q.explanation}</div>
                            </div>
                            <div style={{ background: '#fef9ec', borderLeft: '3px solid #c9973a', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: '13px', color: '#92400e' }}>⚖️ 引用法條：{q.law}</div>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {examSub === 'exam_appendix' && <ExamAppendixSection isPaid={isPaid} />}
          </div>
        )}

        {tab === 'laws'     && <LawSection isPaid={isPaid} />}
        {tab === 'practice' && <PracticeModeSection isPaid={isPaid} />}
        {/* ── FIX: 新增計算題 + 模擬考渲染 ── */}
        {tab === 'calc'     && <CalcPracticeSection />}
        {tab === 'mock'     && <MockExamSection isPaid={isPaid} />}

        {/* ── 🤖 AI 問答 ── */}
        {tab === 'ai' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f1f3d, #1a3260)', borderRadius: '16px', padding: '24px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{aiMode === 'quiz' ? '🎓' : '🤖'}</div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px' }}>
                {aiMode === 'quiz' ? '模擬考題出題模式' : '地政同根生 AI 顧問'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                {aiMode === 'quiz' ? 'AI 出題 → 你作答 → AI 詳細解析' : '專業回答地政士與房仲的法律、稅務、登記實務問題'}
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '14px' }}>
                <button onClick={() => { setAiMode('chat'); setMessages([]); setAiError('') }}
                  style={{ padding: '6px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                    background: aiMode === 'chat' ? 'white' : 'rgba(255,255,255,0.15)',
                    color: aiMode === 'chat' ? '#0f1f3d' : 'rgba(255,255,255,0.8)' }}>
                  💬 問答模式
                </button>
                <button onClick={() => { setAiMode('quiz'); setMessages([]); setAiError('') }}
                  style={{ padding: '6px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                    background: aiMode === 'quiz' ? '#c9973a' : 'rgba(255,255,255,0.15)',
                    color: aiMode === 'quiz' ? 'white' : 'rgba(255,255,255,0.8)' }}>
                  🎓 出題模式
                </button>
              </div>
              {aiMode === 'quiz' && (
                <div style={{ marginTop: '14px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>選擇出題範圍：</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['土地法規', '土地稅法', '民法物權', '繼承登記', '不動產經紀', '信託法', '都市計畫', '農地法規', '隨機混合'].map(t => (
                      <button key={t} onClick={() => setQuizTopic(t)}
                        style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '12px',
                          background: quizTopic === t ? '#c9973a' : 'transparent', color: 'white', fontWeight: quizTopic === t ? 700 : 400 }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!isPaid && (
                <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 16px', fontSize: '13px' }}>
                  免費版剩餘問答：<strong style={{ color: '#fbbf24' }}>{Math.max(0, freeLimit - freeQuestions)} / {freeLimit}</strong> 次
                  　｜　<a href={CHECKOUT_MONTHLY} style={{ color: '#fbbf24', fontWeight: 700 }}>升級無限制</a>
                </div>
              )}
            </div>

            {aiMode === 'quiz' && messages.length === 0 && (
              <div style={{ textAlign: 'center', marginBottom: '20px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
                <p style={{ fontSize: '15px', color: '#374151', marginBottom: '8px', fontWeight: 600 }}>準備好了嗎？</p>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>主題：<strong style={{ color: '#c9973a' }}>{quizTopic}</strong></p>
                <button onClick={handleStartQuiz}
                  style={{ padding: '14px 40px', background: '#c9973a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}>
                  🎓 出一道考題
                </button>
              </div>
            )}

            {aiMode === 'chat' && messages.length === 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>💡 常見問題範例</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => setInputText(q)}
                      style={{ textAlign: 'left', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', background: m.role === 'user' ? '#0f1f3d' : '#c9973a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                      {m.role === 'user' ? '👤' : aiMode === 'quiz' ? '🎓' : '🤖'}
                    </div>
                    <div style={{ flex: 1, background: m.role === 'user' ? '#f0f4ff' : '#faf8f3', borderRadius: m.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px', padding: '12px 16px', fontSize: '14px', lineHeight: 1.8, color: '#1a1a2e', whiteSpace: 'pre-wrap', maxWidth: '85%' }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#c9973a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{aiMode === 'quiz' ? '🎓' : '🤖'}</div>
                    <div style={{ background: '#faf8f3', borderRadius: '4px 12px 12px 12px', padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>
                      {aiMode === 'quiz' ? '出題中...' : 'AI 顧問思考中...'}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {aiError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', fontSize: '14px', color: '#dc2626' }}>
                ⚠️ {aiError}
                {aiError.includes('升級') && <a href={CHECKOUT_MONTHLY} style={{ marginLeft: '8px', fontWeight: 700, color: '#0f1f3d' }}>立即升級 →</a>}
              </div>
            )}

            {aiMode === 'quiz' && messages.length > 0 && !aiLoading && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <button onClick={handleStartQuiz}
                  style={{ flex: 1, padding: '12px', background: '#c9973a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  🎓 再出一題（{quizTopic}）
                </button>
                <button onClick={() => { setMessages([]); setAiError('') }}
                  style={{ padding: '12px 16px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  換題目
                </button>
              </div>
            )}

            {aiMode === 'chat' && (
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <textarea value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="輸入你的地政或不動產問題...（Enter 送出，Shift+Enter 換行）"
                  disabled={!isPaid && freeQuestions >= freeLimit}
                  style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontSize: '14px', lineHeight: 1.6, minHeight: '48px', maxHeight: '120px', fontFamily: 'inherit', color: '#1a1a2e', background: 'transparent' }}
                  rows={2} />
                <button onClick={() => handleSendMessage()} disabled={!inputText.trim() || aiLoading || (!isPaid && freeQuestions >= freeLimit)}
                  style={{ flexShrink: 0, width: '44px', height: '44px', background: (!inputText.trim() || aiLoading) ? '#e2e8f0' : '#0f1f3d', color: 'white', border: 'none', borderRadius: '10px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {aiLoading ? '⏳' : '➤'}
                </button>
              </div>
            )}

            {messages.length > 0 && (
              <button onClick={() => { setMessages([]); setAiError('') }}
                style={{ marginTop: '10px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
                🗑 清除對話，重新開始
              </button>
            )}
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>AI 回答僅供參考，具體個案建議諮詢持照地政士或律師</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, content, bg }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>{title}</div>
      <div style={{ background: bg || '#f8fafc', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', color: '#374151', lineHeight: 1.7 }}>{content}</div>
    </div>
  )
}
