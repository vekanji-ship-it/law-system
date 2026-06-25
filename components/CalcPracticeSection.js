'use client'
import { useState } from 'react'

// ── 計算邏輯 ──────────────────────────────────

function calcLVT({ prev, current, isSelf }) {
  const p = Number(prev) || 0
  const c = Number(current) || 0
  if (c <= p || p <= 0) return null
  const app = c - p
  const ratio = (app / p) * 100

  if (isSelf) {
    return {
      steps: [
        { label: '移轉現值', val: c },
        { label: '前次移轉現值（原地價）', val: p },
        { label: '漲價總數額', val: app, formula: `${fmt(c)} − ${fmt(p)}` },
        { label: '漲價比率', val: `${ratio.toFixed(1)}%`, formula: `${fmt(app)} ÷ ${fmt(p)} × 100` },
        { label: '適用稅率（自用住宅）', val: '10%', note: '限制：都市地≤3公畝、非都市≤7公畝、已辦戶籍' },
      ],
      tax: app * 0.1,
      label: '自用住宅稅率 10%',
    }
  }

  let tax = 0, t1 = 0, t2 = 0, t3 = 0
  const steps = [
    { label: '移轉現值', val: c },
    { label: '前次移轉現值（原地價）', val: p },
    { label: '漲價總數額', val: app, formula: `${fmt(c)} − ${fmt(p)}` },
    { label: '漲價比率', val: `${ratio.toFixed(1)}%`, formula: `${fmt(app)} ÷ ${fmt(p)} × 100` },
  ]

  if (ratio < 100) {
    t1 = app * 0.2
    tax = t1
    steps.push({ label: '稅率', val: '20%（漲幅未達100%）' })
    steps.push({ label: '應納土地增值稅', val: tax, formula: `${fmt(app)} × 20%`, highlight: true })
  } else if (ratio < 200) {
    t1 = p * 0.2
    t2 = (app - p) * 0.3
    tax = t1 + t2
    steps.push({ label: '第一級距（前100%）', val: t1, formula: `${fmt(p)} × 20%` })
    steps.push({ label: '第二級距（100% 至漲幅）', val: t2, formula: `（${fmt(app)} − ${fmt(p)}）× 30%` })
    steps.push({ label: '應納土地增值稅', val: tax, formula: `${fmt(t1)} + ${fmt(t2)}`, highlight: true })
  } else {
    t1 = p * 0.2
    t2 = p * 0.3
    t3 = (app - p * 2) * 0.4
    tax = t1 + t2 + t3
    steps.push({ label: '第一級距（前100%）', val: t1, formula: `${fmt(p)} × 20%` })
    steps.push({ label: '第二級距（100%～200%）', val: t2, formula: `${fmt(p)} × 30%` })
    steps.push({ label: '第三級距（超過200%）', val: t3, formula: `（${fmt(app)} − ${fmt(p * 2)}）× 40%` })
    steps.push({ label: '應納土地增值稅', val: tax, formula: `${fmt(t1)} + ${fmt(t2)} + ${fmt(t3)}`, highlight: true })
  }

  return { steps, tax, label: ratio < 100 ? '一般稅率 20%' : ratio < 200 ? '累進 20%+30%' : '累進 20%+30%+40%' }
}

function calcEstate({ gross, hasSpouse, childCount, parentCount, hasFuneral, disabledCount }) {
  const g = Number(gross) || 0
  const EXEMPT = 13330000
  const sd = hasSpouse ? 4930000 : 0
  const cd = (Number(childCount) || 0) * 560000
  const pd = (Number(parentCount) || 0) * 1380000
  const fd = hasFuneral ? 1380000 : 0
  const dd = (Number(disabledCount) || 0) * 3380000
  const total_d = sd + cd + pd + fd + dd
  const net = Math.max(0, g - EXEMPT - total_d)

  let tax = 0
  if (net <= 50000000)       tax = net * 0.1
  else if (net <= 100000000) tax = 5000000 + (net - 50000000) * 0.2
  else                       tax = 5000000 + 10000000 + (net - 100000000) * 0.3

  return {
    steps: [
      { label: '遺產總額', val: g },
      { label: '免稅額', val: EXEMPT, note: '1,333萬（固定）' },
      { label: '配偶扣除額', val: sd, note: '493萬／人' },
      { label: '直系卑親屬扣除額', val: cd, note: `${childCount}人 × 56萬` },
      { label: '父母扣除額', val: pd, note: `${parentCount}人 × 138萬` },
      { label: '喪葬費扣除額', val: fd, note: '138萬（固定）' },
      { label: '重度身心障礙扣除額', val: dd, note: `${disabledCount}人 × 338萬` },
      { label: '課稅遺產淨額', val: net, formula: `${fmt(g)} − ${fmt(EXEMPT)} − ${fmt(total_d)}` },
      { label: '應納遺產稅', val: tax, formula: net <= 50000000 ? `${fmt(net)} × 10%` : net <= 100000000 ? `5,000萬×10% + （${fmt(net)}−5,000萬）×20%` : '累進三級', highlight: true },
    ],
    tax
  }
}

