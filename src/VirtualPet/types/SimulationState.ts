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
  hunger: number
}

// the virtual pet is newly created and has not hatched yet
export type Egg = BaseSimulationState<SimulationStateName.Egg>;

// the virtual pet is in its idle state
export type Idle = BaseSimulationState<SimulationStateName.Idle>;

// the virtual pet has become sick and requires medicine
export type Sick = BaseSimulationState<SimulationStateName.Sick>;

// the virtual pet is excessively hungry
export type Hungry = BaseSimulationState<SimulationStateName.Hungry>;

// the virtual pet needs to use the toilet
export type Pooping = BaseSimulationState<SimulationStateName.Pooping>;

// the virtual pet pooped
export type Unsanitary = BaseSimulationState<SimulationStateName.Unsanitary>;

// the virtual pet is unhappy
export type Unhappy = BaseSimulationState<SimulationStateName.Unhappy>;

// the virtual pet has died
export type Dead = BaseSimulationState<SimulationStateName.Dead> & {
  timeOfDeath: Date
};

// union type of all possible simulation states
export type SimulationState = Egg | Idle | Sick | Hungry | Pooping | Unsanitary | Unhappy | Dead;

export enum SimulationActionName {
  IncreaseHunger = "IncreaseHunger",
  DecreaseHappiness = "DecreaseHappiness",
  DecreaseDiscipline = "DecreaseDiscipline"
}

// the virtual pet gets hungrier over time
export type IncreaseHunger = VariantRecord<SimulationActionName.IncreaseHunger> & {
  prevHunger: number,
  currHunger: number
};

// the virtual pet loses happiness over time
export type DecreaseHappiness = VariantRecord<SimulationActionName.DecreaseHappiness> & {
  prevHappiness: number,
  currHappiness: number
};

// the virtual pet becomes misbehaved over time
export type DecreaseDiscipline = VariantRecord<SimulationActionName.DecreaseDiscipline> & {
  prevDiscipline: number,
  currDiscipline: number
};

// union type of all possible simulation actions
export type SimulationAction = IncreaseHunger | DecreaseHappiness | DecreaseDiscipline;

// method signature for simulation state reducers
type StateReducer<State extends SimulationState> = (action: SimulationAction, state: State) => SimulationState;

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
 * @param {SimulationAction} action the action
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
