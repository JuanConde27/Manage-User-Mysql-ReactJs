import express from 'express';
import cors from 'cors';
import db from './src/databse/db.js';
import usersRoutes from './src/routes/UsersRoutes.js';
import dotenv from 'dotenv';
import errorHandler from './src/middleware/error.handler.js';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use('/api', usersRoutes);

app.use('/static', express.static(path.join(import.meta.url.split('/').slice(3, -1).join('/'), 'src/static')));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});
