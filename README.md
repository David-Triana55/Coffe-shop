
# Ecommerce de Cafés Especiales

## Descripción del Proyecto
Este proyecto es un ecommerce diseñado para ofrecer una experiencia optimizada en la compra de cafés especiales y sostenibles. Permite a los usuarios explorar productos, gestionar su carrito, y realizar simulaciones de compra mientras mantiene control sobre inventarios y datos de facturación.

## Integrantes del Equipo
- David Triana

## Tecnologías Utilizadas
### Frontend
- **Next.js:** Framework de React para renderizado dinámico y fluido.
- **Gestión de Estado:** Zustand con persistencia para el manejo eficiente del carrito.

### Backend y Base de Datos
- **Node.js y Express.js:** Para la creación de endpoints y lógica del servidor.
- **PostgreSQL:** Base de datos relacional con triggers y funciones personalizadas para el control de inventarios y cálculos de facturación.

### Autenticación y Seguridad
- **JWT (JSON Web Tokens):** Para manejo de sesiones.
- **bcrypt:** Para encriptación segura de contraseñas.

### Infraestructura
- **Vercel:** Plataforma para despliegue y gestión del entorno.

   
Aquí tienes un ejemplo de markdown que incluye las instrucciones para levantar el proyecto usando `npm run dev` y `docker-compose up`:

```bash
    git clone https://github.com/David-Triana55/Coffe-shop.git
```

## Opción 1: Usando npm

1. Asegúrate de tener Node.js instalado en tu máquina.
2. Instala las dependencias
    ```bash
   npm install
   ```
4. Ejecuta el siguiente comando para iniciar el proyecto en modo desarrollo:

   ```bash
   npm run dev
   ```

5. El servidor de desarrollo se levantará en el puerto configurado (usualmente `http://localhost:3000`).

## Opción 2: Usando Docker

1. Asegúrate de tener Docker y Docker Compose instalados en tu máquina.
2. En el directorio raíz del proyecto, ejecuta el siguiente comando para levantar los contenedores:

   ```bash
   docker-compose up
   ```

## Características Principales
- **Gestión de Carrito:** Persistencia en cliente mediante Zustand.
- **Facturación Simulada:** Cálculo automatizado de IVA y totales.
- **Control de Inventario:** Actualización automática mediante triggers.
- **Páginas Dinámicas:** Rutas basadas en categorías.
- **Autenticación:** Inicio de sesión y registro con tokens JWT.
- **Responsive Design:** Optimización para móviles y tabletas.

## Flujo de Datos
1. **Exploración de Productos:** Consultas dinámicas para cargar productos por categoría.
2. **Gestión de Carrito:** Persistencia local y sincronización en tiempo real.
3. **Simulación de Compra:** Facturación y actualización de inventarios tras completar el checkout.
4. **Perfil del Usuario:** Modificación de datos y consulta de historial.

## Enlace del Proyecto
[Demo en Producción](https://www.coffeshop.online/)

## Buenas Prácticas
- **Optimización SQL:** Uso de índices en columnas clave.
- **Seguridad de Datos:** Consultas preparadas y cifrado de contraseñas.
- **Caché:** Implementación en el cliente para mejorar la velocidad de carga.

