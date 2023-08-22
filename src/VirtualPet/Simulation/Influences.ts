import { Meal } from "../types/Meal.js";
import { Activity } from "../enums/Activity.js";

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

export type BaseInfluence<T extends Influences> = {
  with: T,
};

export type Feed = BaseInfluence<Influences.Feed> & {
  meal: Meal
};

export type AdministerMedicine = BaseInfluence<Influences.AdministerMedicine>;

export type Play = BaseInfluence<Influences.Play> & {
  activity: Activity
};

export type Clean = BaseInfluence<Influences.Clean>;

export type Discipline = BaseInfluence<Influences.Discipline>;

export type WelfareTick = BaseInfluence<Influences.WelfareTick> & {
  hunger: number,
  happiness: number,
  discipline: number,
};

export type AgeTick = BaseInfluence<Influences.AgeTick>;

export type Hatch = BaseInfluence<Influences.Hatch>;

export type GoToBathroom = BaseInfluence<Influences.GoToBathroom>;

// union type of all possible simulation actions
export type Influence = Feed | Play | AdministerMedicine | Clean | Discipline | WelfareTick | AgeTick | Hatch | GoToBathroom;
