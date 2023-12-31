// external imports
import express from 'express';
import colors from 'colors';
// local imports
import connectToDatabase from './config/db.js';
import { csvExport } from './controller/InemController.js';

// intialize app
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api endpoints
app.get('/export-data', csvExport);

const port = 3000;
const bootstrap = async () => {
  await connectToDatabase();
  app.listen(port, () => console.log(`Server is running on port ${port}`.yellow.bold));
};

bootstrap();
