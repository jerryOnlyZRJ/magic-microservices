import portalRegister, {
  EventType,
  isPortalRegister,
} from '@byted-cg/open-source-portal';

import PortalHtmlEntryPlugin from '@byted-cg/portal-html-entry-plugin';

import { Host, PuzzleEventListener, PuzzleServiceInstance } from '../../puzzle';
import { invariant, warning } from '../utils';
import type {
  AsyncNoop,
  IPuzzleSPAAppItem,
  IPuzzleSPAOptions,
  LifeCycleHooksRecord,
  PuzzleApp,
  PuzzleAppName,
} from '../type';

import Router from './Router';
import Prefetcher from './Prefetcher';
import AppStatus from './Status';
import { createLifeCycleHooks } from './Hook';
import { AppStatusEnums, HOST_NAVIGATE } from './const';
import {
  createApps,
  createContainer,
  createPuzzleInstance,
  formatManifest,
  isAppActive,
} from './utils';

export * from './const';

export class InternalPuzzleSPA<T extends IPuzzleSPAOptions> {
  public running: boolean;
  public apps: PuzzleApp[];
  public appStatus: AppStatus;
  public router: Router;
  public prefetcher: Prefetcher;
  public containerElm: HTMLElement | null;
  public host: InstanceType<typeof Host>;

  public hooks: LifeCycleHooksRecord = {} as LifeCycleHooksRecord;

  private readonly beforeReroute: AsyncNoop;
  private readonly afterReroute: AsyncNoop;

  constructor(public options: T) {
    this.host = new Host();
    this.prefetcher = new Prefetcher();
    if (!options.apps) return;
    this.apps = createApps(options.apps);
    this.hooks = createLifeCycleHooks(this.hooks);
    this.appStatus = new AppStatus();
    options.plugins?.forEach((plugin) => plugin.apply(this));

    this.reroute = this.reroute.bind(this);
    this.beforeReroute = this.hooks.beforeReroute.call.bind(this, this);
    this.afterReroute = async () => {
      this.hooks.afterReroute.call.bind(this, this);
      this.emit(Array.from(this.appStatus.mounted), HOST_NAVIGATE, {
        action: 'REPLACE',
        data: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
        },
      });
    };

    this.router = new Router(
      /* reroute */
      this.reroute,
      /* beforeReroute */
      this.beforeReroute,
      /* afterReroute */
      this.afterReroute,
    );

    this.containerElm = createContainer(this.options);

    invariant(
      !!this.containerElm,
      'Container element is unable to found! \n' + ' Double check the container option.',
    );

    this.apps.forEach((app) => {
      app.prefetch && this.appStatus.toPrefetch.add(app);
    });

