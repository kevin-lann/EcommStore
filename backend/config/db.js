import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connect(process.env.DATABASE_URI)
        console.log("Connected to database ☑️")
    }catch(err) {
        console.error(err)
        process.exit(1)
    }
}

export default connectDB