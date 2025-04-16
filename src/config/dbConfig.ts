import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config()
const MONGO_URI =  process.env.MONGODB_URI as string
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

export default connectDB;