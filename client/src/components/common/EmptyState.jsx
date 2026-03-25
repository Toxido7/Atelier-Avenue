import Button from './Button'

function EmptyState({ title, description, actionLabel, action }) {
  return (
    <div className="surface-card flex flex-col items-center gap-5 px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mist text-2xl">
        0
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mx-auto max-w-md text-sm leading-6 text-stone">{description}</p>
      </div>
      {actionLabel && <Button onClick={action}>{actionLabel}</Button>}
    </div>
  )
}

export default EmptyState
