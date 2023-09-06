import { Sick, Hungry, Unhappy, Idle, Hibernating, Conditions } from "../Conditions.js"
import { Reducer } from "../Reducer.js";
import { Influences } from "../Influences.js";
import { SIMULATION_THRESHOLD_EXPIRY, SIMULATION_THRESHOLD_HUNGER, SIMULATION_THRESHOLD_UNHAPPY } from "../Constants.js";
import { reduceConditionGenericTick } from "./Generic.js";

export const reduceConditionSick: Reducer<Sick> = (condition, influence) => {
  switch (influence.with) {
    case Influences.Medicine:
      if (condition.hunger < SIMULATION_THRESHOLD_HUNGER) {
        return <Hungry> {
          ...condition,
          is: Conditions.Hungry,
          ticks: 0,
        };
      } else if (condition.happiness < SIMULATION_THRESHOLD_UNHAPPY) {
        return <Unhappy> {
          ...condition,
          is: Conditions.Unhappy,
          ticks: 0,
        };
      } else {
        return <Idle> {
          ...condition,
          is: Conditions.InGoodHealth,
          ticks: 0,
        };
      }

    case Influences.Time:
      if (condition.ticks >= SIMULATION_THRESHOLD_EXPIRY) {
        return <Hibernating> {
          ...condition,
          is: Conditions.Hibernating,
          timeOfHibernation: Date.now(),
          ticks: 0,
        };
      } else {
        return reduceConditionGenericTick(condition, influence);
      }

    default:
      return condition;
  }
};
