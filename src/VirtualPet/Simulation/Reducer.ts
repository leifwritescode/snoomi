import { Condition } from "./Conditions.js";
import { Influence } from "./Influences.js";

export type Reducer<T extends Condition> = (condition: T, influence: Influence) => Condition;
