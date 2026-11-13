import './QuestLog.css'

export default function QuestLog({ quests }) {
  const visible = quests.filter(q => q.status === 'active' || q.status === 'completed')
  if (visible.length === 0) return null

  const active    = visible.find(q => q.status === 'active')
  const completed = visible.filter(q => q.status === 'completed')

  return (
    <div className="quest-log">
      {active && (
        <div className="quest-active">
          <div className="quest-log-header">
            <span className="quest-log-label">CURRENT</span>
            <span className="quest-icon">{active.icon}</span>
          </div>
          <div className="quest-title">{active.title}</div>
          <div className="quest-subtitle">{active.subtitle}</div>
          <ul className="quest-objectives">
            {active.objectives.map(obj => (
              <li key={obj.id} className={obj.completed ? 'done' : ''}>
                <span className="obj-dot">{obj.completed ? '✓' : '○'}</span>
                {obj.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {completed.length > 0 && (
        <div className="quest-completed-list">
          {completed.map(q => (
            <div key={q.id} className="quest-completed-item">
              <span>{q.icon}</span> {q.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
