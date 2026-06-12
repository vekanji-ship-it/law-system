'use client'
import { useState } from 'react'
import { LAW_CATEGORIES, FULL_LAW_ARTICLES } from '../lib/full-law-data'
import { SUPPLEMENT_LAW_ARTICLES_1 } from '../lib/supplement-law-data-1'
import Link from 'next/link'

const CHECKOUT_URL = 'https://mookie-kanji.lemonsqueezy.com/checkout/buy/ee9d58aa-a6dd-4e9d-9b53-143b36f9de65?discount=EARLY30'

export default function LawSection({ isPaid }) {
  const [selectedCat, setSelectedCat] = useState('全部')
  const [searchText, setSearchText] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [showFreq, setShowFreq] = useState('全部')

  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  // Filter
  const filtered = FULL_LAW_ARTICLES.filter(l => {
    const matchCat = selectedCat === '全部' || l.catCode === selectedCat
    const matchFreq = showFreq === '全部' || l.freq === showFreq
    const matchSearch = !searchText || 
      l.code.includes(searchText) || 
      l.title.includes(searchText) || 
      l.detail.includes(searchText)
    return matchCat && matchFreq && matchSearch
  })

  const LockWall = () => (
    <div style={{ background: '#fef9ec', border: '2px dashed #fbbf24', borderRadius: '10px', padding: '24px', textAlign: 'center', marginTop: '10px' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
      <p style={{ color: '#92400e', fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>付費會員限定 — 321條完整法條全文</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer"
          style={{ background: '#c9973a', color: 'white', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          💳 升級解鎖
        </a>
        <Link href="/activate" style={{ background: 'white', color: '#0f1f3d', border: '2px solid #0f1f3d', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          🔑 輸入授權碼
        </Link>
      </div>
    </div>
  )

  return (
    <div>
      {/* Stats bar */}
      <div style={{ background: '#0f1f3d', borderRadius: '10px', padding: '14px 20px', marginBottom: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ color: 'white', fontSize: '13px' }}>
          <span style={{ color: '#c9973a', fontWeight: 900, fontSize: '20px' }}>321</span> 條法條
        </div>
        <div style={{ color: 'white', fontSize: '13px' }}>
          <span style={{ color: '#c9973a', fontWeight: 900, fontSize: '20px' }}>18</span> 大類別
        </div>
        <div style={{ color: 'white', fontSize: '13px' }}>
          <span style={{ color: '#c9973a', fontWeight: 900, fontSize: '20px' }}>80</span> 子類別
        </div>
        {!isPaid && (
          <div style={{ marginLeft: 'auto', background: 'rgba(201,151,58,0.2)', border: '1px solid rgba(201,151,58,0.4)', borderRadius: '20px', padding: '4px 14px', color: '#e8b95a', fontSize: '12px', fontWeight: 700 }}>
            免費版：前3條可看
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '14px' }}>
        <input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="🔍 搜尋法條代號、標題或內容（如：民法 §758、優先購買...）"
          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
        />
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {['全部', ...LAW_CATEGORIES.map(c => c.id)].map(cat => {
          const label = cat === '全部' ? '全部' : LAW_CATEGORIES.find(c => c.id === cat)?.label?.split('.')[0] + '.'
          const count = cat === '全部' ? filtered.length : FULL_LAW_ARTICLES.filter(l => l.catCode === cat).length
          return (
            <button key={cat} onClick={() => setSelectedCat(cat)}
              style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                background: selectedCat === cat ? '#0f1f3d' : '#e2e8f0',
                color: selectedCat === cat ? 'white' : '#374151' }}>
              {label} <span style={{ opacity: 0.6 }}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Freq filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {[['全部', '全部'], ['high', '★ 高頻'], ['mid', '◆ 中頻'], ['low', '◇ 一般']].map(([val, label]) => (
          <button key={val} onClick={() => setShowFreq(val)}
            style={{ padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              background: showFreq === val ? (val === 'high' ? '#dc2626' : val === 'mid' ? '#d97706' : '#6b7280') : '#f1f5f9',
              color: showFreq === val ? 'white' : '#374151' }}>
            {label}
          </button>
        ))}
        <span style={{ fontSize: '12px', color: '#94a3b8', alignSelf: 'center', marginLeft: '8px' }}>
          顯示 {filtered.length} / 321 條
        </span>
      </div>

      {/* Law articles list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(l => (
          <div key={l.id} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div onClick={() => toggle(l.id)} style={{ cursor: 'pointer', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ background: '#0f1f3d', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    {l.catCode}
                  </span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700,
                    background: l.freq === 'high' ? '#fef2f2' : l.freq === 'mid' ? '#fffbeb' : '#f8fafc',
                    color: l.freq === 'high' ? '#dc2626' : l.freq === 'mid' ? '#d97706' : '#6b7280' }}>
                    {l.freqLabel}
                  </span>
                  {!l.isPaid && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>✓ 免費</span>}
                  {l.isPaid && isPaid && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>✓ 已解鎖</span>}
                  {l.isPaid && !isPaid && <span style={{ background: '#fef9ec', color: '#92400e', border: '1px solid #fbbf24', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>🔒 付費</span>}
                </div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f1f3d' }}>{l.code}</div>
                <div style={{ fontSize: '13px', color: '#374151', marginTop: '2px' }}>{l.title}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{l.subLabel}</div>
              </div>
              <span style={{ color: '#94a3b8', fontSize: '18px', flexShrink: 0 }}>{expandedId === l.id ? '▲' : '▼'}</span>
            </div>

            {expandedId === l.id && (
              l.isPaid && !isPaid ? <div style={{ padding: '0 18px 18px' }}><LockWall /></div> : (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ marginTop: '16px', background: '#f8fafc', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.9, color: '#1e293b', whiteSpace: 'pre-wrap', borderLeft: '4px solid #0f1f3d' }}>
                    {l.detail}
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
