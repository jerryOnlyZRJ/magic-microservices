import { PuzzleServiceInstance, IPuzzleServiceItem, PuzzleEventListener } from '@/puzzle';
import { IDefaultPortalProps, EventType } from '@byted-cg/open-source-portal';

import type { InternalPuzzleSPA, PuzzleSPAInstance } from './core';
import { AppStatusEnums, LifeCycleHooks } from './core/const';
import Hook from './core/Hook';
export { InternalPuzzleSPA } from './core';

type StartsWith = string;
export type PuzzleAppName = string;

export interface IPuzzleSPAAppItem
  extends Pick<IPuzzleServiceItem, 'serviceMode'>,
    CamelCaseKey<Pick<IPuzzleServiceItem, 'history-isolation'>> {
  name: string;
  /**
   * App active rule
   * @param location
   */
  activeRule: ((location: Location) => boolean) | StartsWith;
  /**
   * Enable prefetch
   */
  prefetch?: boolean;
  /**
   * iframe fallback
   */
  htmlUrl: string | ((app: PuzzleApp) => string);
  /**
   * web-component
   */
  manifest?: IPuzzleServiceItem['manifest'];
  initialUrl?:
    | IPuzzleServiceItem['initial-url']
    | ((app: PuzzleApp) => IPuzzleServiceItem['initial-url']);
}

export interface PuzzleSPAPlugin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apply: (instance: InternalPuzzleSPA<any>) => any;
}

export interface IPuzzleSPAOptions {
  container?: ServiceContainer;
  serviceMode?: IPuzzleServiceItem['serviceMode'];
  apps?: IPuzzleSPAAppItem[];
  plugins?: PuzzleSPAPlugin[];
}

export interface IHostNavigateEvent {
  action: 'REPLACE' | 'PUSH';
  data: {
    pathname: string;
    search: string;
    hash: string;
  };
}

export type ServiceContainerDOMorSelector =
  | ((options: IPuzzleSPAOptions) => HTMLElement | string)
  | HTMLElement
  | string
  | null;

export type ServiceContainer = ServiceContainerDOMorSelector;

export type PuzzleApp = IPuzzleSPAAppItem & {
  status: AppStatusEnums;
  rawManifest: IDefaultPortalProps['manifest'];
  serviceInstance: PuzzleServiceInstance | null;
  listeners: Record<EventType, PuzzleEventListener[]>;
};

export type LifeCycleHooksRecord = Record<
  LifeCycleHooks,
  Hook<PuzzleSPAInstance, PuzzleSPAInstance>
>;

export type Noop = () => void;
export type AsyncNoop = () => Promise<void>;
export type CamelCase<T> = T extends `${infer Left}-${infer Right}`
  ? `${Left}${Right extends `${infer RightLeft}${infer RightRight}`
      ? `${Capitalize<RightLeft>}${CamelCase<RightRight>}`
      : Right}`
  : T;
export type CamelCaseKey<T> = {
  [K in keyof T as CamelCase<K>]: T[K];
};
