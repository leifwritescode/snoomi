import { Devvit } from "@devvit/public-api";
import { ViewStateName } from "../types/ViewState.js";
import Element = JSX.Element;
import CustomPostComponent = Devvit.CustomPostComponent;
import VirtualPetGame from "../VirtualPetGame.js";
import HomePage from "./pages/HomePage.js";
import ActivitySelectPage from "./pages/ActivitySelectPage.js";
import MealSelectPage from "./pages/MealSelectPage.js";
import FinishedMealPage from "./pages/FinishedMealPage.js";
import FinishedActivityPage from "./pages/FinishedActivityPage.js";

const VirtualPet: CustomPostComponent = (context) => {
  const game = new VirtualPetGame(context);

  let page: Element;
  switch (game.viewState.name) {
    case ViewStateName.VirtualPet:
      page = <HomePage game={game} />;
      break;
    case ViewStateName.MealSelect:
      page = <MealSelectPage game={game} />;
      break;
    case ViewStateName.FinishedMeal:
      page = <FinishedMealPage game={game} />;
      break;
    case ViewStateName.ActivitySelect:
      page = <ActivitySelectPage game={game} />;
      break;
    case ViewStateName.FinishedActivity:
      page = <FinishedActivityPage game={game} />;
      break;
    // default:
    //  exception(`no page defined for ${game.viewState.name}`);
  }

  return (
    <blocks height='tall'>
      {page}
    </blocks>
  );
};

export default VirtualPet;
