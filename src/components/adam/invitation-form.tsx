'use client'

import { useState, type FormEvent } from 'react'
import { FadeUp } from './motion'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const cooperationOptions = [
  { value: 'course', label: '公開開課' },
  { value: 'course', label: '企業內訓' },
  { value: 'consulting', label: 'AI 導入／陪跑' },
  { value: 'unsure', label: '尚未確定' },
] as const

export function CpcInvitationForm() {
  const [cooperation, setCooperation] = useState('')
  const [company, setCompany] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [industry, setIndustry] = useState('')
  const [headcount, setHeadcount] = useState('')
  const [problem, setProblem] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const selectedOption = cooperationOptions.find((o) => o.label === cooperation)
  const serviceType = selectedOption?.value ?? 'unsure'
  const serviceLabel = cooperation || '尚未確定'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (honeypot) return

    setStatus('submitting')
    setErrorMessage('')

    const industryText = industry ? `\n產業類型：${industry}` : ''
    const headcountText = headcount ? `\n預計人數：${headcount}` : ''
    const message = `合作方式：${serviceLabel}${industryText}${headcountText}\n\n希望解決的問題／期望成果：\n${problem}`

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactPerson,
          company,
          email,
          phone: '',
          service_type: serviceType,
          message,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || '送出失敗，請稍後再試')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : '送出失敗，請稍後再試')
    }
  }

  if (status === 'success') {
    return (
      <section id="invitation" className="bg-adam-navy py-20 md:py-28">
        <div className="mx-auto max-w-[600px] px-5 text-center md:px-8">
          <div className="rounded-3xl border border-white/10 bg-adam-navy-light p-12">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#4CAF7D]/20">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="font-serif text-[28px] font-semibold text-white">
              已收到你的需求
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/60">
              Adam 會在 1–2 個工作天內與你聯繫，確認課程方向與細節。
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="invitation" className="bg-adam-navy py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid items-start gap-16 md:grid-cols-[1fr_1.1fr]">
          <FadeUp>
            <div>
              <p className="text-[13px] font-medium tracking-[0.18em] text-adam-gold">
                INVITATION
              </p>
              <h2 className="mt-4 font-serif text-[30px] font-semibold leading-tight text-white md:text-[36px]">
                邀請 Adam 授課
              </h2>
              <p className="mt-4 max-w-[420px] text-[16px] leading-[1.75] text-white/60">
                不論是一場 AI 趨勢講座、主題實作課或企業內訓規劃，歡迎告訴我你的需求。我會依學員背景、產業與工作場景，設計最適合的課程內容。
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {[
                  '依學員程度與產業客製',
                  '從入門到進階皆可安排',
                  '提供課後支援與追蹤',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="inline-block size-2 rounded-full bg-[#4CAF7D]" />
                    <span className="text-[14px] text-white/70">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/8 bg-adam-navy-light p-8 md:p-10"
            >
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="cpc-hp">不要填寫</label>
                <input
                  id="cpc-hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-5">
                <fieldset>
                  <legend className="mb-2 text-[13px] font-semibold text-white/50">
                    合作方式
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {cooperationOptions.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setCooperation(opt.label)}
                        className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all ${
                          cooperation === opt.label
                            ? 'bg-adam-gold font-semibold text-adam-navy'
                            : 'border border-white/15 text-white/70 hover:border-adam-gold hover:text-adam-gold'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label
                    htmlFor="cpc-company"
                    className="mb-2 block text-[13px] font-semibold text-white/50"
                  >
                    公司／單位名稱
                  </label>
                  <input
                    id="cpc-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                    placeholder="例如：中華民國全國工業總會"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cpc-name"
                      className="mb-2 block text-[13px] font-semibold text-white/50"
                    >
                      聯絡人 *
                    </label>
                    <input
                      id="cpc-name"
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cpc-email"
                      className="mb-2 block text-[13px] font-semibold text-white/50"
                    >
                      Email *
                    </label>
                    <input
                      id="cpc-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cpc-industry"
                      className="mb-2 block text-[13px] font-semibold text-white/50"
                    >
                      產業類型
                    </label>
                    <input
                      id="cpc-industry"
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                      placeholder="例如：製造業"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cpc-headcount"
                      className="mb-2 block text-[13px] font-semibold text-white/50"
                    >
                      預計人數
                    </label>
                    <input
                      id="cpc-headcount"
                      type="text"
                      value={headcount}
                      onChange={(e) => setHeadcount(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                      placeholder="例如：30 人"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cpc-problem"
                    className="mb-2 block text-[13px] font-semibold text-white/50"
                  >
                    希望解決的工作問題 / 期望成果 *
                  </label>
                  <textarea
                    id="cpc-problem"
                    required
                    rows={4}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full resize-none rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                    placeholder="例如：希望讓行政同仁學會用 AI 處理日常文書、資料整理與報表"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-[14px] text-red-400">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-2 w-full rounded-2xl bg-adam-gold px-7 py-4 text-[16px] font-semibold tracking-wider text-adam-navy transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {status === 'submitting' ? '送出中⋯' : '送出邀課需求 →'}
                </button>
              </div>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
