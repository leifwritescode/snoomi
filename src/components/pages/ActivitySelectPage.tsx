import { Devvit } from "@devvit/public-api";
import { ViewActionName } from "../../types/ViewState.js";
import { Page } from "../Page.js";

const ActivitySelectPage: Page = ({ game }) => {
  return (
    <button onPress={() => game.navigate({ name: ViewActionName.GoToFinishedActivity, activity: "Reading" })}>Quick go!</button>
  );
};

export default ActivitySelectPage;
