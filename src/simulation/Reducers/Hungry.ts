import { Idle, Unhappy, Sick, Hungry, Conditions } from "../Conditions.js";
import { Reducer } from "../Reducer.js";
import { Influences } from "../Influences.js";
import { clamp } from "../../math.js";
import { SIMULATION_THRESHOLD_HUNGER, SIMULATION_THRESHOLD_UNHAPPY, SIMULATION_THRESHOLD_EXPIRY } from "../Constants.js";
import { calculateNutritionalScore } from "../../nutrition/Algorithm.js";

export const reduceConditionHungry: Reducer<Hungry> = (condition, influence) => {
  switch (influence.with) {
    case Influences.Food: {
      // todo nutritional scoring
      const scores = calculateNutritionalScore(influence.plate, influence.genes);
      const happiness = clamp(condition.happiness + scores.wants, 0, 100);
      const hunger = clamp(condition.hunger + scores.needs, 0, 100);

      if (SIMULATION_THRESHOLD_HUNGER >= hunger) {
        return {
          ...condition,
          happiness: happiness,
          hunger: hunger,
          ticks: condition.ticks + 1,
        };
      } else if (SIMULATION_THRESHOLD_UNHAPPY >= happiness) {
        return <Unhappy> {
          ...condition,
          is: Conditions.Unhappy,
          happiness: happiness,
          hunger: hunger,
          ticks: 0,
        };
      } else {
        return <Idle> {
          ...condition,
          is: Conditions.InGoodHealth,
          happiness: happiness,
          hunger: hunger,
          ticks: 0,
        };
      }
    }

    case Influences.Time: {
      const happiness = clamp(condition.happiness - influence.happiness, 0, 100);
      const hunger = clamp(condition.hunger - influence.hunger, 0, 100);
      const discipline = clamp(condition.discipline - influence.discipline, 0, 100);

      if (SIMULATION_THRESHOLD_EXPIRY >= condition.ticks) {
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

    default: {
      return condition;
    }
  }
};
