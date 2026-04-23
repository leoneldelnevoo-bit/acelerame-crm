const BUCKETS = [
  { title: '0 · Nuevos', etapas: [0], color: '' },
  { title: '1 · Contactados', etapas: [1], color: '' },
  { title: '2-3 · Responden', etapas: [2, 3], color: '' },
  { title: '4-5 · Califican', etapas: [4, 5], color: '' },
  { title: '6-8 · Pitch', etapas: [6, 7, 8], color: 'hot' },
  { title: '9-11 · Calientes', etapas: [9, 10, 11], color: 'hot' },
  { title: '12 · Agendados', etapas: [12], color: 'won' }
]

function ScoreBar({ score }) {
  const s = Math.min(10, Math.max(0, parseInt(score) || 0))
  return (
    <span className="score-bar">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className={i < s ? 'filled' : ''} />
      ))}
    </span>
  )
}

export default function Pipeline({ leads }) {
  return (
    <section className="pipeline">
      <div className="pipeline-track">
        {BUCKETS.map(b => {
          const inBucket = leads.filter(l => b.etapas.includes(parseInt(l.etapa)))
          const preview = inBucket.slice(0, 3)
          return (
            <div key={b.title} className="stage fade-up">
              <div className="stage-head">
                <div className="stage-title">{b.title}</div>
                <div className={`stage-count ${b.color}`}>{inBucket.length}</div>
              </div>
              {preview.map(l => (
                <div key={l.handle} className="lead" title={l.score_motivo || ''}>
                  <div className="lead-handle">@{l.handle}</div>
                  <div className="lead-score">
                    <ScoreBar score={l.score} />
                    <span>{l.score || '—'}/10</span>
                  </div>
                </div>
              ))}
              {inBucket.length > 3 && (
                <div className="stage-more">+ {inBucket.length - 3} más</div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