    this.hooks.bootstrapped.call(this);
  }

  registerApps(apps: IPuzzleSPAAppItem[] | IPuzzleSPAAppItem) {
    const innerApps = createApps(apps);
    this.apps.push(...innerApps);

    innerApps.forEach((app) => {
      app.prefetch && this.appStatus.toPrefetch.add(app);
    });
    this.hooks.beforePrefetch.call(this).then(() => this.prefetch());
  }

  async start() {
    invariant(
      !this.running,
      'SPA is running, restart is prohibited. \n\n' +
        'You need to `stop` PuzzleSPA first, and try again.',
    );

    this.running = true;
    this.router.hack();

    await this.hooks.beforePortalRegistered.call(this);
    if (!isPortalRegister()) {
      await portalRegister({
        plugins: [new PortalHtmlEntryPlugin()],
      });
    }
    await this.hooks.afterPortalRegistered.call(this);

    await this.hooks.beforePrefetch.call(this);
    await this.prefetch();
    await this.reroute();
  }

  async stop() {
    this.running = false;
    await this.clean();
    this.router.restore();
    this.prefetcher.clear();
  }

  async clean() {
    const mountedApps = Array.from(this.appStatus.mounted);

    await this.hooks.beforeClean.call(this);

    if (mountedApps.length && this.containerElm) {
      mountedApps.forEach((app) => {
        const elementToRemove = app.serviceInstance;
        elementToRemove?.parentElement?.removeChild(elementToRemove);

        this.appStatus.mounted.delete(app);
        this.appStatus.unmounted.add(app);
        app.status = AppStatusEnums.unmounted;
        app.serviceInstance = null;
      });
    }
  }

  async reroute() {
    this.updateAppStatusSnapshot();

    await this.runUnmount();
    await this.runMount();
    this.reattachListeners();
  }

  private async runUnmount() {
    const toUnmountApps = Array.from(this.appStatus.toUnmount);

    await this.hooks.beforeUnmount.call(this);

    if (toUnmountApps.length && this.containerElm) {
      toUnmountApps.forEach((app) => {
        const elementToRemove = app.serviceInstance;
        elementToRemove?.parentElement?.removeChild(elementToRemove);

        this.appStatus.toUnmount.delete(app);
        this.appStatus.unmounted.add(app);
        app.status = AppStatusEnums.unmounted;
        app.serviceInstance = null;
      });
    }

    await this.hooks.afterUnmount.call(this);
  }

  private async runMount() {
    const toMountApps = Array.from(this.appStatus.toMount);

    invariant(
      toMountApps.length <= 1,
      'Only one app could be mounted at the same time. \n\n' +
        ' Check the activeRule for each app and try again.',
    );

    await this.hooks.beforeMount.call(this);

    // Find the first matched app to mount
    const toMountApp = toMountApps[0];

    if (toMountApp) {
      await this.hooks.beforeCreate.call(this);
      const component = await createPuzzleInstance(toMountApp);
      await this.hooks.afterCreate.call(this);

      this.appStatus.toMount.delete(toMountApp);
      this.appStatus.mounted.add(toMountApp);
      toMountApp.status = AppStatusEnums.mounted;

      this.containerElm!.appendChild(component!);
      toMountApp.serviceInstance = component;

      await this.hooks.afterMount.call(this);
    }
  }

  private async prefetch() {
    const status = this.appStatus;
    const toPrefetch = Array.from(status.toPrefetch);

    if (!toPrefetch.length) return;

    const manifests = await Promise.all(
      toPrefetch.map((app) =>
        formatManifest(app.manifest, {
          shouldPrefetch: true,
          prefetcher: this.prefetcher,
        }),
      ),
    );

    manifests.forEach((manifest, index) => {
      const prefetchedApp = toPrefetch[index];
      prefetchedApp.manifest = manifest;

      status.toPrefetch.delete(prefetchedApp);
      status.prefetched.add(prefetchedApp);
      prefetchedApp.status = AppStatusEnums.prefetched;
    });
  }

  updateAppStatusSnapshot() {
    this.apps.forEach((app) => {
      const status = this.appStatus;
      const currentActive = isAppActive(app.activeRule);

      if (!currentActive) {
        // App currently not activated
        // Skip unmounted apps
        if (status.unmounted.has(app)) return;

        warning(
          !status.toMount.has(app),
          'App would never mount and unmount at the same time.' +
            ' Please file an issue.',
        );

        // Unmount apps that was mounted
        if (status.mounted.has(app)) {
          status.mounted.delete(app);
          status.toUnmount.add(app);
        }
      } else {
        // App currently activated

        // Skip mounted apps
        if (status.mounted.has(app)) return;

        warning(
          !status.toUnmount.has(app),
          'App would never mount and unmount at the same time.' +
            ' Please file an issue.',
        );

        // Mount apps directly
        if (status.unmounted.has(app)) status.unmounted.delete(app);
        status.toMount.add(app);
      }
    });
  }

  private reattachListeners() {
    this.apps.forEach((app) => {
      if (app.status === AppStatusEnums.mounted) {
        const eventNames = Object.keys(app.listeners);

        eventNames.forEach((eventName) => {
          const callbacksToEvent = (
            app.listeners as Record<string, PuzzleEventListener[]>
          )[eventName];

          callbacksToEvent.forEach((callback) => {
            // Remove EventListener first to avoid duplicated listener assignments while doing in-app reroutes
            app.serviceInstance &&
              this.host.off(app.serviceInstance, eventName, callback);
            app.serviceInstance && this.host.on(app.serviceInstance, eventName, callback);
          });
        });
      }
    });
  }

  emit(
    apps: PuzzleApp[] | PuzzleAppName[] | PuzzleAppName,
    type: EventType,
    message?: unknown,
  ) {
    if (typeof apps === 'string') {
      apps = this.apps.filter((puzzleApp) => apps === puzzleApp.name) as PuzzleApp[];
    } else if (typeof apps?.[0] === 'string') {
      apps = this.apps.filter((puzzleApp) =>
        (apps as string[]).includes(puzzleApp.name),
      ) as PuzzleApp[];
    }
    (apps as PuzzleApp[]).forEach((app) => {
      warning(app.status === AppStatusEnums.mounted, 'App is not mounted');
      if (app.serviceInstance) {
        this.host.emit(app.serviceInstance, type, message, '*');
      }
    });
  }

  on(app: PuzzleApp | PuzzleAppName, type: EventType, callback: PuzzleEventListener) {
    let puzzleApp: PuzzleApp | undefined;
    let instanceToListen: PuzzleServiceInstance | null;

    if (app && typeof app === 'object') {
      puzzleApp = app;
      instanceToListen = app.serviceInstance;
    } else {
      puzzleApp = this.apps.find((puzzleApp) => app === puzzleApp.name);
      instanceToListen = puzzleApp?.serviceInstance ?? null;
    }

    (
      (puzzleApp!.listeners as Record<string, PuzzleEventListener[]>)[type] ||
      ((puzzleApp!.listeners as Record<string, PuzzleEventListener[]>)[type] = [])
    ).push(callback);

    if (instanceToListen) {
      this.host.on(instanceToListen, type, callback);
    }
  }

  off(app: PuzzleApp | PuzzleAppName, type: EventType, callback: PuzzleEventListener) {
    let puzzleApp: PuzzleApp | undefined;
    let instanceToListen: PuzzleServiceInstance | null;

    if (app && typeof app === 'object') {
      puzzleApp = app;
      instanceToListen = app.serviceInstance;
    } else {
      puzzleApp = this.apps.find((puzzleApp) => app === puzzleApp.name);
      instanceToListen = puzzleApp?.serviceInstance ?? null;
    }

    (puzzleApp!.listeners as Record<string, PuzzleEventListener[]>)[type] = (
      puzzleApp!.listeners as Record<string, PuzzleEventListener[]>
    )[type].filter((listener) => listener !== callback);

    if (instanceToListen) {
      this.host.off(instanceToListen, type, callback);
    }
  }
}

export type PuzzleSPAInstance<T extends IPuzzleSPAOptions = IPuzzleSPAOptions> =
  InternalPuzzleSPA<T>;

const PuzzleSPA = function <T extends IPuzzleSPAOptions>(
  options: T,
): PuzzleSPAInstance<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (this instanceof PuzzleSPA) {
    throw new TypeError('PuzzleSPA is not a constructor');
  }

  return new InternalPuzzleSPA(options);
};

const createPuzzleSPA = PuzzleSPA;

export { PuzzleSPA, createPuzzleSPA };
