import * as mongoose from "mongoose";

export const CommonSchema = new mongoose.Schema(
  {
    id: String,
    createdAt: Date,
    createdBy: String,
    updatedAt: Date,
    updatedBy: String
  },
  { discriminatorKey: "_type" }
);
