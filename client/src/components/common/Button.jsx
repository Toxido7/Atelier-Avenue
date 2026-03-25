import clsx from 'clsx'

function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center rounded-full border text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:cursor-not-allowed disabled:opacity-60',
        {
          'border-ink bg-ink text-white hover:-translate-y-0.5 hover:bg-black':
            variant === 'primary',
          'border-line bg-white text-ink hover:border-ink': variant === 'secondary',
          'border-transparent bg-transparent text-ink hover:bg-black/5': variant === 'ghost',
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3': size === 'md',
          'px-7 py-4 text-base': size === 'lg',
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
