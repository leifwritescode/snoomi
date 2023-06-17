/**
 * Get a random number in the given range
 * @param min min value in range
 * @param max max value in range
 * @returns a value x satisfying min <= x <= max
 */
export function getRandomNumberInRange(min: number, max: number) : number {
   const r = Math.random();
   return Math.round(r * (max - min + 1) + min);
}
