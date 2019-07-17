import { NotFoundException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "apollo-server-express";
import { NewRecipeInput } from "./dto/new-recipe.input";
import { RecipeInput } from "./dto/recipe.input";
import { RecipesArgs } from "./dto/recipes.args";
import { Recipe } from "./models/recipe";
import { RecipesService } from "./recipes.service";

const pubSub = new PubSub();

@Resolver(of => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Query(returns => Recipe)
  async recipe(@Args("id") id: string): Promise<Recipe> {
    const recipe = await this.recipesService.findOneById(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    return recipe;
  }

  @Query(returns => [Recipe])
  recipes(@Args() recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return this.recipesService.findAll(recipesArgs);
  }

  @Mutation(returns => Recipe)
  async addRecipe(@Args("recipe") recipe: NewRecipeInput): Promise<Recipe> {
    const newRecipe = await this.recipesService.create(recipe);
    pubSub.publish("recipeAdded", { recipeAdded: newRecipe });
    return newRecipe;
  }

  @Mutation(returns => Recipe)
  async updateRecipe(@Args("recipe") recipe: RecipeInput): Promise<Recipe> {
    const updatedRecipe = await this.recipesService.update(recipe);
    pubSub.publish("recipeUpdated", { recipeUpdated: updatedRecipe });
    return updatedRecipe;
  }

  @Mutation(returns => Boolean)
  async removeRecipe(@Args("id") id: string) {
    return this.recipesService.remove(id);
  }

  @Subscription(returns => Recipe)
  recipeAdded() {
    return pubSub.asyncIterator("recipeAdded");
  }

  @Subscription(returns => Recipe)
  recipeUpdated() {
    return pubSub.asyncIterator("recipeUpdated");
  }
}
