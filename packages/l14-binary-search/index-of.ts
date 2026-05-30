const self = <T>(v: T) => v;

function resolveValue <T, P>(item: T, getter: (item: T) => P = (self as (item: T) => P)): P {
  return getter(item);
}

function getHalf(start: number, end: number) {
  return start + Math.floor((end - start) / 2);
}

export function indexOf<T, P>(arr: T[], predicate: P, getter?: (item: T) => P): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const half = getHalf(left, right);
    const val = resolveValue(arr[half], getter);

    if (val === predicate) {
      const prev = indexOf(arr.slice(left, half), predicate, getter);
      if (prev >= 0) return prev + left;
      return half;
    }

    if (val < predicate) {
      left = half + 1;
    } else {
      right = half - 1;
    }
  }

  return -1
}

export function lastIndexOf<T, P>(arr: T[], predicate: P, getter?: (item: T) => P): number  {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const half = getHalf(left, right);
    const val = resolveValue(arr[half], getter);


    if (val === predicate) {
      const next = lastIndexOf(arr.slice(half + 1), predicate, getter);
      if (next >= 0) return next + half + 1;
      return half;
    }


    if (val < predicate) {
      left = half + 1;
    } else {
      right = half - 1;
    }
  }

  return -1;
}
