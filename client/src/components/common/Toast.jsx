import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { useUI } from '../../context/UIContext'

const toastStyles = {
  success: {
    icon: CheckCircle2,
    accent: 'text-emerald-600',
  },
  error: {
    icon: CircleAlert,
    accent: 'text-rose-500',
  },
  info: {
    icon: Info,
    accent: 'text-ink',
  },
}

function Toast() {
  const { toast, hideToast } = useUI()

  if (!toast) return null

  const currentToast = toastStyles[toast.type] ?? toastStyles.info
  const Icon = currentToast.icon

  return (
    <div className="pointer-events-none fixed inset-x-4 top-24 z-[70] flex justify-center sm:inset-x-6 sm:top-28">
      <div className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-[28px] border border-line bg-white px-5 py-4 shadow-soft">
        <div className={`mt-0.5 ${currentToast.accent}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-6 text-ink">{toast.message}</p>
        </div>
        <button type="button" onClick={hideToast} className="text-stone transition hover:text-ink" aria-label="Dismiss toast">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast
