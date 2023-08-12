import { Activity } from "../enums/Activity.js";
import { clamp, scalarInverse } from "../utilities.js";
import { Meal, getNutritionalValue } from "./Meal.js";
import { NUMERICS_MAX_DATE_MS, NUMERICS_SCALAR_HUNDRED, NUMERICS_SCALAR_THIRTY, SIMULATION_THRESHOLD_DEFIANT_POOPING, SIMULATION_THRESHOLD_EXPIRY, SIMULATION_THRESHOLD_HUNGER, SIMULATION_THRESHOLD_RANDOM_EVENT, SIMULATION_THRESHOLD_UNHAPPY } from "../constants.js";

export enum Conditions {
    InEgg = "Egg", // egg is a special simulation condition where nothing can happen
    InGoodHealth = "Idle",
    Sick = "Sick",
    Hungry = "Hungry",
    Pooping = "Pooping",
    Unsanitary = "Unsanitary",
    Unhappy = "Unhappy",
    Dead = "Dead"
};

type BaseCondition<T extends Conditions> = {
  is: T,
  happiness: number,
  discipline: number,
  hunger: number,
  weight: number,
  ticks: number, // ticks in the current condition, useful for determining transitions e.g. unsanitary -> sick
}

// the virtual pet is newly created and has not hatched yet
type Egg = BaseCondition<Conditions.InEgg>;

// the virtual pet is in its idle condition
type Idle = BaseCondition<Conditions.InGoodHealth>;

// the virtual pet has become sick and requires medicine
type Sick = BaseCondition<Conditions.Sick>;

// the virtual pet is excessively hungry
type Hungry = BaseCondition<Conditions.Hungry>;

// the virtual pet needs to use the toilet
type Pooping = BaseCondition<Conditions.Pooping>;

// the virtual pet pooped
type Unsanitary = BaseCondition<Conditions.Unsanitary>;

// the virtual pet is unhappy
type Unhappy = BaseCondition<Conditions.Unhappy>;

// the virtual pet has died
type Dead = BaseCondition<Conditions.Dead> & {
  timeOfDeath: number // todo: cannot use Date because of JSON serialization
};

// union type of all possible simulation states
export type Condition = Egg | Idle | Sick | Hungry | Pooping | Unsanitary | Unhappy | Dead;

export enum Influences {
  Feed = "Feed",
  AdministerMedicine = "AdministerMedicine",
  Play = "Play",
  Clean = "Clean",
  Discipline = "Discipline",
  WelfareTick = "Special_WelfareTick",
  AgeTick = "Special_AgeTick",
  Hatch = "Special_Hatch",
  GoToBathroom = "GoToBathroom",
};

type BaseInfluence<T extends Influences> = {
  with: T,
};

type Feed = BaseInfluence<Influences.Feed> & {
  meal: Meal
};

type AdministerMedicine = BaseInfluence<Influences.AdministerMedicine>;

type Play = BaseInfluence<Influences.Play> & {
  activity: Activity
};

type Clean = BaseInfluence<Influences.Clean>;

type Discipline = BaseInfluence<Influences.Discipline>;

type WelfareTick = BaseInfluence<Influences.WelfareTick> & {
  hunger: number,
  happiness: number,
  discipline: number,
};

type AgeTick = BaseInfluence<Influences.AgeTick>;

type Hatch = BaseInfluence<Influences.Hatch>;

type GoToBathroom = BaseInfluence<Influences.GoToBathroom>;

// union type of all possible simulation actions
type Influence = Feed | Play | AdministerMedicine | Clean | Discipline | WelfareTick | AgeTick | Hatch | GoToBathroom;

// method signature for simulation condition reducers
type Reducer<T extends Condition> = (condition: T, influence: Influence) => Condition;

// random pooping occurs if (random number between 0 and 100) + (inverse discipline) > 75
// todo could alternatively do this as a random between 0 and 100 and reduce the value by x% proportional to discipline
function randomPoopingOccurs(discipline: number): boolean {
  const r = Math.random() * NUMERICS_SCALAR_HUNDRED;
  const d = scalarInverse(discipline) + NUMERICS_SCALAR_HUNDRED;
  return (r + d) > SIMULATION_THRESHOLD_RANDOM_EVENT;
}

