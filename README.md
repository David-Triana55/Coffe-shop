Aquí tienes un ejemplo de markdown que incluye las instrucciones para levantar el proyecto usando `npm run dev` y `docker-compose up`:

# Instrucciones para levantar el proyecto

Este proyecto se puede levantar de dos maneras: utilizando `npm` o `Docker`.

## Opción 1: Usando npm

1. Asegúrate de tener Node.js instalado en tu máquina.
2. Ejecuta el siguiente comando para iniciar el proyecto en modo desarrollo:

   ```bash
   npm run dev
   ```

3. El servidor de desarrollo se levantará en el puerto configurado (usualmente `http://localhost:3000`).

## Opción 2: Usando Docker

1. Asegúrate de tener Docker y Docker Compose instalados en tu máquina.
2. En el directorio raíz del proyecto, ejecuta el siguiente comando para levantar los contenedores:

   ```bash
   docker-compose up
   ```

3. El proyecto estará disponible en el puerto configurado en el archivo `docker-compose.yml`.
```

Este markdown proporciona instrucciones claras para iniciar el proyecto tanto con npm como con Docker.
