import magic, { isModuleRegistered } from '@magic-microservices/magic';
import {
  renderHtmlTagObjectsToFragment,
  defaultFetch,
  getUrlObj,
} from '@byted-cg/open-source-portal-utils';
import Sandbox from '@byted/garfish-sandbox';
import md5 from 'blueimp-md5';

import { EventEmitter, EventType } from './EventEmitter';
import { overrideHistory, historySandbox } from './history/sandbox';
import { PropTypesMap } from '@magic-microservices/magic/dist/src/lib/Heap';
import { LOADING_CONTAINER_ID, loadingStyleCss, loadingDom } from './const/loading';
import {
  IBuildPortalContentParams,
  IDefaultPortalProps,
  IPortalManifest,
  IPortalRegisterOptions,
  MagicPortalElement,
  PORTAL_HTML_TAG,
} from './interface';

const rawElementAddEventListener = Element.prototype.addEventListener;
const rawElementRemoveEventListener = Element.prototype.removeEventListener;

async function buildPortalContent({
  container,
  manifest,
  fetch = defaultFetch,
  overrides,
  'history-isolation': historyIsolation,
  'initial-url': initialUrl,
  'render-dom-id': renderDomId,
  webcomponentsIns,
}: IBuildPortalContentParams) {
  const { hostEventEmitter, clientEventEmitter, sandbox: oldSandbox } = webcomponentsIns;
  // clear sideEffect
  container.innerHTML = '';
  clientEventEmitter.emitEvent('beforeServiceUmount');
  clientEventEmitter.clean();
  oldSandbox?.clearEffects();

  // mock head
  const head = document.createElement('head');
  container.appendChild(head);
  // mock body
  const body = document.createElement('body');
  body.style.position = 'relative';
  const bodyContent = document.createDocumentFragment();
  // create loading
  const loadingContainer = document.createElement('div');
  loadingContainer.setAttribute('id', LOADING_CONTAINER_ID);
  loadingContainer.style.position = 'absolute';
  loadingContainer.style.width = '100%';
  loadingContainer.style.height = '100%';
  const loadingStyleDom = document.createElement('style');
  loadingStyleDom.appendChild(document.createTextNode(loadingStyleCss));
  head.appendChild(loadingStyleDom);
  loadingContainer.innerHTML += loadingDom;
  // create render root
  const renderContainer = document.createElement('div');
  renderContainer.setAttribute('id', renderDomId || 'root');
  // generate body DOM
  bodyContent.appendChild(loadingContainer);
  bodyContent.appendChild(renderContainer);
  body.appendChild(bodyContent);
  container.appendChild(body);

  const initialOrigin = getUrlObj(initialUrl || window.location.href).origin;
  const isSameOrigin = window.location.origin === initialOrigin;

  let manifestJson = (await manifest) as IPortalManifest;
  if (!manifestJson) {
    return;
  }
  if (typeof manifest === 'string') {
    manifestJson = JSON.parse(await fetch(manifest)) as IPortalManifest;
  }
  const { scripts, styles, renderContent } = manifestJson;
  const stylesDOMFragment = renderHtmlTagObjectsToFragment(styles);
  head.appendChild(stylesDOMFragment);
  // for SSR
  renderContent && (renderContainer.innerHTML = renderContent);

  let sandboxModulesOverrides = {};
  if (historyIsolation) {
    const { location, history, History, historyEventEmitters } = historySandbox(
      initialUrl || window.location.href,
    );
    webcomponentsIns.historyEventEmitters = historyEventEmitters;
    sandboxModulesOverrides = {
      history: () => {
        return {
          override: {
            history,
            History,
          },
        };
      },
      location: () => ({
        override: {
          location,
        },
      }),
    };
  }

  if (isSameOrigin) {
    sandboxModulesOverrides = {
      ...sandboxModulesOverrides,
      storage: () => {
        return {
          override: {
            localStorage: window.localStorage,
            sessionStorage: window.sessionStorage,
          },
        };
      },
    };
  }

  // create sandbox
  const sandbox = new Sandbox({
    el: () => container,
    protectVariable: () => ['HTMLElement', 'EventTarget', 'Event'],
    namespace: md5(initialOrigin),
    modules: {
      // hack garfish sandbox error
      ...sandboxModulesOverrides,
      module: () => ({
        override: {
          module: {},
        },
      }),
      portalHost: () => ({
        override: {
          portalHost: {
            shadowRoot: webcomponentsIns.shadowRoot,
            postMessage: hostEventEmitter.postMessage,
            emitEvent: hostEventEmitter.emitEvent,
            addEventListener: clientEventEmitter.addPortalEventListener,
            removeEventListener: clientEventEmitter.removePortalEventListener,
          },
        },
      }),
    },
  });
  Object.keys(overrides || {}).forEach((key) => {
    if (sandbox.context && overrides) {
      sandbox.context[key] = overrides[key];
    }
  });
  if (historyIsolation && sandbox.context) {
    // 复写history
    overrideHistory(sandbox, webcomponentsIns);
  }
  webcomponentsIns.sandbox = sandbox;
  /**
   * proxy script tags
   */
  // 模拟浏览器串行加载执行所有 JS
  // TODO: 需要让过程更贴合浏览器实现，比如 async & defer & type="module"
  await scripts?.reduce(async (acc, script) => {
    await acc;
    let scriptContent = script.innerHTML;
    const scriptSrc = script.attributes?.src;
    if (scriptSrc) {
      scriptContent = await fetch(scriptSrc);
    }
    scriptContent && sandbox.execScript(scriptContent, scriptSrc);
  }, Promise.resolve());
  // close loading
  loadingContainer.style.display = 'none';
}

