import { IsOptional, Length, MaxLength } from "class-validator";
import { Field, InputType, ID } from "type-graphql";

@InputType()
export class RecipeInput {
  @Field(type => ID)
  _id: string;

  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(30, 255)
  description?: string;

  @Field(type => [String])
  ingredients: string[];
}
