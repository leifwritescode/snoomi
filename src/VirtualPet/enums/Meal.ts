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

interface NutritionalValues {
  [key: string]: NutritionalValue;
} 

export const NutritionalValues: NutritionalValues = {
  Hamburger: {
    hunger: 20,
    happiness: 5,
    weight: 15
  },
  Salad: {
    hunger: 20,
    happiness: 5,
    weight: -15,
  },
  Fruit: {
    hunger: 10,
    happiness: 15,
    weight: -5
  },
  Candy: {
    hunger: 5,
    happiness: 20,
    weight: 30
  }
};
