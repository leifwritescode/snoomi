import { Dead } from "../Conditions.js";
import { Reducer } from "../Reducer.js";
import { Influences } from "../Influences.js";
import { reductiConditionGenericTick } from "./Generic.js";

// dead pets cannot transition to any other condition, but can tick
export const reduceConditionDead: Reducer<Dead> = (condition, influence) => {
  switch (influence.with) {
    case Influences.WelfareTick:
      return reductiConditionGenericTick(condition, influence);

    default:
      return condition;
  }
};
