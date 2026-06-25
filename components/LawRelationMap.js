'use client'
import { useState } from 'react'

const SCENARIOS = [
  {
    id: 'inherit',
    icon: '👨‍👩‍👧',
    title: '繼承登記',
    desc: '被繼承人死亡後辦理繼承登記',
    color: '#7c3aed',
    nodes: [
      { law: '民法 §1138', label: '繼承人順序', cat: 'A', type: 'core' },
      { law: '民法 §1147', label: '繼承開始', cat: 'A', type: 'core' },
      { law: '民法 §1148', label: '概括繼承有限責任', cat: 'A', type: 'core' },
      { law: '土地法 §73-1', label: '逾期繼承登記收歸國有', cat: 'A', type: 'warning' },
      { law: '民法 §1174', label: '拋棄繼承（3個月內）', cat: 'A', type: 'option' },
      { law: '遺產及贈與稅法 §22', label: '遺產稅申報（6個月）', cat: 'D', type: 'tax' },
      { law: '遺產及贈與稅法 §13', label: '遺產稅稅率10/20/30%', cat: 'D', type: 'tax' },
      { law: '土地稅法 §28-2', label: '繼承移轉免土地增值稅', cat: 'D', type: 'tax' },
      { law: '民法 §1151', label: '公同共有（分割前）', cat: 'F', type: 'info' },
      { law: '民法 §1223', label: '特留分保障', cat: 'A', type: 'option' },
    ],
    flow: ['繼承開始', '確認繼承人', '申報遺產稅', '辦理繼承登記', '分割遺產']
  },
  {
    id: 'buysell',
    icon: '🏠',
    title: '一般不動產買賣',
    desc: '成屋買賣從簽約到完成過戶',
    color: '#0891b2',
    nodes: [
      { law: '民法 §345', label: '買賣契約成立', cat: 'B', type: 'core' },
      { law: '民法 §354', label: '出賣人瑕疵擔保', cat: 'R', type: 'core' },
      { law: '民法 §373', label: '危險負擔移轉（交屋時）', cat: 'B', type: 'core' },
      { law: '不動產經紀業管理條例 §23', label: '禁止賺差價/隱瞞瑕疵', cat: 'N', type: 'warning' },
      { law: '不動產經紀業管理條例 §24', label: '仲介費上限6%', cat: 'N', type: 'info' },
      { law: '土地稅法 §30', label: '土地增值稅（賣方）', cat: 'D', type: 'tax' },
      { law: '契稅條例 §2', label: '契稅6%（買方）', cat: 'D', type: 'tax' },
      { law: '民法 §758', label: '移轉登記生效', cat: 'B', type: 'core' },
      { law: '平均地權條例 §47-1', label: '實價登錄義務', cat: 'N', type: 'info' },
      { law: '消費者保護法 §22', label: '廣告真實義務', cat: 'N', type: 'warning' },
    ],
    flow: ['簽訂買賣契約', '用印完稅', '地政士辦理過戶', '銀行撥款', '交屋點交']
  },
  {
    id: 'farmland',
    icon: '🌾',
    title: '農地買賣',
    desc: '農業用地買賣及相關稅務優惠',
    color: '#16a34a',
    nodes: [
      { law: '農業發展條例 §3', label: '農業用地/耕地定義', cat: 'I', type: 'core' },
      { law: '農業發展條例 §33', label: '私法人禁購耕地', cat: 'I', type: 'warning' },
      { law: '農業發展條例 §16', label: '分割不得低於0.25公頃', cat: 'I', type: 'warning' },
      { law: '農業發展條例 §38-1', label: '農用免土地增值稅', cat: 'D', type: 'tax' },
      { law: '遺產及贈與稅法 §20', label: '農地贈與繼承人免贈與稅', cat: 'D', type: 'tax' },
      { law: '農業發展條例 §18', label: '農舍興建資格限制', cat: 'I', type: 'info' },
      { law: '區域計畫法 §15', label: '非都市土地使用分區', cat: 'K', type: 'info' },
      { law: '非都市土地使用管制規則 §3', label: '農牧用地使用限制', cat: 'K', type: 'info' },
    ],
    flow: ['確認農地使用分區', '確認農業用途', '簽約', '申請農用免稅', '辦理移轉登記']
  },
  {
    id: 'mortgage',
    icon: '🏦',
    title: '抵押權設定',
    desc: '不動產設定抵押權向銀行貸款',
    color: '#c9973a',
    nodes: [
      { law: '民法 §860', label: '普通抵押權定義', cat: 'C', type: 'core' },
      { law: '民法 §824-1', label: '最高限額抵押權', cat: 'C', type: 'core' },
      { law: '民法 §865', label: '抵押權次序（登記先後）', cat: 'C', type: 'core' },
      { law: '民法 §861', label: '擔保範圍（本金+利息）', cat: 'C', type: 'info' },
      { law: '民法 §872', label: '抵押物滅失之處理', cat: 'C', type: 'info' },
      { law: '民法 §873', label: '聲請法院拍賣（實行）', cat: 'C', type: 'warning' },
      { law: '稅捐稽徵法 §6', label: '地價稅優先於抵押權', cat: 'D', type: 'warning' },
      { law: '土地登記規則 §136', label: '查封登記效力', cat: 'H', type: 'info' },
    ],
    flow: ['評估貸款金額', '設定抵押權登記', '撥款', '繳款', '清償後塗銷抵押']
  },
  {
    id: 'trust',
    icon: '🔐',
    title: '不動產信託',
    desc: '委託人將不動產設定信託',
    color: '#6366f1',
    nodes: [
      { law: '信託法 §1', label: '信託定義（委/受/受益）', cat: 'E', type: 'core' },
      { law: '信託法 §4', label: '信託登記對抗第三人', cat: 'E', type: 'core' },
      { law: '信託法 §9', label: '信託財產獨立性', cat: 'E', type: 'core' },
      { law: '信託法 §11', label: '不屬受託人破產財團', cat: 'E', type: 'core' },
      { law: '信託法 §22', label: '受託人善良管理人義務', cat: 'E', type: 'info' },
      { law: '信託法 §34', label: '受託人不得享有信託利益', cat: 'E', type: 'warning' },
      { law: '遺產及贈與稅法 §5-1', label: '委託人≠受益人→贈與稅', cat: 'D', type: 'tax' },
    ],
    flow: ['簽訂信託契約', '辦理信託登記', '受託人管理', '信託目的完成', '塗銷信託登記']
  },
  {
    id: 'urban_renew',
    icon: '🏗️',
    title: '都市更新/危老重建',
    desc: '老舊建物申請都更或危老重建',
    color: '#ea580c',
    nodes: [
      { law: '都市更新條例 §22', label: '同意門檻80%（都更）', cat: 'J', type: 'core' },
      { law: '危老重建條例 §4', label: '同意門檻100%（危老）', cat: 'J', type: 'core' },
      { law: '危老重建條例 §6', label: '容積獎勵1.3倍', cat: 'J', type: 'info' },
      { law: '都市更新條例 §67', label: '都更稅賦三大優惠', cat: 'D', type: 'tax' },
      { law: '危老重建條例 §9', label: '危老地價稅房屋稅全免', cat: 'D', type: 'tax' },
      { law: '都市更新條例 §65', label: '權利變換分配原則', cat: 'J', type: 'info' },
      { law: '公寓大廈管理條例 §13', label: '全體決議重建要件', cat: 'M', type: 'warning' },
    ],
    flow: ['確認適用（都更/危老）', '取得所有權人同意', '送審計畫', '拆除重建', '權利變換分配']
  },
]

