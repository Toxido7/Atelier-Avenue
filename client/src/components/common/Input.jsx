import clsx from 'clsx'

function Input({ label, className, ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <input
        className={clsx(
          'w-full rounded-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-stone focus:border-ink',
          className,
        )}
        {...props}
      />
    </label>
  )
}

export default Input
