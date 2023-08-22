import { VirtualPet } from "../src/VirtualPet/VirtualPet.js";
import { Gene } from "../src/VirtualPet/Genetics/Genotype.js";
import { Conditions } from "../src/VirtualPet/Simulation/Conditions.js";

const zero: Gene = { primary: 0, hidden0: 0, hidden1: 0, hidden2: 0 };

/**
 * a genetically neutral virtual pet for testing
 */
export const testVirtualPet: VirtualPet = {
  name: "test",
  owner: "test",
  birthdate: Date.now(),
  age: 0,
  generation: 0,
  genotype: {
    appearance: {
      hat: zero,
      face: zero,
      top: zero,
      leftHand: zero,
      rightHand: zero,
      bottom: zero,
      device: zero
    },
    personality: {
      energetic: zero,
      calm: zero,
      curious: zero,
      daredevil: zero,
      agile: zero,
      unafraid: zero,
      imaginative: zero,
      eidetic: zero
    },
    nutritionalNeeds: {
      carnivory: zero,
      herbivory: zero,
      entomophagy: zero,
      piscivory: zero,
      frugivory: zero,
      fungivory: zero
    },
    nutritionalPrefs: {
      carnivory: zero,
      herbivory: zero,
      entomophagy: zero,
      piscivory: zero,
      frugivory: zero,
      fungivory: zero
    },
    health: {
      resilience: zero,
      metabolism: zero,
      delinquency: zero,
      immunity: zero
    }
  },
  state: {
    is: Conditions.InGoodHealth,
    hunger: 100,
    happiness: 100,
    discipline: 100,
    weight: 50,
    ticks: 0
  }
};

