const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

dotenv.config();
const SERVER_URL = process.env.SERVER_URL;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mood Check-in API',
      version: '1.0.0',
      description: 'API untuk login, register, daily check-in dengan analisis mood dan rekomendasi aktivitas',
    },
    servers: [
      {
        url: SERVER_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
