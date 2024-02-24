import express from 'express';
import cors from 'cors';
// import intakeRoutes from './routes/intake.js'
import 'dotenv/config'
import dockets from './routes/dockets.js'
import intakes from './routes/intakes.js'

const app = express();
app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 5050;

// In order to parse body.
app.use(express.json());

// basic home route
app.get('/', (_req, res) => {
  res.send('Welcome to cellarhand api');
});

// all users routes
app.use('/api/dockets', dockets);
// app.use('/api/dockets/:id', intakes);
app.use('/api/intakes', intakes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});