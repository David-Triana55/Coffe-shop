export function formatPrice (price) {
  return new Intl.NumberFormat('es-CO').format(price)
}

const typesCoffeeName = {
  'Cafe molido': 'Café Molido',
  'Cafe en Grano': 'Café en grano',
  'Capsulas de cafe': 'Cápsulas de Café',
  'Mezclas Especiales': 'Mezclas Especiales',
  Molinillos: 'Molinillos',
  Cafeteras: 'Cafeteras ',
  'Tazas y termos': 'Tazas y termos',
  Filtros: 'Filtros',
  Oma: 'Oma',
  'Juan Valdez': 'Juan Valdez',
  Nescafe: 'Nescafé',
  Colcafe: 'Colcafé',
  'Cafe Devocion': 'Café Devoción',
  Arabica: 'Arábica',
  Instantaneo: 'Instantáneo',
  'Cafetera de Capsulas': 'Cafetera de Cápsulas',
  'Molinillo Electrico': 'Molinillo Eléctrico'

}

export function formatCategory (category) {
  return typesCoffeeName[category]
}
