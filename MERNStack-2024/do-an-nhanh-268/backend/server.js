import express from 'express';
import cors from 'cors';
import { connectDB111 } from './config/database2.js';
import foodRouter from './routes/foodRoute.js';

const app = express();
const PORT = 5200;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB111();

// api endpoint
app.use('/api/food', foodRouter);

app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
