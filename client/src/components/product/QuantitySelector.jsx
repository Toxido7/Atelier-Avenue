function QuantitySelector({ quantity, onDecrease, onIncrease, compact = false }) {
  return (
    <div className={`space-y-3 ${compact ? '' : ''}`}>
      {!compact && <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone">Quantity</p>}
      <div className="inline-flex items-center rounded-full border border-line">
        <button type="button" onClick={onDecrease} className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} text-lg`}>
          -
        </button>
        <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
        <button type="button" onClick={onIncrease} className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} text-lg`}>
          +
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector
