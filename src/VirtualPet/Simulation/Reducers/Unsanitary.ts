import { Unsanitary, Hungry, Unhappy, Idle, Sick, Conditions } from "../Conditions.js";
import { Reducer } from "../Reducer.js";
import { Influences } from "../Influences.js";
import { clamp } from "../../math.js";
import { SIMULATION_THRESHOLD_EXPIRY, SIMULATION_THRESHOLD_HUNGER, SIMULATION_THRESHOLD_UNHAPPY } from "../../constants.js";

export const reduceConditionUnsanitary: Reducer<Unsanitary> = (condition, influence) => {
  switch (influence.with) {
    case Influences.WelfareTick: {
      const happiness = clamp(condition.happiness - influence.happiness, 0, 100);
      const hunger = clamp(condition.hunger - influence.hunger, 0, 100);
      const discipline = clamp(condition.discipline - influence.discipline, 0, 100);

      if (condition.ticks >= SIMULATION_THRESHOLD_EXPIRY) {
        return <Sick> {
          ...condition,
          is: Conditions.Sick,
          ticks: 0,
          happiness: happiness,
          hunger: hunger,
          discipline: discipline
        };
      } else {
        return {
          ...condition,
          ticks: condition.ticks + 1,
          happiness: happiness,
          hunger: hunger,
          discipline: discipline
        };
      }
    }

    case Influences.Clean: {
      if (SIMULATION_THRESHOLD_HUNGER >= condition.hunger) {
        return <Hungry> {
          ...condition,
          is: Conditions.Hungry,
          ticks: 0,
        };
      } else if (SIMULATION_THRESHOLD_UNHAPPY >= condition.happiness) {
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
    }
 
    default: {
      return condition;
    }
  }
};
