import { LinkedList } from "../linked-list.ts";

function values<T>(list: LinkedList<T>): T[] {
  return [...list].map((node) => node.value);
}

describe("LinkedList", () => {
  describe("push и итерация", () => {
    it("пустой список не даёт элементов при обходе", () => {
      const list = new LinkedList<number>();
      expect(values(list)).toEqual([]);
    });

    it("push добавляет один элемент", () => {
      const list = new LinkedList<number>();
      list.push(1);
      expect(values(list)).toEqual([1]);
    });

    it("push сохраняет порядок вставки", () => {
      const list = new LinkedList<number>();
      list.push(1);
      list.push(2);
      list.push(3);
      expect(values(list)).toEqual([1, 2, 3]);
    });

    it("итератор связывает узлы через next", () => {
      const list = new LinkedList<number>();
      list.push(10);
      list.push(20);
      const nodes = [...list];
      expect(nodes).toHaveLength(2);
      expect(nodes[0]!.next).toBe(nodes[1]);
      expect(nodes[1]!.prev).toBe(nodes[0]);
      expect(nodes[1]!.next).toBeNull();
    });
  });

  describe("find", () => {
    it("в пустом списке возвращает null", () => {
      const list = new LinkedList<string>();
      expect(list.find((v) => v === "a")).toBeNull();
    });

    it("находит существующее значение", () => {
      const list = new LinkedList<number>();
      list.push(1);
      list.push(2);
      expect(list.find((v) => v === 2)).toBe(2);
    });

    it("возвращает первое совпадение", () => {
      const list = new LinkedList<number>();
      list.push(1);
      list.push(2);
      list.push(2);
      expect(list.find((v) => v === 2)).toBe(2);
    });

    it("возвращает null, если совпадений нет", () => {
      const list = new LinkedList<number>();
      list.push(1);
      expect(list.find((v) => v === 99)).toBeNull();
    });
  });

  describe("delete", () => {
    it("в пустом списке возвращает null", () => {
      const list = new LinkedList<number>();
      expect(list.delete((v) => v === 1)).toBeNull();
    });

    it("возвращает null, если элемент не найден", () => {
      const list = new LinkedList<number>();
      list.push(1);
      expect(list.delete((v) => v === 2)).toBeNull();
      expect(values(list)).toEqual([1]);
    });

    it("удаляет единственный элемент", () => {
      const list = new LinkedList<number>();
      list.push(42);
      expect(list.delete((v) => v === 42)).toBe(42);
      expect(values(list)).toEqual([]);
      expect(list.find(() => true)).toBeNull();
    });

    it("удаляет голову", () => {
      const list = new LinkedList<number>();
      list.push(1);
      list.push(2);
      list.push(3);
      expect(list.delete((v) => v === 1)).toBe(1);
      expect(values(list)).toEqual([2, 3]);
    });

    it("удаляет хвост", () => {
      const list = new LinkedList<number>();
      list.push(1);
      list.push(2);
      list.push(3);
      expect(list.delete((v) => v === 3)).toBe(3);
      expect(values(list)).toEqual([1, 2]);
    });

    it("удаляет элемент из середины", () => {
      const list = new LinkedList<number>();
      list.push(1);
      list.push(2);
      list.push(3);
      expect(list.delete((v) => v === 2)).toBe(2);
      expect(values(list)).toEqual([1, 3]);
    });

    it("удаляет только первое совпадение", () => {
      const list = new LinkedList<number>();
      list.push(1);
      list.push(2);
      list.push(2);
      expect(list.delete((v) => v === 2)).toBe(2);
      expect(values(list)).toEqual([1, 2]);
    });

    it("после удаления find не находит удалённое значение", () => {
      const list = new LinkedList<string>();
      list.push("keep");
      list.push("remove");
      list.delete((v) => v === "remove");
      expect(list.find((v) => v === "remove")).toBeNull();
      expect(list.find((v) => v === "keep")).toBe("keep");
    });
  });
});
