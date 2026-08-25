import Link from 'next/link'
import { FeatureSections } from '../../../components/(products)/tex/components/FeatureSections'
import { HeroNotepad } from '../../../components/(products)/tex/components/HeroNotepad'
import TExLogo from '../../../components/(products)/tex/components/TExLogo'

const benefits = [
  ['Fast Expansions', 'Expansions happen instantly as you type. TEx runs quietly in the system tray.',],
  ['Customizable', 'Define your own abbreviations for text, emojis, links, and passwords. Organize them in categories.',],
  ['Secure & Local', 'Your data stays on your machine. Passwords are encrypted with keyring. No cloud sync.',],
  ['Open Source', 'Built in Python and fully open source. Inspect the code, contribute, or modify it.', ],
]

const marqueeItems = [
  '--heart　→　♥',
  '--p　→　••••••',
  '--sig　→　Kind regards, Dev Team',
  '--gmail　→　contact@tex.app',
  '--pr　→　pull-request-merge',
]

function Marquee() {
  const group = (hidden = false) => (
    <div className="marquee-group" aria-hidden={hidden}>
      {marqueeItems.map((item, index) => (
        <span className="marquee-item" key={`${item}-${index}`}>
          {item}
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee" aria-label="Example TEx expansions">
      <div className="marquee-track">
        {group()}
        {group(true)}
        {group(true)}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <main>
      <section className="hero">
        <div className="hero-kicker">
          <span>Open Source</span>
          Free forever
        </div>
        <div className='mx-auto w-fit'>
        <TExLogo />
        </div>
        <h1>
          Type less.
          <br />
          Expand instantly.
        </h1>
        <p className="hero-copy">
          TEx is a keyboard abbreviation app to replace the copy &amp; paste headaches. Define short triggers that expand into text, emojis, links, or passwords.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="tex/download">Download for Desktop</Link>
          <Link className="button" href="https://github.com/gravadox/tex" target="_blank" rel="noreferrer">GitHub Repository</Link>
        </div>
        <HeroNotepad />
        <p className="availability">Available on Windows and Linux.</p>
      </section>

      <Marquee />
      <FeatureSections />

      <section className="section benefits-section">
        <div className="eyebrow">What TEx does</div>
        <h2>A straightforward text expander</h2>
        <div className="benefit-list">
          {benefits.map(([title, text, ]) => (
            <article className="benefit" key={title}>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <div className='logo-footer'>
          <TExLogo />
          </div>
          <div>
            <h3>TEx</h3>
            <p>A lightweight text expander for Windows and<br />Linux, built in Python.</p>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <b>Product</b>
            <Link href="/tex/download">Downloads</Link>
            <Link href="#features">Features</Link>
          </div>
          <div >
            <b>Resources</b>
            <Link href="/projects/tex" target="_blank" rel="noreferrer">Documentation</Link>
            <Link href="https://github.com/gravadox/TEx" target="_blank" rel="noreferrer">GitHub Repository</Link>
            <Link href="/tex/changelog">Changelog</Link>
          </div>
          <div>
            <b>Developer</b>
            <Link href="https://github.com/gravadox/TEx" target="_blank" rel="noreferrer">Contribute</Link>
            <Link href="https://github.com/gravadox/TEx/blob/main/license.txt">MIT License</Link>
            <Link href="https://github.com/gravadox/TEx" target="_blank" rel="noreferrer">Source Code</Link>
            <Link href="https://github.com/gravadox/TEx/issues">Report Issues</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TEx Open Source Project. All specifications subject to MIT License.</span>
        </div>
      </footer>
    </main>
  )
}