export function isPortalRegister(): boolean {
  return isModuleRegistered(PORTAL_HTML_TAG);
}

export const customElementCompatibility =
  Object.prototype.toString.call(window.customElements) ===
  '[object CustomElementRegistry]';

export async function portalRegister<T extends IDefaultPortalProps = IDefaultPortalProps>(
  options: IPortalRegisterOptions<T> = {},
): Promise<void> {
  const { restMagicOptions, plugins } = options;

  if (!customElementCompatibility) {
    throw new Error('Browser not support web components');
  }

  // register a service component
  await magic<T>(
    PORTAL_HTML_TAG,
    {
      bootstrap: (webcomponentsIns: MagicPortalElement) => {
        // 父子通信能力
        const host = new EventEmitter();
        const client = new EventEmitter();
        webcomponentsIns.hostEventEmitter = host;
        webcomponentsIns.clientEventEmitter = client;
        webcomponentsIns.postMessage = client.postMessage;
        webcomponentsIns.emitEvent = client.emitEvent;
        webcomponentsIns.addPortalEventListener = host.addPortalEventListener;
        webcomponentsIns.removePortalEventListener = host.removePortalEventListener;
        webcomponentsIns.addEventListener = (
          type: EventType,
          listener: EventListener,
          ...args: unknown[]
        ) => {
          if (type === 'message') {
            return host.addPortalEventListener(type, listener);
          }
          return rawElementAddEventListener.call(
            webcomponentsIns,
            type,
            listener,
            ...args,
          );
        };
        webcomponentsIns.removeEventListener = (
          type: EventType,
          listener: EventListener,
          ...args: unknown[]
        ) => {
          if (type === 'message') {
            return host.removePortalEventListener(type, listener);
          }
          return rawElementRemoveEventListener.call(
            webcomponentsIns,
            type,
            listener,
            ...args,
          );
        };
      },
      mount: async (container, props, webcomponentsIns: MagicPortalElement) => {
        await buildPortalContent({
          ...props,
          container,
          webcomponentsIns,
        });
      },
      updated: async (attributeName, _propsValue, container, props, webcomponentsIns) => {
        if (attributeName === 'manifest' || attributeName === 'history-isolation') {
          await buildPortalContent({
            ...props,
            container,
            webcomponentsIns,
          });
        }
      },
      unmount: (webcomponentsIns: MagicPortalElement) => {
        const { hostEventEmitter, clientEventEmitter, sandbox } = webcomponentsIns;
        clientEventEmitter.emitEvent('beforeServiceUmount');
        clientEventEmitter.clean();
        hostEventEmitter.clean();
        sandbox?.clearEffects();
      },
    },
    {
      ...(restMagicOptions || {}),
      shadow: true,
      plugins: [...(restMagicOptions?.plugins || []), ...(plugins || [])],
      propTypes: {
        ...(restMagicOptions?.propTypes || ({} as PropTypesMap<T>)),
        manifest: Object,
        fetch: Function,
        overrides: Object,
        'initial-url': String,
        'history-isolation': Boolean,
      },
    },
  );
}
