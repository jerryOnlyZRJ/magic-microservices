export * from './functionExecutor';
export * from './message';

type PromiseFn = () => Promise<unknown>

export const chainPromise = (...promiseFns: PromiseFn[]) => {
  return promiseFns.reduce((lastPromise, currPromise) => {
    return lastPromise.then(() => currPromise());
  }, Promise.resolve());
};