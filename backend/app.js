import express from 'express';
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import { notFound, errorHandler} from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import adminRoutes from './routes/adminRoutes.js'
import { fileURLToPath } from 'url';
import path from 'path';
dotenv.config();

connectDB()
const port = process.env.PORT || 5000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin:"*"
  }))
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use('/golbalSearch/products', express.static(path.join(__dirname, '/public')));

app.use('/api/users',userRoutes)
app.use('/api/admin',adminRoutes)

app.get('/',(req,res) =>{
    res.send('server is Running')
})

app.use(notFound)
app.use(errorHandler);


app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
})