
export function scalarInverse(value: number) : number {
  return value * -1;
}

export function clamp(value: number, min: number, max: number) : number {
  return Math.min(Math.max(value, min), max);
}