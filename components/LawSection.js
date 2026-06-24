'use client'
import { useState } from 'react'
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
import { SUPPLEMENT_LAW_ARTICLES_11 } from '../lib/supplement-law-data-11'
import { SUPPLEMENT_LAW_ARTICLES_12 } from '../lib/supplement-law-data-12'
import { SUPPLEMENT_LAW_ARTICLES_13 } from '../lib/supplement-law-data-13'
import { SUPPLEMENT_LAW_ARTICLES_14 } from '../lib/supplement-law-data-14'
import { SUPPLEMENT_LAW_ARTICLES_15 } from '../lib/supplement-law-data-15'
import { SUPPLEMENT_LAW_ARTICLES_16 } from '../lib/supplement-law-data-16'
import { SUPPLEMENT_LAW_ARTICLES_17 } from '../lib/supplement-law-data-17'
import { SUPPLEMENT_LAW_ARTICLES_18 } from '../lib/supplement-law-data-18'
import { SUPPLEMENT_LAW_ARTICLES_19 } from '../lib/supplement-law-data-19'
import LawHeatmap from './LawHeatmap'
import LawRelationMap from './LawRelationMap'
import Link from 'next/link'

const CHECKOUT_URL = '/checkout'

// 考試類別對應（沒有exam欄位的舊文章預設為both）
const getExamType = (article) => article.exam || 'both'

