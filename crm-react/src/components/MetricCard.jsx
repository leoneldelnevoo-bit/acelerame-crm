import { useEffect, useState } from 'react'

export default function MetricCard({ label, value, sub, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const start = displayValue
    const end = value
    const duration = 1200
    const startTime = performance.now()

    let frame
    function update(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * eased)
      setDisplayValue(current)
      if (progress < 1) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="metric-card fade-up" style={{ animationDelay: `${delay}s` }}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{displayValue.toLocaleString('es-AR')}</div>
      <div className="metric-foot">
        <span className="metric-sub">{sub}</span>
      </div>
    </div>
  )
}
