import { HashTable } from "../hash-table.ts";

function entries<K, V>(table: HashTable<V>): [K, V][] {
  const result: [K, V][] = [];
  for (const entry of table) {
    result.push(entry as [K, V]);
  }
  return result;
}

describe("HashTable", () => {
  describe("get", () => {
    it("возвращает null для отсутствующего ключа", () => {
      const table = new HashTable<number>();
      expect(table.get(404)).toBeNull();
    });

    it("возвращает значение после set", () => {
      const table = new HashTable<number>();
      table.set(1, 42);
      expect(table.get(1)).toBe(42);
    });

    it("различает разные ключи", () => {
      const table = new HashTable<number>();
      table.set(1, 10);
      table.set(2, 20);
      expect(table.get(1)).toBe(10);
      expect(table.get(2)).toBe(20);
    });
  });

  describe("has", () => {
    it("false для отсутствующего ключа", () => {
      const table = new HashTable<number>();
      expect(table.has(0)).toBe(false);
    });

    it("true после set", () => {
      const table = new HashTable<number>();
      table.set(1, 100);
      expect(table.has(1)).toBe(true);
    });

    it("false после delete", () => {
      const table = new HashTable<number>();
      table.set(1, 100);
      table.delete(1);
      expect(table.has(1)).toBe(false);
    });
  });

  describe("delete", () => {
    it("возвращает null для отсутствующего ключа", () => {
      const table = new HashTable<number>();
      expect(table.delete(999)).toBeNull();
    });

    it("возвращает удалённое значение", () => {
      const table = new HashTable<number>();
      table.set(7, 99);
      expect(table.delete(7)).toBe(99);
    });

    it("удаляет ключ из таблицы", () => {
      const table = new HashTable<number>();
      table.set(3, 1);
      table.delete(3);
      expect(table.get(3)).toBeNull();
      expect(table.has(3)).toBe(false);
    });

    it("не затрагивает другие ключи", () => {
      const table = new HashTable<number>();
      table.set(1, 10);
      table.set(2, 20);
      table.delete(1);
      expect(table.get(2)).toBe(20);
    });
  });

  describe("set — обновление существующего ключа", () => {
    it("перезаписывает значение для того же ключа", () => {
      const table = new HashTable<number>();
      table.set(5, 1);
      table.set(5, 2);
      expect(table.get(5)).toBe(2);
    });
  });

  describe("итерация for...of", () => {
    it("пустая таблица не даёт пар", () => {
      const table = new HashTable<number>();
      expect(entries(table)).toEqual([]);
    });

    it("обходит все пары [ключ, значение]", () => {
      const table = new HashTable<number>();
      table.set(1, 10);
      table.set(2, 20);
      expect(entries<number, number>(table).sort((a, b) => a[0] - b[0])).toEqual([
        [1, 10],
        [2, 20],
      ]);
    });

    it("не содержит удалённые ключи", () => {
      const table = new HashTable<number>();
      table.set(1, 10);
      table.set(2, 20);
      table.delete(1);
      expect(entries(table)).toEqual([[2, 20]]);
    });
  });

  describe("ключи-строки", () => {
    it("get: null для отсутствующего ключа", () => {
      const table = new HashTable<number>();
      expect(table.get("missing")).toBeNull();
    });

    it("get: значение после set и разные строковые ключи", () => {
      const table = new HashTable<number>();
      table.set("alpha", 1);
      table.set("beta", 2);
      expect(table.get("alpha")).toBe(1);
      expect(table.get("beta")).toBe(2);
      expect(table.get("alpha")).not.toBe(table.get("beta"));
    });

    it("has: false / true / false после delete", () => {
      const table = new HashTable<number>();
      expect(table.has("key")).toBe(false);
      table.set("key", 10);
      expect(table.has("key")).toBe(true);
      table.delete("key");
      expect(table.has("key")).toBe(false);
    });

    it("delete: null, возвращает значение, ключ исчезает", () => {
      const table = new HashTable<number>();
      expect(table.delete("ghost")).toBeNull();

      table.set("item", 42);
      expect(table.delete("item")).toBe(42);
      expect(table.get("item")).toBeNull();
    });

    it("delete не затрагивает другие строковые ключи", () => {
      const table = new HashTable<number>();
      table.set("a", 1);
      table.set("b", 2);
      table.delete("a");
      expect(table.get("b")).toBe(2);
    });

    it("set перезаписывает значение для той же строки", () => {
      const table = new HashTable<number>();
      table.set("k", 1);
      table.set("k", 99);
      expect(table.get("k")).toBe(99);
    });

    it("одинаковое содержимое строки — тот же ключ", () => {
      const table = new HashTable<number>();
      const keyA = "shared";
      const keyB = "shared";
      table.set(keyA, 7);
      expect(table.get(keyB)).toBe(7);
      expect(table.has(keyB)).toBe(true);
    });

    it("итерация: все пары и без удалённых ключей", () => {
      const table = new HashTable<number>();
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
      const table = new HashTable<string>();
      table.set("", "empty");
      expect(table.get("")).toBe("empty");
      expect(table.has("")).toBe(true);
      expect(table.delete("")).toBe("empty");
      expect(table.has("")).toBe(false);
    });
  });

  describe("rehash при переполнении буфера", () => {
    it("сохраняет все записи после расширения таблицы", () => {
      const table = new HashTable<number>(4);
      const pairs: [number, number][] = [
        [0, 100],
        [1, 101],
        [2, 102],
        [3, 103],
        [4, 104],
      ];

      for (const [key, value] of pairs) {
        table.set(key, value);
      }

      for (const [key, value] of pairs) {
        expect(table.get(key)).toBe(value);
        expect(table.has(key)).toBe(true);
      }

      expect(entries<number, number>(table).sort((a, b) => a[0] - b[0])).toEqual(pairs);
    });

    it("get, set и delete работают после рехеша", () => {
      const table = new HashTable<number>(4);

      for (let i = 0; i < 5; i++) {
        table.set(i, i * 10);
      }

      table.set(2, 999);
      expect(table.get(2)).toBe(999);

      expect(table.delete(1)).toBe(10);
      expect(table.has(1)).toBe(false);
      expect(table.get(3)).toBe(30);
    });
  });

  describe("ключи-объекты (идентичность по ссылке)", () => {
    it("разные объекты — разные записи; обновление по той же ссылке", () => {
      const a = {};
      const b = {};
      const table = new HashTable<number>();

      table.set(a, 1);
      table.set(b, 2);

      expect(table.get(a)).not.toBe(table.get(b));
      expect(table.get(a)).toBe(1);
      expect(table.get(b)).toBe(2);

      table.set(a, 5);
      expect(table.get(a)).toBe(5);
      expect(table.get(b)).toBe(2);
    });

    it("has и delete работают по ссылке на объект", () => {
      const key = { id: 1 };
      const other = { id: 1 };
      const table = new HashTable<string>();

      table.set(key, "value");
      expect(table.has(key)).toBe(true);
      expect(table.has(other)).toBe(false);

      expect(table.delete(other)).toBeNull();
      expect(table.delete(key)).toBe("value");
      expect(table.has(key)).toBe(false);
    });

    it("итерация отдаёт те же ссылки ключей, что были при set", () => {
      const a = {};
      const b = {};
      const table = new HashTable<number>();
      table.set(a, 1);
      table.set(b, 2);

      const keys = entries<object, number>(table).map(([k]) => k);
      expect(keys).toContain(a);
      expect(keys).toContain(b);
      expect(keys).toHaveLength(2);
    });
  });
});
