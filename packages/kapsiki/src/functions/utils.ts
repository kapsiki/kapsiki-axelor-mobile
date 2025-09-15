type AnyFn = (...args: any[]) => any;

type DebouncedFn<T extends AnyFn> = ((...args: Parameters<T>) => void) & {
  cancel: () => void;
  flush: () => void;
};

/**
 * Calls startFn exactly once at the beginning of a burst.
 * Calls endFn (or startFn if omitted) wait ms after the last call in the burst,
 * with the last arguments and `this`.
 */
export function debounceStartEnd<T extends AnyFn>(
  startFn: T,
  wait: number,
  endFn?: T,
): DebouncedFn<T> {
  const trailing: T = (endFn ?? startFn) as T;

  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  // started indicates whether startFn has already been called for the current burst
  let started = false;

  const invokeTrailing = () => {
    if (lastArgs) {
      trailing.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  };

  const debounced = function (this: any, ...args: Parameters<T>) {
    lastArgs = args;
    // eslint-disable-next-line consistent-this
    lastThis = this;

    // call startFn only once per burst
    if (!started) {
      started = true;
      startFn.apply(this, args);
    }

    // reset trailing timer
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      // burst ended: call trailing and reset started so next burst can trigger start again
      invokeTrailing();
      started = false;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastArgs = null;
    lastThis = null;
    started = false;
  };

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      invokeTrailing();
      started = false;
    }
  };

  return debounced as DebouncedFn<T>;
}
