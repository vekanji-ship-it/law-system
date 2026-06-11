'use client'
import { useState } from 'react'
import { REAL_CASES } from '../lib/content-data-v2'
import Link from 'next/link'

const CHECKOUT_URL = '/checkout'

export default function RealCasesSection({ isPaid }) {
  const [selectedTag, setSelectedTag] = useState('全部')
  const [selectedDiff, setSelectedDiff] = useState('全部')
  const [expandedId, setExpandedId] = useState(null)
  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  const tags = ['全部', ...new Set(REAL_CASES.map(c => c.tag))]
  const filtered = REAL_CASES.filter(c =>
    (selectedTag === '全部' || c.tag === selectedTag) &&
    (selectedDiff === '全部' || c.diff === selectedDiff)
  )

  const LockWall = () => (
    <div style={{ background: '#fef9ec', border: '2px dashed #fbbf24', borderRadius: '10px', padding: '20px', textAlign: 'center', marginTop: '10px' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
      <p style={{ color: '#92400e', fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>付費會員限定 — 19個完整實務案例解析</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={CHECKOUT_URL} style={{ background: '#c9973a', color: 'white', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>💳 升級解鎖</a>
        <Link href="/activate" style={{ background: 'white', color: '#0f1f3d', border: '2px solid #0f1f3d', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>🔑 輸入授權碼</Link>
      </div>
    </div>
  )

  const diffColors = { low: { bg: '#f0fdf4', color: '#16a34a' }, mid: { bg: '#fff7ed', color: '#c2410c' }, high: { bg: '#fef2f2', color: '#dc2626' } }

  return (
    <div>
      <div style={{ background: '#0f1f3d', borderRadius: '10px', padding: '14px 20px', marginBottom: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '13px' }}><span style={{ color: '#c9973a', fontWeight: 900, fontSize: '20px' }}>19</span> 個真實案例</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>涵蓋繼承、買賣、稅務、仲介、農地等各類型</div>
        {!isPaid && <div style={{ marginLeft: 'auto', background: 'rgba(201,151,58,0.2)', border: '1px solid rgba(201,151,58,0.4)', borderRadius: '20px', padding: '4px 14px', color: '#e8b95a', fontSize: '12px', fontWeight: 700 }}>免費版：前3案例可看解答</div>}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <button key={tag} onClick={() => setSelectedTag(tag)}
            style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: selectedTag === tag ? '#0f1f3d' : '#e2e8f0', color: selectedTag === tag ? 'white' : '#374151' }}>
            {tag}
          </button>
        ))}
        {['全部', 'low', 'mid', 'high'].map(d => (
          <button key={d} onClick={() => setSelectedDiff(d)}
            style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              background: selectedDiff === d ? (d === 'low' ? '#16a34a' : d === 'mid' ? '#c2410c' : d === 'high' ? '#dc2626' : '#6b7280') : '#f1f5f9',
              color: selectedDiff === d ? 'white' : '#374151' }}>
            {d === '全部' ? '全部難度' : d === 'low' ? '基礎' : d === 'mid' ? '進階' : '高難度'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(c => {
          const dc = diffColors[c.diff] || diffColors.mid
          return (
            <div key={c.id} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div onClick={() => toggle(c.id)} style={{ cursor: 'pointer', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ background: '#0f1f3d', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{c.tag}</span>
                    <span style={{ background: dc.bg, color: dc.color, fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{c.diffLabel}</span>
                    {!c.isPaid && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>✓ 免費</span>}
                    {c.isPaid && isPaid && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>✓ 已解鎖</span>}
                    {c.isPaid && !isPaid && <span style={{ background: '#fef9ec', color: '#92400e', border: '1px solid #fbbf24', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>🔒 付費</span>}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f1f3d' }}>{c.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{c.question}</div>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '18px', flexShrink: 0 }}>{expandedId === c.id ? '▲' : '▼'}</span>
              </div>

              {expandedId === c.id && (
                c.isPaid && !isPaid ? <div style={{ padding: '0 18px 18px' }}><LockWall /></div> : (
                  <div style={{ padding: '0 18px 18px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#374151', marginBottom: '6px' }}>📋 案例情境</div>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#374151', lineHeight: 1.8 }}>{c.scenario}</div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#374151', marginBottom: '8px' }}>⚖️ 引用法條</div>
                      {c.laws.map((l, i) => (
                        <div key={i} style={{ background: '#f0f4ff', borderLeft: '3px solid #0f1f3d', padding: '8px 12px', borderRadius: '0 6px 6px 0', fontSize: '13px', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, color: '#1e40af' }}>{l.code}</span>
                          <span style={{ color: '#374151', marginLeft: '8px' }}>{l.note}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#374151', marginBottom: '6px' }}>✅ 解題解析</div>
                      <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#1a1a2e', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{c.answer}</div>
                    </div>
                    {c.refs && <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>📖 相關章節：{c.refs}</div>}
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
