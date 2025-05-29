const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const swaggerUiDist = require('swagger-ui-dist');
const dotenv = require('dotenv');

dotenv.config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000/api';

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
  // 1. Serve swagger-ui static assets on a custom path
  const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath();
  app.use('/api/docs-assets', express.static(swaggerUiPath));

  // 2. Customize Swagger UI with correct asset path
  app.use('/api/docs', (req, res, next) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Swagger UI</title>
        <link href="/api/docs-assets/swagger-ui.css" rel="stylesheet">
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="/api/docs-assets/swagger-ui-bundle.js"></script>
        <script src="/api/docs-assets/swagger-ui-standalone-preset.js"></script>
        <script>
          const ui = SwaggerUIBundle({
            url: '/api-docs-json',
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout"
          });
        </script>
      </body>
      </html>
    `);
  });

  // 3. Serve JSON spec separately
  app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = setupSwagger;
