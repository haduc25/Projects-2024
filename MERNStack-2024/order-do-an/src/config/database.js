const { mongoose } = require('mongoose');

const mongodbUrl =
    'mongodb+srv://duchm25:abcd1234@cluster0.sfcx0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function connectDB() {
    return mongoose.connect(mongodbUrl);
}

module.exports = connectDB;
