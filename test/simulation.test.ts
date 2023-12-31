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
import { Activity } from "../src/VirtualPet/enums/Activity.js";

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

describe(`A virtual pet in the ${SimulationStateName.Egg} state`, () => {
  it('can hatch', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Egg,
      hunger: 0,
      happiness: 0,
      discipline: 0,
      weight: 0,
      ticks: 0
    };

    const actual = reduce(sut, { name: SimulationActionName.Hatch });

    // todo these will change to "sensible" defaults that are based on genetics
    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(50);
    expect(actual.weight).toBe(50);
    expect(actual.ticks).toBe(0);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Idle} state`, () => {
  it('gets hungier, unhappier, and less disciplined over time', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 0,
      ticks: 3
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      hunger: 10,
      happiness: 20,
      discipline: 30,
    });

    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.hunger).toBe(90);
    expect(actual.happiness).toBe(80);
    expect(actual.discipline).toBe(70);
    expect(actual.ticks).toBe(4);
    expect(actual.weight).toBe(0);
  });

  it(`can get hungry`, () => {
    const sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 30,
      happiness: 100,
      discipline: 100,
      weight: 0,
      ticks: 1
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      hunger: 10,
      happiness: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.hunger).toBe(20);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.ticks).toBe(0);
    expect(actual.weight).toBe(0);
  });

  it(`can get hungry (priority check)`, () => {
    const sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 30,
      happiness: 30,
      discipline: 100,
      weight: 0,
      ticks: 1
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 10,
      hunger: 10,
      discipline: 0,
    });

    // hungry takes priority
    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.hunger).toBe(20);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(100);
    expect(actual.ticks).toBe(0);
    expect(actual.weight).toBe(0);
  });

  it(`can become unhappy`, () => {
    const sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 100,
      happiness: 30,
      discipline: 100,
      weight: 0,
      ticks: 0
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      hunger: 0,
      happiness: 10,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(100);
    expect(actual.ticks).toBe(0);
    expect(actual.weight).toBe(0);
  });

  it(`will poop sometimes`, () => {
    fakeRandom.mockReturnValue(1);
    vi.setSystemTime(2); // guarantee that sickness doesn't occur

    const sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 0,
      ticks: 2
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Pooping);
    expect(actual.happiness).toBe(100);
    expect(actual.hunger).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.ticks).toBe(0);
    expect(actual.weight).toBe(0);
  });

  it(`can get sick sometimes`, () => {
    fakeRandom.mockReturnValue(1);
    vi.setSystemTime(NUMERICS_MAX_DATE_MS);

    const sut: SimulationState = {
      name: SimulationStateName.Idle,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 0,
      ticks: 2
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Sick);
    expect(actual.happiness).toBe(100);
    expect(actual.hunger).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.ticks).toBe(0);
    expect(actual.weight).toBe(0);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Sick} state`, () => {
  it('can take medicine', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 2
    };

    const actual = reduce(sut, { name: SimulationActionName.AdministerMedicine });

    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it ('can die', () => {
    const timeOfDeath = 1000;
    vi.setSystemTime(timeOfDeath);

    const sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, { name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Dead);
    expect(actual.ticks).toBe(0);
    expect(actual.timeOfDeath).toBe(timeOfDeath);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it ('can be hungry after taking medicine', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 20,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 0
    };

    const actual = reduce(sut, { name: SimulationActionName.AdministerMedicine });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(20);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it ('can be hungry after taking medicine (priority check)', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 20,
      happiness: 20,
      discipline: 100,
      weight: 100,
      ticks: 0
    };

    const actual = reduce(sut, { name: SimulationActionName.AdministerMedicine });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(20);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it ('can be unhappy after taking medicine', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Sick,
      hunger: 100,
      happiness: 20,
      discipline: 100,
      weight: 100,
      ticks: 0
    };

    const actual = reduce(sut, { name: SimulationActionName.AdministerMedicine });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);  
  });
});

