import { Activity } from "../enums/Activity.js";
import { clamp, scalarInverse } from "../utilities.js";
import { Meal, getNutritionalValue } from "./Meal.js";
import { VariantRecord } from "./VariantRecord.js";
import { NUMERICS_MAX_DATE_MS, NUMERICS_SCALAR_HUNDRED, NUMERICS_SCALAR_NEGATIVE_ONE, NUMERICS_SCALAR_THIRTY, SIMULATION_THRESHOLD_DEFIANT_POOPING, SIMULATION_THRESHOLD_EXPIRY, SIMULATION_THRESHOLD_HUNGER, SIMULATION_THRESHOLD_RANDOM_EVENT, SIMULATION_THRESHOLD_UNHAPPY } from "../constants.js";

export enum SimulationStateName {
    Egg = "Egg", // egg is a special simulation state where nothing can happen
    Idle = "Idle",
    Sick = "Sick",
    Hungry = "Hungry",
    Pooping = "Pooping",
    Unsanitary = "Unsanitary",
    Unhappy = "Unhappy",
    Dead = "Dead"
};

type BaseSimulationState<T extends SimulationStateName> = VariantRecord<T> & {
  happiness: number,
  discipline: number,
  hunger: number,
  weight: number,
  ticks: number, // ticks in the current state, useful for determining transitions e.g. unsanitary -> sick
}

// the virtual pet is newly created and has not hatched yet
type Egg = BaseSimulationState<SimulationStateName.Egg>;

// the virtual pet is in its idle state
type Idle = BaseSimulationState<SimulationStateName.Idle>;

// the virtual pet has become sick and requires medicine
type Sick = BaseSimulationState<SimulationStateName.Sick>;

// the virtual pet is excessively hungry
type Hungry = BaseSimulationState<SimulationStateName.Hungry>;

// the virtual pet needs to use the toilet
type Pooping = BaseSimulationState<SimulationStateName.Pooping>;

// the virtual pet pooped
type Unsanitary = BaseSimulationState<SimulationStateName.Unsanitary>;

// the virtual pet is unhappy
type Unhappy = BaseSimulationState<SimulationStateName.Unhappy>;

// the virtual pet has died
type Dead = BaseSimulationState<SimulationStateName.Dead> & {
  timeOfDeath: number // todo: cannot use Date because of JSON serialization
};

// union type of all possible simulation states
export type SimulationState = Egg | Idle | Sick | Hungry | Pooping | Unsanitary | Unhappy | Dead;

