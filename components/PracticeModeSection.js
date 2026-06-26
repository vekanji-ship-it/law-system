'use client'
import { useState, useCallback, useMemo } from 'react'
import { LAW_CATEGORIES, FULL_LAW_ARTICLES } from '../lib/full-law-data'
import { SUPPLEMENT_LAW_ARTICLES_1  } from '../lib/supplement-law-data-1'
import { SUPPLEMENT_LAW_ARTICLES_2  } from '../lib/supplement-law-data-2'
import { SUPPLEMENT_LAW_ARTICLES_3  } from '../lib/supplement-law-data-3'
import { SUPPLEMENT_LAW_ARTICLES_4  } from '../lib/supplement-law-data-4'
import { SUPPLEMENT_LAW_ARTICLES_5  } from '../lib/supplement-law-data-5'
import { SUPPLEMENT_LAW_ARTICLES_6  } from '../lib/supplement-law-data-6'
import { SUPPLEMENT_LAW_ARTICLES_7  } from '../lib/supplement-law-data-7'
import { SUPPLEMENT_LAW_ARTICLES_8  } from '../lib/supplement-law-data-8'
import { SUPPLEMENT_LAW_ARTICLES_9  } from '../lib/supplement-law-data-9'
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

const EXAM_TYPE_MAP = { '共同': 'both', '地政士': 'land_reg', '經紀人': 'broker' }

const normalizeArticle = (article) => {
  if (article.code) return article
  const freq =
    typeof article.frequency === 'number'
      ? article.frequency >= 4 ? 'high'
        : article.frequency === 3 ? 'medium'
        : 'low'
      : 'low'
  return {
    ...article,
    code:     `${article.lawName} ${article.articleNo}`,
    title:    article.lawName,
    detail:   article.content,
    subLabel: article.articleNo,
    freq,
    freqLabel: freq === 'high' ? '★ 高頻' : freq === 'medium' ? '◆ 中頻' : '◇ 一般',
    exam:     EXAM_TYPE_MAP[article.examType] || 'both',
    isPaid:   false,
  }
}

const RAW_ARTICLES = [
  ...FULL_LAW_ARTICLES,
  ...SUPPLEMENT_LAW_ARTICLES_1,  ...SUPPLEMENT_LAW_ARTICLES_2,
  ...SUPPLEMENT_LAW_ARTICLES_3,  ...SUPPLEMENT_LAW_ARTICLES_4,
  ...SUPPLEMENT_LAW_ARTICLES_5,  ...SUPPLEMENT_LAW_ARTICLES_6,
  ...SUPPLEMENT_LAW_ARTICLES_7,  ...SUPPLEMENT_LAW_ARTICLES_8,
  ...SUPPLEMENT_LAW_ARTICLES_9,  ...SUPPLEMENT_LAW_ARTICLES_10,
  ...SUPPLEMENT_LAW_ARTICLES_11, ...SUPPLEMENT_LAW_ARTICLES_12,
  ...SUPPLEMENT_LAW_ARTICLES_13, ...SUPPLEMENT_LAW_ARTICLES_14,
  ...SUPPLEMENT_LAW_ARTICLES_15, ...SUPPLEMENT_LAW_ARTICLES_16,
  ...SUPPLEMENT_LAW_ARTICLES_17, ...SUPPLEMENT_LAW_ARTICLES_18,
  ...SUPPLEMENT_LAW_ARTICLES_19, ...SUPPLEMENT_LAW_ARTICLES_20,
  ...SUPPLEMENT_LAW_ARTICLES_21, ...SUPPLEMENT_LAW_ARTICLES_22,
  ...SUPPLEMENT_LAW_ARTICLES_23, ...SUPPLEMENT_LAW_ARTICLES_24,
  ...SUPPLEMENT_LAW_ARTICLES_25, ...SUPPLEMENT_LAW_ARTICLES_26,
  ...SUPPLEMENT_LAW_ARTICLES_27, ...SUPPLEMENT_LAW_ARTICLES_28,
]

