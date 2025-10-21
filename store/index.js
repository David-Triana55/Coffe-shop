import { formatPrice } from '@/utils/formatter'
import { ROLES } from '@/utils/roles'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(persist(
  (set, get) => ({
    checkoutWindow: false,
    checkoutData: [],
    login: {
      isLogged: false,
      role: ROLES.DESCONOCIDO
    },
    totalBill: 0,
    clientInfo: {},

    toogleCheckoutWindow: () => set((state) => ({ checkoutWindow: !state.checkoutWindow })),
    toogleCheckoutWindowValue: (value) => set({ checkoutWindow: value }),

    addToCart: (product, count = 1) => {
      set((state) => {
        const alreadyInCart = state.checkoutData.find((item) => item.id === product.id)
        if (alreadyInCart) {
          return {
            checkoutData: state.checkoutData.map((item) =>
              item.id === product.id
                ? { ...item, count }
                : item
            )
          }
        } else {
          return {
            checkoutData: [...state.checkoutData, { ...product, count }]
          }
        }
      })
      const { calculateTotalBill } = get()
      calculateTotalBill()
    },
    removeToCart: (id) => {
      set((state) => ({
        checkoutData: state.checkoutData.filter((product) => product.id !== id)
      }))

      const { calculateTotalBill } = get()
      calculateTotalBill()
    },

    removeClientInfo: () => set({ clientInfo: {} }),

    setClientInfo: (info) => set({ clientInfo: info }),

    cleanCart: () => set({ checkoutData: [], totalBill: 0 }),

    calculateTotalBill: () => {
      const { checkoutData } = get()
      const total = checkoutData.reduce((total, item) => total + item.price * item.count, 0)
      const totalBill = formatPrice(total)
      set({ totalBill })
    },

    setLogin: (isLogged, role) => {
      set((state) => ({
        login: {
          isLogged,
          role
        }
      }))
    },

    logOut: () => set({ login: { isLogged: false, role: ROLES.DESCONOCIDO }, checkoutData: [], totalBill: 0, clientInfo: {} })
  }),
  {
    name: 'isLogged',
    getStorage: () => localStorage
  }
))

export default useStore
