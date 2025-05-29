const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const serverless = require('serverless-http');
const dotenv = require('dotenv');

dotenv.config();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000/api';

const app = express();

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
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = serverless(app);