const ALL_ARTICLES = RAW_ARTICLES.map(normalizeArticle)

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function PracticeModeSection({ isPaid }) {
  const [view, setView]               = useState('home')
  const [filterCat, setFilterCat]     = useState('全部')
  const [filterFreq, setFilterFreq]   = useState('high')
  const [filterCount, setFilterCount] = useState(10)
  const [deck, setDeck]               = useState([])
  const [current, setCurrent]         = useState(0)
  const [showAnswer, setShowAnswer]   = useState(false)
  const [results, setResults]         = useState({ know: 0, review: 0 })
  const [reviewList, setReviewList]   = useState([])

  // FIX: 過濾欄位損壞的舊版錯題資料
  const [wrongBook, setWrongBook] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('law_wrongbook') || '[]')
      // 過濾欄位損壞的舊版資料（修復前存入的 undefined 欄位）
      return data.filter(w => w.id && w.code && w.title)
    } catch { return [] }
  })
  const [expandedWrong, setExpandedWrong] = useState(null)

  const saveWrongBook = (updated) => {
    setWrongBook(updated)
    try { localStorage.setItem('law_wrongbook', JSON.stringify(updated)) } catch {}
  }

  const addToWrongBook = (article) => {
    if (wrongBook.find(w => w.id === article.id)) return
    saveWrongBook([...wrongBook, { ...article, addedAt: Date.now() }])
  }

  const removeFromWrongBook = (id) => {
    saveWrongBook(wrongBook.filter(w => w.id !== id))
  }

  const startPractice = useCallback((customDeck) => {
    let d
    if (customDeck) {
      d = shuffle(customDeck.map(a => a.code ? a : normalizeArticle(a)))
    } else {
      let pool = ALL_ARTICLES.filter(l => {
        const matchCat  = filterCat === '全部' || l.catCode === filterCat
        const matchFreq = filterFreq === '全部' || l.freq === filterFreq
        const matchPaid = isPaid || !l.isPaid
        return matchCat && matchFreq && matchPaid
      })
      d = shuffle(pool).slice(0, filterCount)
    }
    setDeck(d)
    setCurrent(0)
    setShowAnswer(false)
    setResults({ know: 0, review: 0 })
    setReviewList([])
    setView('practice')
  }, [filterCat, filterFreq, filterCount, isPaid])

  const handleKnow = () => {
    setResults(r => ({ ...r, know: r.know + 1 }))
    next()
  }

  const handleReview = () => {
    addToWrongBook(deck[current])
    setResults(r => ({ ...r, review: r.review + 1 }))
    setReviewList(prev => [...prev, deck[current]])
    next()
  }

  const next = () => {
    setShowAnswer(false)
    if (current + 1 >= deck.length) setView('result')
    else setCurrent(c => c + 1)
  }

  const poolSize = ALL_ARTICLES.filter(l => {
    const matchCat  = filterCat === '全部' || l.catCode === filterCat
    const matchFreq = filterFreq === '全部' || l.freq === filterFreq
    const matchPaid = isPaid || !l.isPaid
    return matchCat && matchFreq && matchPaid
  }).length

  // ── 首頁 ──
  if (view === 'home') return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #0f1f3d, #1a3a6e)', borderRadius: '14px', padding: '20px', color: 'white', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => setView('home')}>
          <div style={{ fontSize: '32px', marginBottom: '6px' }}>🎯</div>
          <div style={{ fontWeight: 800, fontSize: '15px' }}>閃卡練習</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>自選類別出題</div>
        </div>
        <div style={{
            flex: 1,
            background: wrongBook.length > 0 ? 'linear-gradient(135deg, #7f1d1d, #dc2626)' : '#f8fafc',
            borderRadius: '14px', padding: '20px',
            color: wrongBook.length > 0 ? 'white' : '#94a3b8',
            textAlign: 'center', cursor: 'pointer',
            border: wrongBook.length > 0 ? 'none' : '2px dashed #e2e8f0',
          }}
          onClick={() => setView('wrongbook')}>
          <div style={{ fontSize: '32px', marginBottom: '6px' }}>📕</div>
          <div style={{ fontWeight: 800, fontSize: '15px' }}>錯題本</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
            {wrongBook.length > 0 ? `共 ${wrongBook.length} 題需複習` : '尚無錯題紀錄'}
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '16px' }}>
        <h3 style={{ fontWeight: 800, color: '#0f1f3d', marginBottom: '20px', fontSize: '15px' }}>🎯 閃卡練習設定</h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>📂 類別篩選</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['全部', ...LAW_CATEGORIES.map(c => c.id)].map(cat => {
              const label = cat === '全部' ? '全部' : LAW_CATEGORIES.find(c => c.id === cat)?.label?.split('. ')[1] || cat
              return (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  style={{ padding: '4px 10px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                    background: filterCat === cat ? '#0f1f3d' : '#e2e8f0',
                    color:      filterCat === cat ? 'white'   : '#374151' }}>
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>⭐ 頻率篩選</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[['全部', '全部'], ['high', '★ 高頻'], ['medium', '◆ 中頻'], ['low', '◇ 一般']].map(([val, label]) => (
              <button key={val} onClick={() => setFilterFreq(val)}
                style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  background: filterFreq === val
                    ? (val === 'high' ? '#dc2626' : val === 'medium' ? '#d97706' : val === 'low' ? '#6b7280' : '#0f1f3d')
                    : '#f1f5f9',
                  color: filterFreq === val ? 'white' : '#374151' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>
            🃏 抽題數量：<span style={{ color: '#0f1f3d' }}>{filterCount} 題</span>
            <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '8px' }}>（資料池共 {poolSize} 條）</span>
          </label>
          <input type="range" min={5} max={Math.min(50, poolSize || 5)} value={filterCount}
            onChange={e => setFilterCount(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0f1f3d' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            <span>5 題</span><span>50 題</span>
          </div>
        </div>

        <button onClick={() => startPractice()} disabled={poolSize === 0}
          style={{ width: '100%', padding: '14px', background: poolSize === 0 ? '#e2e8f0' : '#0f1f3d', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 800, cursor: poolSize === 0 ? 'not-allowed' : 'pointer' }}>
          🚀 開始練習 {filterCount} 題
        </button>
      </div>

      <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#1e40af', lineHeight: 1.8 }}>
        <strong>💡 練習方式</strong>：看法條名稱 → 腦中回想 → 翻面確認 → 標記「✅ 我知道了」或「📕 存入錯題本」→ 標記錯題的會自動記錄，隨時可複習
      </div>
    </div>
  )

  // ── 錯題本 ──
  if (view === 'wrongbook') return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontWeight: 900, color: '#0f1f3d', fontSize: '20px', marginBottom: '4px' }}>📕 個人錯題本</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>共 {wrongBook.length} 題需要加強複習</p>
        </div>
        <button onClick={() => setView('home')}
          style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: '#374151' }}>
          ← 返回
        </button>
      </div>

      {wrongBook.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
          <p style={{ fontSize: '16px', fontWeight: 700 }}>錯題本是空的！</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>繼續練習，答錯的法條會自動記錄在這裡</p>
          <button onClick={() => setView('home')}
            style={{ marginTop: '20px', padding: '10px 24px', background: '#0f1f3d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: 700 }}>
            開始練習
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button onClick={() => startPractice(wrongBook)}
              style={{ flex: 1, padding: '12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              🔄 練習全部錯題（{wrongBook.length} 題）
            </button>
            <button onClick={() => { if (confirm('確定清空全部錯題本？')) saveWrongBook([]) }}
              style={{ padding: '12px 16px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}>
              🗑 清空
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[...wrongBook].sort((a, b) => b.addedAt - a.addedAt).map(l => (
              <div key={l.id} style={{ background: 'white', borderRadius: '10px', border: '1px solid #fecaca', borderLeft: '4px solid #dc2626', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1, cursor: 'pointer' }}
                    onClick={() => setExpandedWrong(expandedWrong === l.id ? null : l.id)}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ background: '#0f1f3d', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{l.catCode}</span>
                      <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>📕 錯題</span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700,
                        background: l.freq === 'high' ? '#fef2f2' : l.freq === 'medium' ? '#fffbeb' : '#f8fafc',
                        color:      l.freq === 'high' ? '#dc2626' : l.freq === 'medium' ? '#d97706' : '#6b7280' }}>
                        {l.freqLabel}
                      </span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f1f3d' }}>{l.code}</div>
                    <div style={{ fontSize: '13px', color: '#374151', marginTop: '2px' }}>{l.title}</div>
                    {l.subLabel && l.subLabel !== l.title && (
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{l.subLabel}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                    <button onClick={() => removeFromWrongBook(l.id)}
                      style={{ background: '#f0fdf4', border: '1px solid #16a34a', color: '#16a34a', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      ✅ 已掌握
                    </button>
                    <span style={{ color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}
                      onClick={() => setExpandedWrong(expandedWrong === l.id ? null : l.id)}>
                      {expandedWrong === l.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
                {expandedWrong === l.id && (
                  <div style={{ padding: '0 18px 18px', borderTop: '1px solid #fecaca' }}>
                    <div style={{ marginTop: '14px', background: '#fff8f8', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.9, color: '#1e293b', whiteSpace: 'pre-wrap', borderLeft: '4px solid #dc2626' }}>
                      {l.isPaid && !isPaid ? '🔒 此為付費內容，升級後可查看完整條文' : l.detail}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button onClick={() => removeFromWrongBook(l.id)}
                        style={{ background: '#f0fdf4', border: '1px solid #16a34a', color: '#16a34a', borderRadius: '6px', padding: '5px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>
                        ✅ 標記為已掌握，從錯題本移除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )

  // ── 結果畫面 ──
  if (view === 'result') return (
    <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f1f3d, #1a3a6e)', borderRadius: '16px', padding: '36px', marginBottom: '24px', color: 'white' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>練習完成！</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>共練習 {deck.length} 條法條</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#f0fdf4', border: '2px solid #16a34a', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#16a34a' }}>{results.know}</div>
          <div style={{ fontSize: '13px', color: '#166534', fontWeight: 700 }}>✅ 已掌握</div>
        </div>
        <div style={{ background: '#fff7ed', border: '2px solid #ea580c', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#ea580c' }}>{results.review}</div>
          <div style={{ fontSize: '13px', color: '#9a3412', fontWeight: 700 }}>📕 已存入錯題本</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px', textAlign: 'left' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f1f3d', marginBottom: '8px' }}>
          📊 掌握率：{deck.length > 0 ? Math.round(results.know / deck.length * 100) : 0}%
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(90deg, #16a34a, #4ade80)', height: '100%', borderRadius: '99px',
            width: `${deck.length > 0 ? Math.round(results.know / deck.length * 100) : 0}%` }} />
        </div>
        {results.review > 0 && (
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '12px' }}>
            📕 {results.review} 題已自動存入錯題本，隨時可以到「錯題本」複習
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {reviewList.length > 0 && (
          <button onClick={() => startPractice(reviewList)}
            style={{ flex: 1, padding: '12px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            🔄 重練本次錯題（{reviewList.length} 題）
          </button>
        )}
        <button onClick={() => setView('wrongbook')}
          style={{ flex: 1, padding: '12px', background: '#fef2f2', color: '#dc2626', border: '2px solid #dc2626', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          📕 查看錯題本（{wrongBook.length}）
        </button>
        <button onClick={() => setView('home')}
          style={{ flex: 1, padding: '12px', background: '#0f1f3d', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          🎯 重新設定
        </button>
      </div>
    </div>
  )

  // ── 練習畫面 ──
  const card     = deck[current]
  const progress = deck.length > 0 ? Math.round((current / deck.length) * 100) : 0

  if (!card) return null

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
          <span>第 {current + 1} / {deck.length} 題</span>
          <span>✅ {results.know}　📕 {results.review}</span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(90deg, #0f1f3d, #3b82f6)', height: '100%', borderRadius: '99px', width: `${progress}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{
        background: 'white', borderRadius: '16px',
        border: `2px solid ${card.freq === 'high' ? '#fca5a5' : card.freq === 'medium' ? '#fcd34d' : '#e2e8f0'}`,
        borderLeft: `6px solid ${card.freq === 'high' ? '#dc2626' : card.freq === 'medium' ? '#d97706' : '#94a3b8'}`,
        padding: '28px', marginBottom: '16px', minHeight: '280px',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ background: '#0f1f3d', color: 'white', fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: 700 }}>
              {LAW_CATEGORIES.find(c => c.id === card.catCode)?.label?.split('. ')[1] || card.catCode}
            </span>
            <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: 700,
              background: card.freq === 'high' ? '#fef2f2' : card.freq === 'medium' ? '#fffbeb' : '#f8fafc',
              color:      card.freq === 'high' ? '#dc2626' : card.freq === 'medium' ? '#d97706' : '#6b7280' }}>
              {card.freqLabel}
            </span>
            {wrongBook.find(w => w.id === card.id) && (
              <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: 700 }}>📕 錯題</span>
            )}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f1f3d', marginBottom: '8px' }}>{card.code}</div>
          <div style={{ fontSize: '16px', color: '#374151', fontWeight: 600 }}>{card.title}</div>
          {card.subLabel && card.subLabel !== card.title && (
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>{card.subLabel}</div>
          )}
        </div>

        <div style={{ borderTop: '2px dashed #e2e8f0', margin: '20px 0' }} />

        {!showAnswer ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤔</div>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>先在腦中回想條文內容...</p>
            <button onClick={() => setShowAnswer(true)}
              style={{ marginTop: '16px', padding: '10px 28px', background: '#0f1f3d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              👁 翻面看答案
            </button>
          </div>
        ) : (
          <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.9, color: '#1e293b', whiteSpace: 'pre-wrap', borderLeft: '4px solid #0f1f3d', maxHeight: '240px', overflowY: 'auto' }}>
            {card.isPaid && !isPaid ? '🔒 此為付費內容，升級後可看完整條文' : card.detail}
          </div>
        )}
      </div>

      {showAnswer && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button onClick={handleReview}
            style={{ padding: '14px', background: '#fff7ed', color: '#ea580c', border: '2px solid #ea580c', borderRadius: '10px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
            📕 存入錯題本
          </button>
          <button onClick={handleKnow}
            style={{ padding: '14px', background: '#f0fdf4', color: '#16a34a', border: '2px solid #16a34a', borderRadius: '10px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
            ✅ 我知道了
          </button>
        </div>
      )}

      {/* ── FIX 3: 跳過 = 不確定 = 存入錯題本 ── */}
      {!showAnswer && (
        <button
          onClick={() => { addToWrongBook(deck[current]); next() }}
          style={{ width: '100%', padding: '10px', background: 'none', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}>
          🤔 不確定，存入錯題本並跳過 →
        </button>
      )}
    </div>
  )
}
