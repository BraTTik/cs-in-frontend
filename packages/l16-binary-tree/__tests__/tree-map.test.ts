import { TreeMap } from "../tree-map.ts";

function entries<K extends string | number, V>(table: TreeMap<K, V>): [K, V][] {
  const result: [K, V][] = [];
  for (const entry of table) {
    result.push(entry as [K, V]);
  }
  return result;
}

type TestKey = { id: number };
const comparator = <T extends TestKey>(a: T, b: T) => a.id - b.id;

describe("TreeMap", () => {
  describe("get", () => {
    it("возвращает null для отсутствующего ключа", () => {
      const table = new TreeMap<number, number>();
      expect(table.get(404)).toBeNull();
    });

    it("возвращает значение после set", () => {
      const table = new TreeMap<number, number>();
      table.set(1, 42);
      expect(table.get(1)).toBe(42);
    });

    it("различает разные ключи", () => {
      const table = new TreeMap<number, number>();
      table.set(1, 10);
      table.set(2, 20);
      expect(table.get(1)).toBe(10);
      expect(table.get(2)).toBe(20);
      expect(table.size()).toBe(2);
    });
  });

  describe("has", () => {
    it("false для отсутствующего ключа", () => {
      const table = new TreeMap<number, number>();
      expect(table.has(0)).toBe(false);
    });

    it("true после set", () => {
      const table = new TreeMap<number, number>();
      table.set(1, 100);
      expect(table.has(1)).toBe(true);
    });

    it("false после delete", () => {
      const table = new TreeMap<number, number>();
      table.set(1, 100);
      table.delete(1);
      expect(table.has(1)).toBe(false);
    });
  });

  describe("delete", () => {
    it("возвращает null для отсутствующего ключа", () => {
      const table = new TreeMap<number, number>();
      expect(table.delete(999)).toBeNull();
    });

    it("возвращает удалённое значение", () => {
      const table = new TreeMap<number, number>();
      table.set(7, 99);
      expect(table.delete(7)).toBe(99);
      expect(table.size()).toBe(0);
    });

    it("удаляет ключ из таблицы", () => {
      const table = new TreeMap<number, number>();
      table.set(3, 1);
      table.delete(3);
      expect(table.get(3)).toBeNull();
      expect(table.has(3)).toBe(false);
      expect(table.size()).toBe(0);
    });

    it("не затрагивает другие ключи", () => {
      const table = new TreeMap<number, number>();
      table.set(1, 10);
      table.set(2, 20);
      table.delete(1);
      expect(table.get(2)).toBe(20);
      expect(table.size()).toBe(1);
    });
  });

  describe("set — обновление существующего ключа", () => {
    it("перезаписывает значение для того же ключа", () => {
      const table = new TreeMap<number, number>();
      table.set(5, 1);
      table.set(5, 2);
      expect(table.get(5)).toBe(2);
      expect(table.size()).toBe(1);
    });
  });

  describe("итерация for...of", () => {
    it("пустая таблица не даёт пар", () => {
      const table = new TreeMap<number, number>();
      expect(entries(table)).toEqual([]);
    });

    it("обходит все пары [ключ, значение]", () => {
      const table = new TreeMap<number, number>();
      table.set(1, 10);
      table.set(2, 20);
      expect(entries<number, number>(table).sort((a, b) => a[0] - b[0])).toEqual([
        [1, 10],
        [2, 20],
      ]);
    });

    it("не содержит удалённые ключи", () => {
      const table = new TreeMap<number, number>();
      table.set(1, 10);
      table.set(2, 20);
      table.delete(1);
      expect(entries(table)).toEqual([[2, 20]]);
    });

    it("возвращает ключи", () => {
      const table = new TreeMap<number, number>();
      table.set(1, 10);
      table.set(5, 50);
      table.set(3, 20);
      table.set(2, 20);

      expect(table.keys()).toEqual([1, 2, 3, 5]);
    });

    it ("возвращает значения", () => {
      const table = new TreeMap<number, number>();
      table.set(1, 10);
      table.set(5, 50);
      table.set(3, 30);
      table.set(2, 20);

      expect(table.values()).toEqual([10, 20, 30, 50]);
    })
  });

  describe("ключи-строки", () => {
    it("get: null для отсутствующего ключа", () => {
      const table = new TreeMap<string, number>();
      expect(table.get("missing")).toBeNull();
    });

    it("get: значение после set и разные строковые ключи", () => {
      const table = new TreeMap<string, number>();
      table.set("alpha", 1);
      table.set("beta", 2);
      expect(table.get("alpha")).toBe(1);
      expect(table.get("beta")).toBe(2);
      expect(table.get("alpha")).not.toBe(table.get("beta"));
    });

    it("has: false / true / false после delete", () => {
      const table = new TreeMap<string, number>();
      expect(table.has("key")).toBe(false);
      table.set("key", 10);
      expect(table.has("key")).toBe(true);
      table.delete("key");
      expect(table.has("key")).toBe(false);
    });

    it("delete: null, возвращает значение, ключ исчезает", () => {
      const table = new TreeMap<string, number>();
      expect(table.delete("ghost")).toBeNull();

      table.set("item", 42);
      expect(table.delete("item")).toBe(42);
      expect(table.get("item")).toBeNull();
    });

    it("delete не затрагивает другие строковые ключи", () => {
      const table = new TreeMap<string, number>();
      table.set("a", 1);
      table.set("b", 2);
      table.delete("a");
      expect(table.get("b")).toBe(2);
    });

    it("set перезаписывает значение для той же строки", () => {
      const table = new TreeMap<string, number>();
      table.set("k", 1);
      table.set("k", 99);
      expect(table.get("k")).toBe(99);
    });

    it("одинаковое содержимое строки — тот же ключ", () => {
      const table = new TreeMap<string, number>();
      const keyA = "shared";
      const keyB = "shared";
      table.set(keyA, 7);
      expect(table.get(keyB)).toBe(7);
      expect(table.has(keyB)).toBe(true);
    });

    it("итерация: все пары и без удалённых ключей", () => {
      const table = new TreeMap<string, number>();
      table.set("x", 10);
      table.set("y", 20);
      expect(entries<string, number>(table).sort((a, b) => a[0].localeCompare(b[0]))).toEqual([
        ["x", 10],
        ["y", 20],
      ]);

      table.delete("x");
      expect(entries(table)).toEqual([["y", 20]]);
    });

    it("пустая строка — валидный ключ", () => {
      const table = new TreeMap<string, string>();
      table.set("", "empty");
      expect(table.get("")).toBe("empty");
      expect(table.has("")).toBe(true);
      expect(table.delete("")).toBe("empty");
      expect(table.has("")).toBe(false);
    });
  });

  describe("ключи объекты", () => {
    it("работает с ключ-объект", () => {
      const table = new TreeMap<TestKey, number>(comparator);

      table.set({ id: 3 }, 30);
      table.set({ id: 1 }, 10);
      table.set({ id: 2 }, 20);

      expect(table.get({ id: 3 })).toBe(30);
      expect(table.get({ id: 1 })).toBe(10);
      expect(table.get({ id: 2 })).toBe(20);
      expect(table.size()).toBe(3);
    })

    it("итерация: c ключ-объект", () => {
      const table = new TreeMap<TestKey, number>(comparator);

      table.set({ id: 3 }, 30);
      table.set({ id: 1 }, 10);
      table.set({ id: 2 }, 20);

      expect(table.entries()).toEqual([[{ id: 1 }, 10], [{ id: 2 }, 20], [{ id: 3 }, 30]])
    })
  })
});