describe(`A virtual pet in the ${SimulationStateName.Hungry} state`, () => {
  it('can be sated', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Hungry,
      hunger: 20,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 2
    };

    const actual = reduce(sut, {
      name: SimulationActionName.Feed,
      meal: Meal.Hamburger
    });

    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.hunger).toBe(40);
    expect(actual.ticks).toBe(0);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it('can remain hungry after eating', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Hungry,
      hunger: 5,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 2
    };

    const actual = reduce(sut, {
      name: SimulationActionName.Feed,
      meal: Meal.Hamburger
    });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.hunger).toBe(25);
    expect(actual.ticks).toBe(3);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it('can become unhappy after eating', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Hungry,
      hunger: 20,
      happiness: 0,
      discipline: 100,
      weight: 100,
      ticks: 2
    };

    const actual = reduce(sut, {
      name: SimulationActionName.Feed,
      meal: Meal.Hamburger
    });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
    expect(actual.hunger).toBe(40);
    expect(actual.happiness).toBe(5);
    expect(actual.ticks).toBe(0);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it('can get sick if it is not fed', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Hungry,
      hunger: 20,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Sick);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(20);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Pooping} state`, () => {
  it('can poop', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Pooping,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Unsanitary);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(90);
    expect(actual.weight).toBe(100);
  });

  it('can become unhappy', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Pooping,
      hunger: 100,
      happiness: 20,
      discipline: 100,
      weight: 100,
      ticks: 3
    };
      
    const actual = reduce(sut, { name: SimulationActionName.GoToBathroom });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it ('can become hungry', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Pooping,
      hunger: 20,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, { name: SimulationActionName.GoToBathroom });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(20);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it ('can become hungry (priority check)', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Pooping,
      hunger: 20,
      happiness: 20,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, { name: SimulationActionName.GoToBathroom });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(20);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it ('can go to the bathroom', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Pooping,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, { name: SimulationActionName.GoToBathroom });

    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Unsanitary} state`, () => {
  it('can be cleaned', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Unsanitary,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, { name: SimulationActionName.Clean });

    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it('can become unhappy', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Unsanitary,
      hunger: 100,
      happiness: 20,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, { name: SimulationActionName.Clean });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it ('can become hungry', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Unsanitary,
      hunger: 20,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, { name: SimulationActionName.Clean });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(20);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it('can become hungry (priority check)', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Unsanitary,
      hunger: 20,
      happiness: 20,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, { name: SimulationActionName.Clean });

    expect(actual.name).toBe(SimulationStateName.Hungry);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(20);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it('can become sick', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Unsanitary,
      hunger: 100,
      happiness: 100,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, { name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Sick);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(100);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Unhappy} state`, () => {
  it('gets hungier, unhappier, and less disciplined over time', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Unhappy,
      hunger: 100,
      happiness: 50,
      discipline: 40,
      weight: 0,
      ticks: 1
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      hunger: 10,
      happiness: 20,
      discipline: 30,
    });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
    expect(actual.hunger).toBe(90);
    expect(actual.happiness).toBe(30);
    expect(actual.discipline).toBe(10);
    expect(actual.ticks).toBe(2);
    expect(actual.weight).toBe(0);
  });

  it('can be made happier', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Unhappy,
      hunger: 100,
      happiness: 25,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, {
      name: SimulationActionName.Play,
      activity: Activity.Football
    });

    expect(actual.name).toBe(SimulationStateName.Idle);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(35);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it('can remain unhappy after playing', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Unhappy,
      hunger: 100,
      happiness: 5,
      discipline: 100,
      weight: 100,
      ticks: 2
    };

    const actual = reduce(sut, {
      name: SimulationActionName.Play,
      activity: Activity.Football
    });

    expect(actual.name).toBe(SimulationStateName.Unhappy);
    expect(actual.ticks).toBe(3);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(15);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it('can get sick if it is not played with', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Unhappy,
      hunger: 100,
      happiness: 20,
      discipline: 100,
      weight: 100,
      ticks: 3
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Sick);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(100);
    expect(actual.weight).toBe(100);
  });

  it ('may randomly poop defiantly', () => {
    fakeRandom.mockReturnValue(1);

    const sut: SimulationState = {
      name: SimulationStateName.Unhappy,
      hunger: 100,
      happiness: 20,
      discipline: 25,
      weight: 100,
      ticks: 1
    };

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 0,
      hunger: 0,
      discipline: 0,
    });

    expect(actual.name).toBe(SimulationStateName.Unsanitary);
    expect(actual.ticks).toBe(0);
    expect(actual.hunger).toBe(100);
    expect(actual.happiness).toBe(20);
    expect(actual.discipline).toBe(15);
    expect(actual.weight).toBe(100);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Dead} state`, () => {
  it('cannot be fed', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Dead,
      hunger: 0xDEAD,
      happiness: 0xDEAD,
      discipline: 0xDEAD,
      weight: 0xDEAD,
      ticks: 0,
      timeOfDeath: 0xDEAD
    };

    const actual = reduce(sut, {
      name: SimulationActionName.Feed,
      meal: Meal.Hamburger
    });

    expect(actual).toEqual(sut);
  });

  it('cannot be played with', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Dead,
      hunger: 0xDEAD,
      happiness: 0xDEAD,
      discipline: 0xDEAD,
      weight: 0xDEAD,
      ticks: 0,
      timeOfDeath: 0xDEAD
    };

    const actual = reduce(sut, {
      name: SimulationActionName.Play,
      activity: Activity.Football
    });

    expect(actual).toEqual(sut);
  });

  it('cannot be cleaned', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Dead,
      hunger: 0xDEAD,
      happiness: 0xDEAD,
      discipline: 0xDEAD,
      weight: 0xDEAD,
      ticks: 0,
      timeOfDeath: 0xDEAD
    };

    const actual = reduce(sut, { name: SimulationActionName.Clean });

    expect(actual).toEqual(sut);
  });

  it('cannot be administered medicine', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Dead,
      hunger: 0xDEAD,
      happiness: 0xDEAD,
      discipline: 0xDEAD,
      weight: 0xDEAD,
      ticks: 0,
      timeOfDeath: 0xDEAD
    };

    const actual = reduce(sut, { name: SimulationActionName.AdministerMedicine });

    expect(actual).toEqual(sut);
  });

  it('cannot go to the bathroom', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Dead,
      hunger: 0xDEAD,
      happiness: 0xDEAD,
      discipline: 0xDEAD,
      weight: 0xDEAD,
      ticks: 0,
      timeOfDeath: 0xDEAD
    };

    const actual = reduce(sut, { name: SimulationActionName.GoToBathroom });

    expect(actual).toEqual(sut);
  });

  it('cannot hatch', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Dead,
      hunger: 0xDEAD,
      happiness: 0xDEAD,
      discipline: 0xDEAD,
      weight: 0xDEAD,
      ticks: 0,
      timeOfDeath: 0xDEAD
    };

    const actual = reduce(sut, { name: SimulationActionName.Hatch });

    expect(actual).toEqual(sut);
  });

  it('can tick', () => {
    const sut: SimulationState = {
      name: SimulationStateName.Dead,
      hunger: 0xDEAD,
      happiness: 0xDEAD,
      discipline: 0xDEAD,
      weight: 0xDEAD,
      ticks: 0,
      timeOfDeath: 0xDEAD
    };

    vi.setSystemTime(0xDEAD);

    const actual = reduce(sut, {
      name: SimulationActionName.WelfareTick,
      happiness: 20,
      hunger: 20,
      discipline: 20,
    });

    expect(actual).not.toEqual(sut);
    expect(actual.name).toBe(SimulationStateName.Dead);
    expect(actual.ticks).toBe(1);
    expect(actual.timeOfDeath).toBe(0xDEAD);
    expect(actual.hunger).toBe(0xDEAD);
    expect(actual.happiness).toBe(0xDEAD);
    expect(actual.discipline).toBe(0xDEAD);
    expect(actual.weight).toBe(0xDEAD);
  });
});
