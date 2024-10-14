# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo el package.json y package-lock.json (si lo tienes)
COPY package.json ./
COPY package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]
