function SizeSelector({ sizes, selectedSize, onChange }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone">Select size</p>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`min-w-14 rounded-full border px-4 py-2 text-sm font-medium transition ${selectedSize === size ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'}`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SizeSelector
