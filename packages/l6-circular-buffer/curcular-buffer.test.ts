import { CircularBuffer } from './circular-buffer.ts';

describe('CircularBuffer', () => {
  describe('capacity и length', () => {
    it('после создания length === 0, capacity как задано', () => {
      const b = new CircularBuffer<number>(3);
      expect(b.capacity).toBe(3);
      expect(b.length).toBe(0);
    });
  });

  describe('capacity === 0', () => {
    it('length остаётся 0, push возвращает 0 и не меняет состояние', () => {
      const b = new CircularBuffer<string>(0);
      expect(b.push('x')).toBe(0);
      expect(b.length).toBe(0);
      expect(b.shift()).toBeNull();
      expect(b.pop()).toBeNull();
      expect(b.at(0)).toBeNull();
    });
  });

  describe('push и at: порядок от старого к новому', () => {
    it('push увеличивает length до capacity; at(0) — самый старый', () => {
      const b = new CircularBuffer<string>(3);
      expect(b.push('a')).toBe(1);
      expect(b.push('b')).toBe(2);
      expect(b.length).toBe(2);
      expect(b.at(0)).toBe('a');
      expect(b.at(1)).toBe('b');
    });

    it('при переполнении перезаписывается самый старый, length === capacity', () => {
      const b = new CircularBuffer<string>(2);
      b.push('a');
      b.push('b');
      expect(b.length).toBe(2);
      expect(b.at(0)).toBe('a');
      expect(b.at(1)).toBe('b');
      expect(b.push('c')).toBe(2);
      console.log(b._arr)
      expect(b.length).toBe(2);
      expect(b.at(0)).toBe('b');
      expect(b.at(1)).toBe('c');
    });
  });

  describe('at: границы и невалидный индекс', () => {
    it('at вне [0, length) возвращает null', () => {
      const b = new CircularBuffer<number>(3);
      b.push(1);
      expect(b.at(-1)).toBeNull();
      expect(b.at(1)).toBeNull();
      expect(b.at(0)).toBe(1);
    });
  });

  describe('shift', () => {
    it('на пустом буфере возвращает null', () => {
      expect(new CircularBuffer<number>(2).shift()).toBeNull();
    });

    it('удаляет и возвращает самый старый элемент', () => {
      const b = new CircularBuffer<string>(3);
      b.push('a');
      b.push('b');
      expect(b.shift()).toBe('a');
      expect(b.length).toBe(1);
      expect(b.at(0)).toBe('b');
    });
  });

  describe('pop', () => {
    it('на пустом буфере возвращает null', () => {
      expect(new CircularBuffer<number>(2).pop()).toBeNull();
    });

    it('удаляет и возвращает самый новый элемент', () => {
      const b = new CircularBuffer<string>(3);
      b.push('a');
      b.push('b');
      expect(b.pop()).toBe('b');
      expect(b.length).toBe(1);
      expect(b.at(0)).toBe('a');
    });
  });

  describe('unshift', () => {
    it('добавляет в начало (становится самым старым)', () => {
      const b = new CircularBuffer<string>(3);
      b.push('a');
      expect(b.unshift('z')).toBe(2);
      console.log(b._arr)
      expect(b.at(0)).toBe('z');
      expect(b.at(1)).toBe('a');
    });

    it('при заполненном буфере вытесняется самый новый (с конца)', () => {
      const b = new CircularBuffer<number>(3);
      b.push(1);
      b.push(2);
      b.push(3);
      expect(b.length).toBe(3);
      expect(b.at(0)).toBe(1);
      expect(b.at(2)).toBe(3);
      expect(b.unshift(0)).toBe(3);
      expect(b.at(0)).toBe(0);
      expect(b.at(1)).toBe(1);
      expect(b.at(2)).toBe(2);
    });
  });

  describe('комбинированные сценарии', () => {
    it('серия shift после кольцевого переполнения сохраняет FIFO', () => {
      const b = new CircularBuffer<number>(2);
      b.push(1);
      b.push(2);
      b.push(3);
      expect(b.shift()).toBe(2);
      expect(b.shift()).toBe(3);
      expect(b.shift()).toBeNull();
    });
  });
});
