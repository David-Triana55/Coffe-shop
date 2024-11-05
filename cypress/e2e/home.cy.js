// verificar la pagina principal y que haga lo esperado
describe("Página de Inicio", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("se muestra el título", () => {
    cy.get(".title").contains("Coffee Shop");
  });

  it("se abre la navegación", () => {
    cy.get(".button-mobile").click();
    cy.contains("Tipos de Café");
    cy.contains("Accesorios de Café");
    cy.contains("Marcas de Café");
    cy.contains("Iniciar sesión");
    cy.contains("Crear cuenta");
    cy.get(".button-mobile__close").click();
  });


  it("click en el botón principal", () => {
    cy.get(".button-main").click();
    cy.contains("Café de calidad, hecho con cuidado y dedicado para aquellos que buscan disfrutar cada sorbo.");
    cy.contains("Café Molido");
  });

  it("click el cards de marcas de café", () => {
    cy.get(".card-brands").first().click();
    cy.url().should("include", "/Marcas-de-cafe/Oma");
    cy.contains("Oma");
  })
});

// verificar que los productos se muestren correctamente en la página de productos y se puedan agregar con el icono al carrito


describe("cuando se agrega al carrito de compra", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.get(".card-brands").first().click();
    cy.url().should("include", "/Marcas-de-cafe/Oma");
    cy.contains("Oma");
    cy.get(".cart-counter").contains("0");
  }) 

  it("darle un click al icono de agregar al carrito", () => {
    cy.get(".card_product__cart").first().click()
    cy.get(".icon-cart-check").should('have.css', 'color', 'rgb(34, 197, 94)')
    cy.get(".cart-counter").contains("1");
  })

  it("darle un click al icono de chulo para remover del carrito", () => {
    cy.get(".card_product__cart").first().click();
    cy.get(".cart-counter").contains("1");
    cy.get(".card_product__cart").first().click();
    cy.get(".cart-counter").contains("0");
    cy.get(".card_product__cart").first().click();
    cy.get(".cart-counter").contains("1");
  });
});

// verificar que se muestre el detalle del producto al hacer click
describe("cuando se hace click en el producto", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.get(".card-brands").first().click();
    cy.url().should("include", "/Marcas-de-cafe/Oma");
    cy.contains("Oma");
    cy.get(".cart-counter").contains("0");
    cy.get(".card_product__cart").first().click()
    cy.get(".icon-cart-check").should('have.css', 'color', 'rgb(34, 197, 94)')
    cy.get(".cart-counter").contains("1");
  }) 

  it("se muestra el detalle del producto", () => {
    cy.get(".card_product__content > .card_product__image > img").first().click();
    cy.url().should("include", "/ProductDetail/1");
    cy.contains('Descripcion');
    cy.contains('Origen');
  })
})

// agregar al carrito y remover del carrito
describe("cuando se agrega al carrito y se remove del carrito", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get(".card-brands").first().click();
    cy.url().should("include", "/Marcas-de-cafe/Oma");
    cy.contains("Oma");
    cy.get(".cart-counter").contains("0");
    cy.get(".card_product__cart").first().click()
    cy.get(".icon-cart-check").should('have.css', 'color', 'rgb(34, 197, 94)')
    cy.get(".cart-counter").contains("1");
  })

  it("se muestra el modal de compra", () => {
    cy.get(".button-checkout").click();
    cy.contains("Productos");
    cy.contains("Total: $ 11.235,00");
    cy.get(".remove-element").first().click();
    cy.contains('Total: $ 0,00')
    cy.contains("Carrito vacio");
  })
})

// agregar al carrito y comprar sin iniciar sesión
describe("cuando se agrega al carrito y se compra sin iniciar sesión", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.get(".card-brands").first().click();
    cy.url().should("include", "/Marcas-de-cafe/Oma");
    cy.contains("Oma");
    cy.get(".cart-counter").contains("0");
    cy.get(".card_product__cart").first().click()
    cy.get(".icon-cart-check").should('have.css', 'color', 'rgb(34, 197, 94)')
    cy.get(".cart-counter").contains("1");
  })

  it('se muestra el modal de compra', () => {
    cy.get(".button-checkout").click();
    cy.contains("Productos");
    cy.contains("Total");
    cy.contains('Finalizar').click();
    cy.url().should("include", "/Sign-in");
  })
})

// agregar al carrito y comprar con iniciar sesión

describe("Flujo de compra al agregar al carrito y comprar con iniciar sesión", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/testing',
      body: {
        email: 'prueba@prueba.com'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect([200, 409, 500]).to.include(res.status)
    })

    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/signUp', 
      body: {
        name: 'Prueba',
        lastName: 'Usuario',
        number: '12345',
        password: '12345',
        email: 'prueba@prueba.com',
        confirmPassword: '12345'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect([201, 409]).to.include(res.status)
    })
  })

    it("debería permitir agregar un producto al carrito ", () => {
      cy.get(".button-mobile").click();
      cy.visit("http://localhost:3000/Sign-in");
      cy.get('#email').type('prueba@prueba.com');
      cy.get('#password').type('12345');
      cy.get('button[type="submit"]').click();
      cy.get(".card-brands").first().click().wait(1000);
      cy.url().should("include", "/Marcas-de-cafe/Oma");
      cy.contains("Oma");
      cy.get(".cart-counter").contains("0");
      cy.get(".card_product__cart").first().click()
      cy.get(".icon-cart-check").should('have.css', 'color', 'rgb(34, 197, 94)')
      cy.get(".cart-counter").contains("1");
      cy.get(".button-checkout").click();
      cy.contains("Productos");
      cy.contains("Total");
      cy.contains('Finalizar').click();
      cy.url().should("include", "/Pay/").wait(1000);
      cy.contains("Factura").should('exist');
    });
});

// ver info de cliente y modificar

describe('cambiar info de cliente', () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/Sign-in");
    cy.get('#email').type('prueba@prueba.com');
    cy.get('#password').type('12345');
    cy.get('button[type="submit"]').click();
    cy.get(".button-mobile").click();
    cy.visit("http://localhost:3000/Profile");
    cy.contains("Menú de Perfil");
  });
  
  it('cambiar info de cliente', () => {
    cy.contains("Historial de Facturas");
  });

})