export enum SimulationActionName {
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

type Feed = VariantRecord<SimulationActionName.Feed> & {
  meal: Meal
};

type AdministerMedicine = VariantRecord<SimulationActionName.AdministerMedicine>;

type Play = VariantRecord<SimulationActionName.Play> & {
  activity: Activity
};

type Clean = VariantRecord<SimulationActionName.Clean>;

type Discipline = VariantRecord<SimulationActionName.Discipline>;

type WelfareTick = VariantRecord<SimulationActionName.WelfareTick> & {
  hunger: number,
  happiness: number,
  discipline: number,
};

type AgeTick = VariantRecord<SimulationActionName.AgeTick>;

type Hatch = VariantRecord<SimulationActionName.Hatch>;

type GoToBathroom = VariantRecord<SimulationActionName.GoToBathroom>;

// union type of all possible simulation actions
type SimulationAction = Feed | Play | AdministerMedicine | Clean | Discipline | WelfareTick | AgeTick | Hatch | GoToBathroom;

// method signature for simulation state reducers
type StateReducer<State extends SimulationState> = (state: State, action: SimulationAction) => SimulationState;

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

const tickState = <State extends SimulationState>(state: State): State => {
  return <State> {
    ...state,
    ticks: state.ticks + 1,
  };
}

const reduceSimulationStateEgg: StateReducer<Egg> = (state, action) => {
  switch (action.name) {
    case SimulationActionName.Hatch:
      // todo sensible defaults based on genetics
      return <Idle> {
        name: SimulationStateName.Idle,
        happiness: 100,
        hunger: 100,
        discipline: 50,
        weight: 50,
        ticks: 0
      };

    // eggs tick, but their welfare is indeterminate until they hatch
    case SimulationActionName.WelfareTick: {
      return tickState(state);
    }

    default: {
      return state;
    }
  }
};

const reduceSimulationStateIdle: StateReducer<Idle> = (state, action) => {
  var hunger: number;
  var happiness: number;
  var discipline: number;
  var weight: number;
  var ticks: number = state.ticks + 1;

  switch (action.name) {
    case SimulationActionName.Feed:
      const nutrition = getNutritionalValue(action.meal);
      hunger = clamp(state.hunger + nutrition.hunger, 0, 100);
      happiness = clamp(state.happiness + nutrition.happiness, 0, 100);
      weight = clamp(state.weight + nutrition.weight, 0, 100);

      return <Idle> {
        ...state,
        hunger: hunger,
        happiness: happiness,
        weight: weight,
        ticks: ticks
      };

    /**
     * suuuuuper naive welfare tick calculation
     * todo: account for genetics. this could be difficult, since the statemachine doesn't have access to the pet's genetics. perhaps the action could accept a genetics object?
     */
    case SimulationActionName.WelfareTick:
      hunger = state.hunger - action.hunger;
      happiness = state.happiness - action.happiness;
      discipline = state.discipline - action.discipline;

      if (randomSicknessOccurs()) {
        return <Sick> {
          ...state,
          name: SimulationStateName.Sick,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: 0
        };
      } else if (randomPoopingOccurs(state.discipline)) {
        return <Pooping> {
          ...state,
          name: SimulationStateName.Pooping,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: 0
        };
      } else if (hunger < SIMULATION_THRESHOLD_HUNGER) {
        return <Hungry> {
          ...state,
          name: SimulationStateName.Hungry,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: 0,
        };
      } else if (happiness < SIMULATION_THRESHOLD_UNHAPPY) {
        return <Unhappy> {
          ...state,
          name: SimulationStateName.Unhappy,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: 0,
        };
      } else {
        return <Idle> {
          ...state,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: ticks
        };
      }

    default:
      return tickState(state);
  }
};

const reduceSimulationStateSick: StateReducer<Sick> = (state, action) => {
  switch (action.name) {
    case SimulationActionName.AdministerMedicine:
      if (state.hunger < SIMULATION_THRESHOLD_HUNGER) {
        return <Hungry> {
          ...state,
          name: SimulationStateName.Hungry,
          ticks: 0,
        };
      } else if (state.happiness < SIMULATION_THRESHOLD_UNHAPPY) {
        return <Unhappy> {
          ...state,
          name: SimulationStateName.Unhappy,
          ticks: 0,
        };
      } else {
        return <Idle> {
          ...state,
          name: SimulationStateName.Idle,
          ticks: 0,
        };
      }

    case SimulationActionName.WelfareTick:
      if (state.ticks >= SIMULATION_THRESHOLD_EXPIRY) {
        return <Dead> {
          ...state,
          name: SimulationStateName.Dead,
          timeOfDeath: Date.now(),
          ticks: 0,
        };
      } else {
        return tickState(state);
      }

    default:
      return state;
  }
};

const reduceSimulationStateHungry: StateReducer<Hungry> = (state, action) => {
  switch (action.name) {
    default:
      return tickState(state);
  }
};

const reduceSimulationStatePooping: StateReducer<Pooping> = (state, action) => {
  switch (action.name) {
    case SimulationActionName.GoToBathroom: {
      // todo remove discipline++ magic number
      if (SIMULATION_THRESHOLD_HUNGER >= state.hunger) {
        return <Hungry> {
          ...state,
          name: SimulationStateName.Hungry,
          ticks: 0,
          discipline: clamp(state.discipline + 10, 0, 100),
        };
      } else if (SIMULATION_THRESHOLD_UNHAPPY >= state.happiness) {
        return <Unhappy> {
          ...state,
          name: SimulationStateName.Unhappy,
          ticks: 0,
          discipline: clamp(state.discipline + 10, 0, 100),
        };
      } else {
        return <Idle> {
          ...state,
          name: SimulationStateName.Idle,
          ticks: 0,
          discipline: clamp(state.discipline + 10, 0, 100),
        };
      }
    }

    case SimulationActionName.WelfareTick: {
      const happiness = clamp(state.happiness - action.happiness, 0, 100);
      const hunger = clamp(state.hunger - action.hunger, 0, 100);
      const discipline = clamp(state.discipline - action.discipline, 0, 100);

      if (state.ticks >= SIMULATION_THRESHOLD_EXPIRY) {
        return <Unsanitary> {
          ...state,
          name: SimulationStateName.Unsanitary,
          ticks: 0,
          discipline: discipline - 10, // todo remove magic number
          happiness: happiness,
          hunger: hunger,
        };
      } else {
        return {
          ...state,
          ticks: state.ticks + 1,
          happiness: happiness,
          hunger: hunger,
          discipline: discipline
        };
      }
    }

    default: {
      return state;
    }
  }
};

const reduceSimulationStateUnsanitary: StateReducer<Unsanitary> = (state, action) => {
  switch (action.name) {
    case SimulationActionName.WelfareTick: {
      const happiness = clamp(state.happiness - action.happiness, 0, 100);
      const hunger = clamp(state.hunger - action.hunger, 0, 100);
      const discipline = clamp(state.discipline - action.discipline, 0, 100);

      if (state.ticks >= SIMULATION_THRESHOLD_EXPIRY) {
        return <Sick> {
          ...state,
          name: SimulationStateName.Sick,
          ticks: 0,
          happiness: happiness,
          hunger: hunger,
          discipline: discipline
        };
      } else {
        return {
          ...state,
          ticks: state.ticks + 1,
          happiness: happiness,
          hunger: hunger,
          discipline: discipline
        };
      }
    }

    case SimulationActionName.Clean: {
      if (SIMULATION_THRESHOLD_HUNGER >= state.hunger) {
        return <Hungry> {
          ...state,
          name: SimulationStateName.Hungry,
          ticks: 0,
        };
      } else if (SIMULATION_THRESHOLD_UNHAPPY >= state.happiness) {
        return <Unhappy> {
          ...state,
          name: SimulationStateName.Unhappy,
          ticks: 0,
        };
      } else {
        return <Idle> {
          ...state,
          name: SimulationStateName.Idle,
          ticks: 0,
        };
      }
    }
 
    default: {
      return state;
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

const reduceSimulationStateUnhappy: StateReducer<Unhappy> = (state, action) => {
  switch (action.name) {
    case SimulationActionName.WelfareTick: {
      const happiness = clamp(state.happiness - action.happiness, 0, 100);
      const hunger = clamp(state.hunger - action.hunger, 0, 100);
      const discipline = clamp(state.discipline - action.discipline, 0, 100);

      if (state.ticks >= SIMULATION_THRESHOLD_EXPIRY) {
        return <Sick> {
          ...state,
          name: SimulationStateName.Sick,
          ticks: 0,
          happiness: happiness,
          hunger: hunger,
          discipline: discipline
        };
      } else if (defiantPoopingOccurs(discipline)) {
        return <Unsanitary> {
          ...state,
          name: SimulationStateName.Unsanitary,
          ticks: 0,
          happiness: happiness,
          hunger: hunger,
          discipline: discipline - 10 // todo remove magic number,
        };
      } else {
        return {
          ...state,
          ticks: state.ticks + 1,
          happiness: happiness,
          hunger: hunger,
          discipline: discipline
        };
      }
    }

    case SimulationActionName.Feed: {
      const nutrition = getNutritionalValue(action.meal);
      const happiness = clamp(state.happiness + nutrition.happiness, 0, 100);
      const hunger = clamp(state.hunger + nutrition.hunger, 0, 100);
      const weight = clamp(state.weight + nutrition.weight, 0, 100);

      if (SIMULATION_THRESHOLD_UNHAPPY >= happiness) {
        return <Unhappy> {
          ...state,
          happiness: happiness,
          hunger: hunger,
          weight: weight,
          ticks: state.ticks + 1,
        };
      } else {
        return <Idle> {
          ...state,
          name: SimulationStateName.Idle,
          happiness: happiness,
          hunger: hunger,
          weight: weight,
          ticks: 0,
        };
      }
    }

    case SimulationActionName.Play: {
      // todo activities need an equivalent of nutrtional values
      const happiness = clamp(state.happiness + 10, 0, 100);
      const discipline = clamp(state.discipline + 10, 0, 100);

      if (SIMULATION_THRESHOLD_UNHAPPY >= happiness) {
        return {
          ...state,
          happiness: happiness,
          discipline: discipline,
          ticks: state.ticks + 1,
        }
      } else {
        return <Idle> {
          ...state,
          name: SimulationStateName.Idle,
          happiness: happiness,
          discipline: discipline,
          ticks: 0,
        };
      }
    }

    default: {
      return state;
    }
  }
};

// dead pets cannot transition to any other state, but can tick
const reduceSimulationStateDead: StateReducer<Dead> = (state, action) => {
  switch (action.name) {
    case SimulationActionName.WelfareTick:
      return tickState(state);

    default:
      return state;
  }
};

/**
 * {@link SimulationState} reducer
 * @param {SimulationAction} action the action
 * @param {SimulationState} state the state
 * @returns a new {@link SimulationState} made by applying {@link action} to {@link state}, or {@link state} if no transition occurs
 */
export const reduce: StateReducer<SimulationState> = (state, action) => {
  switch (state.name) {
    case SimulationStateName.Egg:
      return reduceSimulationStateEgg(state, action);
    case SimulationStateName.Idle:
      return reduceSimulationStateIdle(state, action);
    case SimulationStateName.Sick:
      return reduceSimulationStateSick(state, action);
    case SimulationStateName.Hungry:
      return reduceSimulationStateHungry(state, action);
    case SimulationStateName.Pooping:
      return reduceSimulationStatePooping(state, action);
    case SimulationStateName.Unsanitary:
      return reduceSimulationStateUnsanitary(state, action);
    case SimulationStateName.Unhappy:
      return reduceSimulationStateUnhappy(state, action);
    case SimulationStateName.Dead:
      return reduceSimulationStateDead(state, action);
    default:
      return state;
  }
}

export const initialSimulationState:{():SimulationState} = () => {
  return <Egg> {
    name: SimulationStateName.Egg,
    happiness: 100,
    hunger: 100,
    discipline: 50,
    weight: 50
  };
}
