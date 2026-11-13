import './InteractionPrompt.css'

export default function InteractionPrompt({ label, hint = 'E' }) {
  if (!label) return null
  return (
    <div className="interact-prompt">
      <kbd className="interact-key">{hint}</kbd>
      <span className="interact-label">{label}</span>
    </div>
  )
}
