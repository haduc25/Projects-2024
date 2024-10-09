import mongoose from 'mongoose';
const mongodbUrl = 'mongodb+srv://admin:admin@cluster0.s1wyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB111 = async () => {
    try {
        await mongoose.connect(mongodbUrl).then(() => console.log('DB is connected'));
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};
