'use client'

import { useState, useRef, type FormEvent } from 'react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface Answers {
  area?: string
  duration?: string
  impact?: string
  pace?: string
  screen?: string
}

const QUESTIONS = [
  {
    key: 'area' as const,
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
    key: 'duration' as const,
    title: '這個狀態持續多久了？',
    sub: '時間長短，決定我們從哪一層開始。',
    options: ['未滿 3 個月', '3 到 12 個月', '一年以上'],
  },
  {
    key: 'impact' as const,
    title: '它已經影響到事業或重大決定了嗎？',
    sub: '',
    options: [
      '尚未，但我不想等到那一天',
      '開始影響了',
      '已明顯影響，需要盡快處理',
    ],
  },
  {
    key: 'pace' as const,
    title: '你希望多快看見改變？',
    sub: '',
    options: [
      '30 天內先穩住',
      '3 個月內重建',
      '我需要一位長期在身邊的顧問',
    ],
  },
  {
    key: 'screen' as const,
    title: '最後一題，為了確保你得到最合適的協助。',
    sub: '過去兩週，你是否持續無法正常工作或入睡，或出現過傷害自己的念頭？',
    options: ['否', '是'],
  },
]

const TOTAL_STEPS = 6

export function AdvisoryForm() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [city, setCity] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [note, setNote] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const startedAt = useRef(Date.now())

  function selectOption(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setStep((s) => s + 1)
  }

  function goBack() {
    if (step > 1) setStep((s) => s - 1)
  }

  function validBirth(): boolean {
    const y = Number(birthYear)
    const m = Number(birthMonth)
    const d = Number(birthDay)
    const nowYear = new Date().getFullYear()
    if (!y || !m || !d || y < 1920 || y > nowYear - 16 || m < 1 || m > 12 || d < 1 || d > 31)
      return false
    const dt = new Date(y, m - 1, d)
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (honeypot) return

    if (!name.trim()) return showError('請填寫稱呼。')
    if (!contact.trim()) return showError('請留下回覆方式。')
    if (!validBirth()) return showError('請確認出生日期（西元年／月／日）。')
    if (!consent) return showError('請勾選同意說明。')

    setStatus('submitting')
    setErrorMessage('')

    const birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`

    try {
      const res = await fetch('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          city: city.trim(),
          birth_date: birthDate,
          note: note.trim(),
          area: answers.area || '',
          duration: answers.duration || '',
          impact: answers.impact || '',
          pace: answers.pace || '',
          screen_flag: answers.screen || '',
          consent: true,
          website: honeypot,
          startedAt: startedAt.current,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || '送出時發生問題，請稍後再試。')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : '送出時發生問題，請稍後再試。')
    }
  }

  function showError(msg: string) {
    setErrorMessage(msg)
    setStatus('error')
  }

  if (status === 'success') {
    const today = new Date()
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

    return (
      <div className="py-8" tabIndex={-1}>
        <div className="flex items-baseline justify-between border-b border-[#D0C9C0] pb-5">
          <h2 className="font-serif text-[18px] font-semibold tracking-[0.5em] text-[#2A2520]">
            私人評估申請書
          </h2>
          <span className="text-[14px] text-[#8A847B]">{dateStr}</span>
        </div>

        <div className="mt-10 flex flex-col items-center text-center">
          <SealStamp chars={['顧', '問', '親', '閱']} />

          <h3 className="mt-8 font-serif text-[24px] font-semibold leading-snug text-[#2A2520] sm:text-[28px]">
            {name}，你的申請已送達。
          </h3>

          <p className="mx-auto mt-5 max-w-[440px] text-[15px] leading-[1.85] text-[#6B665E]">
            顧問將在 48 小時內親自審閱你的資料，並透過你留下的聯絡方式，回覆一份《狀態快照》與建議的起始路徑。
          </p>

          <p className="mt-6 text-[14px] text-[#A09A92]">
            在那之前，你不需要準備任何東西。
          </p>
        </div>
      </div>
    )
  }

  const currentStep = Math.min(step, TOTAL_STEPS)
  const progressPct = Math.round((currentStep / TOTAL_STEPS) * 100)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[13px] text-[#8A847B]">
          第 {currentStep} / {TOTAL_STEPS} 步
        </span>
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="text-[14px] text-[#8A847B] transition-colors hover:text-[#2A2520]"
          >
            ← 上一步
          </button>
        )}
      </div>
      <div className="mb-8 h-[2px] bg-[#D0C9C0]">
        <div
          className="h-[2px] bg-[#C13B2A] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {step <= QUESTIONS.length && (
        <QuestionStep
          question={QUESTIONS[step - 1]}
          selected={answers[QUESTIONS[step - 1].key]}
          onSelect={(value) => selectOption(QUESTIONS[step - 1].key, value)}
        />
      )}

      {step > QUESTIONS.length && answers.screen === '是' && (
        <div className="mb-6 rounded-xl border border-[#D0C9C0] bg-white p-6">
          <h4 className="font-serif text-[18px] font-semibold text-[#2A2520]">
            謝謝你如實回答。
          </h4>
          <p className="mt-3 text-[14px] leading-[1.8] text-[#6B665E]">
            這項服務是決策與關係系統顧問，並非心理治療。以你現在的狀態，最優先的是醫療或心理專業的陪伴；顧問會在回覆中協助你銜接合適的資源。
          </p>
          <p className="mt-3 text-[14px] leading-[1.8] text-[#6B665E]">
            如果此刻有傷害自己的念頭，請立即撥打當地的緊急求助專線（台灣：安心專線
            1925，24 小時；香港：撒瑪利亞防止自殺會 2389 2222）。
          </p>
        </div>
      )}

      {step > QUESTIONS.length && (
        <div className="flex flex-col gap-5">
          <h3 className="font-serif text-[22px] font-semibold text-[#2A2520]">
            建立你的評估檔案
          </h3>
          <p className="-mt-3 text-[14px] text-[#8A847B]">
            顧問會依這些資料準備你的《狀態快照》。
          </p>

          <Field label="怎麼稱呼你" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：陳先生、Grace"
              maxLength={40}
              className={INPUT_CLASS}
            />
          </Field>

          <Field label="回覆方式" required>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="LINE ID／WhatsApp／Email 擇一"
              maxLength={120}
              className={INPUT_CLASS}
            />
          </Field>

          <Field label="所在城市">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="例如：台北、香港、新加坡"
              maxLength={40}
              className={INPUT_CLASS}
            />
          </Field>

          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold text-[#8A847B]">
              出生日期（西元）<span className="text-[#C13B2A]"> *</span>
            </legend>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="adv-birth-y"
                  className="mb-1 block text-[12px] text-[#A09A92]"
                >
                  年
                </label>
                <input
                  id="adv-birth-y"
                  type="text"
                  inputMode="numeric"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="1978"
                  maxLength={4}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label
                  htmlFor="adv-birth-m"
                  className="mb-1 block text-[12px] text-[#A09A92]"
                >
                  月
                </label>
                <input
                  id="adv-birth-m"
                  type="text"
                  inputMode="numeric"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  placeholder="6"
                  maxLength={2}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label
                  htmlFor="adv-birth-d"
                  className="mb-1 block text-[12px] text-[#A09A92]"
                >
                  日
                </label>
                <input
                  id="adv-birth-d"
                  type="text"
                  inputMode="numeric"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  placeholder="15"
                  maxLength={2}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
            <p className="mt-2 text-[12px] text-[#A09A92]">
              用於建立你的個人決策模式基準，僅顧問本人可見。
            </p>
          </fieldset>

          <Field label="有一件事，你希望顧問先知道（選填）">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="一兩句就好。"
              maxLength={600}
              className={`${INPUT_CLASS} resize-none`}
            />
          </Field>

          <div className="sr-only" aria-hidden="true">
            <label htmlFor="adv-hp">不要填寫</label>
            <input
              id="adv-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-[#6B665E]">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 size-5 shrink-0 accent-[#C13B2A]"
            />
            <span>
              我了解這是決策與關係系統顧問服務，不包含醫療診斷、心理治療或命運預測；資料僅供本次評估使用。
            </span>
          </label>

          {errorMessage && (
            <p className="text-[14px] text-[#C13B2A]" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-2 w-full bg-[#2A2520] px-7 py-4 text-[16px] font-semibold tracking-wider text-[#F5F0E8] transition-all hover:bg-[#3D3630] disabled:opacity-50"
          >
            {status === 'submitting' ? '送出中⋯' : '送出申請'}
          </button>
        </div>
      )}
    </form>
  )
}

const INPUT_CLASS =
  'w-full border border-[#D0C9C0] bg-white px-4 py-3 text-[15px] text-[#2A2520] placeholder:text-[#B5AFA6] focus:border-[#C13B2A] focus:outline-none'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold text-[#8A847B]">
        {label}
        {required && <span className="text-[#C13B2A]"> *</span>}
      </p>
      {children}
    </div>
  )
}

function QuestionStep({
  question,
  selected,
  onSelect,
}: {
  question: (typeof QUESTIONS)[number]
  selected?: string
  onSelect: (value: string) => void
}) {
  return (
    <div>
      <h3 className="font-serif text-[22px] font-semibold leading-snug text-[#2A2520]">
        {question.title}
      </h3>
      {question.sub && (
        <p className="mt-2 text-[14px] text-[#8A847B]">{question.sub}</p>
      )}
      <div className="mt-6 flex flex-col gap-3" role="radiogroup">
        {question.options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={selected === opt}
            onClick={() => onSelect(opt)}
            className={`flex items-center gap-4 border px-5 py-4 text-left text-[15px] leading-relaxed transition-all ${
              selected === opt
                ? 'border-[#C13B2A] bg-[#C13B2A]/[0.04] text-[#2A2520]'
                : 'border-[#D0C9C0] text-[#5A554D] hover:border-[#8A847B]'
            }`}
          >
            <span
              className={`flex size-[14px] shrink-0 items-center justify-center rounded-full border ${
                selected === opt
                  ? 'border-[#C13B2A] bg-[#C13B2A]'
                  : 'border-[#C13B2A]/50'
              }`}
              aria-hidden="true"
            />
            <span>{opt}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function SealStamp({ chars, size = 80 }: { chars: [string, string, string, string]; size?: number }) {
  const fontSize = size * 0.35
  return (
    <div
      className="inline-grid grid-cols-2 grid-rows-2 items-center justify-items-center border-[3px] border-[#C13B2A]"
      style={{
        width: size,
        height: size,
        transform: 'rotate(-4deg)',
        fontFamily: 'var(--font-serif, "Noto Serif TC", serif)',
        fontSize,
        fontWeight: 700,
        color: '#C13B2A',
        lineHeight: 1,
      }}
    >
      {chars.map((ch, i) => (
        <span key={i}>{ch}</span>
      ))}
    </div>
  )
}
