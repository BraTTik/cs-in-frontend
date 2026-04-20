import { minmax } from "../minmax.ts";

describe("minmax", () => {
  it("ограничивает значение сверху границей max", () => {
    expect(minmax(1, 10)(12)).toBe(10);
  });

  it("ограничивает значение снизу границей min", () => {
    expect(minmax(1, 10)(0)).toBe(1);
  });

  it("оставляет значение внутри диапазона без изменений", () => {
    expect(minmax(1, 10)(5)).toBe(5);
  });

  it("возвращает min при value равном min", () => {
    expect(minmax(1, 10)(1)).toBe(1);
  });

  it("возвращает max при value равном max", () => {
    expect(minmax(1, 10)(10)).toBe(10);
  });

  it("работает с отрицательными границами", () => {
    const clamp = minmax(-5, -1);
    expect(clamp(-10)).toBe(-5);
    expect(clamp(0)).toBe(-1);
    expect(clamp(-3)).toBe(-3);
  });

  it("работает когда min и max совпадают", () => {
    expect(minmax(7, 7)(0)).toBe(7);
    expect(minmax(7, 7)(100)).toBe(7);
  });
});
