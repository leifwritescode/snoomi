import { getRandomNumberInRange } from "../utilities.js";

/**
 * A single gene that influences some aspect of a virtual pet's behavior, preferences, or appearance.
 * Each gene has a primary value and three hidden values.
 * The primary value is the gene's dominant expression.
 * The hidden values are recessive expressions that may be passed on to offspring but are not expressed in the parent.
 */
type Gene = {
  primary: number;
  hidden0: number;
  hidden1: number;
  hidden2: number;
};

/**
 * Genes that express afinity for mini-game mechanics.
 */
export type Personality = {
  /**
   * Influences affinity for physical games.
   */
  energetic: Gene;

  /**
   * Influences affinity for strategic games.
   */
  calm: Gene;

  /**
   * Influences affinity for puzzle games.
   */
  curious: Gene;

  /**
   * Influences affinity for higher-risk games.
   */
  daredevil: Gene;

  /**
   * Influences affinity for precision games.
   */
  agile: Gene;

  /**
   * Influences affinity for games that don't require precision.
   */
  clumsy: Gene;

  /**
   * Influences affinity for creative games.
   */
  imaginative: Gene;

  /**
   * Influences affinity for memory games.
   */
  eidetic: Gene;
};

/**
 * Genes that express virtual pet appearance.
 */
export type Appearance = {
  /**
   * Influences the pet's headwear.
   */
  hat: Gene;

  /**
   * Influences the pet's face.
   */
  face: Gene;

  /**
   * Influences the pet's top.
   */
  top: Gene;

  /**
   * Influences the pet's left hand.
   */
  leftHand: Gene;

  /**
   * Influences the pet's right hand.
   */
  rightHand: Gene;

  /**
   * Influences the pet's bottom.
   */
  bottom: Gene;

  /**
   * Influences the pet's environment.
   */
  device: Gene;
};

/**
 * Genes that express nutritional needs and preferences.
 */
export type Nutrition = {
  /**
   * Influences affinity for red- and white meat.
   */
  carnivory: Gene;

  /**
   * Influences affinity for plant-based foods.
   */
  herbivory: Gene;

  /**
   * Influences affinity for insects.
   */
  entomophagy: Gene;

  /**
   * Influences affinity for fish and seafood.
   */
  piscivory: Gene;

  /**
   * Influences affinity for fruit, nuts, and seeds.
   */
  frugivory: Gene;

  /**
   * Influences affinity for mushrooms and other fungi.
   */
  fungivory: Gene;
};

/**
 * The complete set of genes that describe a virtual pet.
 */
export type Genotype = {
  /**
   * Genes that express the pet's appearance.
   */
  appearance: Appearance;

  /**
   * Genes that express the pet's personality.
   */
  personality: Personality;

  /**
   * Genes that express the pet's nutritional needs.
   */
  nutritionalNeeds: Nutrition;

  /**
   * Genes that express the pet's nutritional preferences.
   */
  nutritionalPrefs: Nutrition;

  // Interactivity: Influences rate of change in happiness, discpline, and hunger measures.
  happiness: Gene;
  discipline: Gene;
  hunger: Gene;

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
};

/** Get a new gene with random values
 * @returns a new gene with random values
 */
const makeNewGene = (geneticValueFactory: {():number}) : Gene => {
  return {
      primary: geneticValueFactory(),
      hidden0: geneticValueFactory(),
      hidden1: geneticValueFactory(),
      hidden2: geneticValueFactory()
  }
}

const randomGenotypeGene = (): number => {
  return getRandomNumberInRange(-2, 2);
};

const randomPhenotypeGene = (): number => {
  return getRandomNumberInRange(1, 10);
};

export const newFirstGenerationGenotype = (): Genotype => {
  return {
    happiness: makeNewGene(randomGenotypeGene),
    discipline: makeNewGene(randomGenotypeGene),
    hunger: makeNewGene(randomGenotypeGene),
    weight: makeNewGene(randomGenotypeGene),
    intelligence: makeNewGene(randomGenotypeGene),
    aging: makeNewGene(randomGenotypeGene),
  };
};

export const newFirstGenerationPhenotype = (): Appearance => {
  return {
    top: makeNewGene(randomPhenotypeGene),
    bottom: makeNewGene(randomPhenotypeGene),
    hat: makeNewGene(randomPhenotypeGene),
    face: makeNewGene(randomPhenotypeGene),
    leftHand: makeNewGene(randomPhenotypeGene),
    rightHand: makeNewGene(randomPhenotypeGene),
    environment: makeNewGene(randomPhenotypeGene)
  };
};
