import express from 'express';
import cors from 'cors';
import { connectDB111 } from './config/database2.js';

const app = express();
const PORT = 5200;

app.use(express.json());
app.use(cors());

connectDB111();

app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Sử dụng routes
// app.use('/api', itemRoutes);

// app.listen(PORT, async () => {
//     await connectDB().then(() => console.log('connected'));
//     console.log('Server listening on port', PORT);
// });
