import { ETAPAS } from '../hooks/useSupabaseData.js'

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffH < 1) return 'hace minutos'
  if (diffH < 24) return `hace ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `hace ${diffD}d`
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

export default function HotLeads({ leads }) {
  const hot = leads
    .filter(l => { const e = parseInt(l.etapa); return e >= 4 && e <= 12 && e !== 99 })
    .sort((a, b) => (parseInt(b.etapa) || 0) - (parseInt(a.etapa) || 0))
    .slice(0, 10)

  return (
    <section className="hot-leads">
      <div className="hot-table">
        <div className="hot-table-head">
          <div>Handle</div>
          <div>Etapa</div>
          <div>Score</div>
          <div>Interés detectado</div>
          <div>Último contacto</div>
        </div>
        {hot.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
            <div className="empty-state-msg">Sin leads calientes en este momento. El sistema sigue prospectando.</div>
          </div>
        ) : (
          hot.map(l => {
            const etapa = ETAPAS[parseInt(l.etapa)] || { label: 'Desconocido', short: '?' }
            return (
              <div key={l.handle} className="hot-row">
                <div className="hot-handle">@{l.handle}</div>
                <div className="hot-stage">{etapa.short}</div>
                <div className="hot-score">{l.score || '—'}</div>
                <div className="hot-motivo">{(l.score_motivo || l.bio || '').substring(0, 70)}</div>
                <div className="hot-date">{formatDate(l.ultimo_contacto)}</div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
