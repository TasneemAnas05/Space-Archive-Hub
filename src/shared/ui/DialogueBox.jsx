import './DialogueBox.css'

const PORTRAITS = {
  scott:    { emoji: '👨‍🚀', color: '#00d4ff' },
  irwin:    { emoji: '🧑‍🚀', color: '#7b2fff' },
  houston:  { emoji: '🎧',   color: '#44cc88' },
  worden:   { emoji: '🧑‍🚀', color: '#ff9933' },
  narrator: { emoji: '📡',   color: '#c8d8e8' },
  default:  { emoji: '👤',   color: '#8892a4' },
}

export default function DialogueBox({ dialogue, onAdvance }) {
  if (!dialogue) return null

  const line   = dialogue.lines[dialogue.index]
  const isLast = dialogue.index >= dialogue.lines.length - 1
  const port   = PORTRAITS[line.speaker] ?? PORTRAITS.default

  return (
    <div className="dialogue-box" onClick={onAdvance} role="dialog" aria-label="Dialogue">
      <div className="dialogue-portrait" style={{ borderColor: port.color }}>
        {port.emoji}
      </div>

      <div className="dialogue-body">
        <span className="dialogue-speaker" style={{ color: port.color }}>
          {line.speakerName}
        </span>
        <p className="dialogue-text">{line.text}</p>
      </div>

      <div className="dialogue-nav">
        <span className="dialogue-counter">
          {dialogue.index + 1} / {dialogue.lines.length}
        </span>
        <span className="dialogue-cta">{isLast ? '✓ Close' : '▶ Next'}</span>
      </div>
    </div>
  )
}
