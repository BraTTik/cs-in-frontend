import { indexOf, lastIndexOf } from "../index-of.ts";

const ages = [12, 42, 42, 42, 56];

const pivot = 42;
const nonExist = 1000;

const userPredicate = (item: { age: number }) => item.age;

const users = [
  { age: 12, name: 'Bob' },
  { age: 42, name: 'Ben' },
  { age: 42, name: 'Jack' },
  { age: 42, name: 'Sam' },
  { age: 56, name: 'Bill' }
];


describe("indexOf", () => {
  it("finds first index", () => {
    expect(indexOf(ages, pivot)).toBe(1);
    expect(indexOf(users, pivot, userPredicate)).toBe(1);
  })

  it("returns -1 if not found", () => {
    expect(indexOf(ages, nonExist)).toBe(-1);
    expect(indexOf(users, nonExist, userPredicate)).toBe(-1);
  })
})

describe("lastIndexOf", () => {
  it("finds last index", () => {
    expect(lastIndexOf(ages, pivot)).toBe(3);
    expect(lastIndexOf(users, pivot, userPredicate)).toBe(3);
  })

  it("returns -1 if not found", () => {
    expect(lastIndexOf(ages, nonExist)).toBe(-1);
    expect(lastIndexOf(users, nonExist, userPredicate)).toBe(-1);
  })
})
