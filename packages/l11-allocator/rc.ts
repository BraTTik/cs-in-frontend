type Disposable<T extends object> = T & {
  [Symbol.dispose]: () => void;
}

type RC<T extends object> = Disposable<T> & {
  clone: () => RC<T>
}

function rc<T extends object>(obj: Disposable<T>): RC<T> {
  const innerDispose = obj[Symbol.dispose].bind(obj);
  let counter = 0;

  Object.defineProperty(obj, "clone", {
    configurable: true,
    enumerable: true,
    value: () => {
      counter += 1;
      return obj;
    }
  });

  Object.defineProperty(obj, Symbol.dispose, {
    configurable: true,
    enumerable: false,
    value: () => {
      if (counter <= 0) {
        innerDispose();
      } else {
        counter -= 1;
      }
    }
  })

  return obj as RC<T>;
}

export const Rc = function<T extends object>(value: Disposable<T>): RC<T> {
  return rc<T>(value);
} as unknown as new <T extends object>(value: Disposable<T>) => RC<T>
