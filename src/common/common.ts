import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Common {
  @Field(type => ID)
  _id: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  createdBy?: String;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  updatedBy?: String;
}
