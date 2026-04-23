import { useSupabaseData, ETAPAS } from '../hooks/useSupabaseData.js'
import MetricCard from './MetricCard.jsx'
import Pipeline from './Pipeline.jsx'
import Funnel from './Funnel.jsx'
import HotLeads from './HotLeads.jsx'

export default function Dashboard({ project, user }) {
  if (!project) {
    return (
      <div className="loading-full">
        <div className="loading-full-title">Ningún proyecto seleccionado</div>
        <div className="loading-full-msg">Elegí un proyecto desde el sidebar para ver las métricas.</div>
      </div>
    )
  }

  if (project.supabaseUrl === 'PENDIENTE') {
    return (
      <>
        <Header project={project} status="loading" statusText="Pendiente" />
        <div className="empty-state">
          <div className="empty-state-title">Proyecto en instalación</div>
          <div className="empty-state-msg">
            Este proyecto todavía no tiene los datos en producción. El operador técnico está configurando las
            cuentas, workflows y scraping. En cuanto esté listo, las métricas aparecerán acá automáticamente.
          </div>
        </div>
      </>
    )
  }

  const { data, loading, error, lastUpdate, reload } = useSupabaseData(project)

  if (loading && !data) {
    return (
      <>
        <Header project={project} status="loading" statusText="Cargando..." />
        <div className="loading-full">
          <div className="loading-full-title">Sincronizando datos</div>
          <div className="loading-full-msg">Conectando con la base de datos del proyecto...</div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header project={project} status="error" statusText="Error de conexión" />
        <div className="error-state">
          <div className="error-state-title">No se pudieron cargar los datos</div>
          <div className="error-state-msg">{error}</div>
        </div>
      </>
    )
  }

  const { leads, summary } = data
  const { total, contactados, activos, agendados } = summary

  return (
    <>
      <Header project={project} status="active" statusText="Sistema Activo" lastUpdate={lastUpdate} onRefresh={reload} />

      <section className="metrics">
        <MetricCard
          label="Leads Totales"
          value={total}
          sub={`${total} en pipeline`}
          delay={0.05}
        />
        <MetricCard
          label="Contactados"
          value={contactados}
          sub={contactados > 0 ? `${Math.round(contactados/total*100)}% del total` : '0%'}
          delay={0.1}
        />
        <MetricCard
          label="En Conversación"
          value={activos}
          sub={contactados > 0 ? `${Math.round(activos/contactados*100)}% tasa respuesta` : '—'}
          delay={0.15}
        />
        <MetricCard
          label="Agendados"
          value={agendados}
          sub={total > 0 ? `${(agendados/total*100).toFixed(1)}% conversión` : '0%'}
          delay={0.2}
        />
      </section>

      <div className="section-head">
        <h2 className="section-title">Pipeline <em>por etapa</em></h2>
        <div className="section-meta">
          {lastUpdate && `Actualizado · ${lastUpdate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`}
        </div>
      </div>
      <Pipeline leads={leads} />

      <div className="two-col">
        <Funnel leads={leads} total={total} contactados={contactados} agendados={agendados} />
        <ScoreDistribution leads={leads} />
      </div>

      <div className="section-head">
        <h2 className="section-title">Leads <em>calientes</em></h2>
        <div className="section-meta">Top 10 más avanzados</div>
      </div>
      <HotLeads leads={leads} />

      <footer className="footer">
        <div>{project.name}</div>
        <div>Datos vivos · Auto-refresh cada 30s</div>
      </footer>
    </>
  )
}

function Header({ project, status, statusText, lastUpdate, onRefresh }) {
  return (
    <header className="header">
      <div className="header-info">
        <h1>{project.brand} <em>·</em> {project.vertical}</h1>
        <div className="header-info-meta">{project.owner} · Operado por Leo</div>
      </div>
      <div className={`status-pill ${status === 'active' ? '' : status}`}>
        <span className="status-dot" />
        <span>{statusText}</span>
      </div>
    </header>
  )
}

function ScoreDistribution({ leads }) {
  const buckets = { '9-10': 0, '7-8': 0, '5-6': 0, '3-4': 0, '1-2': 0 }
  for (const l of leads) {
    const s = parseInt(l.score) || 0
    if (s >= 9) buckets['9-10']++
    else if (s >= 7) buckets['7-8']++
    else if (s >= 5) buckets['5-6']++
    else if (s >= 3) buckets['3-4']++
    else if (s >= 1) buckets['1-2']++
  }
  const max = Math.max(...Object.values(buckets), 1)

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">Distribución de Score</div>
        <div className="panel-sub">Calidad de leads prospectados</div>
      </div>
      {Object.entries(buckets).map(([range, count]) => (
        <div key={range} className="funnel-row">
          <div className="funnel-label">Score {range}</div>
          <div className="funnel-bar">
            <div className="funnel-fill" style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <div className="funnel-value">{count}</div>
        </div>
      ))}
    </div>
  )
}
