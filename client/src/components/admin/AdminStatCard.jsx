import clsx from 'clsx'

function AdminStatCard({ icon: Icon, label, value, hint, accent = 'default' }) {
  const accentStyles = {
    default: 'border-black/5 bg-white',
    ink: 'border-stone-300 bg-stone-950 text-white',
    beige: 'border-[#e8dece] bg-[#fbf6ee]',
    green: 'border-emerald-200 bg-emerald-50/80',
    amber: 'border-amber-200 bg-amber-50/80',
  }

  const dark = accent === 'ink'

  return (
    <div
      className={clsx(
        'rounded-[26px] border p-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(17,17,17,0.08)]',
        accentStyles[accent] || accentStyles.default,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={clsx('text-[11px] font-semibold uppercase tracking-[0.24em]', dark ? 'text-white/65' : 'text-stone')}>
            {label}
          </p>
          <p className={clsx('mt-4 text-[2rem] font-semibold tracking-tight', dark ? 'text-white' : 'text-ink')}>
            {value}
          </p>
        </div>
        {Icon && (
          <div className={clsx('flex h-11 w-11 items-center justify-center rounded-2xl border', dark ? 'border-white/10 bg-white/10 text-white' : 'border-black/5 bg-white text-ink')}>
            <Icon size={18} />
          </div>
        )}
      </div>
      {hint && <p className={clsx('mt-4 text-sm leading-6', dark ? 'text-white/70' : 'text-stone')}>{hint}</p>}
    </div>
  )
}

export default AdminStatCard
