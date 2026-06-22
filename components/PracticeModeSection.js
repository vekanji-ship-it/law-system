'use client'
import { useState, useCallback } from 'react'
import { LAW_CATEGORIES, FULL_LAW_ARTICLES } from '../lib/full-law-data'
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

const ALL_ARTICLES = [
  ...FULL_LAW_ARTICLES,
  ...SUPPLEMENT_LAW_ARTICLES_1,
  ...SUPPLEMENT_LAW_ARTICLES_2,
  ...SUPPLEMENT_LAW_ARTICLES_3,
  ...SUPPLEMENT_LAW_ARTICLES_4,
  ...SUPPLEMENT_LAW_ARTICLES_5,
  ...SUPPLEMENT_LAW_ARTICLES_6,
  ...SUPPLEMENT_LAW_ARTICLES_7,
  ...SUPPLEMENT_LAW_ARTICLES_8,
  ...SUPPLEMENT_LAW_ARTICLES_9,
  ...SUPPLEMENT_LAW_ARTICLES_10,
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function PracticeModeSection({ isPaid }) {
  const [filterCat, setFilterCat] = useState('全部')
  const [filterFreq, setFilterFreq] = useState('high')
  const [filterCount, setFilterCount] = useState(10)
  const [started, setStarted] = useState(false)
  const [deck, setDeck] = useState([])
  const [current, setCurrent] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [results, setResults] = useState({ know: 0, review: 0 })
  const [finished, setFinished] = useState(false)
  const [reviewList, setReviewList] = useState([])

  const startPractice = useCallback(() => {
    let pool = ALL_ARTICLES.filter(l => {
      const matchCat = filterCat === '全部' || l.catCode === filterCat
      const matchFreq = filterFreq === '全部' || l.freq === filterFreq
      const matchPaid = isPaid || !l.isPaid
      return matchCat && matchFreq && matchPaid
    })
    const shuffled = shuffle(pool).slice(0, filterCount)
    setDeck(shuffled)
    setCurrent(0)
    setShowAnswer(false)
    setResults({ know: 0, review: 0 })
    setFinished(false)
    setReviewList([])
    setStarted(true)
  }, [filterCat, filterFreq, filterCount, isPaid])

  const handleKnow = () => {
    setResults(r => ({ ...r, know: r.know + 1 }))
    nextCard()
  }

  const handleReview = () => {
    setResults(r => ({ ...r, review: r.review + 1 }))
    setReviewList(prev => [...prev, deck[current]])
    nextCard()
  }

  const nextCard = () => {
    setShowAnswer(false)
    if (current + 1 >= deck.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const poolSize = ALL_ARTICLES.filter(l => {
    const matchCat = filterCat === '全部' || l.catCode === filterCat
    const matchFreq = filterFreq === '全部' || l.freq === filterFreq
    const matchPaid = isPaid || !l.isPaid
    return matchCat && matchFreq && matchPaid
  }).length

  // ── 設定畫面 ──
  if (!started) return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f1f3d, #1a3a6e)', borderRadius: '16px', padding: '28px', marginBottom: '24px', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>法條閃卡練習</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>先看法條名稱，回想內容，再翻面核對</p>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '16px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>📂 類別篩選</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['全部', ...LAW_CATEGORIES.map(c => c.id)].map(cat => {
              const label = cat === '全部' ? '全部' : LAW_CATEGORIES.find(c => c.id === cat)?.label?.split('. ')[1] || cat
              return (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  style={{ padding: '4px 10px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                    background: filterCat === cat ? '#0f1f3d' : '#e2e8f0',
                    color: filterCat === cat ? 'white' : '#374151' }}>
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
                  background: filterFreq === val ? (val === 'high' ? '#dc2626' : val === 'medium' ? '#d97706' : val === 'low' ? '#6b7280' : '#0f1f3d') : '#f1f5f9',
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
          <input type="range" min={5} max={Math.min(50, poolSize)} value={filterCount}
            onChange={e => setFilterCount(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0f1f3d' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            <span>5 題</span><span>50 題</span>
          </div>
        </div>

        <button onClick={startPractice} disabled={poolSize === 0}
          style={{ width: '100%', padding: '14px', background: poolSize === 0 ? '#e2e8f0' : '#0f1f3d', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 800, cursor: poolSize === 0 ? 'not-allowed' : 'pointer' }}>
          🚀 開始練習 {filterCount} 題
        </button>
      </div>

      <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '16px', fontSize: '13px', color: '#1e40af', lineHeight: 1.8 }}>
        <strong>💡 練習方式</strong><br />
        看到法條代號與標題 → 在腦中回想條文內容 → 點「翻面看答案」確認 → 標記「✅ 我知道了」或「🔄 再複習」→ 練習結束後可重複練習「再複習」的題目
      </div>
    </div>
  )

  // ── 完成畫面 ──
  if (finished) return (
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
          <div style={{ fontSize: '13px', color: '#9a3412', fontWeight: 700 }}>🔄 需複習</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px', textAlign: 'left' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f1f3d', marginBottom: '12px' }}>
          📊 掌握率：{Math.round(results.know / deck.length * 100)}%
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '10px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ background: 'linear-gradient(90deg, #16a34a, #4ade80)', height: '100%', borderRadius: '99px', width: `${Math.round(results.know / deck.length * 100)}%`, transition: 'width 0.5s ease' }} />
        </div>
        {reviewList.length > 0 && (
          <>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ea580c', marginBottom: '8px' }}>🔄 需再複習的法條：</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {reviewList.map(l => (
                <div key={l.id} style={{ background: '#fff7ed', borderLeft: '3px solid #ea580c', padding: '8px 12px', borderRadius: '0 6px 6px 0', fontSize: '13px' }}>
                  <strong>{l.code}</strong> — {l.title}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {reviewList.length > 0 && (
          <button onClick={() => {
            setDeck(shuffle(reviewList))
            setCurrent(0)
            setShowAnswer(false)
            setResults({ know: 0, review: 0 })
            setFinished(false)
            setReviewList([])
          }}
            style={{ flex: 1, padding: '12px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            🔄 只練習「需複習」({reviewList.length} 題)
          </button>
        )}
        <button onClick={() => setStarted(false)}
          style={{ flex: 1, padding: '12px', background: '#0f1f3d', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          🎯 重新設定練習
        </button>
      </div>
    </div>
  )

  // ── 練習畫面 ──
  const card = deck[current]
  const progress = Math.round((current / deck.length) * 100)

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* 進度條 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
          <span>第 {current + 1} / {deck.length} 題</span>
          <span>✅ {results.know} 已掌握　🔄 {results.review} 需複習</span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(90deg, #0f1f3d, #3b82f6)', height: '100%', borderRadius: '99px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* 閃卡 */}
      <div style={{ background: 'white', borderRadius: '16px', border: `2px solid ${card.freq === 'high' ? '#fca5a5' : card.freq === 'medium' ? '#fcd34d' : '#e2e8f0'}`, borderLeft: `6px solid ${card.freq === 'high' ? '#dc2626' : card.freq === 'medium' ? '#d97706' : '#94a3b8'}`, padding: '28px', marginBottom: '16px', minHeight: '280px' }}>
        {/* 題面：法條代號與標題 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ background: '#0f1f3d', color: 'white', fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: 700 }}>
              {card.catCode} — {LAW_CATEGORIES.find(c => c.id === card.catCode)?.label?.split('. ')[1] || card.catCode}
            </span>
            <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: 700,
              background: card.freq === 'high' ? '#fef2f2' : card.freq === 'medium' ? '#fffbeb' : '#f8fafc',
              color: card.freq === 'high' ? '#dc2626' : card.freq === 'medium' ? '#d97706' : '#6b7280' }}>
              {card.freqLabel}
            </span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f1f3d', marginBottom: '8px' }}>{card.code}</div>
          <div style={{ fontSize: '16px', color: '#374151', fontWeight: 600 }}>{card.title}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>{card.subLabel}</div>
        </div>

        {/* 分隔線 */}
        <div style={{ borderTop: '2px dashed #e2e8f0', margin: '20px 0' }} />

        {/* 答案區域 */}
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
          <div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.9, color: '#1e293b', whiteSpace: 'pre-wrap', borderLeft: '4px solid #0f1f3d', maxHeight: '240px', overflowY: 'auto' }}>
              {card.isPaid && !isPaid ? '🔒 此為付費內容，升級後可查看完整條文' : card.detail}
            </div>
          </div>
        )}
      </div>

      {/* 操作按鈕 */}
      {showAnswer && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button onClick={handleReview}
            style={{ padding: '14px', background: '#fff7ed', color: '#ea580c', border: '2px solid #ea580c', borderRadius: '10px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
            🔄 再複習
          </button>
          <button onClick={handleKnow}
            style={{ padding: '14px', background: '#f0fdf4', color: '#16a34a', border: '2px solid #16a34a', borderRadius: '10px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
            ✅ 我知道了
          </button>
        </div>
      )}

      {/* 跳過按鈕 */}
      {!showAnswer && (
        <button onClick={nextCard}
          style={{ width: '100%', padding: '10px', background: 'none', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}>
          跳過這題 →
        </button>
      )}
    </div>
  )
}
