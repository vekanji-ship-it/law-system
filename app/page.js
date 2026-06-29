import Link from 'next/link'

const CHECKOUT_URL = '/checkout'

const NAV_LINKS = [
  { label: '法條解析', href: '/dashboard' },
  { label: '考古題庫', href: '/dashboard' },
  { label: '實務案例', href: '/dashboard' },
]

const STATS = [
  { value: '1,920+', label: '法條條目' },
  { value: '32', label: '補充批次' },
  { value: '18', label: '考試類別' },
  { value: '2', label: '考照科目' },
]

const FEATURES = [
  {
    icon: '⚖️',
    title: '法條解析',
    desc: '1,920+ 條文全文，白話解說與命題分布圖，永久免費開放。',
    tag: '免費',
    tagStyle: { background: '#dcfce7', color: '#16a34a' },
    size: 'large',
  },
  {
    icon: '📝',
    title: '考古題庫',
    desc: '歷年地政士與不動產經紀人試題，含詳解與引用法條。',
    tag: '付費',
    tagStyle: { background: '#fef3c7', color: '#92400e' },
    size: 'normal',
  },
  {
    icon: '🧮',
    title: '計算題練習',
    desc: '土地增值稅、地價稅等計算題完整練習。',
    tag: '免費',
    tagStyle: { background: '#dcfce7', color: '#16a34a' },
    size: 'normal',
  },
  {
    icon: '📂',
    title: '實務案例庫',
    desc: '繼承、買賣、稅務、租賃真實案例，含地政士視角與房仲視角雙解析。',
    tag: '付費',
    tagStyle: { background: '#fef3c7', color: '#92400e' },
    size: 'normal',
  },
  {
    icon: '🎯',
    title: '練習模式＋模擬考',
    desc: '計時模擬考、隨機出題、即時批改，精準抓出弱點。',
    tag: '付費',
    tagStyle: { background: '#fef3c7', color: '#92400e' },
    size: 'normal',
  },
  {
    icon: '🤖',
    title: 'AI 問答顧問',
    desc: '無限次地政法規 AI 問答，土地登記、稅務、登記實務一問即解。',
    tag: '付費',
    tagStyle: { background: '#fef3c7', color: '#92400e' },
    size: 'normal',
  },
]

