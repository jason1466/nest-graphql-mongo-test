import { ICommon } from "../../common/common.interface";

export interface IRecipe extends ICommon {
  readonly title: string;
  readonly description: string;
  readonly ingredients: string[];
}
