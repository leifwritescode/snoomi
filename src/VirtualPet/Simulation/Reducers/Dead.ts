import { Dead } from "../Conditions.js";
import { Reducer } from "../Reducer.js";
import { Influences } from "../Influences.js";
import { reduceConditionGenericTick } from "./Generic.js";

// dead pets cannot transition to any other condition, but can tick
export const reduceConditionDead: Reducer<Dead> = (condition, influence) => {
  switch (influence.with) {
    case Influences.Time:
      return reduceConditionGenericTick(condition, influence);

    default:
      return condition;
  }
};
