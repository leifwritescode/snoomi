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
      return state;
  }
};

const reduceSimulationStateIdle: StateReducer<Idle> = (state, action) => {
  switch (action.name) {
    case SimulationActionName.Feed:
      const nutrition = getNutritionalValue(action.meal);
      return <Idle> {
        ...state,
        hunger: clamp(state.hunger + nutrition.hunger, 0, 100),
        happiness: clamp(state.happiness + nutrition.happiness, 0, 100),
        weight: clamp(state.weight + nutrition.weight, 0, 100)
      };

    /**
     * suuuuuper naive welfare tick calculation
     * todo: account for genetics. this could be difficult, since the statemachine doesn't have access to the pet's genetics. perhaps the action could accept a genetics object?
     */
    case SimulationActionName.WelfareTick:
      const hunger = state.hunger - action.hunger;
      const happiness = state.happiness - action.happiness;
      const discipline = state.discipline - action.discipline;

      if (happiness < 0 || hunger < 0) {
        return <Sick> {
          ...state,
          name: SimulationStateName.Sick,
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
      }
  
      return <Idle> {
        ...state,
        hunger: clamp(hunger, 0, 100),
        happiness: clamp(happiness, 0, 100),
        discipline: clamp(discipline, 0, 100),
        ticks: state.ticks + 1
      };

    case SimulationActionName.AgeTick:
      return <Idle> {
        ...state,
      };

    default:
      return state;
  }
};

const reduceSimulationStateSick: StateReducer<Sick> = (state, action) => state;
const reduceSimulationStateHungry: StateReducer<Hungry> = (state, action) => state;
const reduceSimulationStatePooping: StateReducer<Pooping> = (state, action) => state;
const reduceSimulationStateUnsanitary: StateReducer<Unsanitary> = (state, action) => state;
const reduceSimulationStateUnhappy: StateReducer<Unhappy> = (state, action) => state;
const reduceSimulationStateDead: StateReducer<Dead> = (state, action) => state;

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
