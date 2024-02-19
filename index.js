import express from 'express';
import cors from 'cors';
// import intakeRoutes from './routes/intake.js'
import 'dotenv/config'
import docketRoutes from './routes/docket.js'

const app = express();
app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 5050;

// In order to parse body.
app.use(express.json());

// basic home route
app.get('/', (req, res) => {
  res.send('Welcome to cellarhand api');
});

// all users routes
app.use('/api/docket', docketRoutes);
// app.use('/api/intake', intakeRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});