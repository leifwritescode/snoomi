import { Context } from "@devvit/public-api";
import { VirtualPet } from "../VirtualPet.js";
import { ViewAction, ViewState } from "./ViewState.js";

export type VirtualPetComponentContext = Context & {
  getVirtualPet: () => VirtualPet;
  setVirtualPet: (virtualPet: VirtualPet) => void;
  getViewState: () => ViewState
  setViewState: (action: ViewAction) => void;
}

export type VirtualPetComponent = (context: VirtualPetComponentContext) => JSX.Element;
