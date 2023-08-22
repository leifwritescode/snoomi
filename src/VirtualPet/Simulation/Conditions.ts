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

export type BaseCondition<T extends Conditions> = {
  is: T,
  happiness: number,
  discipline: number,
  hunger: number,
  weight: number,
  ticks: number, // ticks in the current condition, useful for determining transitions e.g. unsanitary -> sick
}

// the virtual pet is newly created and has not hatched yet
export type Egg = BaseCondition<Conditions.InEgg>;

// the virtual pet is in its idle condition
export type Idle = BaseCondition<Conditions.InGoodHealth>;

// the virtual pet has become sick and requires medicine
export type Sick = BaseCondition<Conditions.Sick>;

// the virtual pet is excessively hungry
export type Hungry = BaseCondition<Conditions.Hungry>;

// the virtual pet needs to use the toilet
export type Pooping = BaseCondition<Conditions.Pooping>;

// the virtual pet pooped
export type Unsanitary = BaseCondition<Conditions.Unsanitary>;

// the virtual pet is unhappy
export type Unhappy = BaseCondition<Conditions.Unhappy>;

// the virtual pet has died
export type Dead = BaseCondition<Conditions.Dead> & {
  timeOfDeath: number // todo: cannot use Date because of JSON serialization
};

// union type of all possible simulation states
export type Condition = Egg | Idle | Sick | Hungry | Pooping | Unsanitary | Unhappy | Dead;