function calcGift({ amount }) {
  const a = Number(amount) || 0
  const EXEMPT = 2440000
  const net = Math.max(0, a - EXEMPT)
  let tax = 0
  if (net <= 25000000)       tax = net * 0.1
  else if (net <= 50000000)  tax = 2500000 + (net - 25000000) * 0.15
  else                       tax = 2500000 + 3750000 + (net - 50000000) * 0.2

  return {
    steps: [
      { label: '當年贈與總額', val: a },
      { label: '每年免稅額', val: EXEMPT, note: '244萬（每年重設）' },
      { label: '課稅贈與淨額', val: net, formula: `${fmt(a)} − ${fmt(EXEMPT)}` },
      { label: '應納贈與稅', val: tax, formula: net <= 25000000 ? `${fmt(net)} × 10%` : net <= 50000000 ? `2,500萬×10% + （${fmt(net)}−2,500萬）×15%` : '累進三級', highlight: true },
    ],
    tax
  }
}

function calcLandTax({ declared, selfUse, area }) {
  const d = Number(declared) || 0
  const a = Number(area) || 0
  if (d <= 0 || a <= 0) return null
  const base = d * a
  const rate = selfUse ? 0.002 : 0.01
  const tax = base * rate
  return {
    steps: [
      { label: '申報地價', val: d, note: '元/平方公尺' },
      { label: '面積', val: a, note: '平方公尺' },
      { label: '地價總額（計稅基礎）', val: base, formula: `${fmt(d)} × ${a}` },
      { label: '適用稅率', val: selfUse ? '2‰（自用住宅）' : '10‰（一般）', note: selfUse ? '需辦戶籍登記，每人限一處' : '超累進稅率，此處以基本稅率估算' },
      { label: '應納地價稅（估算）', val: tax, formula: `${fmt(base)} × ${selfUse ? '0.2%' : '1%'}`, highlight: true },
    ],
    tax
  }
}

function fmt(n) {
  if (typeof n !== 'number') return n
  return Math.round(n).toLocaleString('zh-TW')
}

// ── UI 元件 ──────────────────────────────────

const CALCS = [
  { id: 'lvt',    icon: '📈', title: '土地增值稅', subtitle: '移轉時計算增值部分課稅' },
  { id: 'estate', icon: '🏛️', title: '遺產稅',    subtitle: '免稅額1,333萬，三級稅率' },
  { id: 'gift',   icon: '🎁', title: '贈與稅',    subtitle: '每年免稅額244萬，三級稅率' },
  { id: 'land',   icon: '🌱', title: '地價稅',    subtitle: '自用2‰，一般10‰起' },
]

function Field({ label, unit, value, onChange, note }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
        {label}{note && <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '6px' }}>{note}</span>}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="0"
          style={{ flex: 1, padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
        />
        {unit && <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{unit}</span>}
      </div>
    </div>
  )
}

function Toggle({ label, checked, onChange, note }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px' }}>
      <span style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>
        {label}{note && <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginLeft: '6px' }}>{note}</span>}
      </span>
      <button onClick={() => onChange(!checked)}
        style={{ width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer', position: 'relative', background: checked ? '#0f1f3d' : '#e2e8f0', transition: 'background 0.2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: '3px', left: checked ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', display: 'block' }} />
      </button>
    </div>
  )
}

function Steps({ result }) {
  if (!result) return null
  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>📋 計算步驟</div>
      {result.steps.map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px',
          padding: '8px 12px', borderRadius: '6px',
          background: s.highlight ? '#f0fdf4' : '#f8fafc',
          border: s.highlight ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', width: '18px', flexShrink: 0, paddingTop: '1px' }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{s.label}</div>
            {s.formula && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>= {s.formula}</div>}
            {s.note && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>（{s.note}）</div>}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: s.highlight ? '#16a34a' : '#0f1f3d', whiteSpace: 'nowrap', paddingTop: '1px' }}>
            {typeof s.val === 'number' ? `NT$ ${fmt(s.val)}` : s.val}
          </div>
        </div>
      ))}
      <div style={{ background: '#0f1f3d', borderRadius: '8px', padding: '14px 16px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 700 }}>應納稅額</span>
        <span style={{ color: '#e8b95a', fontWeight: 900, fontSize: '20px' }}>NT$ {fmt(result.tax)}</span>
      </div>
    </div>
  )
}

// ── 各計算機 ────────────────────────────────

