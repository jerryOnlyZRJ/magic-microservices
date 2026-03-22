import warn from 'tiny-warning';
import invar from 'tiny-invariant';


// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const warning = (expectation: any, message: string, namespace = '') => {
  return warn(expectation, `[PuzzleSPA${namespace? `:${namespace}`:''}]: ` + message);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const invariant = (expectation: any, message: string, namespace = '') => {
  return invar(expectation, `[PuzzleSPA${namespace? `:${namespace}`:''}]: ` + message);
};