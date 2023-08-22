import { NUMERICS_SCALAR_HUNDRED, SIMULATION_THRESHOLD_RANDOM_EVENT, NUMERICS_MAX_DATE_MS, NUMERICS_SCALAR_THIRTY, SIMULATION_THRESHOLD_DEFIANT_POOPING } from "../constants.js";
import { scalarInverse } from "../math.js";

// random pooping occurs if (random number between 0 and 100) + (inverse discipline) > 75
// todo could alternatively do this as a random between 0 and 100 and reduce the value by x% proportional to discipline
export function randomPoopingOccurs(discipline: number): boolean {
  const r = Math.random() * NUMERICS_SCALAR_HUNDRED;
  const d = scalarInverse(discipline) + NUMERICS_SCALAR_HUNDRED;
  return (r + d) > SIMULATION_THRESHOLD_RANDOM_EVENT;
}

// random sickness occurs if (random number between 0 and number.max) == date.now()
// todo this logic makes random sickness exceptionally rare slash unfortunate. needs to be somewhat more likely
export function randomSicknessOccurs(): boolean {
  const r = Math.random() * NUMERICS_MAX_DATE_MS;
  return r === Date.now();
}

export function defiantPoopingOccurs(discipline: number): boolean {
  if (discipline > SIMULATION_THRESHOLD_DEFIANT_POOPING) {
    return false;
  }

  // lower discipline levels make it more likely that the pet will poop defiantly
  return (Math.random() * NUMERICS_SCALAR_THIRTY) > discipline;
}
