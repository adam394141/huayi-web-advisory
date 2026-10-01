'use client'

import { useState, type FormEvent } from 'react'
import { FadeUp } from './motion'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const cooperationOptions = [
  { value: 'consulting', label: '企業健檢' },
  { value: 'consulting', label: '人的定位' },
  { value: 'consulting', label: '團隊天賦盤點' },
  { value: 'consulting', label: '顧問陪跑' },
] as const

export function RosieInvitationForm() {
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
    const headcountText = headcount ? `\n公司人數：${headcount}` : ''
    const message = `[Rosie 講師頁] 合作方式：${serviceLabel}${industryText}${headcountText}\n\n諮詢需求：\n${problem}`

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
              Rosie 會在 1–2 個工作天內與你聯繫，確認諮詢方向與細節。
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
                預約企業健檢
              </h2>
              <p className="mt-4 max-w-[420px] text-[16px] leading-[1.75] text-white/60">
                品牌被比價、被殺價？業務一直在解釋？老闆與接班人意見不合，方案推不動？先找出真正卡住的地方，再定位人、定位品牌、給方向。
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {[
                  '建議 30–150 人金額規模的企業主',
                  '提供課後支援與追蹤',
                  '從人的定位到品牌落地一條龍',
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
                <label htmlFor="rosie-hp">不要填寫</label>
                <input
                  id="rosie-hp"
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
                    htmlFor="rosie-company"
                    className="mb-2 block text-[13px] font-semibold text-white/50"
                  >
                    公司／單位名稱
                  </label>
                  <input
                    id="rosie-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                    placeholder="例如：台灣中小企業"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="rosie-name"
                      className="mb-2 block text-[13px] font-semibold text-white/50"
                    >
                      聯絡人 *
                    </label>
                    <input
                      id="rosie-name"
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rosie-email"
                      className="mb-2 block text-[13px] font-semibold text-white/50"
                    >
                      Email *
                    </label>
                    <input
                      id="rosie-email"
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
                      htmlFor="rosie-industry"
                      className="mb-2 block text-[13px] font-semibold text-white/50"
                    >
                      產業類型
                    </label>
                    <input
                      id="rosie-industry"
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                      placeholder="例如：美業／餐飲／製造"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rosie-headcount"
                      className="mb-2 block text-[13px] font-semibold text-white/50"
                    >
                      公司人數
                    </label>
                    <input
                      id="rosie-headcount"
                      type="text"
                      value={headcount}
                      onChange={(e) => setHeadcount(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                      placeholder="例如：50 人"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="rosie-problem"
                    className="mb-2 block text-[13px] font-semibold text-white/50"
                  >
                    諮詢需求 / 期望解決的問題 *
                  </label>
                  <textarea
                    id="rosie-problem"
                    required
                    rows={4}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full resize-none rounded-xl border border-white/12 bg-white/4 px-4 py-3 text-[15px] text-white placeholder:text-white/30 focus:border-adam-gold focus:outline-none"
                    placeholder="例如：品牌做了很多年但一直沒有明確定位，想重新整理方向"
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
                  {status === 'submitting' ? '送出中⋯' : '送出諮詢需求 →'}
                </button>
              </div>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
