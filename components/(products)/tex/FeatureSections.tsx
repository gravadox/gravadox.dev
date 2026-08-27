'use client'

import { useEffect, useRef, useState } from 'react'

const features = [
  ['Text Snippets', 'Expand abbreviations into full blocks of text, boilerplate, templates, signatures, or anything you type often.',],
  ['Emojis', 'Type a short abbreviation to insert any emoji. No need to search through picker menus.',],
  ['Links', 'Easier links access, no need for repetitive copy & paste, can work for GIFs, picture, videos, or any link.',],
  ['Secure Passwords', 'Securely store and expand passwords encrypted with keyring. Type your abbreviation and the password expands in place.',],
]

const steps = [
  ['Set Custom Abbreviations', 'Define your abbreviations in the TEx app. Assign simple tags like --pr, --slack or --meet to templates.'],
  ['Run In Background', 'TEx runs as a system tray app, monitoring your keyboard input in the background.'],
  ['Instant Replacement', 'Type your abbreviation anywhere. TEx replaces it with the full expansion in place.'],
]

export function FeatureSections() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const targetProgress = useRef(0)
  const displayProgress = useRef(0)
  const rafId = useRef<number | undefined>(undefined)

  const [renderProgress, setRenderProgress] = useState(0)

  useEffect(() => {
    const updateTarget = () => {
      const el = wrapRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const viewportProgress = (window.innerHeight * 0.72 - rect.top) / (rect.height * 0.82)
      targetProgress.current = Math.min(1, Math.max(0, viewportProgress))
    }

    const tick = () => {
      displayProgress.current += (targetProgress.current - displayProgress.current) * 0.12
      if (Math.abs(targetProgress.current - displayProgress.current) < 0.0008) {
        displayProgress.current = targetProgress.current
      }
      setRenderProgress(displayProgress.current)
      rafId.current = requestAnimationFrame(tick)
    }

    updateTarget()
    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', updateTarget)
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', updateTarget)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  const n = steps.length
  const cursor = renderProgress * (n - 1)

  return (
    <>
      <section className="section feature-section" id="features">
        <div className="eyebrow">Snippets, Links, Emojis &amp; More</div>
        <h2>Abbreviate anything, expand instantly</h2>
        <p className="section-intro">Define abbreviations that expand into what you need.</p>

        <div className="feature-list">
          {features.map(([title, description, ]) => (
            <article className="feature-item" key={title}>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section workflow-section" id="workflow">
        <div className="eyebrow">Workflow Design</div>
        <h2 className='text-center'>How TEx speeds up your day</h2>

        <div className="workflow-wrap" ref={wrapRef}>
          <div className="steps">
            {steps.map(([title, description], index) => {
              const glow = Math.max(0, 1 - Math.abs(cursor - index))
              return (
                <article
                  className="step"
                  key={title}
                  style={{ '--glow': glow } as React.CSSProperties}
                >
                  <strong>0{index + 1}</strong>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

    </>
  )
}