const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 5050;

// In order to parse body.
app.use(express.json());

// basic home route
app.get('/', (req, res) => {
  res.send('Welcome to cellarhand api');
});

const docketRoutes = require('./routes/docket-routes');
const intakeRoutes = require('./routes/intake-routes');

// all users routes
app.use('/api/docket', docketRoutes);
app.use('/api/intake', intakeRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});