const TESTIMONIALS = [
  { text: '法條解析真的很完整，尤其分類清楚，複習效率大提升。', name: 'Y.C.', role: '地政士考試 準考生' },
  { text: '考古題附有詳解和引用法條，不用再翻書，省了好多時間。', name: 'M.L.', role: '不動產經紀人 在職進修' },
]

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy: #0f1f3d;
          --navy-mid: #1a3260;
          --gold: #c9973a;
          --gold-light: #e8b95a;
          --gold-pale: rgba(201,151,58,0.12);
          --white: #ffffff;
          --off-white: #faf8f3;
          --text-muted: rgba(255,255,255,0.55);
          --border-subtle: rgba(255,255,255,0.08);
          --radius-sm: 8px;
          --radius-md: 14px;
          --radius-lg: 20px;
        }

        body { font-family: 'Noto Sans TC', -apple-system, sans-serif; }

        .serif { font-family: 'Noto Serif TC', Georgia, serif; }

        /* NAV */
        .nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 64px;
          background: rgba(15,31,61,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon { font-size: 22px; }
        .nav-logo-text { color: var(--white); font-weight: 900; font-size: 16px; letter-spacing: -0.3px; }
        .nav-logo-sub { color: var(--gold); font-size: 13px; font-weight: 500; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-link { color: var(--text-muted); font-size: 14px; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: var(--white); }
        .nav-ctas { display: flex; align-items: center; gap: 10px; }
        .btn-ghost { color: rgba(255,255,255,0.7); font-size: 14px; background: none; border: none; cursor: pointer; padding: 8px 14px; border-radius: var(--radius-sm); text-decoration: none; transition: background 0.2s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.06); }
        .btn-gold { background: var(--gold); color: var(--white); font-size: 14px; font-weight: 700; padding: 9px 20px; border-radius: var(--radius-sm); border: none; cursor: pointer; text-decoration: none; letter-spacing: -0.2px; transition: background 0.2s, transform 0.15s; display: inline-block; }
        .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); }
        .btn-outline-white { color: var(--white); border: 1px solid rgba(255,255,255,0.3); font-size: 14px; font-weight: 600; padding: 9px 20px; border-radius: var(--radius-sm); background: none; cursor: pointer; text-decoration: none; letter-spacing: -0.2px; transition: border-color 0.2s, background 0.2s; display: inline-block; }
        .btn-outline-white:hover { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); }

        /* HERO */
        .hero {
          background: linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 60%, #1e3a6e 100%);
          padding: 100px 40px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--gold-pale); border: 1px solid rgba(201,151,58,0.3);
          border-radius: 100px; padding: 5px 14px;
          font-size: 12px; color: var(--gold-light); font-weight: 600;
          letter-spacing: 0.3px; margin-bottom: 24px;
        }
        .hero-h1 {
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 900;
          color: var(--white);
          line-height: 1.15;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
        }
        .hero-h1 em { color: var(--gold); font-style: normal; }
        .hero-desc {
          font-size: 17px;
          color: rgba(255,255,255,0.65);
          line-height: 1.75;
          max-width: 460px;
          margin-bottom: 36px;
        }
        .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-gold-lg { font-size: 16px; padding: 14px 28px; }
        .btn-outline-lg { font-size: 16px; padding: 14px 28px; }

        /* HERO VISUAL */
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .hero-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg);
          padding: 24px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
        }
        .hero-card-label { font-size: 11px; color: var(--gold); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px; }
        .hero-law-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--radius-sm);
          padding: 12px 14px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .hero-law-item:last-child { margin-bottom: 0; }
        .hero-law-name { font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 600; }
        .hero-law-count { font-size: 11px; color: var(--gold-light); background: rgba(201,151,58,0.12); padding: 2px 8px; border-radius: 100px; font-weight: 700; }
        .hero-card-footer { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: space-between; }
        .hero-total { font-size: 22px; font-weight: 900; color: var(--white); }
        .hero-total-label { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
        .hero-badge { background: #16a34a; color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; }

        /* STATS */
        .stats-strip {
          background: rgba(255,255,255,0.03);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }
        .stats-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
          padding: 0 40px;
        }
        .stat-cell {
          padding: 28px 20px;
          text-align: center;
          border-right: 1px solid var(--border-subtle);
        }
        .stat-cell:last-child { border-right: none; }
        .stat-value { font-size: 30px; font-weight: 900; color: var(--gold); letter-spacing: -1px; display: block; }
        .stat-label { font-size: 12px; color: var(--text-muted); margin-top: 3px; letter-spacing: 0.3px; }

        /* FEATURES */
        .section { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
        .section-eyebrow { font-size: 12px; color: var(--gold); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
        .section-title { font-size: clamp(28px, 4vw, 40px); font-weight: 900; color: var(--white); letter-spacing: -1px; line-height: 1.2; margin-bottom: 48px; }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto auto;
          gap: 16px;
        }
        .bento-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-md);
          padding: 28px;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .bento-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); }
        .bento-card.large { grid-column: span 1; grid-row: span 2; }
        .bento-icon { font-size: 28px; margin-bottom: 16px; display: block; }
        .bento-title { font-size: 17px; font-weight: 800; color: var(--white); margin-bottom: 8px; letter-spacing: -0.3px; }
        .bento-desc { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.65; }
        .bento-tag { display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; margin-top: 16px; }
        .bento-card-glow { position: absolute; top: -60px; right: -60px; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(201,151,58,0.08) 0%, transparent 70%); pointer-events: none; }

        /* PRICING */
        .pricing-section {
          background: rgba(255,255,255,0.02);
          border-top: 1px solid var(--border-subtle);
          padding: 80px 40px;
        }
        .pricing-inner { max-width: 780px; margin: 0 auto; }
        .pricing-header { text-align: center; margin-bottom: 48px; }
        .pricing-promo {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(201,151,58,0.1); border: 1px solid rgba(201,151,58,0.25);
          border-radius: 100px; padding: 8px 20px;
          font-size: 13px; color: var(--gold-light); font-weight: 600; margin-bottom: 24px;
        }
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .pricing-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg);
          padding: 32px;
        }
        .pricing-card.featured {
          background: linear-gradient(145deg, rgba(201,151,58,0.15) 0%, rgba(201,151,58,0.06) 100%);
          border-color: rgba(201,151,58,0.35);
        }
        .pricing-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; display: block; }
        .pricing-price { font-size: 42px; font-weight: 900; color: var(--white); letter-spacing: -1.5px; line-height: 1; }
        .pricing-price span { font-size: 14px; font-weight: 500; color: var(--text-muted); letter-spacing: 0; margin-left: 2px; }
        .pricing-unit { font-size: 13px; color: var(--text-muted); margin-top: 4px; margin-bottom: 28px; }
        .pricing-feature { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 14px; color: rgba(255,255,255,0.75); }
        .pricing-check { color: var(--gold); font-weight: 900; flex-shrink: 0; margin-top: 1px; }
        .pricing-check.green { color: #4ade80; }
        .pricing-cta-wrap { margin-top: 28px; }
        .btn-full { width: 100%; text-align: center; display: block; padding: 13px 24px; border-radius: var(--radius-sm); font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .btn-gold-full { background: var(--gold); color: white; }
        .btn-gold-full:hover { background: var(--gold-light); transform: translateY(-1px); }
        .btn-outline-full { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); }
        .btn-outline-full:hover { border-color: rgba(255,255,255,0.4); color: white; }

        /* TESTIMONIALS */
        .testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 48px; }
        .testi-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--radius-md); padding: 24px;
        }
        .testi-text { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 16px; font-style: italic; }
        .testi-author { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.85); }
        .testi-role { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        /* FOOTER */
        .footer {
          border-top: 1px solid var(--border-subtle);
          padding: 32px 40px;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1200px; margin: 0 auto;
        }
        .footer-brand { font-size: 14px; font-weight: 700; color: var(--gold); }
        .footer-copy { font-size: 12px; color: var(--text-muted); }

        /* BG WRAPPER */
        .site-bg { background: var(--navy); min-height: 100vh; }
        .hero-wrapper { background: linear-gradient(180deg, var(--navy) 0%, #112040 100%); }
        .features-wrapper { background: var(--navy); }

        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .nav-links { display: none; }
          .hero { grid-template-columns: 1fr; padding: 60px 20px 40px; gap: 40px; }
          .hero-visual { display: none; }
          .stats-inner { grid-template-columns: repeat(2,1fr); }
          .stat-cell { border-right: none; border-bottom: 1px solid var(--border-subtle); }
          .bento-grid { grid-template-columns: 1fr; }
          .bento-card.large { grid-row: span 1; }
          .pricing-grid { grid-template-columns: 1fr; }
          .testi-grid { grid-template-columns: 1fr; }
          .section { padding: 60px 20px; }
          .footer { flex-direction: column; gap: 12px; text-align: center; padding: 24px 20px; }
        }
      `}</style>

      <div className="site-bg">
        {/* NAV */}
        <nav className="nav">
          <a href="/" className="nav-logo">
            <span className="nav-logo-icon">🏡</span>
            <div>
              <div className="nav-logo-text">Kmoji</div>
              <div className="nav-logo-sub">地政X經紀同根生</div>
            </div>
          </a>
          <div className="nav-links">
            {NAV_LINKS.map(l => <Link key={l.label} href={l.href} className="nav-link">{l.label}</Link>)}
          </div>
          <div className="nav-ctas">
            <Link href="/login" className="btn-ghost">登入</Link>
            <Link href="/signup" className="btn-gold">免費開始</Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero-wrapper">
          <div className="hero">
            <div>
              <div className="hero-pill">🏆 台灣最完整地政考照知識庫</div>
              <h1 className="hero-h1 serif">
                地政 × 經紀<br />
                <em>同根生</em>
              </h1>
              <p className="hero-desc">
                1,920+ 法條全面免費。考古題庫、實務案例、AI問答，
                一個平台備考地政士與不動產經紀人。
              </p>
              <div className="hero-ctas">
                <Link href="/signup" className={`btn-gold btn-gold-lg`}>立即免費開始</Link>
                <Link href="/login" className={`btn-outline-white btn-outline-lg`}>已有帳號</Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card">
                <div className="hero-card-label">法條類別總覽</div>
                {[
                  ['稅務申報類', '300'],
                  ['不動產仲介交易類', '160'],
                  ['地政士考試法規', '150'],
                  ['土地使用管制類', '120'],
                  ['繼承與遺產類', '100'],
                ].map(([name, count]) => (
                  <div key={name} className="hero-law-item">
                    <span className="hero-law-name">{name}</span>
                    <span className="hero-law-count">{count}</span>
                  </div>
                ))}
                <div className="hero-card-footer">
                  <div>
                    <div className="hero-total">1,920</div>
                    <div className="hero-total-label">法條總計</div>
                  </div>
                  <div className="hero-badge">全面免費</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="stats-strip">
          <div className="stats-inner">
            {STATS.map(s => (
              <div key={s.label} className="stat-cell">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="features-wrapper">
          <div className="section">
            <div className="section-eyebrow">平台功能</div>
            <h2 className="section-title serif">考什麼，這裡就有什麼</h2>
            <div className="bento-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className={`bento-card${f.size === 'large' ? ' large' : ''}`}>
                  <div className="bento-card-glow" />
                  <span className="bento-icon">{f.icon}</span>
                  <div className="bento-title">{f.title}</div>
                  <div className="bento-desc">{f.desc}</div>
                  <span className="bento-tag" style={f.tagStyle}>{f.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-eyebrow">學員回饋</div>
          <h2 className="section-title serif">備考中的人都這樣說</h2>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card">
                <p className="testi-text">「{t.text}」</p>
                <div className="testi-author">{t.name}</div>
                <div className="testi-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING */}
        <div className="pricing-section">
          <div className="pricing-inner">
            <div className="pricing-header">
              <div className="pricing-promo">
                🎯 早鳥優惠：輸入折扣碼 <strong style={{ color: '#fbbf24' }}>EARLY30</strong> 享 NT$399/月，限前30名
              </div>
              <h2 className="section-title serif" style={{ marginBottom: 0 }}>選擇適合你的方案</h2>
            </div>

            <div className="pricing-grid">
              {/* Free */}
              <div className="pricing-card">
                <span className="pricing-badge" style={{ color: 'rgba(255,255,255,0.4)' }}>免費版</span>
                <div className="pricing-price">NT$0 <span>永久</span></div>
                <div className="pricing-unit">無需信用卡</div>
                {[
                  ['green', '⚖️ 全部法條解析（1,920+）'],
                  ['green', '📊 法條關聯地圖'],
                  ['green', '📈 命題分布圖'],
                  ['green', '🧮 計算題練習'],
                  ['', '🤖 AI問答 3次/天'],
                ].map(([type, text], i) => (
                  <div key={i} className="pricing-feature">
                    <span className={`pricing-check${type ? ' ' + type : ''}`}>✓</span>
                    <span>{text}</span>
                  </div>
                ))}
                <div className="pricing-cta-wrap">
                  <Link href="/signup" className="btn-full btn-outline-full">免費註冊</Link>
                </div>
              </div>

              {/* Paid */}
              <div className="pricing-card featured">
                <span className="pricing-badge" style={{ color: 'var(--gold-light)' }}>月費版 ★</span>
                <div className="pricing-price">NT$699 <span>/ 月</span></div>
                <div className="pricing-unit" style={{ color: 'rgba(255,255,255,0.5)' }}>隨時取消，無合約綁定</div>
                {[
                  ['green', '包含所有免費功能'],
                  ['green', '📂 實務案例庫（全部）'],
                  ['green', '📝 完整考古題庫'],
                  ['green', '🎯 練習模式＋模擬考'],
                  ['green', '📋 SOP實務流程'],
                  ['green', '🤖 AI問答無限次'],
                  ['green', '優先客服支援'],
                ].map(([type, text], i) => (
                  <div key={i} className="pricing-feature">
                    <span className={`pricing-check${type ? ' ' + type : ''}`}>✓</span>
                    <span>{text}</span>
                  </div>
                ))}
                <div className="pricing-cta-wrap">
                  <a href={CHECKOUT_URL} className="btn-full btn-gold-full">💳 立即訂閱</a>
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
              已有授權碼？<Link href="/activate" style={{ color: 'var(--gold)', textDecoration: 'none' }}>點此輸入</Link>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="footer">
            <div className="footer-brand">地政X經紀同根生</div>
            <div className="footer-copy">© 2026 Kmoji · 台灣地政士與不動產經紀人考照備考平台</div>
          </div>
        </footer>
      </div>
    </>
  )
}
