import clsx from 'clsx'

function AdminPageHeader({ eyebrow = 'Admin', title, description, actions, className }) {
  return (
    <div className={clsx('flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone">{eyebrow}</p>
        <div className="space-y-2">
          <h1 className="text-[2rem] font-semibold tracking-tight text-ink md:text-[2.35rem]">{title}</h1>
          {description && <p className="max-w-2xl text-sm leading-7 text-stone">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div>}
    </div>
  )
}

export default AdminPageHeader
