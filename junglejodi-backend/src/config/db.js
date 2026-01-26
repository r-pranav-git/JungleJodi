import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`🌲 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('Note: If you see ECONNREFUSED/querySrv, check your DNS or try the non-SRV connection string.');
        // Don't exit process so server can stay alive for non-DB routes
    }
};

export default connectDB;
