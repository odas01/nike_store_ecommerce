import express, { NextFunction, Request } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

import router from './routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(
   '/api',
   (req: Request, _, next: NextFunction) => {
      setTimeout(() => {
         next();
      }, 1000);
   },
   router
);

const PORT = process.env.PORT || 3000;
const MONGOURL =
   process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/nikeshoes';

mongoose
   .connect(MONGOURL)
   .then(() => {
      console.log('Connect to MongoDB successfully!!!');
      app.listen(PORT, () =>
         console.log(`Server is listening on port ${PORT}`)
      );
   })
   .catch((err) => {
      console.log({ err });
      process.exit(1);
   });
