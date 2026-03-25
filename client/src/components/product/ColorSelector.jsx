function ColorSelector({ colors, selectedColor, onChange }) {
  if (!colors?.length) return null

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone">Select color</p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedColor === color ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'}`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ColorSelector
