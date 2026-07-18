import { querySelectorAllLazy } from "../query-selector-lazy.ts";

const createTree = (html: string): HTMLElement => {
  const root = document.createElement("div");
  root.innerHTML = html.trim();
  return root;
};

const ids = (elements: Iterable<Element>): string[] =>
  Array.from(elements, (el) => el.id);

describe("querySelectorAllLazy", () => {
  it("yields matching direct children in document order", () => {
    const root = createTree(`
      <div class="item" id="a"></div>
      <div class="other" id="b"></div>
      <div class="item" id="c"></div>
    `);

    expect(ids(querySelectorAllLazy(".item", root))).toEqual(["a", "c"]);
  });

  it("yields nested matches in depth-first order", () => {
    const root = createTree(`
      <div class="item" id="1">
        <span class="item" id="1-1"></span>
      </div>
      <div class="other" id="2">
        <span class="item" id="2-1"></span>
      </div>
      <div class="item" id="3"></div>
    `);

    expect(ids(querySelectorAllLazy(".item", root))).toEqual([
      "1",
      "1-1",
      "2-1",
      "3",
    ]);
  });

  it("does not yield the root even if it matches the query", () => {
    const root = createTree(`<div class="item" id="child"></div>`);
    root.className = "item";
    root.id = "root";

    const matches = Array.from(querySelectorAllLazy(".item", root));

    expect(ids(matches)).toEqual(["child"]);
  });

  it("returns empty iterator when there are no matches", () => {
    const root = createTree(`
      <div class="other"></div>
      <span class="another"></span>
    `);

    expect(Array.from(querySelectorAllLazy(".item", root))).toEqual([]);
  });

  it("returns empty iterator when the element has no children", () => {
    const root = document.createElement("div");

    expect(Array.from(querySelectorAllLazy("*", root))).toEqual([]);
  });

  it("supports tag and compound selectors", () => {
    const root = createTree(`
      <span class="item" id="span"></span>
      <div class="item" id="div"></div>
      <div class="item active" id="active"></div>
    `);

    expect(ids(querySelectorAllLazy("div.item", root))).toEqual([
      "div",
      "active",
    ]);
    expect(ids(querySelectorAllLazy(".item.active", root))).toEqual(["active"]);
  });

  it("is lazy and advances one match at a time", () => {
    const root = createTree(`
      <div class="item" id="1"></div>
      <div class="item" id="2"></div>
      <div class="item" id="3"></div>
    `);

    const iter = querySelectorAllLazy(".item", root);

    expect(iter.next().value?.id).toBe("1");
    expect(iter.next().value?.id).toBe("2");
    expect(iter.next().value?.id).toBe("3");
    expect(iter.next()).toEqual({ done: true, value: undefined });
  });

  it("is iterable and can be consumed with for...of", () => {
    const root = createTree(`
      <div class="item" id="a"></div>
      <div class="item" id="b"></div>
    `);

    const result: string[] = [];
    for (const el of querySelectorAllLazy(".item", root)) {
      result.push(el.id);
    }

    expect(result).toEqual(["a", "b"]);
  });

  it("returns itself from Symbol.iterator", () => {
    const root = createTree(`<div class="item" id="1"></div>`);
    const iter = querySelectorAllLazy(".item", root);

    expect(iter[Symbol.iterator]()).toBe(iter);
  });
});
