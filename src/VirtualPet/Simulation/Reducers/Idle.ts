import { Reducer } from "../Reducer.js";
import { Influences } from "../Influences.js";
import { Conditions } from "../Conditions.js";
import { Idle, Sick, Pooping, Unhappy, Hungry } from "../Conditions.js";
import { clamp } from "../../math.js";
import { randomPoopingOccurs, randomSicknessOccurs } from "../Random.js";
import { SIMULATION_THRESHOLD_HUNGER, SIMULATION_THRESHOLD_UNHAPPY } from "../../constants.js";

export const reduceConditionIdle: Reducer<Idle> = (condition, influence) => {
  var hunger: number;
  var happiness: number;
  var discipline: number;
  var weight: number;
  var ticks: number = condition.ticks + 1;

  switch (influence.with) {
    case Influences.Feed: {
      const nutrition = getNutritionalValue(influence.meal);
      hunger = clamp(condition.hunger + nutrition.hunger, 0, 100);
      happiness = clamp(condition.happiness + nutrition.happiness, 0, 100);
      weight = clamp(condition.weight + nutrition.weight, 0, 100);

      return {
        ...condition,
        hunger: hunger,
        happiness: happiness,
        weight: weight,
        ticks: ticks
      };
    }

    /**
     * suuuuuper naive welfare tick calculation
     * todo: account for genetics. this could be difficult, since the statemachine doesn't have access to the pet's genetics. perhaps the influence could accept a genetics object?
     */
    case Influences.WelfareTick: {
      hunger = condition.hunger - influence.hunger;
      happiness = condition.happiness - influence.happiness;
      discipline = condition.discipline - influence.discipline;

      if (randomSicknessOccurs()) {
        return <Sick> {
          ...condition,
          is: Conditions.Sick,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: 0
        };
      } else if (randomPoopingOccurs(condition.discipline)) {
        return <Pooping> {
          ...condition,
          is: Conditions.Pooping,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: 0
        };
      } else if (SIMULATION_THRESHOLD_HUNGER >= hunger) {
        return <Hungry> {
          ...condition,
          is: Conditions.Hungry,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: 0,
        };
      } else if (SIMULATION_THRESHOLD_UNHAPPY >= happiness) {
        return <Unhappy> {
          ...condition,
          is: Conditions.Unhappy,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: 0,
        };
      } else {
        return <Idle> {
          ...condition,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: ticks
        };
      }
    }

    default: {
      return condition;
    }
  }
};