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

// the virtual pet is newly created and has not hatched yet
export type Egg = VariantRecord<SimulationStateName.Egg>;

// the virtual pet is in its idle state
export type Idle = VariantRecord<SimulationStateName.Idle>;

// the virtual pet has become sick and requires medicine
export type Sick = VariantRecord<SimulationStateName.Sick>;

// the virtual pet is excessively hungry
export type Hungry = VariantRecord<SimulationStateName.Hungry>;

// the virtual pet needs to use the toilet
export type Pooping = VariantRecord<SimulationStateName.Pooping>;

// the virtual pet pooped
export type Unsanitary = VariantRecord<SimulationStateName.Unsanitary>;

// the virtual pet is unhappy
export type Unhappy = VariantRecord<SimulationStateName.Unhappy>;

// the virtual pet has died
export type Dead = VariantRecord<SimulationStateName.Dead> & {
  timeOfDeath: Date
};

// union type of all possible simulation states
export type SimulationState = Egg | Idle | Sick | Hungry | Pooping | Unsanitary | Unhappy | Dead;

type StateReducer<T> = (action: any, state: T) => T;

const reduceSimulationStateEgg: StateReducer<Egg> = (action, state) => state;
const reduceSimulationStateIdle: StateReducer<Idle> = (action, state) => state;
const reduceSimulationStateSick: StateReducer<Sick> = (action, state) => state;
const reduceSimulationStateHungry: StateReducer<Hungry> = (action, state) => state;
const reduceSimulationStatePooping: StateReducer<Pooping> = (action, state) => state;
const reduceSimulationStateUnsanitary: StateReducer<Unsanitary> = (action, state) => state;
const reduceSimulationStateUnhappy: StateReducer<Unhappy> = (action, state) => state;
const reduceSimulationStateDead: StateReducer<Dead> = (action, state) => state;

/**
 * {@link SimulationState} reducer
 * @param {any} action the action
 * @param {SimulationState} state the state
 * @returns a new {@link SimulationState} made by applying {@link action} to {@link state}, or {@link state} if no transition occurs
 */
export const reduce: StateReducer<SimulationState> = (action, state) => {
  switch (state.name) {
    case SimulationStateName.Egg:
      return reduceSimulationStateEgg(action, state);
    case SimulationStateName.Idle:
      return reduceSimulationStateIdle(action, state);
    case SimulationStateName.Sick:
      return reduceSimulationStateSick(action, state);
    case SimulationStateName.Hungry:
      return reduceSimulationStateHungry(action, state);
    case SimulationStateName.Pooping:
      return reduceSimulationStatePooping(action, state);
    case SimulationStateName.Unsanitary:
      return reduceSimulationStateUnsanitary(action, state);
    case SimulationStateName.Unhappy:
      return reduceSimulationStateUnhappy(action, state);
    case SimulationStateName.Dead:
      return reduceSimulationStateDead(action, state);
    default:
      return state;
  }
}
