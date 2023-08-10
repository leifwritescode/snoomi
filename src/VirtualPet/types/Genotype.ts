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
    // proposal: we replace weight with a set of "food preferences" genes that influence the pets nutritional needs.
    // failing to meet a pets nutritional needs may result in sickness.
    // sickness is so far has a pretty identifiable cause: hunger, unhappiness, and unsanitary environment.
    // i'm not sure how we model this in a sensiible way yet, but my brain juices are going
    weight: Gene;

    // similar story here. having this as a -/+ scale is a bit opinionated and some might find it offensive
    // i think that we can make this one work, though.
    // intelligence is a positive scale that only impacts how the pet feels about cerebral games.
    // we introduce another gene, sportiness that impacts how the pet feels about physical games.
    // perhaps a third gene, for somewhere in between.
    intelligence: Gene;

    // not sure if we actually need this one. the idea of the aging gene is to influence how rapidly the pet can evolve
    // but there are already a lot of genes that influence the rate of change in the pet.
    aging: Gene;
}
