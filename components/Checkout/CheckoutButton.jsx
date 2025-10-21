'use client'

export default function CheckoutButton ({ onClick, disabled, type = 'button', className, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </button>
  )
}
