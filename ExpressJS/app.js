const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const setupSwagger = require('./swagger');
const serverless = require('serverless-http');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
setupSwagger(app);

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/checkin', checkinRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
module.exports.handler = serverless(app);
