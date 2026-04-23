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

async function fetchSupabase(project, endpoint) {
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = `${project.supabaseUrl}/rest/v1/${endpoint}${separator}apikey=${project.supabaseKey}`
  const response = await fetch(url)
  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Supabase ${response.status}: ${errText.substring(0, 100)}`)
  }
  return response.json()
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
      const leads = await fetchSupabase(
        project,
        'prospeccion_leads?select=handle,etapa,estado,score,score_motivo,ultimo_contacto,bio&order=ultimo_contacto.desc.nullslast&limit=500'
      )

      const porEtapa = {}
      for (const l of leads) {
        const e = parseInt(l.etapa) || 0
        porEtapa[e] = (porEtapa[e] || 0) + 1
      }

      const total = leads.length
      const contactados = leads.filter(l => parseInt(l.etapa) >= 1 && parseInt(l.etapa) !== 99).length
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
