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
type IncreaseHunger = VariantRecord<SimulationActionName.IncreaseHunger> & {
  prevHunger: number,
  currHunger: number
};

// the virtual pet loses happiness over time
type DecreaseHappiness = VariantRecord<SimulationActionName.DecreaseHappiness> & {
  prevHappiness: number,
  currHappiness: number
};

// the virtual pet becomes misbehaved over time
type DecreaseDiscipline = VariantRecord<SimulationActionName.DecreaseDiscipline> & {
  prevDiscipline: number,
  currDiscipline: number
};

// union type of all possible simulation actions
type SimulationAction = IncreaseHunger | DecreaseHappiness | DecreaseDiscipline;

// method signature for simulation state reducers
type StateReducer<State extends SimulationState> = (state: State, action: SimulationAction) => SimulationState;

const reduceSimulationStateEgg: StateReducer<Egg> = (state, action) => state;
const reduceSimulationStateIdle: StateReducer<Idle> = (state, action) => state;
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
