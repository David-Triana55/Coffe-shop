import { formatPrice } from '@/utils/formatter'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Definir la tienda (store)
const useStore = create(persist(
  (set, get) => ({
    checkoutWindow: false,
    checkoutData: [],
    login: {
      token: null,
      isLogged: false
    },
    totalBill: 0,
    bill: [],
    clientInfo: {},

    // Método para abrir y cerrar el modal del checkout
    toogleCheckoutWindowValue: (value) => set({ checkoutWindow: value }),
    toogleCheckoutWindow: () => set((state) => ({ checkoutWindow: !state.checkoutWindow })),

    // Métodos para el manejo del carrito de compras
    addToCart: (product, count = 1) => {
      set((state) => {
        const alreadyInCart = state.checkoutData.find((item) => item.id_producto === product.id_producto)
        if (alreadyInCart) {
          return {
            checkoutData: state.checkoutData.map((item) =>
              item.id_producto === product.id_producto
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
        checkoutData: state.checkoutData.filter((product) => product.id_producto !== id)
      }))

      const { calculateTotalBill } = get()
      calculateTotalBill()
    },

    removeClientInfo: () => set({ clientInfo: {} }),

    setClientInfo: (info) => set({ clientInfo: info }),

    // Métodos para calcular el total de la cuenta
    calculateTotalBill: () => {
      const { checkoutData } = get()
      const total = checkoutData.reduce((total, item) => total + item.valor_producto_iva * item.count, 0)
      const totalBill = formatPrice(total)
      set({ totalBill })
    },

    // Métodos para realizar la facturación
    billProduct: () => {
      const { checkoutData, clientInfo } = get()

      const checkout = {
        cliente: clientInfo,
        productos: checkoutData.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.count,
          precio_unitario: item.valor_producto_iva
        }))
      }

      set((state) => ({
        bill: [...state.bill, checkout]
      }))
    },
    setLogin: (token, isLogged) => {
      set((state) => ({
        login: {
          token,
          isLogged
        }
      }))
    }
  }),
  {
    name: 'isLogged', // Nombre de la clave en localStorage
    getStorage: () => localStorage // Usar localStorage para persistir el estado
  }
))

export default useStore
