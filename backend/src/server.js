import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import { connectDB } from './libs/db.js';



const app = express();
const PORT = process.env.PORT || 5001;

// middlewares

app.use(express.json())

connectDB().then( () => {
app.listen(PORT, () => {
    console.log(`server start on ${PORT}`);
});
});

