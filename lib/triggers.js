// Trigger para actualizar el stock del producto cuando se agrega un producto a la factura

// CREATE TRIGGER disminuir_stock
// AFTER INSERT ON Detalle_factura
// FOR EACH ROW
// BEGIN
//   -- Disminuir el stock actual del producto según la cantidad comprada
//   UPDATE productos
//   SET stock = stock - NEW.cantidad
//   WHERE productos.Id_producto = NEW.Id_producto;
// END;
