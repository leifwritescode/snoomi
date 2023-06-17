import { VariantRecord } from "./VariantRecord.js";
import { State } from "../enums/State.js";

// the virtual pet is newly created and has not hatched yet
export type Egg = VariantRecord<State.Egg>;

// the virtual pet is in its idle state
export type Idle = VariantRecord<State.Idle>;

// the virtual pet has become sick and requires medicine
export type Sick = VariantRecord<State.Sick>;

// the virtual pet is excessively hungry
export type Hungry = VariantRecord<State.Hungry>;

// the virtual pet needs to use the toilet
export type Pooping = VariantRecord<State.Pooping>;

// the virtual pet pooped
export type Unsanitary = VariantRecord<State.Unsanitary>;

// the virtual pet is unhappy
export type Unhappy = VariantRecord<State.Unhappy>;

// the virtual pet has died
export type Dead = VariantRecord<State.Dead> & {
    timeOfDeath: Date
};

// union type of all possible simulation states
export type SimulationState = Idle | Sick | Hungry | Pooping | Unsanitary | Unhappy | Dead;
