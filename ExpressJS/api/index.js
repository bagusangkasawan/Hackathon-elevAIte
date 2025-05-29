const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const swaggerDocument = require('../public/swagger.json');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
