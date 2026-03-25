function Loader() {
  return (
    <div className="flex items-center gap-3 text-sm text-stone">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-ink" />
      <span>Loading curated essentials...</span>
    </div>
  )
}

export default Loader
