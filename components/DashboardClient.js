'use client'
import { FULL_LAW_ARTICLES } from '../lib/full-law-data'
import { SUPPLEMENT_LAW_ARTICLES_1 } from '../lib/supplement-law-data-1'
import { SUPPLEMENT_LAW_ARTICLES_2 } from '../lib/supplement-law-data-2'
import { SUPPLEMENT_LAW_ARTICLES_3 } from '../lib/supplement-law-data-3'
import { SUPPLEMENT_LAW_ARTICLES_4 } from '../lib/supplement-law-data-4'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '../lib/supabase-client'
import { CASES, EXAM_QUESTIONS, SOPS } from '../lib/data'
import LawSection from './LawSection'
import RealCasesSection from './RealCasesSection'
import ExamAppendixSection from './ExamAppendixSection'
import Link from 'next/link'

const CHECKOUT_MONTHLY = '/checkout'
const CHECKOUT_YEARLY = '/checkout'

export default function DashboardClient({ user, isPaid, plan, expiresAt }) {
  const totalLaws = FULL_LAW_ARTICLES.length + SUPPLEMENT_LAW_ARTICLES_1.length + SUPPLEMENT_LAW_ARTICLES_2.length + SUPPLEMENT_LAW_ARTICLES_3.length + SUPPLEMENT_LAW_ARTICLES_4.length
  const [tab, setTab] = useState('cases')
  const [caseCategory, setCaseCategory] = useState('全部')
  const [examCategory, setExamCategory] = useState('全部')
  const [expandedId, setExpandedId] = useState(null)
  const supabase = createClient()

  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  const caseCategories = ['全部', '繼承', '買賣', '稅務', '其他']
  const examCategories = ['全部', '土地法規', '土地登記', '地政士法', '土地稅法', '民法物權', '不動產估價']

  const filteredCases = CASES.filter(c => caseCategory === '全部' || c.category === caseCategory)
  const filteredExams = EXAM_QUESTIONS.filter(q => examCategory === '全部' || q.category === examCategory)

  const freeQuestions = messages.filter(m => m.role === 'user').length
  const freeLimit = 3

  const handleSendMessage = async () => {
    if (!inputText.trim() || aiLoading) return
    setAiError('')
    const userMessage = { role: 'user', content: inputText.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputText('')
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, isPaid })
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
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>解鎖全部案例、條法條、考古題庫、SOP流程和 AI 無限問答</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={CHECKOUT_MONTHLY} className="btn btn-gold">💳 NT$799/月 立即訂閱</a>
        <Link href="/activate" className="btn btn-outline">🔑 已有授權碼？點此輸入</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f3' }}>
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
            <button onClick={handleLogout} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>登出</button>
          </div>
        </div>
      </div>

      {!isPaid && (
        <div style={{ background: '#fff8e1', borderBottom: '1px solid #fbbf24', padding: '10px 24px', textAlign: 'center', fontSize: '13px', color: '#92400e' }}>
          🔑 免費版：<Link href="/activate" style={{ color: '#0f1f3d', fontWeight: 700 }}>輸入授權碼</Link> 或 <a href={CHECKOUT_MONTHLY} style={{ color: '#0f1f3d', fontWeight: 700 }}>升級付費版</a> 解鎖條法條 + AI無限問答
        </div>
      )}

      <div className="page-container">
        <div className="tab-bar">
          {[
            { id: 'cases', label: '📂 案例庫', count: CASES.length },
            { id: 'exams', label: '📝 考古題庫', count: EXAM_QUESTIONS.length },
            { id: 'laws', label: '⚖️ 法條解析', count: totalLaws },
            { id: 'sops', label: '📋 實務SOP', count: SOPS.length },
            { id: 'real_cases', label: '🏠 實務案例庫', count: 19 },
            { id: 'exam_appendix', label: '📅 考古題附錄', count: 38 },
            { id: 'ai', label: '🤖 AI問答', count: null },
          ].map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}
              style={t.id === 'ai' ? { position: 'relative' } : {}}>
              {t.label}
              {t.count && <span style={{ fontSize: '11px', opacity: 0.6 }}> ({t.count})</span>}
              {t.id === 'ai' && !isPaid && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '9px', borderRadius: '10px', padding: '1px 5px' }}>FREE 3次</span>}
            </button>
          ))}
        </div>

        {/* ── AI 問答 ── */}
        {tab === 'ai' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f1f3d, #1a3260)', borderRadius: '16px', padding: '24px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🤖</div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px' }}>地政同根生 AI 顧問</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>專業回答地政士與房仲的法律、稅務、登記實務問題</p>
              {!isPaid && (
                <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 16px', fontSize: '13px' }}>
                  免費版剩餘問答：<strong style={{ color: '#fbbf24' }}>{Math.max(0, freeLimit - freeQuestions)} / {freeLimit}</strong> 次
                  　｜　<a href={CHECKOUT_MONTHLY} style={{ color: '#fbbf24', fontWeight: 700 }}>升級無限制</a>
                </div>
              )}
            </div>

            {messages.length === 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>💡 常見問題範例（點擊快速提問）</div>
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
                      {m.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div style={{ flex: 1, background: m.role === 'user' ? '#f0f4ff' : '#faf8f3', borderRadius: m.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px', padding: '12px 16px', fontSize: '14px', lineHeight: 1.8, color: '#1a1a2e', whiteSpace: 'pre-wrap', maxWidth: '85%' }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#c9973a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
                    <div style={{ background: '#faf8f3', borderRadius: '4px 12px 12px 12px', padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>AI 顧問思考中...</div>
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

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="輸入你的地政或不動產問題...（Enter 送出，Shift+Enter 換行）"
                disabled={!isPaid && freeQuestions >= freeLimit}
                style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontSize: '14px', lineHeight: 1.6, minHeight: '48px', maxHeight: '120px', fontFamily: 'inherit', color: '#1a1a2e', background: 'transparent' }}
                rows={2} />
              <button onClick={handleSendMessage} disabled={!inputText.trim() || aiLoading || (!isPaid && freeQuestions >= freeLimit)}
                style={{ flexShrink: 0, width: '44px', height: '44px', background: (!inputText.trim() || aiLoading) ? '#e2e8f0' : '#0f1f3d', color: 'white', border: 'none', borderRadius: '10px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {aiLoading ? '⏳' : '➤'}
              </button>
            </div>

            {messages.length > 0 && (
              <button onClick={() => { setMessages([]); setAiError('') }}
                style={{ marginTop: '10px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
                🗑 清除對話，重新開始
              </button>
            )}
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>AI 回答僅供參考，具體個案建議諮詢持照地政士或律師</p>
          </div>
        )}

        {/* ── 案例庫 ── */}
        {tab === 'cases' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {caseCategories.map(cat => (
                <button key={cat} onClick={() => setCaseCategory(cat)} className="btn btn-sm" style={{ background: caseCategory === cat ? '#0f1f3d' : '#e2e8f0', color: caseCategory === cat ? 'white' : '#374151' }}>{cat}</button>
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

        {/* ── 考古題庫 ── */}
        {tab === 'exams' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {examCategories.map(cat => (
                <button key={cat} onClick={() => setExamCategory(cat)} className="btn btn-sm" style={{ background: examCategory === cat ? '#0f1f3d' : '#e2e8f0', color: examCategory === cat ? 'white' : '#374151' }}>{cat}</button>
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
                            <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '14px', background: opt.startsWith(q.answer) ? '#f0fdf4' : '#f8fafc', border: opt.startsWith(q.answer) ? '2px solid #16a34a' : '1px solid #e2e8f0', fontWeight: opt.startsWith(q.answer) ? 700 : 400, color: opt.startsWith(q.answer) ? '#16a34a' : '#374151' }}>
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

        {/* ── 法條解析（完整版）── */}
        {tab === 'laws' && <LawSection isPaid={isPaid} />}

        {/* ── 實務SOP ── */}
        {tab === 'sops' && (
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

        {/* ── 實務案例庫（深度解析版）── */}
        {tab === 'real_cases' && <RealCasesSection isPaid={isPaid} />}

        {/* ── 考古題附錄（含113模考）── */}
        {tab === 'exam_appendix' && <ExamAppendixSection isPaid={isPaid} />}

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