const TYPE_CONFIG = {
  core:    { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8', dot: '#3b82f6', label: '核心' },
  warning: { bg: '#fef2f2', border: '#ef4444', text: '#dc2626', dot: '#ef4444', label: '注意' },
  tax:     { bg: '#fefce8', border: '#ca8a04', text: '#854d0e', dot: '#eab308', label: '稅務' },
  option:  { bg: '#f0fdf4', border: '#16a34a', text: '#15803d', dot: '#16a34a', label: '選擇' },
  info:    { bg: '#f8fafc', border: '#94a3b8', text: '#475569', dot: '#94a3b8', label: '參考' },
}

// FIX: 接收 onCategorySelect prop
export default function LawRelationMap({ onCategorySelect }) {
  const [selected, setSelected] = useState(null)
  const [filterType, setFilterType] = useState('全部')
  const [hoveredNode, setHoveredNode] = useState(null)

  const scenario = SCENARIOS.find(s => s.id === selected)

  // FIX: 點擊法條節點 → 跳轉到對應分類並搜尋
  const handleNodeClick = (node) => {
    if (!onCategorySelect) return
    // 傳入 cat 篩選 + law 作為搜尋詞，讓 LawSection 定位到該條文
    onCategorySelect(node.cat, node.law)
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* 標題列 */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>🗺️</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f1f3d' }}>法條關聯地圖</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>選擇常見不動產情境，查看跨類別法條關聯</div>
        </div>
      </div>

      {/* 情境選擇 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {SCENARIOS.map(s => (
          <button key={s.id} onClick={() => { setSelected(selected === s.id ? null : s.id); setFilterType('全部') }}
            style={{ padding: '12px', borderRadius: '10px', border: `2px solid ${selected === s.id ? s.color : '#e2e8f0'}`, cursor: 'pointer', textAlign: 'left',
              background: selected === s.id ? `${s.color}15` : 'white', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '12px', color: selected === s.id ? s.color : '#0f1f3d' }}>{s.title}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{s.desc}</div>
          </button>
        ))}
      </div>

      {/* 關聯詳細圖 */}
      {scenario && (
        <div style={{ background: 'white', border: `2px solid ${scenario.color}40`, borderRadius: '12px', padding: '20px' }}>
          {/* 標題 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>{scenario.icon}</span>
            <div>
              <h3 style={{ fontWeight: 900, fontSize: '18px', color: '#0f1f3d', marginBottom: '2px' }}>{scenario.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>{scenario.desc}</p>
            </div>
          </div>

          {/* 流程步驟 */}
          <div style={{ marginBottom: '16px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 'max-content', padding: '4px 0' }}>
              {scenario.flow.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ background: scenario.color, color: 'white', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {i + 1}. {step}
                  </div>
                  {i < scenario.flow.length - 1 && (
                    <span style={{ color: '#94a3b8', fontSize: '16px' }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 類型篩選 */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <button onClick={() => setFilterType('全部')}
              style={{ padding: '3px 10px', borderRadius: '20px', border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                background: filterType === '全部' ? '#0f1f3d' : '#f1f5f9', color: filterType === '全部' ? 'white' : '#374151' }}>
              全部（{scenario.nodes.length}）
            </button>
            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
              const count = scenario.nodes.filter(n => n.type === type).length
              if (count === 0) return null
              return (
                <button key={type} onClick={() => setFilterType(filterType === type ? '全部' : type)}
                  style={{ padding: '3px 10px', borderRadius: '20px', border: `1px solid ${cfg.border}`, fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    background: filterType === type ? cfg.bg : 'white', color: cfg.text }}>
                  {cfg.label}（{count}）
                </button>
              )
            })}
          </div>

          {/* FIX: 法條節點 — 可點擊，點擊後跳轉到法條列表 */}
          {onCategorySelect && (
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>💡</span> 點擊法條可跳轉至對應條文
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scenario.nodes
              .filter(n => filterType === '全部' || n.type === filterType)
              .map((node, i) => {
                const cfg = TYPE_CONFIG[node.type]
                const isHovered = hoveredNode === `${selected}-${i}`
                return (
                  <div
                    key={i}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredNode(`${selected}-${i}`)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      background: isHovered ? cfg.border + '20' : cfg.bg,
                      border: `1px solid ${isHovered ? cfg.dot : cfg.border}`,
                      borderRadius: '8px', padding: '10px 14px',
                      cursor: onCategorySelect ? 'pointer' : 'default',
                      transition: 'all 0.15s',
                      transform: isHovered ? 'translateX(3px)' : 'none',
                    }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 800, fontSize: '13px', color: cfg.text }}>{node.law}</span>
                      <span style={{ color: '#374151', fontSize: '13px', marginLeft: '8px' }}>{node.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span style={{ background: '#0f1f3d', color: 'white', fontSize: '10px', padding: '2px 7px', borderRadius: '8px', fontWeight: 700 }}>
                        {node.cat}類
                      </span>
                      {onCategorySelect && (
                        <span style={{ fontSize: '12px', color: cfg.dot, opacity: isHovered ? 1 : 0, transition: 'opacity 0.15s' }}>→</span>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>

          {/* 圖例 */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: cfg.text }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.dot }} />
                {cfg.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
