import { CustomPostType, Devvit } from "@devvit/public-api";
import { ViewStateName } from "../types/ViewState.js";
import { exception } from "../utilities.js";
import Element = JSX.Element;

import CustomPostComponent = Devvit.CustomPostComponent;
import VirtualPetGame from "../VirtualPetGame.js";
import HomePage from "./pages/HomePage.js";

const VirtualPet: CustomPostComponent = (context) => {
  const game = new VirtualPetGame(context);

  let page: Element;
  switch (game.viewState.name) {
    case ViewStateName.VirtualPet:
      page = <HomePage game={game} />;
      break;
    default:
      exception(`no page defined for ${game.viewState.name}`);
  }

  return (
    <blocks height='tall'>
      {page}
    </blocks>
  );
};

const VirtualPetCustomPost: CustomPostType = {
  name: 'VirtualPet',
  render: (context) => <VirtualPet { ...context } />
};

export default VirtualPetCustomPost;
