import { toast } from 'react-toastify'

export function toastSuccess (text, autoCloseTime, transition) {
  toast.success(text, {
    position: 'bottom-right',
    autoClose: autoCloseTime,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    theme: 'dark',
    transition
  })
}

export function toastError (text, autoCloseTime, transition) {
  toast.error(text, {
    position: 'bottom-right',
    autoClose: autoCloseTime,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    theme: 'dark',
    transition
  })
}
