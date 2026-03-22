import { LifeCycleHookNames, LifeCycleHooks } from './const';
import { LifeCycleHooksRecord } from '../type';

export type HookCallback<T, K> = (...args: T[]) => K;

class Hook<T, K> {
    private tasks: HookCallback<T, K>[] = [];

    tap = (tasks: HookCallback<T, K> | HookCallback<T, K>[]): void => {
      tasks instanceof Array ? this.tasks.push(...tasks) : this.tasks.push(tasks);
    };

    call = (...args: T[]): Promise<T | K | void> => {
      return this.tasks.reduce((preReturn, task) => {
        return preReturn.then(() => task(...args));
      }, Promise.resolve());
    };
}

export const createLifeCycleHooks = (hooks: LifeCycleHooksRecord): LifeCycleHooksRecord => {
  LifeCycleHookNames.forEach((hookName: LifeCycleHooks) => {
    hooks[hookName] = new Hook();
  });
  return hooks;
};

export default Hook;