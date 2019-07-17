import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RecipeSchema } from "./models/recipe.schema";
import { ICommon } from "../common/common.interface";
import { IRecipe } from "./models/recipe.interface";
import { RecipesArgs } from "./dto/recipes.args";
import { NewRecipeInput } from "./dto/new-recipe.input";
import { RecipeInput } from "./dto/recipe.input";
import { Recipe } from "./models/recipe";

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel("Common") private readonly commonModel: Model<ICommon>
  ) {}

  recipeModel = this.commonModel.discriminator<IRecipe>("Recipe", RecipeSchema);

  async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return await this.recipeModel
      .find()
      // .exec()
      .then(recipes => {
        console.log("Recipe count: ", recipes.length);
        return recipes;
      });
  }

  async findOneById(id: string): Promise<Recipe> {
    return await this.recipeModel
      .findById(id)
      // .exec()
      .then(recipe => {
        if (recipe) {
          console.log("createdAt UTC: ", recipe.createdAt.toUTCString());
        }
        return recipe;
      });
  }

  async create(createRecipeDto: NewRecipeInput): Promise<Recipe> {
    const createdRecipe: IRecipe = new this.recipeModel({
      ...createRecipeDto,
      createdAt: new Date(),
      createdBy: null,
      updatedAt: new Date(),
      updatedBy: null
    });
    return await createdRecipe.save();
  }

  async update(updateRecipeDto: RecipeInput): Promise<Recipe> {
    const originalRecipe: IRecipe = await this.recipeModel
      .findById(updateRecipeDto._id)
      // .exec()
      .then(recipe => {
        console.log("createdAt UTC: ", recipe.createdAt.toUTCString());
        return recipe;
      });
    await originalRecipe.updateOne({
      ...updateRecipeDto,
      updatedAt: new Date(),
      updatedBy: null
    });
    return await this.recipeModel
      .findById(updateRecipeDto._id)
      // .exec()
      .then(recipe => {
        console.log("updatedAt UTC: ", recipe.updatedAt.toUTCString());
        return recipe;
      });
  }

  async remove(id: string): Promise<boolean> {
    return await this.recipeModel
      .deleteOne({ _id: id })
      .then(isDeleted => isDeleted.ok > 0);
  }
}
