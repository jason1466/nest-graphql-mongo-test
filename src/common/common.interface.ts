import { Document } from "mongoose";

export interface ICommon extends Document {
  readonly _id: string;
  readonly createdAt: Date;
  readonly createdBy: string;
  readonly updatedAt: Date;
  readonly updatedBy: string;
}
