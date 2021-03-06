import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

const app = express();
const morgan = require('morgan');

import './db/db.js';

import userRoutes from './routes/userRoute';
import contactRoutes from './routes/contactRoute';

dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || 4200;

/* middlewares */
app.use(morgan('dev'));
app.use(express.json({limit: '200mb'}));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRoutes);
app.use('/api/contact', contactRoutes);

/* error handling middleware */
app.use((err, req, res, next) => {
    console.log('err is>>>', err);
    let statusCode;
    err.code ? statusCode = err.code : statusCode = 400;
    res.status(statusCode).json({ err });
})

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));