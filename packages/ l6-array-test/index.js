const create = {
  packed: (length) => {
    return Array.from({ length }, (_, i) => i);
  },
  holey: (length) => {
    const arr = new Array(length);
    for (let i = 0; i < length; i++) {
      arr[i] = i;
    }
    return arr;
  },
};

const sizes = [10, 100, 1000, 10_000, 100_000];

const jitted = {};

const runTest = (name, test) => {
  if (!jitted[name]) {
    /** прогрев */
    for (let i = 0; i < 1000; i++) {
      test();
    }
    jitted[name] = true;
  }

  const start = Date.now();
  test();
  const end = Date.now();

  return { time: end - start, name }
}

const printTitle = (title) => console.log(`===== ${title} =====`)

const printResult = (result) => {
  console.log(`${result.name} - ${result.time} ms`);
}

for (const size of sizes) {
  const packedPushResult = runTest("push packed", () => {
    const arr = create.packed(0);
    for (let i = 0; i < size; i++) {
      arr.push(i);
    }
  });

  const holeyPushResult = runTest("push holey", () => {
    const arr = create.holey(0);
    for (let i = 0; i < size; i++) {
      arr.push(i);
    }
  });

  const unshiftPackedResult = runTest("unshift packed", () => {
    const arr = create.packed(0);
    for (let i = 0; i < size; i++) {
      arr.unshift(i);
    }
  });

  const unshiftHoleyResult = runTest("unshift holey", () => {
    const arr = create.holey(0);
    for (let i = 0; i < size; i++) {
      arr.unshift(i);
    }
  });

  const popPackedResult = runTest("pop packed", () => {
    const arr = create.packed(size);

    while(arr.length) {
      arr.pop();
    }
  });

  const popHoleyResult = runTest("pop holey", () => {
    const arr = create.holey(size);
    while(arr.length) {
      arr.pop();
    }
  })

  const shiftPackedResult = runTest("shift packed", () => {
    const arr = create.packed(size);
    while(arr.length) {
      arr.shift()
    }
  })

  const shiftHolleyResult = runTest("shift holley", () => {
    const arr = create.holey(size);
    while(arr.length) {
      arr.shift();
    }
  })

  printTitle(`Result for ${size} size`);
  printTitle("Push");
  printResult(packedPushResult);
  printResult(holeyPushResult);
  printTitle("Unshift");
  printResult(unshiftPackedResult);
  printResult(unshiftHoleyResult);
  printTitle("Pop")
  printResult(popPackedResult);
  printResult(popHoleyResult);
  printTitle("Shift");
  printResult(shiftPackedResult);
  printResult(shiftHolleyResult);
  console.log();
}

