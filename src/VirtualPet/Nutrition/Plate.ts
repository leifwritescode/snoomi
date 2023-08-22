export type Plate = {
  meat: number,
  vegetables: number,
  fruits: number,
  mushrooms: number,
  fish: number,
  insects: number,
};

export enum DefaultMeal {
  Hamburger = 'Hamburger',
  Salad = 'Salad',
  FruitSalad = 'FruitSalad',
  MushroomSoup = 'MushroomSoup',
  BakedSalmonAndVeg = 'BakedSalmon',
  StirFriedInsects = 'FriedInsects',
  OnePotMeal = 'OnePotMeal',
};

export const DefaultPlates = {
  [DefaultMeal.Hamburger]: <Plate> {
    meat: 2,
    vegetables: 1,
    fruits: 0,
    mushrooms: 0,
    fish: 0,
    insects: 0,
  },
  [DefaultMeal.Salad]: <Plate> {
    meat: 0,
    vegetables: 2,
    fruits: 0,
    mushrooms: 1,
    fish: 0,
    insects: 0,
  },
  [DefaultMeal.FruitSalad]: <Plate> {
    meat: 0,
    vegetables: 0,
    fruits: 3,
    mushrooms: 0,
    fish: 0,
    insects: 0,
  },
  [DefaultMeal.MushroomSoup]: <Plate> {
    meat: 0,
    vegetables: 0,
    fruits: 0,
    mushrooms: 3,
    fish: 0,
    insects: 0,
  },
  [DefaultMeal.BakedSalmonAndVeg]: <Plate> {
    meat: 0,
    vegetables: 1,
    fruits: 0,
    mushrooms: 0,
    fish: 2,
    insects: 0,
  },
  [DefaultMeal.StirFriedInsects]: <Plate> {
    meat: 0,
    vegetables: 1,
    fruits: 0,
    mushrooms: 1,
    fish: 0,
    insects: 1,
  },
  [DefaultMeal.OnePotMeal]: <Plate> {
    meat: 1,
    vegetables: 1,
    fruits: 1,
    mushrooms: 1,
    fish: 1,
    insects: 1,
  },
};

