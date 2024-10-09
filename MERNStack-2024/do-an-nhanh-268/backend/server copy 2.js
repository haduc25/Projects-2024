const express = require('express');
const app = express();
const cors = require('cors');
// const itemRoutes = require('./routes/itemRoutes.js'); // Đảm bảo đường dẫn đúng

const connectDB = require('./config/database.js');

app.use(cors());

// Sử dụng routes
// app.use('/api', itemRoutes);

const PORT = 5100;
app.listen(PORT, async () => {
    await connectDB().then(() => console.log('connected'));
    console.log('Server listening on port', PORT);
});
