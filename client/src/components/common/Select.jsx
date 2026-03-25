import clsx from 'clsx'

function Select({ label, className, children, ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <select
        className={clsx(
          'w-full rounded-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

export default Select
