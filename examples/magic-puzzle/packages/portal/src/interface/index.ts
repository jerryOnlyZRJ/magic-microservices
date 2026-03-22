import { EventEmitter } from '@/EventEmitter';
import { HistoryEventEmitters } from '@/history/sandbox';
import { IPortalHtmlParserResult } from '@byted-cg/open-source-portal-utils';
import Sandbox from '@byted/garfish-sandbox';
import { MagicOptions } from '@magic-microservices/magic';

export interface IPortalManifest extends IPortalHtmlParserResult {
  renderContent?: string; // for SSR
}

export type ManifestType = string | IPortalManifest;

export interface IDefaultPortalProps {
  manifest?: ManifestType | Promise<ManifestType>;
  fetch?: (url: string) => Promise<string>;
  'initial-url'?: string;
  'history-isolation'?: boolean;
  'render-dom-id'?: string;
  overrides?: Record<string, unknown>;
}

export interface IPortalRegisterOptions<
  T extends IDefaultPortalProps = IDefaultPortalProps,
> {
  restMagicOptions?: MagicOptions<T>;
  plugins?: MagicOptions<T>['plugins'];
}

export interface MagicPortalElement
  extends HTMLElement,
    IDefaultPortalProps,
    EventEmitter {
  sandbox?: Sandbox;
  hostEventEmitter: EventEmitter;
  clientEventEmitter: EventEmitter;
  historyEventEmitters: HistoryEventEmitters;
}

export interface IPortalHost {
  shadowRoot: ShadowRoot;
  postMessage: EventEmitter['postMessage'];
  emitEvent: EventEmitter['emitEvent'];
  addEventListener: EventEmitter['addPortalEventListener'];
  removeEventListener: EventEmitter['removePortalEventListener'];
}

export interface IClientWindow extends Window {
  portalHost?: IPortalHost;
}

export const PORTAL_HTML_TAG = 'magic-portal';

export interface IBuildPortalContentParams extends IDefaultPortalProps {
  container: Element;
  webcomponentsIns: MagicPortalElement;
}
