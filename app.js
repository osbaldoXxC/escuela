import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRouter from './src/routers/auth.router.js';
import eventRouter from './src/routers/event.router.js'; // Añadir esta línea
import newsRouter from './src/routers/news.router.js';
import teacherRouter from './src/routers/teacher.router.js';

const app = express();
import dotenv from 'dotenv';
dotenv.config();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRouter);

app.use('/api/events', eventRouter);
app.use('/api/news', newsRouter); // // Añadir esta línea
app.use('/api/teachers', teacherRouter);
export default app;