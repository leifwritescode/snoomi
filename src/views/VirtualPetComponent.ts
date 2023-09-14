import { Devvit } from "@devvit/public-api";
import VirtualPetGame from "../VirtualPetGame.js";

export type VirtualPetComponentProps = {
  game: VirtualPetGame
};

export type VirtualPetComponent = Devvit.BlockComponent<VirtualPetComponentProps>;
