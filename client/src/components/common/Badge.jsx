function Badge({ children }) {
  return (
    <span className="inline-flex rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-ink">
      {children}
    </span>
  )
}

export default Badge
