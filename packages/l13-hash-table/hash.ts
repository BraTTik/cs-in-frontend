export type HashValue = string | bigint | number | boolean | object | null | undefined;

const OBJECT_ID = Symbol("OBJECT_ID");

let objectId = 2 ** 16;

const nullableHashValue = Number.MAX_SAFE_INTEGER;

export function hash(value: HashValue): number {
  const type = typeof value;
  const isNull = value == null;
  if (isNull) return nullableHash(value);

  switch (type) {
    case "bigint":
    case "number":
      return numberHash(value as (number | bigint));
    case "boolean":
      return booleanHash(value as boolean);
    case "function":
    case "object":
     return objectHash(value as object);
    case "string":
      return stringHash(value as string);
    default:
      throw new TypeError(`Can't convert object to hash value! Got value type: ${type}. Value: ${value}`);
  }
}

function booleanHash(value: boolean): number {
  return Number(value);
}

function numberHash(value: number | bigint): number {
  if (typeof value === "bigint") {
    value = Number(value);
  }
  return (value % Number.MAX_SAFE_INTEGER) >>> 0;
}

function stringHash(value: string): number {
  let result: number = 0;
  let index = 0;

  for (let i of value) {
    const num = (i.charCodeAt(0) ** index) >>> 0;
    result = (result + num) >>> 0;
    index++;
  }

  return result;
}

function objectHash(value: object): number {
  if (Object.hasOwn(value, OBJECT_ID)) {
    return (value as { [OBJECT_ID]: number })[OBJECT_ID];
  }
  const hashId = objectId;
  Object.defineProperty(value, OBJECT_ID, {
    value: hashId,
    enumerable: false,
    configurable: false,
    writable: false
  })

  objectId++;

  return hashId;
}

function nullableHash(value: null | undefined): number {
  return nullableHashValue + Number(value);
}
