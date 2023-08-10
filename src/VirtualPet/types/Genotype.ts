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
    // holy butts why didn't i think of this before: dietary behaviours are a great way to introduce variance here
    // at a high level this will be a set of genes that influence how the pet feels about different foods.
    // e.g tendency toward carnivorous, omnivorous, herbivorous, etc.
    // thinking about this some more, what if the way you feed your pet as it grows influences its dominant dietary behaviour??
    // this is a great way to introduce a sense of ownership over the pet's personality.
    // but also creates an element of unpredictability that makes the pet feel more alive.
    // as their genes will be informed during the proccess of raising them.
    // there's a lot of potential here, but with added depth comes added complexity.
    weight: Gene;

    // similar story here. having this as a -/+ scale is a bit opinionated and some might find it offensive
    // i think that we can make this one work, though.
    // intelligence is a positive scale that only impacts how the pet feels about cerebral games.
    // we introduce another gene, sportiness that impacts how the pet feels about physical games.
    // perhaps a third gene, for somewhere in between.
    // okay so: PERSONALITY TRAITS! that influence affinity for a given game
    // energetic: expresses a preference for physical games
    // calm: expresses a preference for strategic games
    // curious: expresses a preference for puzzle games
    // daredevil: expresses a preference for higher-risk games
    // agility: expresses a preference for precision games
    // clumsy: expresses a preference for games that don't require precision
    // imaginative: expresses a preference for creative games
    // eidetic: expresses a preference for memory games
    // these traits overlap somewhat, which is intentional. the idea being that several genes will influence a given game, based on its mechanical elements.
    // similary to the above notes on dietary behaviours, perhaps the same may be true of personality traits.
    // i think that, from a point of view of passing on genes, there will need to be a degree of influence from the parent.
    // (or indeed from the seed genotype for a generation 0 pet)
    // changes in genetic expression need to occur at a fixed interval, and i think that should be at the point of evolution.
    intelligence: Gene;

    // not sure if we actually need this one. the idea of the aging gene is to influence how rapidly the pet can evolve
    // but there are already a lot of genes that influence the rate of change in the pet.
    aging: Gene;

    // okay, look, hear me out. what if disease exists in this world?
    // the pet can get sick via failure to feed it, failure to clean its environment, or failure to entertain it.
    // and there's a chance that the pet may randomly become unwell.
    // what if there's a gene that influences the likelihood of the pet becoming unwell?
    // and what if there's a gene that influences the likelihood of the pet recovering from illness?
    // what if adult pets can experience decline?
    // what if the pet has an adaptive metabolism, and its nutritional needs change over time?
}
