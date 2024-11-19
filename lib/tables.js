
// -- Crear la tabla clientes
// CREATE TABLE clientes (
//     id_cliente SERIAL PRIMARY KEY,
//     nombre_cliente VARCHAR(50),
//     apellido VARCHAR(50),
//     email VARCHAR(100),
//     password TEXT,
//     telefono VARCHAR(20)
// );

// -- Crear la tabla marcas
// CREATE TABLE marcas (
//     id_marca SERIAL PRIMARY KEY,
//     nombre_marca VARCHAR(100)
// );

// -- Crear la tabla categorias
// CREATE TABLE categorias (
//     id_categoria SERIAL PRIMARY KEY,
//     nombre_categoria VARCHAR(100)
// );

// -- Crear la tabla productos
// CREATE TABLE productos (
//     id_producto SERIAL PRIMARY KEY,
//     id_marca INT,
//     id_categoria INT,
//     nombre_producto VARCHAR(100),
//     imagen VARCHAR(255),
//     descripcion TEXT,
//     precio DECIMAL(10, 2),
//     stock INT,
//     FOREIGN KEY (id_marca) REFERENCES marcas(id_marca),
//     FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
// );

// -- Crear la tabla facturas
// CREATE TABLE facturas (
//     id_factura SERIAL PRIMARY KEY,
//     id_cliente INT,
//     fecha DATE,
//     FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
// );

// -- Crear la tabla detalle_factura
// CREATE TABLE detalle_factura (
//     id_detalle_factura SERIAL PRIMARY KEY,
//     id_factura INT,
//     id_producto INT,
//     cantidad INT,
//     precio_unitario DECIMAL(10, 2),
//     FOREIGN KEY (id_factura) REFERENCES facturas(id_factura),
//     FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
// );

