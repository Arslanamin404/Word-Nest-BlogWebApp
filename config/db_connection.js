import mongoose from "mongoose";

export const connect_mongo_db = async (URL) => {
  try {
    await mongoose.connect(URL);
    console.log("Connected to Database successfully");
  } catch (error) {
    console.error(error.message);
  }
};
