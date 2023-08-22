import { getRandomNumberInRange } from "../utilities.js";

/**
 * A single gene that influences some aspect of a virtual pet's behavior, preferences, or appearance.
 * Each gene has a primary value and three hidden values.
 * The primary value is the gene's dominant expression.
 * The hidden values are recessive expressions that may be passed on to offspring but are not expressed in the parent.
 */
export type Gene = {
  primary: number;
  hidden0: number;
  hidden1: number;
  hidden2: number;
};

/**
 * Genes that express afinity for mini-game mechanics.
 */
type Personality = {
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
   * Influences affinity for spooky games.
   */
  unafraid: Gene;

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
type Appearance = {
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
type Nutrition = {
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

type Health = {
  /**
   * Affects the rate of change in the pet's happiness measure.
   */
  resilience: Gene;

  /**
   * Affects the rate of change in the pet's hunger measure.
   */
  metabolism: Gene;

  /**
   * Affects the rate of change in the pet's discipline measure.
   */
  delinquency: Gene;

  /**
   * Affects the chance that the pet might become ill.
   */
  immunity: Gene;
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

  /**
   * Genes that express the pet's rate-of-change in health-related measures.
   */
  health: Health;
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
    appearance: {
      top: makeNewGene(randomPhenotypeGene),
      bottom: makeNewGene(randomPhenotypeGene),
      hat: makeNewGene(randomPhenotypeGene),
      face: makeNewGene(randomPhenotypeGene),
      leftHand: makeNewGene(randomPhenotypeGene),
      rightHand: makeNewGene(randomPhenotypeGene),
      device: makeNewGene(randomPhenotypeGene)
    },
    personality: {
      energetic: makeNewGene(randomGenotypeGene),
      calm: makeNewGene(randomGenotypeGene),
      curious: makeNewGene(randomGenotypeGene),
      daredevil: makeNewGene(randomGenotypeGene),
      agile: makeNewGene(randomGenotypeGene),
      unafraid: makeNewGene(randomGenotypeGene),
      imaginative: makeNewGene(randomGenotypeGene),
      eidetic: makeNewGene(randomGenotypeGene)
    },
    nutritionalNeeds: {
      carnivory: makeNewGene(randomGenotypeGene),
      herbivory: makeNewGene(randomGenotypeGene),
      entomophagy: makeNewGene(randomGenotypeGene),
      piscivory: makeNewGene(randomGenotypeGene),
      frugivory: makeNewGene(randomGenotypeGene),
      fungivory: makeNewGene(randomGenotypeGene)
    },
    nutritionalPrefs: {
      carnivory: makeNewGene(randomGenotypeGene),
      herbivory: makeNewGene(randomGenotypeGene),
      entomophagy: makeNewGene(randomGenotypeGene),
      piscivory: makeNewGene(randomGenotypeGene),
      frugivory: makeNewGene(randomGenotypeGene),
      fungivory: makeNewGene(randomGenotypeGene)
    },
    health: {
      resilience: makeNewGene(randomGenotypeGene),
      metabolism: makeNewGene(randomGenotypeGene),
      delinquency: makeNewGene(randomGenotypeGene),
      immunity: makeNewGene(randomGenotypeGene)
    }
  };
};
