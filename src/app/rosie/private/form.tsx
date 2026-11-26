'use client'

import { useState, type FormEvent } from 'react'
import styles from './advisory.module.css'

const QUESTIONS = [
  {
    key: 'area',
    title: '此刻最失衡的，是哪一塊？',
    sub: '選最接近的一項，不需要精準。',
    options: [
      '重大決策：反覆拖延，開始不信任自己的判斷',
      '關係：伴侶、家族或合夥人之間的張力',
      '壓力與節律：長期高載，專注與睡眠開始失控',
      '說不清楚，只覺得整個系統在鬆動',
    ],
  },
  {
    key: 'duration',
    title: '這個狀態持續多久了？',
    sub: '時間長短，決定我們從哪一層開始。',
    options: ['未滿 3 個月', '3 到 12 個月', '一年以上'],
  },
  {
    key: 'impact',
    title: '它已經影響到事業或重大決定了嗎？',
    sub: '',
    options: ['尚未，但我不想等到那一天', '開始影響了', '已明顯影響，需要盡快處理'],
  },
  {
    key: 'pace',
    title: '你希望多快看見改變？',
    sub: '',
    options: ['30 天內先穩住', '3 個月內重建', '我需要一位長期在身邊的顧問'],
  },
  {
    key: 'screen',
    title: '最後一題，為了確保你得到最合適的協助。',
    sub: '過去兩週，你是否持續無法正常工作或入睡，或出現過傷害自己的念頭？',
    options: ['否', '是'],
  },
]

function suggestPath(answers: Record<string, string>): string {
  if (answers.screen === '是') return '轉介優先（暫不推付費方案）'
  if (answers.pace === '我需要一位長期在身邊的顧問') return '01 深度評估 → 評估後邀請 03'
  if (answers.impact === '尚未，但我不想等到那一天' || answers.duration === '未滿 3 個月') return '01 系統深度評估'
  if (['開始影響了', '已明顯影響，需要盡快處理'].includes(answers.impact) && ['30 天內先穩住', '3 個月內重建'].includes(answers.pace)) return '02 12 週系統重建'
  return '01 系統深度評估'
}

function isValidDate(y: number, m: number, d: number): boolean {
  const now = new Date()
  if (y < 1920 || y > now.getFullYear() - 16) return false
  if (m < 1 || m > 12) return false
  const maxDay = new Date(y, m, 0).getDate()
  return d >= 1 && d <= maxDay
}

