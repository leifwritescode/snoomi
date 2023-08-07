export enum Meal {
  None = "",
  Hamburger = "Hamburger",
  Salad = "Salad",
  Fruit = "Fruit",
  Candy = "Candy"
}

type NutritionalValue = {
  hunger: number,
  happiness: number,
  weight: number,
}

export const getNutritionalValue = (meal: Meal) : NutritionalValue => {
  switch (meal) {
    case Meal.Hamburger:
      return { hunger: 20, happiness: 5, weight: 15 };
    case Meal.Salad:
      return { hunger: 20, happiness: 5, weight: -15 };
    case Meal.Fruit:
      return { hunger: 10, happiness: 15, weight: -5 };
    case Meal.Candy:
      return { hunger: 5, happiness: 20, weight: 30 };
    default:
      throw new Error(`Unknown meal: ${meal}`);
  }
};
