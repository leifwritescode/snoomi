import {
  reduce,
  SimulationActionName,
  SimulationState,
  SimulationStateName
} from "../src/VirtualPet/types/SimulationState.js";

describe(`A virtual pet in the ${SimulationStateName.Egg} state`, () => {
  it('can hatch', () => {
    var sut: SimulationState = {
      name: SimulationStateName.Egg,
      hunger: 0,
      happiness: 0,
      discipline: 0,
      weight: 0,
      ticks: 0
    };

    var state = reduce(sut, { name: SimulationActionName.Hatch });

    expect(state.name).toBe(SimulationStateName.Idle);
  });
});

describe(`A virtual pet in the ${SimulationStateName.Idle} state`, () => {
  describe(`reduced by the ${SimulationActionName.WelfareTick} action`, () => {
    it('has the correct vitals', () => {
      var sut: SimulationState = {
        name: SimulationStateName.Idle,
        hunger: 100,
        happiness: 50,
        discipline: 40,
        weight: 0,
        ticks: 3
      };

      var state = reduce(sut, {
        name: SimulationActionName.WelfareTick,
        happiness: 20,
        hunger: 10,
        discipline: 30,
      });

      expect(state.name).toBe(SimulationStateName.Idle);
      expect(state.hunger).toBe(90);
      expect(state.happiness).toBe(30);
      expect(state.discipline).toBe(10);
      expect(state.ticks).toBe(4);
    });

    it(`transitions to ${SimulationStateName.Hungry} when hunger falls below a predetermined threshold`, () => {
      var sut: SimulationState = {
        name: SimulationStateName.Idle,
        hunger: 30,
        happiness: 30,
        discipline: 100,
        weight: 0,
        ticks: 0
      };

      var state = reduce(sut, {
        name: SimulationActionName.WelfareTick,
        happiness: 0,
        hunger: 10,
        discipline: 0,
      });

      expect(state.name).toBe(SimulationStateName.Hungry);
      expect(state.hunger).toBe(20);
    });

    it(`transitions to ${SimulationStateName.Unhappy} when happiness falls below a predetermined threshold`, () => {
      var sut: SimulationState = {
        name: SimulationStateName.Idle,
        hunger: 30,
        happiness: 30,
        discipline: 100,
        weight: 0,
        ticks: 0
      };

      var state = reduce(sut, {
        name: SimulationActionName.WelfareTick,
        happiness: 10,
        hunger: 0,
        discipline: 0,
      });

      expect(state.name).toBe(SimulationStateName.Unhappy);
      expect(state.happiness).toBe(20);
    });

    it(`transitions to ${SimulationStateName.Hungry} when both hunger and happiness fall below a predetermined threshold`, () => {
      var sut: SimulationState = {
        name: SimulationStateName.Idle,
        hunger: 30,
        happiness: 30,
        discipline: 100,
        weight: 0,
        ticks: 0
      };

      var state = reduce(sut, {
        name: SimulationActionName.WelfareTick,
        happiness: 10,
        hunger: 10,
        discipline: 0,
      });

      // hungry takes priority
      expect(state.name).toBe(SimulationStateName.Hungry);
    });

    it(`transitions to ${SimulationStateName.Pooping} when a type-a random event occurs`, () => {
      var sut: SimulationState = {
        name: SimulationStateName.Idle,
        hunger: 30,
        happiness: 30,
        discipline: 100,
        weight: 0,
        ticks: 0
      };

      var state = reduce(sut, {
        name: SimulationActionName.WelfareTick,
        happiness: 0,
        hunger: 0,
        discipline: 0,
      });

      expect(state.name).toBe(SimulationStateName.Pooping);
    });

    it(`transitions to ${SimulationStateName.Sick} when a type-b random event occurs`, () => {
      var sut: SimulationState = {
        name: SimulationStateName.Idle,
        hunger: 30,
        happiness: 30,
        discipline: 100,
        weight: 0,
        ticks: 0
      };

      var state = reduce(sut, {
        name: SimulationActionName.WelfareTick,
        happiness: 0,
        hunger: 0,
        discipline: 0,
      });

      expect(state.name).toBe(SimulationStateName.Sick);
    });
  });
});
