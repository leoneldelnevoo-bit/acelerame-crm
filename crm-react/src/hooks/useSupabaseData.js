import { useState, useEffect, useCallback } from 'react'

export const ETAPAS = {
  0: { label: 'Nuevo', short: 'NUEVO' },
  1: { label: 'Contactado', short: 'DM' },
  2: { label: 'Respondió', short: 'RESP' },
  3: { label: 'Conversando', short: 'CONV' },
  4: { label: 'Problema detectado', short: 'PROB' },
  5: { label: 'Tibio', short: 'TIBIO' },
  6: { label: 'Solución planteada', short: 'SOL' },
  7: { label: 'Confianza', short: 'CONF' },
  8: { label: 'Pitch aceptado', short: 'PITCH' },
  9: { label: 'Caliente', short: 'HOT' },
  10: { label: 'Link enviado', short: 'LINK' },
  11: { label: 'Agendando', short: 'AGND' },
  12: { label: 'Agendado', short: 'WON' },
  99: { label: 'Descartado', short: 'OUT' }
}

// Supabase PostgREST default cap = 1000 filas por request.
// Usamos count=exact para conocer el total y Range headers para paginar.
const PAGE_SIZE = 1000
const MAX_PAGES = 50  // cap duro: 50.000 leads. Más que eso avisamos al usuario.

async function fetchSupabasePage(project, endpoint, from, to) {
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = `${project.supabaseUrl}/rest/v1/${endpoint}${separator}apikey=${project.supabaseKey}`
  const response = await fetch(url, {
    headers: {
      'Range-Unit': 'items',
      'Range': `${from}-${to}`,
      'Prefer': 'count=exact'
    }
  })
  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Supabase ${response.status}: ${errText.substring(0, 120)}`)
  }
  // Content-Range: "0-999/17775"
  const contentRange = response.headers.get('content-range') || ''
  const totalStr = contentRange.split('/')[1]
  const totalCount = totalStr && totalStr !== '*' ? parseInt(totalStr) : null
  const rows = await response.json()
  return { rows, totalCount }
}

async function fetchAllLeads(project) {
  // Primer page + descubrir total
  const first = await fetchSupabasePage(
    project,
    'prospeccion_leads?select=handle,etapa,estado,score,score_motivo,ultimo_contacto,bio,empresa&order=ultimo_contacto.desc.nullslast,etapa.desc',
    0,
    PAGE_SIZE - 1
  )
  let all = first.rows
  const total = first.totalCount ?? first.rows.length

  // Traer páginas restantes en paralelo
  if (total > PAGE_SIZE) {
    const pagesNeeded = Math.min(MAX_PAGES, Math.ceil(total / PAGE_SIZE))
    const promises = []
    for (let p = 1; p < pagesNeeded; p++) {
      const from = p * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      promises.push(fetchSupabasePage(
        project,
        'prospeccion_leads?select=handle,etapa,estado,score,score_motivo,ultimo_contacto,bio,empresa&order=ultimo_contacto.desc.nullslast,etapa.desc',
        from,
        to
      ))
    }
    const results = await Promise.all(promises)
    for (const r of results) all = all.concat(r.rows)
  }

  return { leads: all, total }
}

export function useSupabaseData(project) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const load = useCallback(async () => {
    if (!project || project.supabaseUrl === 'PENDIENTE') {
      setData(null)
      setLoading(false)
      setError('Proyecto aún no configurado. Contactá al operador técnico para activarlo.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { leads, total } = await fetchAllLeads(project)

      // Agrupar por etapa
      const porEtapa = {}
      for (const l of leads) {
        const e = parseInt(l.etapa) || 0
        porEtapa[e] = (porEtapa[e] || 0) + 1
      }

      // Métricas: siempre basadas en el TOTAL real (no en lo paginado)
      const contactados = leads.filter(l => {
        const e = parseInt(l.etapa)
        return e >= 1 && e !== 99
      }).length

      const activos = leads.filter(l => {
        const e = parseInt(l.etapa)
        return e >= 2 && e <= 11
      }).length

      const agendados = leads.filter(l => parseInt(l.etapa) === 12).length

      setData({
        leads,
        porEtapa,
        summary: { total, contactados, activos, agendados }
      })
      setLastUpdate(new Date())
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [project])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  return { data, loading, error, lastUpdate, reload: load }
}
