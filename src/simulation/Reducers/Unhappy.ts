import { Unhappy, Sick, Unsanitary, Idle, Conditions } from "../Conditions.js";
import { Reducer } from "../Reducer.js";
import { Influences } from "../Influences.js";
import { clamp } from "../../math.js";
import { SIMULATION_THRESHOLD_UNHAPPY, SIMULATION_THRESHOLD_EXPIRY } from "../Constants.js";
import { defiantPoopingOccurs } from "../Random.js";
import { calculateNutritionalScore } from "../../nutrition/Algorithm.js";

export const reduceConditionUnhappy: Reducer<Unhappy> = (condition, influence) => {
  switch (influence.with) {
    case Influences.Time: {
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
      } else if (defiantPoopingOccurs(discipline)) {
        return <Unsanitary> {
          ...condition,
          is: Conditions.Unsanitary,
          ticks: 0,
          happiness: happiness,
          hunger: hunger,
          discipline: discipline - 10 // todo remove magic number,
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

    case Influences.Food: {
      const scores = calculateNutritionalScore(influence.plate, influence.genes);
      const happiness = clamp(condition.happiness + scores.wants, 0, 100);
      const hunger = clamp(condition.hunger + scores.needs, 0, 100);

      if (SIMULATION_THRESHOLD_UNHAPPY >= happiness) {
        return <Unhappy> {
          ...condition,
          happiness: happiness,
          hunger: hunger,
          ticks: condition.ticks + 1,
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

    case Influences.Play: {
      // todo activities need an equivalent of nutrtional values
      const happiness = clamp(condition.happiness + 10, 0, 100);
      const discipline = clamp(condition.discipline + 10, 0, 100);

      if (SIMULATION_THRESHOLD_UNHAPPY >= happiness) {
        return {
          ...condition,
          happiness: happiness,
          discipline: discipline,
          ticks: condition.ticks + 1,
        }
      } else {
        return <Idle> {
          ...condition,
          is: Conditions.InGoodHealth,
          happiness: happiness,
          discipline: discipline,
          ticks: 0,
        };
      }
    }

    default: {
      return condition;
    }
  }
};
