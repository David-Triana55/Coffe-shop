export function useFilter (setProducts, products, value) {
  if (value === 'Ordenar por precio alto a bajo') {
    setProducts(products.sort((a, b) => a.valor_producto_iva - b.valor_producto_iva))
  } else if (value === 'Ordenar por precio bajo a alto') {
    setProducts(products.sort((a, b) => b.valor_producto_iva - a.valor_producto_iva))
  } else if (value === 'Ordenar por alfabeto') {
    setProducts(products.sort((a, b) => a.nombre_producto.localeCompare(b.nombre_producto)))
  } else {
    setProducts(products)
  }
}
