import { Genotype } from "../Genetics/Genotype.js";
import { Plate } from "../Nutrition/Plate.js";
import { Activity } from "../enums/Activity.js";

export enum Influences {
  Food = "Food",
  Medicine = "Medicine",
  Play = "Play",
  Clean = "Clean",
  Scold = "Discipline",
  Potty = "Potty",

  Time = "Special_Time",
  Growth = "Special_Growth",
  Hatch = "Special_Hatch",
};

export type BaseInfluence<T extends Influences> = {
  with: T,
};

export type Food = BaseInfluence<Influences.Food> & {
  plate: Plate,
  genes: Genotype
};

export type Medicine = BaseInfluence<Influences.Medicine>;

export type Play = BaseInfluence<Influences.Play> & {
  activity: Activity
};

export type Clean = BaseInfluence<Influences.Clean>;

export type Discipline = BaseInfluence<Influences.Scold>;

export type Time = BaseInfluence<Influences.Time> & {
  hunger: number,
  happiness: number,
  discipline: number,
};

export type Growth = BaseInfluence<Influences.Growth>;

export type Hatch = BaseInfluence<Influences.Hatch>;

export type Potty = BaseInfluence<Influences.Potty>;

// union type of all possible simulation actions
export type Influence = Food | Play | Medicine | Clean | Discipline | Time | Growth | Hatch | Potty;
