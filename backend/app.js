import express from 'express';
import dotenv from 'dotenv'
import connectDB from './config/db.js';
dotenv.config();



connectDB()
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.get('/', (req,res)=> res. send ('Server is Running'))

app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
})