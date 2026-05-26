import mongoose from "mongoose";

const URL = process.env.MONGO_URL;
const connectDB = async () => {
  await mongoose.connect(URL);
  console.log("DB Connected");
};

export default connectDB;
