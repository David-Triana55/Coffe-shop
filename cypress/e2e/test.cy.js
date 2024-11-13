// verificar la pagina principal y que haga lo esperado
describe("Página de Inicio", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("se muestra el título", () => {
    cy.get(".title").contains("Coffee Shop");
  });

  it("se abre la navegación en mobile", () => {
    cy.get(".button-mobile").click();
    cy.contains("Tipos de Café");
    cy.contains("Accesorios de Café");
    cy.contains("Marcas de Café");
    cy.contains("Iniciar sesión");
    cy.contains("Crear cuenta");
    cy.get(".button-mobile__close").click();
  });

  it("click a un link de la navegación en mobile", () => {
    cy.get(".button-mobile").click(); 
    cy.contains("Tipos de Café");
    cy.contains("Accesorios de Café");
    cy.contains("Marcas de Café");
    cy.intercept("GET", "**/Accesorios-de-cafe/Cafeteras*").as("getCafeterasPage");
    cy.get(".link-navbar-mobile").eq(4).should("contain", "Cafeteras").click();
    cy.wait("@getCafeterasPage", {timeout: 10000});
    cy.url().should("include", "/Accesorios-de-cafe/Cafeteras");
});


  it("se abre la navegacion en desktop", () => {
    cy.viewport('macbook-11')
    cy.get('.button-desktop').click()
    cy.contains("Tipos de Café");
    cy.contains("Accesorios de Café");
    cy.contains("Marcas de Café");
  })

  it("click a un link de la navegación en desktop", () => {
    cy.viewport('macbook-11')
    cy.get('.button-desktop').click()
    cy.contains("Tipos de Café");
    cy.contains("Accesorios de Café");
    cy.contains("Marcas de Café");
    cy.intercept("GET", "**/Accesorios-de-cafe/Cafeteras*").as("getCafeterasPage");
    cy.get(".link-navbar-desktop").eq(4).should('contain', 'Cafeteras').click()
    cy.wait("@getCafeterasPage", {timeout: 10000});
    cy.url().should("include", "/Accesorios-de-cafe/Cafeteras") 
  })


  it("click en el botón principal", () => {
    cy.get(".button-main").click();
    cy.contains("Café de calidad, hecho con cuidado y dedicado para aquellos que buscan disfrutar cada sorbo.");
    cy.intercept("GET", "**/Tipos-de-cafe/Cafe-molido*").as("getCafeMolidoPage");
    cy.wait("@getCafeMolidoPage", {timeout: 10000});
    cy.contains("Café Molido");
  });

  it("click el cards de marcas de café", () => {
    cy.get(".card-brands").first().click();
    cy.intercept("GET", "**/Marcas-de-cafe/Oma*").as("getOmaPage");
    cy.wait("@getOmaPage", {timeout: 10000});
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
    cy.wait(5000);
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
    cy.intercept('GET', '**/Sign-in*').as('getSignInPage');
    cy.wait('@getSignInPage', {timeout: 10000});
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
      },
      failOnStatusCode: false
    }).then((res) => {
      expect([201, 409]).to.include(res.status)
    })
  })

  it("deberia permitir agregar un producto al carrito y realizar la compra", () => {
    cy.get(".button-mobile").click();
    cy.visit("http://localhost:3000/Sign-in");
    cy.get('#email').type('prueba@prueba.com');
    cy.get('#password').type('12345');
    cy.get('button[type="submit"]').click();
    
    cy.intercept('GET', '**/*').as('getHomePage');
    cy.wait('@getHomePage', { timeout: 10000 });

    cy.get(".card-brands").first().click();
    cy.intercept('GET', '**/Marcas-de-cafe/Oma*').as('getBrandPage');
  
  
    cy.wait('@getBrandPage', { timeout: 10000 }); 
  
    cy.url().should("include", "/Marcas-de-cafe/Oma");
  
    cy.contains("Oma");
  
    cy.get(".cart-counter").contains("0");
    cy.get(".card_product__cart").first().click();
    cy.get(".icon-cart-check").should('have.css', 'color', 'rgb(34, 197, 94)');
    cy.get(".cart-counter").contains("1");
    cy.get(".button-checkout").click();
  
    cy.contains("Productos");
    cy.contains("Total");
    cy.contains('Finalizar').click();
  
    cy.intercept('GET', '**/Pay/*').as('getPayPage');
    cy.wait('@getPayPage', { timeout: 10000 });
  
    cy.url().should("include", "/Pay/");
    cy.contains("Factura").should('exist');
  });
  
});

