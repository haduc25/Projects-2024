import mongoose from 'mongoose';
const mongodbUrl = 'mongodb+srv://admin:admin@cluster0.s1wyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// const uri = 'mongodb+srv://duc25:abcd1234@food01.67cgq.mongodb.net/?retryWrites=true&w=majority&appName=food01';
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export const connectDB = async () => {
    try {
        // await mongoose.connect(
        //     'mongodb+srv://duc25:abcd1234@food01.67cgq.mongodb.net/foodDB?retryWrites=true&w=majority&appName=food01',
        // );
        // console.log('DB connected successfully');

        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
    console.log('123');
};
