import { invariant } from '../utils';
import { AsyncNoop } from '../type';
import { createPopStateEvent } from './utils';

class Router {
  public running: boolean;

  private rawPushState: History['pushState'];
  private rawReplaceState: History['replaceState'];

  private historyChangeHandler: EventListener | null = null;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    public reroute: AsyncNoop,
    public beforeReroute: AsyncNoop,
    public afterReroute: AsyncNoop,
  ) {}

  hack() {
    invariant(
      !this.running,
      'Reactivation is prohibited while Puzzle-Router hack is running',
      'Router',
    );

    this.running = true;
    this.rawPushState = window.history.pushState;
    this.rawReplaceState = window.history.replaceState;

    const hackItems = [
      {
        toHack: 'pushState',
        raw: this.rawPushState,
      },
      {
        toHack: 'replaceState',
        raw: this.rawReplaceState,
      },
    ] as const;

    hackItems.forEach((hackItem) => {
      window.history[hackItem.toHack] = (...args) => {
        const beforeHref = window.location.href;

        hackItem.raw.apply(window.history, [...args]);

        const afterHref = window.location.href;

        if (beforeHref !== afterHref) {
          dispatchEvent(createPopStateEvent());
        }
      };
    });

    this.historyChangeHandler = async () => {
      await this.beforeReroute();
      await this.reroute();
      await this.afterReroute();
    };

    /**
     * Get informed by user-wise history.back / history.forward actions
     */
    window.addEventListener('popstate', this.historyChangeHandler);
    window.addEventListener('hashchange', this.historyChangeHandler);
  }

  restore() {
    invariant(
      this.running,
      'Restoration is prohibited as route hack is stopped.',
      'Router',
    );

    window.history.pushState = this.rawPushState;
    window.history.replaceState = this.rawReplaceState;

    if (this.historyChangeHandler) {
      window.removeEventListener('popstate', this.historyChangeHandler);
      window.removeEventListener('hashchange', this.historyChangeHandler);
      this.historyChangeHandler = null;
    }

    this.running = false;
  }
}

export default Router;
