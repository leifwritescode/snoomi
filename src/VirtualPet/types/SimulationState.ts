import { Activity } from "../enums/Activity.js";
import { clamp } from "../utilities.js";
import { Meal, getNutritionalValue } from "./Meal.js";
import { VariantRecord } from "./VariantRecord.js";

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

// union type of all possible simulation actions
type SimulationAction = Feed | Play | AdministerMedicine | Clean | Discipline | WelfareTick | AgeTick | Hatch;

// method signature for simulation state reducers
type StateReducer<State extends SimulationState> = (state: State, action: SimulationAction) => SimulationState;

// random pooping occurs if (random number between 0 and 100) + (inverse discipline) > 75
// todo could alternatively do this as a random between 0 and 100 and reduce the value by x% proportional to discipline
function randomPoopingOccurs(discipline: number): boolean {
  const r = Math.random() * 100;
  const d = (discipline * -1) + 100;
  return (r + d) > 75;
}

// random sickness occurs if (random number between 0 and number.max) == date.now()
// todo this logic makes random sickness exceptionally rare slash unfortunate. needs to be somewhat more likely
function randomSicknessOccurs(): boolean {
  const r = Math.random() * Number.MAX_VALUE;
  return r == Date.now();
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

    default:
      return tickState(state);
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
      } else if (hunger < 25) {
        return <Hungry> {
          ...state,
          name: SimulationStateName.Hungry,
          hunger: clamp(hunger, 0, 100),
          happiness: clamp(happiness, 0, 100),
          discipline: clamp(discipline, 0, 100),
          ticks: 0,
        };
      } else if (happiness < 25) {
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
      return <Idle> {
        ...state,
        name: SimulationStateName.Idle,
        ticks: 0,
      };

    default:
      if (state.ticks > 3) {
        return <Dead> {
          ...state,
          name: SimulationStateName.Dead,
          timeOfDeath: Date.now(),
        };
      } else {
        return tickState(state);
      }
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
    default:
      return tickState(state);
  }
};

const reduceSimulationStateUnsanitary: StateReducer<Unsanitary> = (state, action) => {
  switch (action.name) {
    default:
      return tickState(state);
  }
};

const reduceSimulationStateUnhappy: StateReducer<Unhappy> = (state, action) => {
  switch (action.name) {
    default:
      return tickState(state);
  }
};

// dead pets cannot transition to any other state
const reduceSimulationStateDead: StateReducer<Dead> = (state, _) => state;

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
