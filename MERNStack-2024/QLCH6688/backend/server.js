import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import productRouter from './routes/productRoute.js';
// import 'dotenv/config';

const app = express();
const PORT = 6868;

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

// API Endpoint
app.use('/api/sanpham', productRouter);
app.use('/images', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
