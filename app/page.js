import Link from 'next/link'

const CHECKOUT_URL = '/checkout'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3260 100%)' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ color: 'white', fontWeight: 800, fontSize: '20px' }}>
          🏡 Kmoji <span style={{ color: '#c9973a', fontSize: '14px', fontWeight: 500 }}>地政X經紀同根生</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>登入</Link>
          <Link href="/signup" className="btn btn-gold">立即加入</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 20px 60px', color: 'white' }}>
        <div style={{ display: 'inline-block', background: 'rgba(201,151,58,0.2)', border: '1px solid #c9973a', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#e8b95a', marginBottom: '24px' }}>
          🏆 台灣地政士 × 不動產經紀人最完整知識平台
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.2, marginBottom: '20px' }}>
          地政 × 經紀<br /><span style={{ color: '#c9973a' }}>同根生</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.75)', maxWidth: '560px', margin: '0 auto 40px' }}>
          法條解析、考古題庫、實務案例、SOP流程。
          1,920+ 法條全面免費，地政士與房仲業者共用的專業知識庫。
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" className="btn btn-gold" style={{ fontSize: '16px', padding: '14px 32px' }}>🚀 免費開始使用</Link>
          <Link href="/login" className="btn btn-outline" style={{ fontSize: '16px', padding: '14px 32px', color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>已有帳號，登入</Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {[
          { icon: '⚖️', title: '法條解析', desc: '1,920+ 法條全文 + 關聯地圖 + 命題分布 + 計算題，全面免費開放', free: true },
          { icon: '📂', title: '實務案例庫', desc: '真實地政案例，繼承、買賣、稅務、租賃，含SOP流程', free: false },
          { icon: '📝', title: '考古題庫＋練習', desc: '歷年考試題目、練習模式、模擬考，含詳解與引用法條', free: false },
          { icon: '🤖', title: 'AI問答顧問', desc: '無限次地政法規AI問答，專業回答土地登記與稅務問題', free: false },
        ].map((f, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.icon}</div>
            <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>{f.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '12px' }}>{f.desc}</p>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: f.free ? '#dcfce7' : '#fef9ec', color: f.free ? '#16a34a' : '#92400e' }}>
              {f.free ? '免費' : '付費'}
            </span>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', color: 'white', fontSize: '32px', marginBottom: '16px' }}>方案選擇</h2>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ background: 'rgba(201,151,58,0.25)', border: '1px solid #c9973a', borderRadius: '20px', padding: '8px 20px', fontSize: '14px', color: '#e8b95a', fontWeight: 700 }}>
            🎯 早鳥優惠：輸入折扣碼 <strong style={{color:'#fbbf24'}}>EARLY30</strong> 享 NT$399/月，限前30名
          </span>
        </div>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            {
              name: '免費版', price: '0', unit: '永久免費',
              features: ['⚖️ 全部法條解析免費', '📊 法條關聯地圖', '📈 命題分布圖', '🧮 計算題練習', 'AI問答 3次/天'],
              cta: '免費註冊', href: '/signup', gold: false, external: false
            },
            {
              name: '月費版', price: '699', unit: '元 / 月',
              features: ['📂 全部實務案例庫', '📝 完整考古題庫', '🎯 練習模式＋模擬考', '📋 全SOP流程', '🤖 AI問答無限次', '優先客服'],
              cta: '💳 立即訂閱', href: CHECKOUT_URL, gold: true, external: true
            },
          ].map((p, i) => (
            <div key={i} style={{ background: p.gold ? 'linear-gradient(135deg, #c9973a, #e8b95a)' : 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', border: p.gold ? 'none' : '1px solid rgba(255,255,255,0.15)', transform: p.gold ? 'scale(1.05)' : 'none' }}>
              <div style={{ color: p.gold ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>{p.name}</div>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: 900 }}>NT${p.price}</div>
              <div style={{ color: p.gold ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '24px' }}>{p.unit}</div>
              <ul style={{ listStyle: 'none', marginBottom: '28px' }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ color: p.gold ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '8px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              {p.external ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="btn" style={{ width: '100%', display: 'block', textAlign: 'center', background: p.gold ? 'rgba(0,0,0,0.2)' : 'rgba(201,151,58,0.9)', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}>{p.cta}</a>
              ) : (
                <Link href={p.href} className="btn" style={{ width: '100%', background: 'rgba(201,151,58,0.9)', color: 'white' }}>{p.cta}</Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
        © 2026 Kmoji 地政X經紀同根生 · 台灣地政士與房仲專業知識平台
      </footer>
    </div>
  )
}
