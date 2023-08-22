import { Egg, Condition, Conditions } from "./Conditions.js";
import { Reducer } from "./Reducer.js";
import { reduceConditionDead } from "./Reducers/Dead.js";
import { reduceConditionEgg } from "./Reducers/Egg.js";
import { reduceConditionHungry } from "./Reducers/Hungry.js";
import { reduceConditionIdle } from "./Reducers/Idle.js";
import { reduceConditionPooping } from "./Reducers/Pooping.js";
import { reduceConditionSick } from "./Reducers/Sick.js";
import { reduceConditionUnhappy } from "./Reducers/Unhappy.js";
import { reduceConditionUnsanitary } from "./Reducers/Unsanitary.js";

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
    case Conditions.Dead:
      return reduceConditionDead(condition, influence);
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