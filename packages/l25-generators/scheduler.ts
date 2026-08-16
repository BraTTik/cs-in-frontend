export function runTask(gen: Generator, options?: {
  threshold?: number;
  delay?: number
}) {
  const { threshold = 100, delay = 500 } = options ?? {};

  let work = gen;
  let now = Date.now();

  while (true) {
    if (Date.now() - now > threshold) {
      setTimeout(() => {
        runTask(work, options);
      }, delay);
      break;
    }
    const step = work.next();
    if (step.done) break;
  }
}
