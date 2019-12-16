import express, { Application } from 'express';
import morgan from 'morgan';
import userRoutes from './routes/user';
import bodyParser from 'body-parser';
import requestRoutes from './routes/request';

const app: Application = express();

app.set('port', 3001);

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Rutas
app.use('/api', userRoutes);
app.use('/api', requestRoutes);

export default app;