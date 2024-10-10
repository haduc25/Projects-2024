import express from 'express';
import cors from 'cors';
import { connectDB111 } from './config/database2.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config';

const app = express();
const PORT = 5200;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB111();

// api endpoints
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
