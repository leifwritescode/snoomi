import {
  reduce,
  SimulationActionName,
  SimulationState,
  SimulationStateName
} from "../src/VirtualPet/types/SimulationState.js";

describe(`State Machine Transitions: ${SimulationStateName.Egg}`, () => {
  test(`When the action is ${SimulationActionName.Hatch}`, () => {
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

describe(`State Machine Transitions: ${SimulationStateName.Idle}`, () => {
  describe(`When the action is ${SimulationActionName.WelfareTick}`, () => {
    test('And Hunger falls below 25', () => {
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

    test('And Happiness falls below 25', () => {
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

    test('And both Hunger and Happiness fall below 25', () => {
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
  });
});
