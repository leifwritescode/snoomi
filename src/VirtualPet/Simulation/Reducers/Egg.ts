import { Egg, Idle, Conditions } from "../Conditions.js";
import { Reducer } from "../Reducer.js";
import { Influences } from "../Influences.js";
import { reduceConditionGenericTick } from "./Generic.js";

export const reduceConditionEgg: Reducer<Egg> = (condition, influence) => {
  switch (influence.with) {
    case Influences.Hatch:
      // todo sensible defaults based on genetics
      return <Idle> {
        is: Conditions.InGoodHealth,
        happiness: 100,
        hunger: 100,
        discipline: 50,
        ticks: 0
      };

    // eggs tick, but their welfare is indeterminate until they hatch
    case Influences.WelfareTick: {
      return reduceConditionGenericTick(condition, influence);
    }

    default: {
      return condition;
    }
  }
};
