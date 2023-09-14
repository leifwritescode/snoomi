import { Egg, Condition, Conditions } from "./Conditions.js";
import { Reducer } from "./Reducer.js";
import { reduceConditionHibernating } from "./reducers/Hibernating.js";
import { reduceConditionEgg } from "./reducers/Egg.js";
import { reduceConditionHungry } from "./reducers/Hungry.js";
import { reduceConditionIdle } from "./reducers/Idle.js";
import { reduceConditionPooping } from "./reducers/Pooping.js";
import { reduceConditionSick } from "./reducers/Sick.js";
import { reduceConditionUnhappy } from "./reducers/Unhappy.js";
import { reduceConditionUnsanitary } from "./reducers/Unsanitary.js";

/**
 * {@link Condition} reducer
 * @param {SimulationAction} influence the influence
 * @param {Condition} condition the condition
 * @returns a new {@link Condition} made by applying {@link influence} to {@link condition}, or {@link condition} if no transition occurs
 */
export const reduce: Reducer<Condition> = (condition, influence) => {
  switch (condition.is) {
    case Conditions.InEgg:
      return reduceConditionEgg(condition, influence);
    case Conditions.InGoodHealth:
      return reduceConditionIdle(condition, influence);
    case Conditions.Sick:
      return reduceConditionSick(condition, influence);
    case Conditions.Hungry:
      return reduceConditionHungry(condition, influence);
    case Conditions.Pooping:
      return reduceConditionPooping(condition, influence);
    case Conditions.Unsanitary:
      return reduceConditionUnsanitary(condition, influence);
    case Conditions.Unhappy:
      return reduceConditionUnhappy(condition, influence);
    case Conditions.Hibernating:
      return reduceConditionHibernating(condition, influence);
    default:
      return condition;
  }
}

export const initialCondition:{():Condition} = () => {
  return <Egg> {
    is: Conditions.InEgg,
    happiness: 100,
    hunger: 100,
    discipline: 50
  };
}