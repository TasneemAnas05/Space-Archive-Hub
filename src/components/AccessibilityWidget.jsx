import { useState, useEffect, useRef } from 'react'
import './AccessibilityWidget.css'

const DEFAULTS = { fontSize: 100, highContrast: false, reduceMotion: false, dyslexicFont: false, focusMask: false }

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(() => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('a11y')) }
    } catch {
      return DEFAULTS
    }
  })
  const maskRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--a11y-font-scale', settings.fontSize / 100)
    root.classList.toggle('high-contrast', settings.highContrast)
    root.classList.toggle('reduce-motion', settings.reduceMotion)
    root.classList.toggle('dyslexic-font', settings.dyslexicFont)
    localStorage.setItem('a11y', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!settings.focusMask) return
    const mask = maskRef.current
    if (!mask) return

    const onMove = (e) => {
      mask.style.setProperty('--mx', `${e.clientX}px`)
      mask.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [settings.focusMask])

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }))
  const reset = () => setSettings(DEFAULTS)

  return (
    <>
      {settings.focusMask && <div className="a11y-focus-mask" ref={maskRef} aria-hidden="true" />}

      <div className="a11y-widget" role="region" aria-label="Accessibility options">
        <button
          className="a11y-toggle"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label="Toggle accessibility menu"
          title="Accessibility"
        >
          ♿
        </button>

        {open && (
          <div className="a11y-panel" role="dialog" aria-label="Accessibility settings">
            <h2 className="a11y-title">Accessibility</h2>

            <div className="a11y-row">
              <span>Text Size</span>
              <div className="a11y-controls">
                <button onClick={() => set('fontSize', Math.max(80, settings.fontSize - 10))} aria-label="Decrease font size">A−</button>
                <span className="a11y-value">{settings.fontSize}%</span>
                <button onClick={() => set('fontSize', Math.min(150, settings.fontSize + 10))} aria-label="Increase font size">A+</button>
              </div>
            </div>

            <div className="a11y-row">
              <span>High Contrast</span>
              <button
                className={`a11y-toggle-btn ${settings.highContrast ? 'active' : ''}`}
                onClick={() => set('highContrast', !settings.highContrast)}
                aria-pressed={settings.highContrast}
              >
                {settings.highContrast ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="a11y-row">
              <span>Dyslexic Font</span>
              <button
                className={`a11y-toggle-btn ${settings.dyslexicFont ? 'active' : ''}`}
                onClick={() => set('dyslexicFont', !settings.dyslexicFont)}
                aria-pressed={settings.dyslexicFont}
              >
                {settings.dyslexicFont ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="a11y-row">
              <span>Focus Mask</span>
              <button
                className={`a11y-toggle-btn ${settings.focusMask ? 'active' : ''}`}
                onClick={() => set('focusMask', !settings.focusMask)}
                aria-pressed={settings.focusMask}
              >
                {settings.focusMask ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="a11y-row">
              <span>Reduce Motion</span>
              <button
                className={`a11y-toggle-btn ${settings.reduceMotion ? 'active' : ''}`}
                onClick={() => set('reduceMotion', !settings.reduceMotion)}
                aria-pressed={settings.reduceMotion}
              >
                {settings.reduceMotion ? 'ON' : 'OFF'}
              </button>
            </div>

            <button className="a11y-reset" onClick={reset}>Reset to Default</button>
          </div>
        )}
      </div>
    </>
  )
}
