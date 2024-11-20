import express from 'express';
import cors from 'cors';
// import 'dotenv/config';
// import { connectDB111 } from './config/database2.js';
// import foodRouter from './routes/foodRoute.js';
// import userRouter from './routes/userRoute.js';
// import cartRouter from './routes/cartRoute.js';
// import orderRouter from './routes/orderRoute.js';

const app = express();
const PORT = 6868;

// Middleware
app.use(express.json());
app.use(cors());

// db connection
// connectDB111();

// api endpoints
// app.use('/api/food', foodRouter);
// app.use('/images', express.static('uploads'));
// app.use('/api/user', userRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
