import { create } from 'zustand'

// Definir la tienda (store)
const useStore = create((set) => ({
  cart: 0,
  checkoutWindow: false,
  navBarWindow: false,
  toogleNavBarWindow: () => set((state) => ({ navBarWindow: !state.navBarWindow })),
  toggleCheckoutWindow: () => set((state) => ({ checkoutWindow: !state.checkoutWindow })),
  increase: () => set((state) => ({ cart: state.cart + 1 })),
  decrease: () => set((state) => ({ cart: state.cart - 1 }))
}))

export default useStore
