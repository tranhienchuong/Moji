import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('connect to database success!');
    } catch (error) {
        console.log('connect to database fail:', error);
        process.exit(1);
    }
}