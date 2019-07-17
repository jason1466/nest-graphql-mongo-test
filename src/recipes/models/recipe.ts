import { Field, ObjectType } from "type-graphql";
import { Common } from "../../common/common";

@ObjectType()
export class Recipe extends Common {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [String])
  ingredients: string[];
}
