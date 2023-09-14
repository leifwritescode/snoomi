import { CustomPostType } from "@devvit/public-api";
import { ViewStateName } from "./types/ViewState.js";
import { Devvit } from "@devvit/public-api";
import VirtualPetView from "./views/VirtualPetView.js";
import MealSelectView from "./views/MealSelectView.js";
import FinishedMealView from "./views/FinishedMealView.js";
import ActivitySelectView from "./views/ActivitySelectView.js";
import FinishedActivityView from "./views/FinishedActivityView.js";
import VirtualPetGame from "./VirtualPetGame.js";


const VirtualPetRoot: CustomPostType["render"] = (context) => {
  const game = new VirtualPetGame(context);

  switch (game.viewState.name) {
    case ViewStateName.VirtualPet:
      return (<VirtualPetView game={game} />);
    case ViewStateName.MealSelect:
      return (<MealSelectView game={game} />);
    case ViewStateName.FinishedMeal:
      return (<FinishedMealView game={game} />);
    case ViewStateName.ActivitySelect:
      return (<ActivitySelectView game={game} />);
    case ViewStateName.FinishedActivity:
      return (<FinishedActivityView game={game} />);
  }
}

export default VirtualPetRoot;
