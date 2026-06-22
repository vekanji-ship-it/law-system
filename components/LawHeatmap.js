'use client'
import { useState } from 'react'
import { LAW_CATEGORIES } from '../lib/full-law-data'

export default function LawHeatmap({ allArticles }) {
  const [expanded, setExpanded] = useState(false)

  const stats = LAW_CATEGORIES.map(cat => {
    const articles = allArticles.filter(l => l.catCode === cat.id)
    const high = articles.filter(l => l.freq === 'high').length
    const medium = articles.filter(l => l.freq === 'medium').length
    const low = articles.filter(l => l.freq === 'low').length
    const total = articles.length
    return { ...cat, high, medium, low, total }
  }).filter(c => c.total > 0)

  const maxTotal = Math.max(...stats.map(s => s.total))

  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#0f1f3d' }}>
        <span>📊 命題頻率分布圖</span>
        <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 400 }}>
          {expanded ? '▲ 收起' : '▼ 展開查看各類別考頻分布'}
        </span>
      </button>

      {expanded && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '16px' }}>
          {/* 圖例 */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[['#dc2626', '★ 高頻考點'], ['#d97706', '◆ 中頻考點'], ['#94a3b8', '◇ 一般條文']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#374151' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: color }} />
                {label}
              </div>
            ))}
          </div>

          {/* 熱力條 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.sort((a, b) => b.high - a.high).map(cat => {
              const name = cat.label.split('. ')[1] || cat.label
              const highPct = cat.total ? Math.round(cat.high / cat.total * 100) : 0
              const medPct = cat.total ? Math.round(cat.medium / cat.total * 100) : 0
              const lowPct = 100 - highPct - medPct
              const barWidth = Math.round(cat.total / maxTotal * 100)

              return (
                <div key={cat.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600, flex: 1 }}>{name}</span>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                      {cat.high > 0 && <span style={{ color: '#dc2626', fontWeight: 700 }}>★{cat.high}</span>}
                      {cat.medium > 0 && <span style={{ color: '#d97706' }}>◆{cat.medium}</span>}
                      <span style={{ color: '#94a3b8' }}>共{cat.total}條</span>
                    </div>
                  </div>
                  {/* 條形圖（寬度依總數比例） */}
                  <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '14px', overflow: 'hidden', width: '100%' }}>
                    <div style={{ display: 'flex', height: '100%', width: `${barWidth}%` }}>
                      {cat.high > 0 && (
                        <div style={{ background: '#dc2626', width: `${highPct}%`, transition: 'width 0.5s' }} title={`高頻 ${cat.high} 條`} />
                      )}
                      {cat.medium > 0 && (
                        <div style={{ background: '#d97706', width: `${medPct}%`, transition: 'width 0.5s' }} title={`中頻 ${cat.medium} 條`} />
                      )}
                      {lowPct > 0 && (
                        <div style={{ background: '#cbd5e1', width: `${lowPct}%`, transition: 'width 0.5s' }} title={`一般 ${cat.low} 條`} />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 總計 */}
          <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              ['★ 高頻', allArticles.filter(l => l.freq === 'high').length, '#dc2626'],
              ['◆ 中頻', allArticles.filter(l => l.freq === 'medium').length, '#d97706'],
              ['◇ 一般', allArticles.filter(l => l.freq === 'low').length, '#6b7280'],
            ].map(([label, count, color]) => (
              <div key={label} style={{ fontSize: '13px' }}>
                <span style={{ color, fontWeight: 700 }}>{label}</span>
                <span style={{ color: '#374151', marginLeft: '6px' }}>{count} 條</span>
                <span style={{ color: '#94a3b8', marginLeft: '4px' }}>
                  ({Math.round(count / allArticles.length * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
