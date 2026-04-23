export default function Funnel({ leads, total, contactados, agendados }) {
  const stages = [
    { label: 'Prospectados', count: total },
    { label: 'Contactados', count: contactados },
    { label: 'Respondieron', count: leads.filter(l => { const e = parseInt(l.etapa); return e >= 2 && e !== 99 }).length },
    { label: 'Calificaron', count: leads.filter(l => { const e = parseInt(l.etapa); return e >= 4 && e !== 99 }).length },
    { label: 'Pitch', count: leads.filter(l => { const e = parseInt(l.etapa); return e >= 8 && e !== 99 }).length },
    { label: 'Calientes', count: leads.filter(l => { const e = parseInt(l.etapa); return e >= 9 && e !== 99 }).length },
    { label: 'Agendados', count: agendados }
  ]
  const max = stages[0].count || 1

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">Embudo de Conversión</div>
        <div className="panel-sub">Trayectoria del lead</div>
      </div>
      {stages.map((s, i) => (
        <div key={s.label} className="funnel-row">
          <div className="funnel-label">{s.label}</div>
          <div className="funnel-bar">
            <div
              className="funnel-fill"
              style={{ width: `${(s.count / max) * 100}%`, transitionDelay: `${i * 0.08}s` }}
            />
          </div>
          <div className="funnel-value">{s.count}</div>
        </div>
      ))}
    </div>
  )
}