export function AdvisoryForm() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [city, setCity] = useState('')
  const [referral, setReferral] = useState('')
  const [birthY, setBirthY] = useState('')
  const [birthM, setBirthM] = useState('')
  const [birthD, setBirthD] = useState('')
  const [note, setNote] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const totalSteps = 6
  const isQuestionStep = step < 5
  const isProfileStep = step === 5
  const showScreenNotice = answers.screen === '是'

  function selectOption(value: string) {
    const q = QUESTIONS[step]
    setAnswers(prev => ({ ...prev, [q.key]: value }))
    if (step < 4) {
      setTimeout(() => setStep(s => s + 1), 200)
    } else {
      setTimeout(() => setStep(5), 200)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (honeypot) return

    const y = parseInt(birthY); const m = parseInt(birthM); const d = parseInt(birthD)
    if (!name.trim()) { setErrorMsg('請填寫稱呼'); return }
    if (!contact.trim()) { setErrorMsg('請填寫回覆方式'); return }
    if (!birthY || !birthM || !birthD || !isValidDate(y, m, d)) { setErrorMsg('請確認出生日期是否正確'); return }
    if (!consent) { setErrorMsg('請勾選同意條款'); return }

    setStatus('submitting')
    setErrorMsg('')

    const payload = {
      submitted_at: new Date().toISOString(),
      name: name.trim(),
      contact: contact.trim(),
      city: city.trim(),
      referral: referral.trim(),
      birth_date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      note: note.trim(),
      ...answers,
      screen_flag: answers.screen || '否',
      suggested_path: suggestPath(answers),
      page: typeof window !== 'undefined' ? window.location.href : '',
      lang: typeof navigator !== 'undefined' ? navigator.language : '',
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          company: '',
          email: payload.contact,
          phone: '',
          service: 'private-advisory',
          message: `【私人評估申請】\n失衡領域：${payload.area}\n持續時間：${payload.duration}\n影響程度：${payload.impact}\n期待節奏：${payload.pace}\n篩選題：${payload.screen_flag}\n系統建議：${payload.suggested_path}\n城市：${payload.city}\n推薦人：${payload.referral}\n出生日期：${payload.birth_date}\n備註：${payload.note}`,
        }),
      })
      if (!res.ok) throw new Error('送出失敗')
      setStatus('done')
    } catch {
      setStatus('error')
      setErrorMsg('送出時發生問題，請稍後再試或直接透過 LINE 聯繫。')
    }
  }

  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })

  if (status === 'done') {
    return (
      <div className={styles.letter}>
        <div className={styles.done} tabIndex={-1}>
          <svg className={`${styles.seal} ${styles['seal-done']}`} viewBox="0 0 100 100" role="img" aria-label="顧問親閱">
            <defs><filter id="rs-done"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves={2} seed={11} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={4} /></filter></defs>
            <g filter="url(#rs-done)">
              <rect x="5" y="5" width="90" height="90" rx="5" />
              <text x="71" y="45" className={styles['seal-t']}>顧</text><text x="71" y="87" className={styles['seal-t']}>問</text>
              <text x="29" y="45" className={styles['seal-t']}>親</text><text x="29" y="87" className={styles['seal-t']}>閱</text>
            </g>
          </svg>
          <h3>{name}，你的申請已送達。</h3>
          <p>顧問將在 48 小時內親自審閱你的資料，並透過你留下的聯絡方式，回覆一份《狀態快照》與建議的起始路徑。</p>
          <p className={styles.muted}>在那之前，你不需要準備任何東西。</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.letter}>
      <div className={styles['letter-head']}>
        <p className={styles['letter-title']}>私人評估申請書</p>
        <p className={styles['letter-date']}>{today}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles['progress-row']}>
          <span className={styles['step-label']} aria-live="polite">第 {step + 1} / {totalSteps} 步</span>
          {step > 0 && <button type="button" className={styles['btn-text']} onClick={() => setStep(s => s - 1)}>← 上一步</button>}
        </div>
        <div className={styles.progress} aria-hidden="true">
          <div className={styles['progress-bar']} style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>

        {/* 狀態題 */}
        {isQuestionStep && (
          <div>
            <p className={styles['q-title']}>{QUESTIONS[step].title}</p>
            {QUESTIONS[step].sub && <p className={styles['q-sub']}>{QUESTIONS[step].sub}</p>}
            <div className={styles.options} role="radiogroup" aria-label={QUESTIONS[step].title}>
              {QUESTIONS[step].options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={answers[QUESTIONS[step].key] === opt}
                  className={styles['opt-btn']}
                  onClick={() => selectOption(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 建檔 */}
        {isProfileStep && (
          <>
            {showScreenNotice && (
              <div className={styles.notice} tabIndex={-1}>
                <h3>謝謝你如實回答。</h3>
                <p>這項服務是決策與關係系統顧問，並非心理治療。以你現在的狀態，最優先的是醫療或心理專業的陪伴；顧問會在回覆中協助你銜接合適的資源。</p>
                <p>如果此刻有傷害自己的念頭，請立即撥打當地的緊急求助專線（台灣：安心專線 1925，24 小時；香港：撒瑪利亞防止自殺會 2389 2222）。</p>
              </div>
            )}

            <fieldset className={styles.profile}>
              <legend className={styles['q-title']}>建立你的評估檔案</legend>
              <p className={styles['q-sub']}>顧問會依這些資料準備你的《狀態快照》。</p>

              <div className={styles.field}>
                <label htmlFor="f-name">稱呼</label>
                <input id="f-name" type="text" autoComplete="name" placeholder="例如：陳先生、Grace" maxLength={40} value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="f-contact">回覆方式</label>
                <input id="f-contact" type="text" placeholder="LINE ID／WhatsApp／Email 擇一" maxLength={120} value={contact} onChange={e => setContact(e.target.value)} required />
              </div>
              <div className={styles['field-row']}>
                <div className={styles.field}>
                  <label htmlFor="f-city">所在城市</label>
                  <input id="f-city" type="text" autoComplete="address-level2" placeholder="台北、香港、新加坡…" maxLength={40} value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-ref">推薦人（選填）</label>
                  <input id="f-ref" type="text" placeholder="誰介紹你來的" maxLength={60} value={referral} onChange={e => setReferral(e.target.value)} />
                </div>
              </div>

              <fieldset className={`${styles.field} ${styles.birth}`} style={{ border: 0, padding: 0 }}>
                <legend style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 6 }}>出生日期（西元）</legend>
                <div className={styles['birth-grid']}>
                  <div>
                    <input id="f-y" type="text" inputMode="numeric" placeholder="1978" maxLength={4} value={birthY} onChange={e => setBirthY(e.target.value)} required aria-label="出生年" />
                    <label htmlFor="f-y">年</label>
                  </div>
                  <div>
                    <input id="f-m" type="text" inputMode="numeric" placeholder="6" maxLength={2} value={birthM} onChange={e => setBirthM(e.target.value)} required aria-label="出生月" />
                    <label htmlFor="f-m">月</label>
                  </div>
                  <div>
                    <input id="f-d" type="text" inputMode="numeric" placeholder="15" maxLength={2} value={birthD} onChange={e => setBirthD(e.target.value)} required aria-label="出生日" />
                    <label htmlFor="f-d">日</label>
                  </div>
                </div>
                <p className={styles.hint}>用於建立你的個人決策模式基準，僅顧問本人可見。</p>
              </fieldset>

              <div className={styles.field}>
                <label htmlFor="f-note">有一件事，你希望顧問先知道（選填）</label>
                <textarea id="f-note" rows={3} placeholder="一兩句就好。" maxLength={600} value={note} onChange={e => setNote(e.target.value)} />
              </div>

              <div className={styles.hp} aria-hidden="true">
                <label htmlFor="f-website">Website</label>
                <input id="f-website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
              </div>

              <label className={styles.consent} htmlFor="f-consent">
                <input id="f-consent" type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required />
                <span>我了解這是決策與關係系統顧問服務，不包含醫療診斷、心理治療或命運預測；資料僅供本次評估使用。</span>
              </label>

              {errorMsg && <p className={styles.error} role="alert">{errorMsg}</p>}
              <button type="submit" className={`${styles.btn} ${styles['btn-block']}`} disabled={status === 'submitting'}>
                {status === 'submitting' ? '送出中⋯' : '送出申請'}
              </button>
            </fieldset>
          </>
        )}
      </form>
    </div>
  )
}
