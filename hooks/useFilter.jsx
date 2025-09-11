export function useFilter (setProducts, products, value) {
  if (value === 'Ordenar por precio alto a bajo') {
    setProducts(products.sort((a, b) => a.price - b.price))
  } else if (value === 'Ordenar por precio bajo a alto') {
    setProducts(products.sort((a, b) => b.price - a.price))
  } else if (value === 'Ordenar por alfabeto') {
    setProducts(products.sort((a, b) => a.name.localeCompare(b.name)))
  } else {
    setProducts(products)
  }
}
