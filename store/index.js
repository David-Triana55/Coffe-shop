import { formatPrice } from '@/utils/formatter'
import { create } from 'zustand'

// Definir la tienda (store)
const useStore = create((set, get) => ({
  cart: 0,
  checkoutWindow: false,
  checkoutData: [],
  totalBill: 0,
  bill: [],
  clientInfo: {},

  // Método para abrir y cerrar el modal del checkout

  toggleCheckoutWindow: () => set((state) => ({ checkoutWindow: !state.checkoutWindow })),

  // Métodos para el manejo del carrito de compras
  increase: () => set((state) => ({ cart: state.cart + 1 })),
  decrease: () => set((state) => ({ cart: state.cart - 1 })),
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
    get().calculateTotalBill()
  },
  removeToCart: (id) => {
    set((state) => ({
      checkoutData: state.checkoutData.filter((product) => product.id_producto !== id)
    }))

    const { decrease } = get()
    decrease()
  },

  setClientInfo: (info) => set({ clientInfo: info }),

  // Métodos para calcular el total de la cuenta

  calculateTotalBill: () => {
    const { checkoutData } = get()
    const total = checkoutData.reduce((total, item) => total + item.valor_producto_iva * item.count, 0)
    const totalBill = formatPrice(total)
    set((state) => ({ totalBill }))
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
  }

}))

export default useStore
