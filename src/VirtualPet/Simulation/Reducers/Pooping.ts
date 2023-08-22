import { Pooping, Hungry, Unhappy, Idle, Unsanitary, Conditions } from "../Conditions.js";
import { Reducer } from "../Reducer.js";
import { Influences } from "../Influences.js";
import { clamp } from "../../math.js";
import { SIMULATION_THRESHOLD_HUNGER, SIMULATION_THRESHOLD_UNHAPPY, SIMULATION_THRESHOLD_EXPIRY } from "../Constants.js";

export const reduceConditionPooping: Reducer<Pooping> = (condition, influence) => {
  switch (influence.with) {
    case Influences.GoToBathroom: {
      // todo remove discipline++ magic number
      if (SIMULATION_THRESHOLD_HUNGER >= condition.hunger) {
        return <Hungry> {
          ...condition,
          is: Conditions.Hungry,
          ticks: 0,
          discipline: clamp(condition.discipline + 10, 0, 100),
        };
      } else if (SIMULATION_THRESHOLD_UNHAPPY >= condition.happiness) {
        return <Unhappy> {
          ...condition,
          is: Conditions.Unhappy,
          ticks: 0,
          discipline: clamp(condition.discipline + 10, 0, 100),
        };
      } else {
        return <Idle> {
          ...condition,
          is: Conditions.InGoodHealth,
          ticks: 0,
          discipline: clamp(condition.discipline + 10, 0, 100),
        };
      }
    }

    case Influences.WelfareTick: {
      const happiness = clamp(condition.happiness - influence.happiness, 0, 100);
      const hunger = clamp(condition.hunger - influence.hunger, 0, 100);
      const discipline = clamp(condition.discipline - influence.discipline, 0, 100);

      if (condition.ticks >= SIMULATION_THRESHOLD_EXPIRY) {
        return <Unsanitary> {
          ...condition,
          is: Conditions.Unsanitary,
          ticks: 0,
          discipline: discipline - 10, // todo remove magic number
          happiness: happiness,
          hunger: hunger,
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

    default: {
      return condition;
    }
  }
};
