'use client'

const typeStyles = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
  info: 'bg-sky-500 text-white',
}

const icons = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}

function ToastItem({ toast, onDismiss }) {
  const { id, message, type = 'info', visible } = toast

  const baseStyles =
    'flex items-center gap-3 rounded-xl shadow-lg px-4 py-3 min-w-[280px] max-w-sm'

  const colorStyles = typeStyles[type] ?? typeStyles.info

  const transitionStyles = visible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-2'

  return (
    <div
      className={`${baseStyles} ${colorStyles} ${transitionStyles} transition-all duration-300 ease-in-out`}
    >
      {icons[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onDismiss?.(id)}
        className="ml-1 text-white/70 hover:text-white transition-colors text-lg leading-none"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  )
}

export function ToastContainer({ toasts = [], onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}