import mongoose from "mongoose";

export async function dbConnect() {
    const MONGO_URL = process.env.MONGO_URL;

    if (!MONGO_URL) {
        console.error('MONGO_URL is not defined');
        throw new Error('Please define the MONGO_URL environment variable');
    }

    try {
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
            retryWrites: true
        });
        console.log('✅ MongoDB Connection Successful');
        return null; // Indicate no error
    } catch (err: any) {
        console.error('❌ MongoDB Connection Error:', err.message);
        return err; // Return the error for handling
    }
}