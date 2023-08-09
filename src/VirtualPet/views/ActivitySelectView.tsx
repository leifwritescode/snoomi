import { Devvit } from "@devvit/public-api";
import { VirtualPetComponent } from "../types/VirtualPetComponent.js";
import { ViewActionName } from "../types/ViewState.js";

const ActivitySelectView: VirtualPetComponent = (context) => {
  return (
    <button onPress={() => context.setViewState({ name: ViewActionName.GoToFinishedActivity, activity: "Reading" })}>Quick go!</button>);
};

export default ActivitySelectView;
