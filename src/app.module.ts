import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { RecipesModule } from "./recipes/recipes.module";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { AzureB2CStrategy } from "./common/azure.b2c.strategy";

@Module({
  imports: [
    PassportModule,
    MongooseModule.forRoot(
      "mongodb://teamwiz:IEht4GjHsalkD8ME52wdHBQHzpl9WiW2by5XqF3rc5eAEyXuN2CgPNEEc1eR80pErkhBvA9svK7hRcGybnzp9w==@teamwiz.documents.azure.com:10255/?ssl=true&replicaSet=globaldb",
      {
        dbName: "Test",
        useNewUrlParser: true
      }
    ),
    RecipesModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: "schema.gql",
      context: ({ req }) => ({ req }),
    })
  ],
  providers: [AzureB2CStrategy]
})
export class ApplicationModule {}
