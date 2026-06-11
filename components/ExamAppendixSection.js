'use client'
import { useState } from 'react'
import { EXAM_APPENDIX } from '../lib/content-data-v2'
import Link from 'next/link'

const CHECKOUT_URL = '/checkout'

export default function ExamAppendixSection({ isPaid }) {
  const [selectedYear, setSelectedYear] = useState('全部')
  const [selectedSubj, setSelectedSubj] = useState('全部')
  const [expandedId, setExpandedId] = useState(null)
  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  const years = ['全部', ...new Set(EXAM_APPENDIX.map(q => q.year))]
  const subjects = ['全部', ...new Set(EXAM_APPENDIX.map(q => q.subject))]

  const filtered = EXAM_APPENDIX.filter(q =>
    (selectedYear === '全部' || q.year === selectedYear) &&
    (selectedSubj === '全部' || q.subject === selectedSubj)
  )

  const LockWall = () => (
    <div style={{ background: '#fef9ec', border: '2px dashed #fbbf24', borderRadius: '10px', padding: '20px', textAlign: 'center', marginTop: '10px' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
      <p style={{ color: '#92400e', fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>付費會員限定 — 38題考古題（含113年模考）</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <a href={CHECKOUT_URL} style={{ background: '#c9973a', color: 'white', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>💳 升級解鎖</a>
        <Link href="/activate" style={{ background: 'white', color: '#0f1f3d', border: '2px solid #0f1f3d', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>🔑 輸入授權碼</Link>
      </div>
    </div>
  )

  const tagColor = { high: { bg: '#fef2f2', color: '#dc2626' }, mid: { bg: '#fff7ed', color: '#c2410c' }, low: { bg: '#f0fdf4', color: '#16a34a' } }
  const typeColor = { '計算申論': '#7c3aed', '申論': '#0f1f3d', '測驗': '#0369a1', '計算': '#7c3aed', '申論/測驗': '#0f1f3d' }

  return (
    <div>
      <div style={{ background: '#0f1f3d', borderRadius: '10px', padding: '14px 20px', marginBottom: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '13px' }}><span style={{ color: '#c9973a', fontWeight: 900, fontSize: '20px' }}>38</span> 題考古題</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>含114年重點、113年模擬考、112-111年考題</div>
        {!isPaid && <div style={{ marginLeft: 'auto', background: 'rgba(201,151,58,0.2)', border: '1px solid rgba(201,151,58,0.4)', borderRadius: '20px', padding: '4px 14px', color: '#e8b95a', fontSize: '12px', fontWeight: 700 }}>免費版：前5題可看</div>}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {years.map(y => (
          <button key={y} onClick={() => setSelectedYear(y)}
            style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: selectedYear === y ? '#0f1f3d' : '#e2e8f0', color: selectedYear === y ? 'white' : '#374151' }}>
            {y === '全部' ? '全部年份' : y.split('（')[0]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {subjects.map(s => (
          <button key={s} onClick={() => setSelectedSubj(s)}
            style={{ padding: '4px 10px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600, background: selectedSubj === s ? '#1e40af' : '#f1f5f9', color: selectedSubj === s ? 'white' : '#374151' }}>
            {s}
          </button>
        ))}
        <span style={{ fontSize: '12px', color: '#94a3b8', alignSelf: 'center' }}>顯示 {filtered.length} / 38 題</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map((q, idx) => {
          const tc = tagColor[q.tag] || tagColor.mid
          const typeC = typeColor[q.examType] || '#374151'
          return (
            <div key={q.id} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ background: tc.bg, color: tc.color, fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  {q.tag === 'high' ? '★每年必考' : q.tag === 'mid' ? '◆重點題' : '◇補充'}
                </span>
                <span style={{ background: '#f0f4ff', color: typeC, fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{q.examType}</span>
                <span style={{ background: '#faf5ff', color: '#6b21a8', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{q.subject}</span>
                {!q.isPaid && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>✓ 免費</span>}
                {q.isPaid && isPaid && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>✓ 已解鎖</span>}
                {q.isPaid && !isPaid && <span style={{ background: '#fef9ec', color: '#92400e', border: '1px solid #fbbf24', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>🔒 付費</span>}
              </div>
              {q.isPaid && !isPaid ? (
                <>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', filter: 'blur(4px)', userSelect: 'none' }}>{q.question}</div>
                  <LockWall />
                </>
              ) : (
                <>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f1f3d', lineHeight: 1.7 }}>{q.question}</div>
                  {q.ref && <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>📖 參考章節：{q.ref}</div>}
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#c9973a', fontWeight: 600 }}>📅 {q.year}</div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
