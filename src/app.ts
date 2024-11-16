import cors from 'cors';
import express, { Application } from 'express';
import routers from './app/routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routers);

export default app;