function LVTCalc() {
  const [form, setForm] = useState({ prev: '', current: '', isSelf: false })
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const result = form.prev && form.current ? calcLVT(form) : null
  const showWarning = form.prev && form.current && Number(form.current) <= Number(form.prev)

  return (
    <div>
      <div style={{ background: '#fef9ec', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#92400e' }}>
        <strong>稅率速記</strong>：漲幅＜100%→20%　漲幅100%~200%→30%（超過部分）　漲幅＞200%→40%（超過部分）　自用住宅→10%
      </div>
      <Field label="前次移轉現值（原規定地價）" unit="元" value={form.prev} onChange={set('prev')} note="計算基礎" />
      <Field label="本次申報移轉現值" unit="元" value={form.current} onChange={set('current')} />
      <Toggle label="自用住宅用地" checked={form.isSelf} onChange={set('isSelf')} note="都市≤3公畝、非都市≤7公畝" />
      {/* BUG3 FIX: 輸入異常提示 */}
      {showWarning && (
        <div style={{ marginTop: '4px', padding: '10px 14px', background: '#fef2f2', borderRadius: '6px', fontSize: '13px', color: '#dc2626', border: '1px solid #fecaca' }}>
          ⚠️ 移轉現值需大於前次移轉現值才需課稅（無漲價則免徵土地增值稅）
        </div>
      )}
      <Steps result={result} />
    </div>
  )
}

function EstateCalc() {
  const [form, setForm] = useState({ gross: '', hasSpouse: false, childCount: 0, parentCount: 0, hasFuneral: true, disabledCount: 0 })
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const result = form.gross ? calcEstate(form) : null
  return (
    <div>
      <div style={{ background: '#fef9ec', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#92400e' }}>
        <strong>稅率速記</strong>：課稅淨額≤5,000萬→10%　5,000萬~1億→20%　超過1億→30%
      </div>
      <Field label="遺產總額" unit="元" value={form.gross} onChange={set('gross')} />
      <Toggle label="配偶（扣除額493萬）" checked={form.hasSpouse} onChange={set('hasSpouse')} />
      <Field label="直系卑親屬人數" unit="人（×56萬）" value={form.childCount} onChange={set('childCount')} note="未成年再加算" />
      <Field label="父母人數" unit="人（×138萬）" value={form.parentCount} onChange={set('parentCount')} />
      <Toggle label="喪葬費（138萬）" checked={form.hasFuneral} onChange={set('hasFuneral')} />
      <Field label="重度身心障礙人數" unit="人（×338萬）" value={form.disabledCount} onChange={set('disabledCount')} />
      <Steps result={result} />
    </div>
  )
}

function GiftCalc() {
  const [form, setForm] = useState({ amount: '' })
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const result = form.amount ? calcGift(form) : null
  return (
    <div>
      <div style={{ background: '#fef9ec', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#92400e' }}>
        <strong>稅率速記</strong>：課稅淨額≤2,500萬→10%　2,500萬~5,000萬→15%　超過5,000萬→20%　每年免稅額244萬（每年重設）
      </div>
      <Field label="當年贈與總額" unit="元" value={form.amount} onChange={set('amount')} note="同年度累計" />
      <Steps result={result} />
    </div>
  )
}

function LandTaxCalc() {
  const [form, setForm] = useState({ declared: '', area: '', selfUse: false })
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const result = form.declared && form.area ? calcLandTax(form) : null
  return (
    <div>
      <div style={{ background: '#fef9ec', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#92400e' }}>
        <strong>稅率速記</strong>：自用住宅2‰（每人限一處）　一般用地超累進10‰起（此計算機用基本稅率估算）　申報時間：9/22~10/5
      </div>
      <Field label="申報地價" unit="元/㎡" value={form.declared} onChange={set('declared')} />
      <Field label="持有面積" unit="平方公尺" value={form.area} onChange={set('area')} />
      <Toggle label="自用住宅用地（2‰）" checked={form.selfUse} onChange={set('selfUse')} note="需辦戶籍、未出租" />
      <Steps result={result} />
    </div>
  )
}

const CALC_MAP = { lvt: LVTCalc, estate: EstateCalc, gift: GiftCalc, land: LandTaxCalc }

// ── 主元件 ────────────────────────────────────

export default function CalcPracticeSection() {
  const [active, setActive] = useState('lvt')
  const ActiveCalc = CALC_MAP[active]

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f1f3d, #1a3a6e)', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', color: 'white' }}>
        <div style={{ fontSize: '28px', marginBottom: '6px' }}>🧮</div>
        <h2 style={{ fontWeight: 900, fontSize: '18px', marginBottom: '4px' }}>計算題練習模式</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>輸入數字，自動拆解計算步驟——對照公式練習，考場不失分</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '20px' }}>
        {CALCS.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)}
            style={{ padding: '14px', borderRadius: '10px', border: `2px solid ${active === c.id ? '#0f1f3d' : '#e2e8f0'}`, cursor: 'pointer', textAlign: 'left',
              background: active === c.id ? '#f0f4ff' : 'white', transition: 'all 0.15s' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{c.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: active === c.id ? '#0f1f3d' : '#374151' }}>{c.title}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{c.subtitle}</div>
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
        <ActiveCalc />
      </div>

      <div style={{ marginTop: '14px', background: '#f0f4ff', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: '#1e40af', lineHeight: 1.8 }}>
        <strong>💡 計算題考試重點</strong>：土增稅常考漲幅跨級距計算、自用住宅申請條件；遺產稅常考扣除額加總；贈與稅注意每年重設的244萬免稅額；地價稅注意自用申請期間（9/22~10/5）
      </div>
    </div>
  )
}
