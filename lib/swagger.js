// lib/swagger.js
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Next.js con Swagger',
      version: '1.0.0',
      description: 'Documentación de la API usando Swagger en Next.js'
    },
    servers: [
      {
        url: `${process.env.NEXT_PUBLIC_API_URL}/api`
      }
    ]
  },
  apis: ['./app/api/**/*.js']
}

export const swaggerSpec = swaggerJsdoc(options)
