const badgeStyles = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-800',
  PROCESSING: 'border-sky-200 bg-sky-50 text-sky-800',
  CONFIRMED: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  PAID: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  FAILED: 'border-rose-200 bg-rose-50 text-rose-700',
  CANCELLED: 'border-stone-200 bg-stone-100 text-stone-700',
  FEATURED: 'border-blue-200 bg-blue-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
  STANDARD: 'border-stone-200 bg-white text-stone-700',
  DRAFT: 'border-stone-200 bg-stone-100 text-stone-700',
}

function resolveBadgeKey(value) {
  const normalized = String(value || '').toUpperCase()

  if (normalized.includes('PAID')) return 'PAID'
  if (normalized.includes('PROCESSING')) return 'PROCESSING'
  if (normalized.includes('PENDING')) return 'PENDING'
  if (normalized.includes('FAILED')) return 'FAILED'
  if (normalized.includes('CANCELLED')) return 'CANCELLED'
  if (normalized.includes('CONFIRMED')) return 'CONFIRMED'
  if (normalized.includes('FEATURED')) return 'FEATURED'
  if (normalized.includes('STANDARD')) return 'STANDARD'
  if (normalized.includes('DRAFT')) return 'DRAFT'

  return normalized
}

function StatusBadge({ value, className = '' }) {
  const style = badgeStyles[resolveBadgeKey(value)] || 'border-black/5 bg-white text-ink'

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${style} ${className}`.trim()}
    >
      {value}
    </span>
  )
}

export default StatusBadge
