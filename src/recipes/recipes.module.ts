import { Module } from "@nestjs/common";
import { DateScalar } from "../common/scalars/date.scalar";
import { RecipesResolver } from "./recipes.resolver";
import { RecipesService } from "./recipes.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonSchema } from "../common/common.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Common", schema: CommonSchema, collection: "alldata" }
    ])
  ],
  providers: [RecipesResolver, RecipesService, DateScalar]
})
export class RecipesModule {}
