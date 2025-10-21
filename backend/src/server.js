import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js'



const app = express();
const PORT = process.env.PORT || 5001;

// middlewares

app.use(express.json())

// public routes
app.use('/api/auth', authRoute);

//private routes


connectDB().then( () => {
app.listen(PORT, () => {
    console.log(`server start on ${PORT}`);
});
});

