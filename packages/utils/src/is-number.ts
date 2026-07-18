export function isNumber(n: unknown): n is number {
  return typeof n === 'number' && !isNaN(n);
}

export function isInteger(n: unknown): boolean {
  return isNumber(n) && (n % 1 === 0);
}
