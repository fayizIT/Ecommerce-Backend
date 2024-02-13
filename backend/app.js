import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { notFound, errorHandler} from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';


dotenv.config();

// Check if MongoDB URI is defined
if (!process.env.MONGO_URI) {
    console.error('MongoDB URI is not defined.');
    process.exit(1);
}




connectDB()
const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin:"*"
  }))

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static('backend/public'));

app.use('/api/users',userRoutes)
app.use('/api/admin',adminRoutes)

app.get('/', (req,res)=> res. send ('Server is Running'))


app.use(notFound)
app.use(errorHandler);

app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
})