import mongoose from "mongoose";
import dotnev from 'dotenv';

//CONFIGURATION ENVIRONMENT VARIABLES
dotnev.config();

export const connectDB = async () => {

    //working with database using mongoose third-party library
await mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
})
}