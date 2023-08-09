import exp from "constants";
import {
  NUMERICS_MAX_DATE_MS
} from "../src/VirtualPet/constants.js";
import { Meal } from "../src/VirtualPet/types/Meal.js";
import {
  reduce,
  SimulationActionName,
  SimulationState,
  SimulationStateName
} from "../src/VirtualPet/types/SimulationState.js";
import {
  vi,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  describe,
  it
} from 'vitest';

const fakeRandom = vi.spyOn(global.Math, 'random');

beforeAll(() => { });

beforeEach(() => {
  fakeRandom.mockReturnValue(0);
  vi.useFakeTimers();
});

afterEach(() => {
  fakeRandom.mockClear();
  vi.useRealTimers();
});

afterAll(() => { });

describe(`A virtual pet in the ${SimulationStateName.Egg} actual`, () => {
  it('can hatch', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Egg,
      hunger: 0,
      happiness: 0,
      discipline: 0,
      weight: 0,
      ticks: 0
    };

    var actual = reduce(sut, { name: SimulationActionName.Hatch });

    expect(actual.name).toBe(SimulationStateName.Idle);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Idle} actual`, () => {
  it('gets hungier, unhappier, and less disciplined over time', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 100,
      happiness: 50,
      discipline: 40,
      weight: 0,
      ticks: 3
    };

    var actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 20,
      hunger: 10,
      discipline: 30,
    });

    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.hunger).toBe(90);
    expect(actual.happiness).toBe(30);
    expect(actual.discipline).toBe(10);
    expect(actual.ticks).toBe(4);
  });

  it(`can get hungry`, () => {
    var sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 30,
      happiness: 30,
      discipline: 100,
      weight: 0,
      ticks: 0
    };

    var actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 10,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.hunger).toBe(20);
  });

  it(`can get hungry (priority check)`, () => {
    var sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 30,
      happiness: 30,
      discipline: 100,
      weight: 0,
      ticks: 0
    };

    var actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 10,
      hunger: 10,
      discipline: 0,
    });

    // hungry takes priority
    expect(actual.name).toBe(SimulationStateName.Hungry);
  });

  it(`can become unhappy`, () => {
    var sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 30,
      happiness: 30,
      discipline: 100,
      weight: 0,
      ticks: 0
    };

    var actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 10,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
    expect(actual.happiness).toBe(20);
  });

  it(`will poop sometimes`, () => {
    fakeRandom.mockReturnValue(1);
    vi.setSystemTime(2); // guarantee that sickness doesn't occur

    var sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 30,
      happiness: 30,
      discipline: 100,
      weight: 0,
      ticks: 0
    };

    var actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Pooping);
  });

  it(`can get sick sometimes`, () => {
    fakeRandom.mockReturnValue(1);
    vi.setSystemTime(NUMERICS_MAX_DATE_MS);

    var sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 30,
      happiness: 30,
      discipline: 100,
      weight: 0,
      ticks: 0
    };

    var actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Sick);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Sick} actual`, () => {
  it('can take medicine', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 2
    };

    var actual = reduce(sut, { name: SimulationActionName.AdministerMedicine });

    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.ticks).toBe(0);
  });

  it ('can die', () => {
    const timeOfDeath = 1000;
    vi.setSystemTime(timeOfDeath);

    var sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    var actual = reduce(sut, { name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Dead);
    expect(actual.ticks).toBe(0);
    expect(actual.timeOfDeath).toBe(timeOfDeath);
  });

  it ('can be hungry after taking medicine', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 20,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 0
    };

    var actual = reduce(sut, { name: SimulationActionName.AdministerMedicine });

    expect(actual.name).toBe(SimulationStateName.Hungry);
  });

  it ('can be hungry after taking medicine (priority check)', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 20,
      happiness: 20,
      discipline: 100,
      weight: 100,
      ticks: 0
    };

    var actual = reduce(sut, { name: SimulationActionName.AdministerMedicine });

    expect(actual.name).toBe(SimulationStateName.Hungry);
  });

  it ('can be unhappy after taking medicine', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 100,
      happiness: 20,
      discipline: 100,
      weight: 100,
      ticks: 0
    };

    var actual = reduce(sut, { name: SimulationActionName.AdministerMedicine });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Hungry} actual`, () => {
  it('can be sated', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Hungry,
      hunger: 20,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 2
    };

    var actual = reduce(sut, {
      name: SimulationActionName.Feed,
      meal: Meal.Hamburger
    });

    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.hunger).toBe(40);
    expect(actual.ticks).toBe(0);
  });

  it('can remain hungry after eating', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Hungry,
      hunger: 5,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 2
    };

    var actual = reduce(sut, {
      name: SimulationActionName.Feed,
      meal: Meal.Hamburger
    });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.hunger).toBe(25);
    expect(actual.ticks).toBe(3);
  });

  it('can become unhappy after eating', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Hungry,
      hunger: 20,
      happiness: 0,
      discipline: 100,
      weight: 100,
      ticks: 2
    };

    var actual = reduce(sut, {
      name: SimulationActionName.Feed,
      meal: Meal.Hamburger
    });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
    expect(actual.hunger).toBe(40);
    expect(actual.happiness).toBe(20);
    expect(actual.ticks).toBe(0);
  });

  it('can get sick if it is not fed', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Hungry,
      hunger: 20,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    var actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Sick);
    expect(actual.ticks).toBe(0);
  });
});
