
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
const conn = await mongoose.connect(process.env.DB_URI);
console.log(`Database connected ${conn.connection.host}`);
    } catch (error) {
console.error("Error connectiong to database", error);
process.exit(1);
    }
}
