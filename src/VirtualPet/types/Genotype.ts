import { Gene } from "./Gene.js";

export type Genotype = {
    // Appearance: Influences the snoovatar representing the Snoomagotchi.
    top: Gene;
    bottom: Gene;
    hat: Gene;
    face: Gene;
    leftHand: Gene;
    rightHand: Gene;
    environment: Gene;

    // Interactivity: Influences rate of change in happiness, discpline, and hunger measures.
    happiness: Gene;
    discipline: Gene;
    hunger: Gene;

    // Hidden: Influences measures that aren't explicitly exposed to the player.
    weight: Gene;
    intelligence: Gene;
    aging: Gene;
}
