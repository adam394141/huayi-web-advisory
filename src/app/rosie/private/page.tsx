import type { Metadata } from 'next'
import styles from './advisory.module.css'
import { AdvisoryForm } from './form'

export const metadata: Metadata = {
  title: '饒芝綺｜私人顧問 Private Advisory',
  description: '為正在經歷重大轉折的企業主、家族接班人與決策者，提供結構診斷與恢復路徑。讓你的決策與關係系統，回到可控。',
  alternates: { canonical: 'https://huayi.tw/rosie/private' },
  openGraph: {
    title: '讓你的決策與關係系統，回到可控。',
    description: '私人評估申請 · 由顧問本人審閱，48 小時內回覆。',
    url: 'https://huayi.tw/rosie/private',
    siteName: '饒芝綺 Private Advisory',
    locale: 'zh_TW',
    type: 'website',
    images: [{ url: '/rosie/private/og-portrait.jpg', width: 1200, height: 630, alt: '饒芝綺，首席顧問' }],
  },
}

function Seal({ className, id, children }: { className?: string; id: string; children: React.ReactNode }) {
  return (
    <svg className={`${styles.seal} ${className || ''}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={4} />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </svg>
  )
}

function SmallSeal() {
  return (
    <Seal className={styles['seal-xs']} id="rs0">
      <rect x="5" y="5" width="90" height="90" rx="5" />
      <text x="50" y="68" className={styles['seal-t1']}>饒</text>
    </Seal>
  )
}

export default function RosiePrivatePage() {
  return (
    <div className={styles.page}>
      {/* 版頭 */}
      <header className={styles.mh}>
        <a className={styles['mh-brand']} href="#top">
          <SmallSeal />
          <span className={styles['mh-name']}>饒芝綺</span>
          <span className={styles['mh-sub']}>PRIVATE ADVISORY</span>
        </a>
        <nav className={styles['mh-links']}>
          <a href="#method">方法</a>
          <a href="#paths">路徑</a>
          <a href="#about">顧問</a>
        </nav>
        <a className={styles['mh-cta']} href="#apply">申請評估</a>
      </header>

      <main id="top">
        {/* 一、刊首 */}
        <section className={styles.hero}>
          <div className={styles['hero-paper']}>
            <p className={styles['hero-meta']}>
              <span>私人顧問</span>
              <span className={styles.dash} aria-hidden="true" />
              <span>每月限額受理</span>
            </p>

            <h1 className={styles['hero-title']}>
              <span className={styles.vt}>讓你的決策與關係系統，</span>
              <span className={`${styles.vt} ${styles['vt-strong']}`}>回到可控。</span>
            </h1>

            <Seal className={styles['seal-hero']} id="rs1">
              <rect x="5" y="5" width="90" height="90" rx="5" />
              <text x="71" y="45" className={styles['seal-t']}>饒</text>
              <text x="71" y="87" className={styles['seal-t']}>芝</text>
              <text x="29" y="45" className={styles['seal-t']}>綺</text>
              <text x="29" y="87" className={styles['seal-t']}>印</text>
            </Seal>

            <div className={styles['hero-foot']}>
              <p className={styles['hero-lead']}>
                我不處理你的情緒。<br />我協助你，恢復系統的穩定性。
              </p>
              <p className={styles['hero-body']}>
                為正在經歷重大轉折的企業主、家族接班人與決策者，提供結構診斷與恢復路徑。
              </p>
              <div className={styles['hero-actions']}>
                <a className={styles.btn} href="#apply">申請私人評估</a>
                <span className={styles['hero-note']}>顧問本人審閱 · 48 小時內回覆</span>
              </div>
            </div>
          </div>

          <figure className={styles['hero-photo']}>
            <picture>
              <source type="image/webp" srcSet="/rosie/private/portrait-640.webp 640w, /rosie/private/portrait-1000.webp 1000w" sizes="(max-width: 768px) 100vw, 50vw" />
              <img src="/rosie/private/portrait-1000.jpg" width={1000} height={1500} alt="饒芝綺，首席顧問" />
            </picture>
            <figcaption>
              饒芝綺　首席顧問
              <span>二十三年，坐在決策者的對面。</span>
            </figcaption>
          </figure>
        </section>

        {/* 二、失衡 */}
        <section className={styles.tilt}>
          <div className={styles.wrap}>
            <p className={styles['sec-no']}>壹</p>
            <h2>表面上，<br />一切如常。</h2>
            <p className={styles['tilt-aside']}>但你知道，<br />系統正在鬆動。</p>
          </div>
          <div className={styles['tilt-stage']}>
            <div className={styles['tilt-line']} aria-hidden="true" />
            <ul className={styles['tilt-marks']}>
              <li>
                <span className={styles['mark-dot']} aria-hidden="true" />
                <h3>決策</h3>
                <p>重大決定反覆拖延。<br />開始不信任自己的判斷。</p>
              </li>
              <li>
                <span className={styles['mark-dot']} aria-hidden="true" />
                <h3>關係</h3>
                <p>伴侶、家族或合夥人的張力，<br />滲進每一次判斷。</p>
              </li>
              <li>
                <span className={styles['mark-dot']} aria-hidden="true" />
                <h3>節律</h3>
                <p>專注、睡眠與耐性，<br />一項一項失守。</p>
              </li>
            </ul>
          </div>
        </section>

        {/* 三、回到水平 */}
        <section className={styles.level}>
          <div className={styles.wrap}>
            <p className={styles['sec-no']}>貳</p>
            <h2>我不給安慰。<br />我讓你的系統，<em>回到水平</em>。</h2>
          </div>
          <div className={styles['level-stage']}>
            <div className={styles['level-line']} aria-hidden="true" />
          </div>
          <div className={`${styles.wrap} ${styles['level-foot']}`}>
            <p>失衡的人，往往不是能力不足，<br />而是內在的結構，在某個場景裡被觸發、被推歪了。</p>
            <p>看見結構，情緒就會退回它該在的位置。</p>
          </div>
        </section>

        {/* 四、方法 */}
        <section className={styles.method} id="method">
          <div className={styles.wrap}>
            <p className={styles['sec-no']}>參</p>
            <h2>三個步驟，<br />讓混亂回到有序。</h2>
            <ol className={styles.process}>
              <li>
                <span className={styles['p-node']} aria-hidden="true" />
                <span className={styles['p-no']}>I</span>
                <h3>定位真正的層次</h3>
                <p>你說出口的問題，往往不是需要處理的那一層。先找到它，不在錯的地方用力。</p>
              </li>
              <li>
                <span className={styles['p-node']} aria-hidden="true" />
                <span className={styles['p-no']}>II</span>
                <h3>還原觸發結構</h3>
                <p>在什麼場景、被什麼觸發、壓力從哪裡來。把看不見的反應模式，攤開在桌上。</p>
              </li>
              <li>
                <span className={`${styles['p-node']} ${styles['p-node-end']}`} aria-hidden="true" />
                <span className={styles['p-no']}>III</span>
                <h3>重建操作序列</h3>
                <p>先做什麼、後做什麼、什麼現在不要碰。具體到下週一就能執行。</p>
              </li>
            </ol>
          </div>
        </section>

        {/* 五、關於顧問 */}
        <section className={styles.about} id="about">
          <div className={`${styles.wrap} ${styles['about-grid']}`}>
            <div className={styles['about-side']}>
              <p className={styles['sec-no']}>肆</p>
              <h2 className={styles['about-v']}>關於顧問</h2>
            </div>
            <div className={styles['about-main']}>
              <p className={styles.pull}>真正讓人卡住的，<br />很少是策略本身。</p>
              <div className={styles['about-cols']}>
                <p><span className={styles.drop}>二</span>十三年來，我坐在企業主的對面，協助他們做出品牌、組織與接班的關鍵決定。我發現，真正讓人卡住的，很少是策略本身，而是決策者內在的系統失去了平衡。</p>
                <p>現在，我把企業診斷的方法帶進一對一的私人顧問：用結構讀懂你的反應模式，再用策略把你帶回可控的位置。不預測命運，不販賣安慰，只處理看得見、改得動的東西。</p>
              </div>
              <dl className={styles.figures}>
                <div><dt>23</dt><dd>年企業決策顧問</dd></div>
                <div><dt>300<small>+</small></dt><dd>位企業主與機構</dd></div>
                <div><dt>2026</dt><dd>MUSE Creative Awards 銀獎</dd></div>
              </dl>
              <p className={styles.sign}>饒芝綺 <span>Rosie Jao · 首席顧問</span></p>
            </div>
          </div>
        </section>

        {/* 六、三條路徑 */}
        <section className={styles.paths} id="paths">
          <div className={styles.wrap}>
            <p className={styles['sec-no']}>伍</p>
            <h2>三條路徑。</h2>
            <p className={styles['paths-sub']}>每一條，都先說清楚交付什麼。<br />顧問會在《狀態快照》中，建議你的起點。</p>
            <div className={styles.menu} role="list">
              <article className={styles['menu-row']} role="listitem">
                <span className={styles['m-no']}>I</span>
                <div className={styles['m-name']}><h3>系統深度評估</h3><p>入門 · 單次</p></div>
                <div>
                  <p className={styles['m-desc']}>一次 120 分鐘深度評估。交付書面《失衡根源圖》與 30 天優先行動清單。</p>
                  <p className={styles['m-out']}><span>交付</span>你會清楚知道問題的真正層次，以及第一個該動的槓桿。</p>
                </div>
                <p className={styles['m-price']}>［價格］<small>起</small></p>
              </article>
              <article className={styles['menu-row']} role="listitem">
                <span className={styles['m-no']}>II</span>
                <div className={styles['m-name']}><h3>十二週系統重建</h3><p>核心 · 十二週</p></div>
                <div>
                  <p className={styles['m-desc']}>每週一次 90 分鐘會談、日常訊息支持與操作任務。第 0 週與第 12 週各評估一次。</p>
                  <p className={styles['m-out']}><span>交付</span>決策速度、衝突頻率、節律穩定度，前後對照紀錄。</p>
                </div>
                <p className={styles['m-price']}>［價格］<small>起</small></p>
              </article>
              <article className={styles['menu-row']} role="listitem">
                <span className={styles['m-no']}>III</span>
                <div className={styles['m-name']}><h3>年度私人顧問</h3><p>高階 · 全年</p></div>
                <div>
                  <p className={styles['m-desc']}>每年僅受理［N］位。重大節點即時介入：併購與接班、婚姻與家族、公開危機。</p>
                  <p className={styles['m-out']}><span>交付</span>關鍵時刻，你身邊有一位看得懂你系統的人。</p>
                </div>
                <p className={styles['m-price']}><span className={styles.invite}>邀請制</span></p>
              </article>
            </div>
            <p className={styles['paths-fine']}>所有路徑皆從申請開始，不接受直接購買。</p>
          </div>
        </section>

        {/* 七、適合 */}
        <section className={styles.fit}>
          <div className={styles['fit-grid']}>
            <h2 className={styles['fit-title']}>我只接受<br />彼此適合的合作。</h2>
            <div className={styles['fit-col']}>
              <p className={styles['fit-k']}>適合</p>
              <ul>
                <li>企業主、家族接班人或高階決策者</li>
                <li>願意面對結構，而不只是想被安慰</li>
                <li>要的是具體可執行的下一步</li>
              </ul>
            </div>
            <div className={`${styles['fit-col']} ${styles['fit-col-no']}`}>
              <p className={styles['fit-k']}>不適合</p>
              <ul>
                <li>在尋找命運預測或算命</li>
                <li>此刻需要的是醫療或心理治療</li>
                <li>希望別人替你做決定</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 八、申請 */}
        <section className={styles.apply} id="apply" tabIndex={-1}>
          <div className={`${styles.wrap} ${styles['apply-grid']}`}>
            <div className={styles['apply-side']}>
              <p className={styles['sec-no']}>陸</p>
              <h2 className={styles['apply-v']}>先告訴我，<br />現在是哪裡失衡。</h2>
              <ol className={styles['apply-steps']}>
                <li><span className={styles.n}>一</span><span>回答五題狀態問題，約三分鐘</span></li>
                <li><span className={styles.n}>二</span><span>顧問本人於 48 小時內審閱</span></li>
                <li><span className={styles.n}>三</span><span>收到你的《狀態快照》與建議起點</span></li>
              </ol>
              <p className={styles['apply-fine']}>資料僅由顧問本人閱讀，不公開，可隨時要求刪除。</p>
            </div>
            <AdvisoryForm />
          </div>
        </section>
      </main>

      {/* 頁尾 */}
      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles['footer-row']}`}>
          <div className={styles['footer-brand']}>
            <SmallSeal />
            <div>
              <p className={styles['footer-name']}>饒芝綺　私人顧問</p>
              <p>台灣 · 服務亞洲華語決策者</p>
            </div>
          </div>
          <p className={styles['footer-note']}>
            本服務為決策與關係系統顧問，不提供醫療診斷、心理治療或命運預測。如有需要，顧問會協助轉介合適的專業資源。
          </p>
        </div>
      </footer>
    </div>
  )
}