export default function LawSection({ isPaid }) {
  const [selectedCat, setSelectedCat] = useState('全部')
  const [searchText, setSearchText] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [showFreq, setShowFreq] = useState('全部')
  const [showExam, setShowExam] = useState('全部')  // 考試類別篩選
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('law_bookmarks') || '[]') } catch { return [] }
  })
  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('law_read') || '[]') } catch { return [] }
  })

  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id]
    setBookmarks(updated)
    localStorage.setItem('law_bookmarks', JSON.stringify(updated))
  }

  const markAsRead = (id) => {
    if (readIds.includes(id)) return
    const updated = [...readIds, id]
    setReadIds(updated)
    localStorage.setItem('law_read', JSON.stringify(updated))
  }

  const toggle = (id) => {
    setExpandedId(expandedId === id ? null : id)
    if (expandedId !== id) markAsRead(id)
  }

  const allArticles = [
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
    ...SUPPLEMENT_LAW_ARTICLES_11,
    ...SUPPLEMENT_LAW_ARTICLES_12,
    ...SUPPLEMENT_LAW_ARTICLES_13,
    ...SUPPLEMENT_LAW_ARTICLES_14,
    ...SUPPLEMENT_LAW_ARTICLES_15,
    ...SUPPLEMENT_LAW_ARTICLES_16,
    ...SUPPLEMENT_LAW_ARTICLES_17,
    ...SUPPLEMENT_LAW_ARTICLES_18,
    ...SUPPLEMENT_LAW_ARTICLES_19
  ]

  const filtered = allArticles.filter(l => {
    const matchCat = selectedCat === '全部' || l.catCode === selectedCat
    const matchFreq = showFreq === '全部' || l.freq === showFreq
    const matchSearch = !searchText ||
      l.code.includes(searchText) ||
      l.title.includes(searchText) ||
      l.detail.includes(searchText)
    const matchBookmark = !showBookmarks || bookmarks.includes(l.id)
    const examType = getExamType(l)
    const matchExam = showExam === '全部' ||
      (showExam === 'both' && examType === 'both') ||
      (showExam === 'land_reg' && (examType === 'land_reg' || examType === 'both')) ||
      (showExam === 'broker' && (examType === 'broker' || examType === 'both'))
    return matchCat && matchFreq && matchSearch && matchBookmark && matchExam
  })

  const readPercent = Math.round(readIds.length / allArticles.length * 100)

  const LockWall = () => (
    <div style={{ background: '#fef9ec', border: '2px dashed #fbbf24', borderRadius: '10px', padding: '24px', textAlign: 'center', marginTop: '10px' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
      <p style={{ color: '#92400e', fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>付費會員限定 — 完整法條全文</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={CHECKOUT_URL} style={{ background: '#c9973a', color: 'white', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          💳 升級解鎖
        </a>
        <Link href="/activate" style={{ background: 'white', color: '#0f1f3d', border: '2px solid #0f1f3d', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          🔑 輸入授權碼
        </Link>
      </div>
    </div>
  )

  // 考試類別標籤設定
  const EXAM_CONFIG = {
    both:     { label: '🔵 共同科目', bg: '#eff6ff', color: '#1d4ed8', border: '#93c5fd' },
    land_reg: { label: '🟡 地政士',   bg: '#fefce8', color: '#854d0e', border: '#fde047' },
    broker:   { label: '🟢 經紀人',   bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
  }

  return (
    <div>
      {/* Stats bar */}
      <div style={{ background: '#0f1f3d', borderRadius: '10px', padding: '14px 20px', marginBottom: '12px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '13px' }}>
          <span style={{ color: '#c9973a', fontWeight: 900, fontSize: '20px' }}>{allArticles.length}</span> 條法條
        </div>
        <div style={{ color: 'white', fontSize: '13px' }}>
          <span style={{ color: '#c9973a', fontWeight: 900, fontSize: '20px' }}>{LAW_CATEGORIES.length}</span> 大類別
        </div>
        <div style={{ color: 'white', fontSize: '13px' }}>
          <span style={{ color: '#c9973a', fontWeight: 900, fontSize: '20px' }}>{bookmarks.length}</span> 已收藏
        </div>
        <div style={{ color: 'white', fontSize: '13px' }}>
          <span style={{ color: '#4ade80', fontWeight: 900, fontSize: '20px' }}>{readIds.length}</span> 已讀
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginLeft: '4px' }}>
            / {allArticles.length}（{readPercent}%）
          </span>
        </div>
        {!isPaid && (
          <div style={{ marginLeft: 'auto', background: 'rgba(201,151,58,0.2)', border: '1px solid rgba(201,151,58,0.4)', borderRadius: '20px', padding: '4px 14px', color: '#e8b95a', fontSize: '12px', fontWeight: 700 }}>
            免費版：部分免費條文可看
          </div>
        )}
      </div>

      {/* 學習進度條 */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>📖 學習進度</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>{readIds.length} / {allArticles.length} 條（{readPercent}%）</span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(90deg, #16a34a, #4ade80)', height: '100%', borderRadius: '99px', width: `${readPercent}%`, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* 法條關聯地圖 */}
      <LawRelationMap />

      {/* 命題頻率熱力圖 */}
      <LawHeatmap allArticles={allArticles} />

      {/* 搜尋 */}
      <div style={{ marginBottom: '12px' }}>
        <input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="🔍 搜尋法條代號、標題或內容（如：民法 §758、優先購買...）"
          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
        />
      </div>

      {/* 考試類別篩選（新增）*/}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>📋 考試科目篩選</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            ['全部', '全部科目', '#0f1f3d', 'white'],
            ['both', '🔵 地政士＋經紀人共同', '#1d4ed8', '#eff6ff'],
            ['land_reg', '🟡 地政士專屬', '#854d0e', '#fefce8'],
            ['broker', '🟢 不動產經紀人專屬', '#15803d', '#f0fdf4'],
          ].map(([val, label, color, bg]) => (
            <button key={val} onClick={() => setShowExam(val)}
              style={{ padding: '5px 12px', borderRadius: '20px', border: `1px solid ${showExam === val ? color : '#e2e8f0'}`, cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                background: showExam === val ? (val === '全部' ? '#0f1f3d' : bg) : 'white',
                color: showExam === val ? (val === '全部' ? 'white' : color) : '#374151' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 類別篩選 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {['全部', ...LAW_CATEGORIES.map(c => c.id)].map(cat => {
          const label = cat === '全部' ? '全部' : LAW_CATEGORIES.find(c => c.id === cat)?.label?.split('. ')[1] || cat
          const count = cat === '全部' ? filtered.length : allArticles.filter(l => l.catCode === cat).length
          return (
            <button key={cat} onClick={() => setSelectedCat(cat)}
              style={{ padding: '4px 10px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                background: selectedCat === cat ? '#0f1f3d' : '#e2e8f0',
                color: selectedCat === cat ? 'white' : '#374151' }}>
              {label} <span style={{ opacity: 0.6 }}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* 頻率篩選 + 收藏 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[['全部', '全部'], ['high', '★ 高頻'], ['medium', '◆ 中頻'], ['low', '◇ 一般']].map(([val, label]) => (
          <button key={val} onClick={() => setShowFreq(val)}
            style={{ padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              background: showFreq === val ? (val === 'high' ? '#dc2626' : val === 'medium' ? '#d97706' : val === 'low' ? '#6b7280' : '#0f1f3d') : '#f1f5f9',
              color: showFreq === val ? 'white' : '#374151' }}>
            {label}
          </button>
        ))}
        <button onClick={() => setShowBookmarks(!showBookmarks)}
          style={{ padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            background: showBookmarks ? '#fef9ec' : '#f1f5f9',
            color: showBookmarks ? '#c9973a' : '#374151',
            border: showBookmarks ? '1px solid #c9973a' : '1px solid transparent' }}>
          🔖 收藏 ({bookmarks.length})
        </button>
        <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>
          顯示 {filtered.length} / {allArticles.length} 條
        </span>
      </div>

      {/* 法條列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(l => {
          const isRead = readIds.includes(l.id)
          const isBookmarked = bookmarks.includes(l.id)
          const examType = getExamType(l)
          const examCfg = EXAM_CONFIG[examType]
          return (
            <div key={l.id} style={{
              background: l.freq === 'high' ? '#fff8f8' : l.freq === 'medium' ? '#fffbf0' : 'white',
              borderRadius: '10px',
              border: l.freq === 'high' ? '1px solid #fca5a5' : l.freq === 'medium' ? '1px solid #fcd34d' : '1px solid #e2e8f0',
              borderLeft: l.freq === 'high' ? '4px solid #dc2626' : l.freq === 'medium' ? '4px solid #d97706' : '1px solid #e2e8f0',
              overflow: 'hidden',
              opacity: isRead ? 0.85 : 1,
            }}>
              <div onClick={() => toggle(l.id)} style={{ cursor: 'pointer', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* 考試類別標籤 */}
                    <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '8px', fontWeight: 700,
                      background: examCfg.bg, color: examCfg.color, border: `1px solid ${examCfg.border}` }}>
                      {examCfg.label}
                    </span>
                    <span style={{ background: '#0f1f3d', color: 'white', fontSize: '11px', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>
                      {l.catCode}
                    </span>
                    <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '8px', fontWeight: 700,
                      background: l.freq === 'high' ? '#fef2f2' : l.freq === 'medium' ? '#fffbeb' : '#f8fafc',
                      color: l.freq === 'high' ? '#dc2626' : l.freq === 'medium' ? '#d97706' : '#6b7280' }}>
                      {l.freqLabel}
                    </span>
                    {isRead && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '10px', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>✓ 已讀</span>}
                    {!l.isPaid && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '10px', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>✓ 免費</span>}
                    {l.isPaid && isPaid && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '10px', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>✓ 已解鎖</span>}
                    {l.isPaid && !isPaid && <span style={{ background: '#fef9ec', color: '#92400e', border: '1px solid #fbbf24', fontSize: '10px', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>🔒 付費</span>}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f1f3d' }}>{l.code}</div>
                  <div style={{ fontSize: '13px', color: '#374151', marginTop: '2px' }}>{l.title}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{l.subLabel}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button onClick={(e) => { e.stopPropagation(); toggleBookmark(l.id) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '2px', lineHeight: 1 }}>
                    {isBookmarked ? '🔖' : '🤍'}
                  </button>
                  <span style={{ color: '#94a3b8', fontSize: '16px' }}>{expandedId === l.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedId === l.id && (
                l.isPaid && !isPaid ? <div style={{ padding: '0 16px 16px' }}><LockWall /></div> : (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ marginTop: '14px', background: '#f8fafc', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.9, color: '#1e293b', whiteSpace: 'pre-wrap', borderLeft: '4px solid #0f1f3d' }}>
                      {l.detail}
                    </div>
                  </div>
                )
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
