import { hash } from "../hash.ts";

describe("hash", () => {
  describe("objects", () => {
    it("разные объекты дают разные хеши", () => {
      const a = {};
      const b = {};
      expect(hash(a)).not.toBe(hash(b));
    });

    it("одна и та же ссылка даёт одинаковый хеш", () => {
      const a = {};
      const aRef = a;
      expect(hash(a)).toBe(hash(aRef));
    });

    it("повторный вызов для того же объекта стабилен", () => {
      const obj = { x: 1 };
      const first = hash(obj);
      const second = hash(obj);
      expect(second).toBe(first);
    });

    it("разные ссылки на объекты с одинаковым содержимым дают разные хеши", () => {
      const a = { key: "value" };
      const b = { key: "value" };
      expect(hash(a)).not.toBe(hash(b));
    });

    it("массивы по идентичности ссылки, как объекты", () => {
      const a = [1, 2, 3];
      const b = [1, 2, 3];
      const aRef = a;
      expect(hash(a)).not.toBe(hash(b));
      expect(hash(a)).toBe(hash(aRef));
    });
  });

  describe("примитивы", () => {
    it("числа", () => {
      expect(hash(42)).toBe(hash(42));
      expect(hash(42)).not.toBe(hash(43));
    });

    it("bigint", () => {
      expect(hash(10n)).toBe(hash(10n));
      expect(hash(10n)).not.toBe(hash(11n));
    });

    it("boolean", () => {
      expect(hash(true)).toBe(1);
      expect(hash(false)).toBe(0);
    });

    it("null и undefined", () => {
      expect(hash(null)).toBe(hash(null));
      expect(hash(undefined)).toBe(hash(undefined));
      expect(hash(null)).not.toBe(hash(undefined));
    });
  });
});
