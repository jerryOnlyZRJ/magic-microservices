export enum LifeCycleHooks {
  bootstrapped = 'bootstrapped',
  beforePrefetch = 'beforePrefetch',

  beforeMount = 'beforeMount',
  afterMount = 'afterMount',

  beforePortalRegistered = 'beforePortalRegistered',
  afterPortalRegistered = 'afterPortalRegistered',

  beforeCreate = 'beforeCreate',
  afterCreate = 'afterCreate',

  beforeUnmount = 'beforeUnmount',
  beforeClean = 'beforeClean',
  afterUnmount = 'afterUnmount',

  beforeReroute = 'beforeReroute',
  afterReroute = 'afterReroute',
}

export const LifeCycleHookNames = Object.keys(LifeCycleHooks);

export const HOST_NAVIGATE = 'HOST_NAVIGATE';

export enum AppStatusEnums {
  bootstrapped = 'bootstrapped',

  toPrefetch = 'toPrefetch',
  prefetched = 'prefetched',

  toMount = 'toMount',
  mounted = 'mounted',

  toUpdate = 'toUpdate',
  updating = 'updating',
  updated = 'updated',

  toUnmount = 'toUnmount',
  unmounted = 'unmounted',
}