// ver info de cliente y modificar

describe('cambiar info de cliente', () => {
  beforeEach(() => {
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
      },
      failOnStatusCode: false
    }).then((res) => {
      expect([201, 409]).to.include(res.status)
    })
    cy.visit("http://localhost:3000/Sign-in");
    cy.get('#email').type('prueba@prueba.com');
    cy.get('#password').type('12345');
    cy.get('button[type="submit"]').click();
    cy.wait(5000);
  });

  afterEach(() => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/testing',
      body: {
        email: 'prueba3@prueba.com'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect([200, 409, 500]).to.include(res.status)
    })
  })
  it('Debería actualizar la información correctamente', () => {
    cy.window().then((window) => {
      const loggedInData = window.localStorage.getItem('isLogged');
      if (loggedInData) {
        const { state } = JSON.parse(loggedInData);
        console.log(state);  
      } else {
        throw new Error('No se encontró la información de usuario en localStorage');
      }
    });
  
    cy.get(".button-mobile").click();
    cy.get(".link-perfil-mobile").click();
  
    cy.intercept('GET', '**/Profile*').as('getProfilePage');
    cy.wait('@getProfilePage', {timeout: 8000}); 
    cy.contains("Menú de Perfil");
    cy.get(".buton-information").click();
    cy.contains("Editar Perfil").click();
    cy.window().then((window) => {
      const loggedInData = window.localStorage.getItem('isLogged');
      const { state } = JSON.parse(loggedInData);
  
      cy.request({
        method: 'PUT',
        url: 'http://localhost:3000/api/updateInfo',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.login.token}`
        },
        body: {
          data: {
            nombre_cliente: 'prueba3',
            apellido: 'usuario3',
            email: 'prueba3@prueba.com',
            telefono: '123456789'
          }
        },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.be.oneOf([401, 204,200]);
        console.log(res.status);
        console.log(res.message);
      });
    });

    
    cy.contains('Cambios guardados', { timeout: 10000 }).should('be.visible');

    cy.contains('Cerrar Sesión').click();

    cy.visit("http://localhost:3000/Sign-in");
    cy.get('#email').type('prueba3@prueba.com');
    cy.get('#password').type('12345');
    cy.get('button[type="submit"]').click();
    cy.wait(5000);
    cy.contains('Coffee Shop', { timeout: 10000 }).should('be.visible');


    
  });
  
    


  it("se muestra el historial de facturas", () => {
    cy.get(".card-brands").first().click();
    cy.intercept('GET', '**/Marcas-de-cafe/Oma*').as('getBrandPage');
  
  
    cy.wait('@getBrandPage', { timeout: 10000 }); 
  
    cy.url().should("include", "/Marcas-de-cafe/Oma");
  
    cy.contains("Oma");
  
    cy.get(".cart-counter").contains("0");
    cy.get(".card_product__cart").first().click();
    cy.get(".icon-cart-check").should('have.css', 'color', 'rgb(34, 197, 94)');
    cy.get(".cart-counter").contains("1");
    cy.get(".button-checkout").click();
  
    cy.contains("Productos");
    cy.contains("Total");
    cy.contains('Finalizar').click();
  
    cy.intercept('GET', '**/Pay/*').as('getPayPage');
    cy.wait('@getPayPage', { timeout: 13000 });
    cy.wait(15000);
    cy.contains("Menú de Perfil");
    cy.contains("Historial de Facturas")
    cy.wait(5000);
    cy.get(".bill").first().click();
    cy.intercept('GET', '**/Bill/*').as('getBillPage');
    cy.wait('@getBillPage', {timeout: 8000});
    cy.contains("Factura");
    cy.contains("Cantidad");
    cy.contains("Precio Unitario");
    cy.contains("Total");
    cy.contains("Descargar PDF")
  
  });

})

// iniciar sesión con credenciales incorrectas
describe("cuando se inicia sesión con credenciales incorrectas", () => {
  it("se muestra un mensaje de error", () => {
    cy.visit("http://localhost:3000/Sign-in");
    cy.get('#email').type('prueba@gprueba.com');
    cy.get('#password').type('12345');
    cy.get('button[type="submit"]').click();
    cy.wait(5000);
    cy.contains('Credenciales incorrectas', { timeout: 10000 }).should('be.visible');
  });

});