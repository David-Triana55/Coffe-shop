export function formatPrice (price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(Math.floor(price))
}

const typesCoffeeName = {
  'Cafe molido': 'Café Molido',
  'Capsulas de Cafe': 'Capsulas de Café',
  'Mezclas Especiales': 'Mezclas Especiales',
  Molinillos: 'Molinillos',
  Cafeteras: 'Cafeteras ',
  'Tazas%20y%20termos': 'Tazas y termos',
  Filtros: 'Filtros',
  Oma: 'Oma',
  'Juan Valdez': 'Juan Valdez',
  Nescafe: 'Nescafé',
  Colcafe: 'Colcafé',
  'Cafe Devocion': 'Café Devoción'

}

export function formatCategory (category) {
  return typesCoffeeName[category]
}
