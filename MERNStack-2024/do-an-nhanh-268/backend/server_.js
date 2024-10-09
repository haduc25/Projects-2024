import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// app config
const app = express();
const port = 5000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
// const uri = 'mongodb+srv://admin:admin@cluster0.s1wyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const uri = 'mongodb+srv://duchm25:abcd1234@cluster0.sfcx0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose
    .connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

// basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