// random sickness occurs if (random number between 0 and number.max) == date.now()
// todo this logic makes random sickness exceptionally rare slash unfortunate. needs to be somewhat more likely
function randomSicknessOccurs(): boolean {
  const r = Math.random() * NUMERICS_MAX_DATE_MS;
  return r === Date.now();
}

const tickState = <condition extends Condition>(condition: condition): condition => {
  return <condition> {
    ...condition,
    ticks: condition.ticks + 1,
  };
}

const reduceConditionEgg: Reducer<Egg> = (condition, influence) => {
  switch (influence.with) {
    case Influences.Hatch:
      // todo sensible defaults based on genetics
      return <Idle> {
        is: Conditions.InGoodHealth,
        happiness: 100,
        hunger: 100,
        discipline: 50,
        weight: 50,
        ticks: 0
      };

    // eggs tick, but their welfare is indeterminate until they hatch
    case Influences.WelfareTick: {
      return tickState(condition);
    }

    default: {
      return condition;
    }
  }
};

const reduceConditionIdle: Reducer<Idle> = (condition, influence) => {
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

const reduceConditionSick: Reducer<Sick> = (condition, influence) => {
  switch (influence.with) {
    case Influences.AdministerMedicine:
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

    case Influences.WelfareTick:
      if (condition.ticks >= SIMULATION_THRESHOLD_EXPIRY) {
        return <Dead> {
          ...condition,
          is: Conditions.Dead,
          timeOfDeath: Date.now(),
          ticks: 0,
        };
      } else {
        return tickState(condition);
      }

    default:
      return condition;
  }
};

const reduceConditionHungry: Reducer<Hungry> = (condition, influence) => {
  switch (influence.with) {
    case Influences.Feed: {
      const nutrition = getNutritionalValue(influence.meal);
      const happiness = clamp(condition.happiness + nutrition.happiness, 0, 100);
      const hunger = clamp(condition.hunger + nutrition.hunger, 0, 100);
      const weight = clamp(condition.weight + nutrition.weight, 0, 100);

      if (SIMULATION_THRESHOLD_HUNGER >= hunger) {
        return {
          ...condition,
          happiness: happiness,
          hunger: hunger,
          weight: weight,
          ticks: condition.ticks + 1,
        };
      } else if (SIMULATION_THRESHOLD_UNHAPPY >= happiness) {
        return <Unhappy> {
          ...condition,
          is: Conditions.Unhappy,
          happiness: happiness,
          hunger: hunger,
          weight: weight,
          ticks: 0,
        };
      } else {
        return <Idle> {
          ...condition,
          is: Conditions.InGoodHealth,
          happiness: happiness,
          hunger: hunger,
          weight: weight,
          ticks: 0,
        };
      }
    }

    case Influences.WelfareTick: {
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

const reduceConditionPooping: Reducer<Pooping> = (condition, influence) => {
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

const reduceConditionUnsanitary: Reducer<Unsanitary> = (condition, influence) => {
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

function defiantPoopingOccurs(discipline: number): boolean {
  if (discipline > SIMULATION_THRESHOLD_DEFIANT_POOPING) {
    return false;
  }

  // lower discipline levels make it more likely that the pet will poop defiantly
  return (Math.random() * NUMERICS_SCALAR_THIRTY) > discipline;
}

const reduceConditionUnhappy: Reducer<Unhappy> = (condition, influence) => {
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

    case Influences.Feed: {
      const nutrition = getNutritionalValue(influence.meal);
      const happiness = clamp(condition.happiness + nutrition.happiness, 0, 100);
      const hunger = clamp(condition.hunger + nutrition.hunger, 0, 100);
      const weight = clamp(condition.weight + nutrition.weight, 0, 100);

      if (SIMULATION_THRESHOLD_UNHAPPY >= happiness) {
        return <Unhappy> {
          ...condition,
          happiness: happiness,
          hunger: hunger,
          weight: weight,
          ticks: condition.ticks + 1,
        };
      } else {
        return <Idle> {
          ...condition,
          is: Conditions.InGoodHealth,
          happiness: happiness,
          hunger: hunger,
          weight: weight,
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

// dead pets cannot transition to any other condition, but can tick
const reduceConditionDead: Reducer<Dead> = (condition, influence) => {
  switch (influence.with) {
    case Influences.WelfareTick:
      return tickState(condition);

    default:
      return condition;
  }
};

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
    discipline: 50,
    weight: 50
  };
}
