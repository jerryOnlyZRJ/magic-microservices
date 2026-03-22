import Sandbox from '@byted/garfish-sandbox';
import { getUrlObj } from '@byted-cg/open-source-portal-utils';
import { MagicPortalElement } from '@/interface';

export type Noop = () => void;

export class FackLocation implements Location {
  ancestorOrigins: DOMStringList = [window.location.origin] as unknown as DOMStringList;
  hash: string;
  host: string;
  hostname: string;
  href: string;
  origin: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  assign: Noop;
  reload: Noop;
  replace: Noop;

  refreshLocation(url: string): void {
    const urlObj = new URL(url);
    this.hash = urlObj.hash;
    this.host = urlObj.host;
    this.hostname = urlObj.hostname;
    this.href = urlObj.href;
    this.origin = urlObj.origin;
    this.pathname = urlObj.pathname;
    this.port = urlObj.port;
    this.protocol = urlObj.protocol;
    this.search = urlObj.search;
  }

  constructor(initialUrl: string) {
    this.refreshLocation(initialUrl);
  }

  toString(): string {
    return this.href;
  }
}

interface IHistoryItem {
  state: unknown;
  title: string | null;
  url?: string | null;
}

export class FackHistory implements History {
  location: FackLocation;
  historyEventEmitters: HistoryEventEmitters;
  private current: number;
  private queue: IHistoryItem[];

  constructor(location: FackLocation, historyEventEmitters: HistoryEventEmitters) {
    this.location = location;
    this.historyEventEmitters = historyEventEmitters;
    this.current = 0;
    this.queue = [
      {
        state: null,
        title: null,
        url: location.href,
      },
    ];
  }

  scrollRestoration: ScrollRestoration = 'manual';

  get length(): number {
    return this.queue.length;
  }

  get state(): unknown {
    return this.queue[this.current].state;
  }

  private refreshLocation() {
    this.location.refreshLocation(
      new URL(this.queue[this.current].url || this.location.href, this.location.origin)
        .href,
    );
  }

  go(delta?: number): void {
    if (!delta) return;
    const newCurrent = this.current + delta;
    if (newCurrent < 0 || newCurrent >= this.queue.length) return;
    this.current = newCurrent;
    this.refreshLocation();
    this.historyEventEmitters.emit('popstate', new PopStateEvent('popstate'));
  }

  back() {
    this.go(-1);
  }

  forward() {
    this.go(1);
  }

  private checkUrl(url: string, type: 'pushState' | 'replaceState') {
    const urlObj = new URL(url, this.location.href);
    if (urlObj.origin !== this.location.origin) {
      throw new DOMException(
        `Failed to execute '${type}' on 'History': A history state object with URL '${url}' cannot be created in a document with origin '${this.location.origin}' and URL '${this.location.href}}'.`,
      );
    }
  }

  pushState(state: unknown, title: string | null, url?: string | null): void {
    if (url) this.checkUrl(url, 'pushState');
    this.queue.splice(this.current, this.queue.length - 1 - this.current, {
      state,
      title,
      url,
    });
    this.current = this.queue.length - 1;
    this.refreshLocation();
  }

  replaceState(state: unknown, title: string | null, url?: string | null): void {
    if (url) this.checkUrl(url, 'replaceState');
    this.queue[this.current] = {
      state,
      title,
      url,
    };
    this.refreshLocation();
  }
}

export type HistoryEvents = 'popstate' | 'hashchange';

export class HistoryEventEmitters {
  popstate: EventListener[] = [];
  hashchange: EventListener[] = [];

  onpopstate: EventListener;
  onhashchange: EventListener;

  on(type: HistoryEvents, callback: EventListener) {
    this[type].push(callback);
  }

  emit(type: HistoryEvents, event: PopStateEvent | HashChangeEvent) {
    this[`on${type}` as 'onpopstate' | 'onhashchange']?.(event);
    this[type].forEach((callback) => callback(event));
  }

  off(type: HistoryEvents, callback: EventListener) {
    this[type] = this[type].filter((item) => item !== callback);
  }
}

export function historySandbox(initialUrl: string) {
  const historyEventEmitters = new HistoryEventEmitters();
  const location = new FackLocation(getUrlObj(initialUrl).href);
  const history = new FackHistory(location, historyEventEmitters);
  const fakeHistory = function History() {
    throw new TypeError('Illegal constructor');
  };
  fakeHistory.prototype = history;
  fakeHistory.prototype.constructor = fakeHistory;
  return {
    location,
    history,
    History: fakeHistory,
    historyEventEmitters,
  };
}

export function overrideHistory(sandbox: Sandbox, webcomponentsIns: MagicPortalElement) {
  const context = sandbox.context!;
  const historyEvents = ['popstate', 'hashchange'] as const;
  const { historyEventEmitters } = webcomponentsIns;
  const rawAddEventListener = context.addEventListener;
  const rawRemoveEventListener = context.removeEventListener;
  const rawDispatchEvent = context.dispatchEvent;
  context.dispatchEvent = (event: Event): boolean => {
    if (event instanceof PopStateEvent || event instanceof HashChangeEvent) {
      historyEventEmitters.emit(
        event instanceof PopStateEvent ? 'popstate' : 'hashchange',
        event instanceof PopStateEvent
          ? new PopStateEvent('popstate')
          : new HashChangeEvent('hashchange'),
      );
      return true;
    }
    return rawDispatchEvent(event);
  };
  // 重写 historyIsolation 下的 popstate & hashchange 事件监听，保证和 location 表现一致
  context.addEventListener = (
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): void => {
    if (historyEvents.includes(type as HistoryEvents)) {
      return historyEventEmitters.on(type as HistoryEvents, listener);
    }
    return rawAddEventListener.call(context, type, listener, options);
  };
  context.removeEventListener = (
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): void => {
    if (historyEvents.includes(type as HistoryEvents)) {
      return historyEventEmitters.off(type as HistoryEvents, listener);
    }
    return rawRemoveEventListener.call(context, type, listener, options);
  };
}
