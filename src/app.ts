import cors from 'cors';
import express, { Application } from 'express';
import routers from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routers);

app.use(globalErrorHandler);
export default app;
