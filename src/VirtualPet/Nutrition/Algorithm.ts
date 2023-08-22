import { Genotype, Nutrition } from "../Genetics/Genotype.js";
import { clamp } from "../math.js";
import { NUTRITION_BASE_SCORE_PER_ITEM, NUTRITION_SCORE_MAX, NUTRITION_SCORE_MIN } from "./Constants.js";
import { Plate } from "./Plate.js";

type NutritionScores = {
  needs: number,
  wants: number,
};

const calculateNutrition = (plate: Plate, nutrition: Nutrition) : number => {
  /**
   * eath nutritional gene encodes a value between -2 and +2.
   * we multiply the amount of food on the plate in each category by the gene's value.
   * we then sum the results to get the nutritional modifier, and multiply it by the food's base score.
   * the base score is 10 * the amount of food on the plate.
   * 
   * todo: how is the result of this calculation used?
   * if the needs score is negative, then hunger will not change
   * if the wants score is negative, then happiness will go down and discipline may go down
   * if the wants score is positive, then happiness will go up
   * the pets metabolism, resilience, and diliquency will affect the rate of change
   * 
   * lets say the plate has 1 meat, 1 veg, and 2 fruit. the nutritional genes are -2, +2, and +1.
   * the meat will be -2, the veg will be pos 2, the fruit will be pos 2.
   * the modifier will be -2 + 2 + 2 = 2
   * the base score will be 4 * 3 = 12
   * the final score will be 2 * 12 = 24
   * 
   * the score is capped between -30 and +30
   */
  const meat = plate.meat * nutrition.carnivory.primary;
  const vegetables = plate.vegetables * nutrition.herbivory.primary;
  const fruits = plate.fruits * nutrition.frugivory.primary;
  const mushrooms = plate.mushrooms * nutrition.fungivory.primary;
  const fish = plate.fish * nutrition.piscivory.primary;
  const insects = plate.insects * nutrition.entomophagy.primary;

  const baseScore = (plate.meat + plate.vegetables + plate.fruits + plate.mushrooms + plate.fish + plate.insects) * NUTRITION_BASE_SCORE_PER_ITEM;

  const rawFinalScore = Math.round((meat + vegetables + fruits + mushrooms + fish + insects) * baseScore);

  return clamp(rawFinalScore, NUTRITION_SCORE_MIN, NUTRITION_SCORE_MAX);
};

export const calculateNutritionalScore = (plate: Plate, genes: Genotype) : NutritionScores => {
  return {
    needs: calculateNutrition(plate, genes.nutritionalNeeds),
    wants: calculateNutrition(plate, genes.nutritionalPrefs)
  };
};
