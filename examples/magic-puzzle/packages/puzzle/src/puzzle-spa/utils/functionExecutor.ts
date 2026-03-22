type CallbackFunc<T, P> = (...params: P[]) => T;

export function functionExecutor<T, P>(
  callback: CallbackFunc<T, P> | T,
  ...args: P[]
): T {
  return typeof callback === 'function'
    ? (callback as CallbackFunc<T, P>)(...args)
    : callback;
}
