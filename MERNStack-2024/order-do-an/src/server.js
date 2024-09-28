const { app } = require('.');
const connectDB = require('./config/database.js');

const PORT = 5454;
app.listen(PORT, async () => {
    await connectDB();
    console.log('Server listening on port', PORT);
});
