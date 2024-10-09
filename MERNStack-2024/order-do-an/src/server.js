const { app } = require('./index.js');
const connectDB = require('./config/database.js');

const PORT = 5454;
app.listen(PORT, async () => {
    await connectDB().then(() => console.log('connected'));
    console.log('Server listening on port', PORT);
});
