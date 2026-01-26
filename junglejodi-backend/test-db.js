import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing connection to:', process.env.MONGODB_URI);

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('SUCCESS');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE');
        console.error(err);
        process.exit(1);
    }
};

test();
