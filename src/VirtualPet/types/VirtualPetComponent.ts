import { Context, UseStateResult } from "@devvit/public-api";
import { VirtualPet } from "../VirtualPet.js";
import { ViewActionName, ViewState } from "./ViewState.js";

export type VirtualPetComponentContext = Context & {
  getVirtualPet: () => VirtualPet;
  setVirtualPet: (virtualPet: VirtualPet) => void;
  getViewState: () => ViewState
  setViewState: (action: ViewActionName) => void;
}

export type VirtualPetComponent = (context: VirtualPetComponentContext) => JSX.Element;
