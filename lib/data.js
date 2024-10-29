import { sql } from '@vercel/postgres'

// obtener los productos por id de la base de datos

export async function getProductById (id) {
  try {
    const productos = await sql`SELECT *, valor_producto_con_iva(precio) as valor_producto_iva FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria WHERE productos.id_producto = ${id}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener los productos por marca de la base de datos

export async function getProductByBrand (brand) {
  try {
    const productos = await sql`SELECT id_producto, nombre_producto, imagen, descripcion, precio,  valor_producto_con_iva(precio) as valor_producto_iva FROM productos INNER JOIN marcas ON productos.id_marca = marcas.id_marca WHERE marcas.nombre_marca = ${brand}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener los productos por categoria de la base de datos

export async function getProductByCategory (category) {
  try {
    const productos = await sql`SELECT id_producto, nombre_producto, imagen, descripcion, precio, nombre_categoria, valor_producto_con_iva(precio) as valor_producto_iva  FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria WHERE categorias.nombre_categoria = ${category}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

// insertar un nuevo cliente en la base de datos

export async function registerUser (name, lastName, number, password, email) {
  try {
    const user = await sql`INSERT INTO clientes (nombre_cliente, apellido, telefono, password, email) VALUES (${name}, ${lastName}, ${number}, ${password}, ${email}) RETURNING *`
    return user.rows
  } catch (error) {
    console.log(error)
  }
}

// verificar si un usuario existe en la base de datos

export async function loginUser (email, password) {
  try {
    const user = await sql`SELECT * FROM clientes WHERE email = ${email}`
    return user.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener las marcas de la base de datos

export async function getBrands () {
  try {
    const brands = await sql`SELECT * FROM marcas`
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener los accesorios principales de la base de datos

export async function getAccesoriesPrincipal () {
  try {
    const accesories = await sql`SELECT * FROM categorias WHERE id_categoria >= 4 ORDER BY id_categoria ASC`
    return accesories.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener la informacion del cliente de la base de datos

export async function getClientInfo (id) {
  try {
    const clientInfo = await sql`SELECT  nombre_cliente, apellido, email, telefono FROM clientes WHERE id_cliente = ${id}`
    return clientInfo.rows[0]
  } catch (error) {
    console.log(error)
  }
}

// actualizar la informacion del cliente de la base de datos

export async function updateInfo (id, nombre, apellido, email, telefono) {
  try {
    const update = await sql`UPDATE clientes SET nombre_cliente = ${nombre}, apellido = ${apellido}, email = ${email}, telefono = ${telefono} WHERE id_cliente = ${id}`

    return update.rows
  } catch (error) {
    console.log(error)
  }
}

// insertar un nuevo bill en la base de datos

export async function insertBill (id, fecha) {
  try {
    const bill = await sql`INSERT INTO facturas (id_cliente, fecha) VALUES (${id},${fecha}) RETURNING *`
    return bill.rows
  } catch (error) {
    console.log(error)
  }
}

export async function detailBill (idBill, idProduct, quantity, price) {
  try {
    const bill = await sql`INSERT INTO detalle_factura (id_factura, id_producto, cantidad, precio_unitario) VALUES (${idBill}, ${idProduct}, ${quantity}, ${price}) `
    return bill.rows
  } catch (error) {
    console.log(error)
  }
}

//

export async function detailBillById (idFactura) {
  try {
    const res = await sql`SELECT f.*, c.*, SUM(df.cantidad * df.precio_unitario) AS total FROM detalle_factura df INNER JOIN facturas f ON df.id_factura = f.id_factura INNER JOIN clientes c ON f.id_cliente = c.id_cliente WHERE f.id_factura = ${idFactura} GROUP BY f.id_factura, c.id_cliente;`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

//

export async function getProductsByBill (idFactura) {
  try {
    const res = await sql`SELECT * FROM detalle_factura INNER JOIN productos ON detalle_factura.id_producto = productos.id_producto WHERE id_factura = ${idFactura}`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function historyBill (idFactura) {
  try {
    const res = await sql`SELECT facturas.id_factura ,facturas.fecha, SUM(detalle_factura.cantidad * detalle_factura.precio_unitario) as total FROM facturas  INNER JOIN detalle_factura  ON facturas.id_factura = detalle_factura.id_factura WHERE id_cliente = ${idFactura} GROUP BY facturas.id_factura;`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}
