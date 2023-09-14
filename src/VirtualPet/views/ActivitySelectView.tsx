import { Devvit } from "@devvit/public-api";
import { VirtualPetComponent } from "./VirtualPetComponent.js";
import { ViewActionName } from "../types/ViewState.js";

const ActivitySelectView: VirtualPetComponent = ({ game }) => {
  return (
    <button onPress={() => game.navigate({ name: ViewActionName.GoToFinishedActivity, activity: "Reading" })}>Quick go!</button>
  );
};

export default ActivitySelectView;
