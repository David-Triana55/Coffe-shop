// DELIMITER //
// CREATE FUNCTION valor_producto_con_iva (precio DECIMAL(10,2))
// RETURNS DECIMAL(10,2)
// DETERMINISTIC 
// NO SQL 
// BEGIN
//  DECLARE  iva DECIMAL(10,2);
//  SET iva = precio + (precio * 0.19);
//  RETURN iva;
// END //

// DELIMITER ;

// select nombre_producto, precio, valor_producto_con_iva(precio) as valor_producto_iva 
// FROM productos;