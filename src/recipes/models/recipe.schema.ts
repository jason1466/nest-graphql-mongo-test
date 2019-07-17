import * as mongoose from "mongoose";

export const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: Array<String>()
});
