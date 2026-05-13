// 'use client'

// import { createContext, useState, useCallback } from "react"

// export const ToastContext = createContext(null)

// function ToastProvider({ children }) {
//     const [toast, setToast] = useState([]);

// }

// export default ToastProvider;

'use client'

import { createContext, useState, useCallback } from 'react'

export const ToastContext = createContext(null)

const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.3" />
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.3" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.3" />
      <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

const STYLES = {
  success: {
    background: 'linear-gradient(135deg, #0d2e1a 0%, #0a1f12 100%)',
    border: '1px solid rgba(52, 211, 113, 0.25)',
    color: '#34d371',
    glow: '0 0 20px rgba(52, 211, 113, 0.12)',
  },
  error: {
    background: 'linear-gradient(135deg, #2e0d0d 0%, #1f0a0a 100%)',
    border: '1px solid rgba(248, 81, 81, 0.25)',
    color: '#f85151',
    glow: '0 0 20px rgba(248, 81, 81, 0.12)',
  },
  info: {
    background: 'linear-gradient(135deg, #0d1a2e 0%, #0a121f 100%)',
    border: '1px solid rgba(96, 165, 250, 0.25)',
    color: '#60a5fa',
    glow: '0 0 20px rgba(96, 165, 250, 0.12)',
  },
}

function ToastItem({ toast }) {
  const style = STYLES[toast.type]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: '10px',
        background: style.background,
        border: style.border,
        boxShadow: `${style.glow}, 0 8px 32px rgba(0,0,0,0.4)`,
        color: style.color,
        fontFamily: "'DM Mono', 'Fira Code', monospace",
        fontSize: '13px',
        letterSpacing: '0.01em',
        minWidth: '240px',
        maxWidth: '360px',
        backdropFilter: 'blur(12px)',
        transition: 'opacity 300ms ease, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: toast.visible ? 1 : 0,
        transform: toast.visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
        pointerEvents: toast.visible ? 'auto' : 'none',
      }}
    >
      <span style={{ flexShrink: 0 }}>{ICONS[toast.type]}</span>
      <span style={{ color: '#e2e8f0', fontFamily: "'DM Sans', sans-serif", fontSize: '13.5px' }}>
        {toast.message}
      </span>
    </div>
  )
}

function ToastContainer({ toasts }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@400;500&display=swap');
      `}</style>
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()

    setToasts((prev) => [...prev, { id, message, type, visible: true }])

    setTimeout(() => {
      // Start fade out
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      )

      setTimeout(() => {
        // Remove from array entirely
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}