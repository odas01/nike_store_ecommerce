import express, { NextFunction, Request } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
const http = require('http');

import router from './routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/api', router);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const MONGOURL =
   process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/nikeshoes';

mongoose
   .connect(MONGOURL)
   .then(() => {
      console.log('Connect to MongoDB successfully!!!');
      server.listen(PORT, () =>
         console.log(`Server is listening on port ${PORT}`)
      );
   })
   .catch((err) => {
      console.log({ err });
      process.exit(1);
   });
