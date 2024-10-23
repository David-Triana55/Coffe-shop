export function formatPrice (price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(Math.floor(price))
}

const typesCoffeeName = {
  'Cafe molido': 'Café Molido',
  'Capsulas de Cafe': 'Capsulas de Café',
  'Mezclas Especiales': 'Mezclas Especiales'
}

export function formatCategory (category) {
  return typesCoffeeName[category]
}
