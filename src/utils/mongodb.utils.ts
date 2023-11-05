import mongoose from "mongoose";

export const convertToMongooseId = (id: string): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId(id);
}