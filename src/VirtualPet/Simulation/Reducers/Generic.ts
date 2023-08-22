import { Condition } from "../Conditions.js";
import { Reducer } from "../Reducer.js";

export const reduceConditionGenericTick: Reducer<Condition> = (condition, _) => {
  const ticks = condition.ticks + 1;
  return <Condition> {
    ...condition,
    ticks: ticks
  };
};
