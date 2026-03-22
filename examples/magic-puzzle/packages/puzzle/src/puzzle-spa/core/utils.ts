import { EventType } from '@byted-cg/open-source-portal';

import { IPortalManifest, PuzzleEventListener } from '@/puzzle';
import { puzzle } from '@/puzzle/puzzleServiceCreator';

import { IPuzzleSPAAppItem, IPuzzleSPAOptions, PuzzleApp } from '../type';

import Prefetcher from './Prefetcher';
import { AppStatusEnums } from './const';
import { functionExecutor, invariant } from '../utils';

export const fetchManifest = async (
  manifestPath: string,
  options: {
    prefetcher?: Prefetcher;
    shouldPrefetch: boolean;
  },
) => {
  const { shouldPrefetch, prefetcher } = options;

  const manifestResponse = await fetch(manifestPath, {
    credentials: 'omit',
  });

  let manifest: IPortalManifest;

  try {
    manifest = await manifestResponse.json();
  } catch (e) {
    invariant(
      false,
      'Manifest should formatted as JSON with scripts and styles (both optional).',
    );
    return {} as IPortalManifest;
  }

  if (shouldPrefetch && prefetcher) {
    manifest.scripts.forEach((scriptObject) => {
      if (scriptObject.attributes?.src) {
        prefetcher.prefetch(scriptObject.attributes.src);
      }
    });

    manifest.styles.forEach((scriptObject) => {
      if (scriptObject.attributes?.href) {
        prefetcher.prefetch(scriptObject.attributes.src);
      }
    });
  }

  return manifest;
};

export const formatManifest = async (
  manifest: PuzzleApp['manifest'],
  options: {
    prefetcher?: Prefetcher;
    shouldPrefetch: boolean;
  },
) => {
  return typeof manifest === 'string'
    ? await fetchManifest(manifest, {
      shouldPrefetch: options.shouldPrefetch,
      prefetcher: options.prefetcher,
    })
    : manifest;
};

export const createApps = (
  optionApps: IPuzzleSPAAppItem[] | IPuzzleSPAAppItem,
): PuzzleApp[] => {
  optionApps = Array.isArray(optionApps) ? optionApps : [optionApps];

  return optionApps.map((app) => ({
    ...app,
    status: AppStatusEnums.bootstrapped,
    rawManifest: app.manifest,
    serviceInstance: null,
    listeners: {} as Record<EventType, PuzzleEventListener[]>,
  }));
};

export const createPuzzleInstance = async (app: PuzzleApp) => {
  const puzzleIns = await puzzle({
    manifest: app.manifest,
    src: app.htmlUrl && !app.manifest ? functionExecutor(app.htmlUrl) : undefined,
    'history-isolation': app.historyIsolation,
    'initial-url': functionExecutor(app.initialUrl, app),
    fallbackHTMLURL: functionExecutor(app.htmlUrl),
  });

  puzzleIns.setAttribute('data-puzzle-service', app.name);

  return puzzleIns;
};

export const createContainer = (options: IPuzzleSPAOptions) => {
  const container = options.container;
  if (!container) return null;
  let innerContainer: string | HTMLElement | null;

  if (typeof container === 'function') {
    innerContainer = container(options);
  } else {
    innerContainer = container;
  }

  return typeof innerContainer === 'string'
    ? (document.querySelector(innerContainer) as HTMLElement | null)
    : innerContainer;
};

export const isAppActive = (activeRule: IPuzzleSPAAppItem['activeRule']): boolean => {
  if (typeof activeRule === 'function') {
    return activeRule(window.location);
  }

  return window.location.pathname.startsWith(activeRule);
};

interface IPuzzleWrappedPopStateEvent extends PopStateEvent {
  puzzleSpa: true;
}

interface IPopStateEventPolyfill extends PopStateEvent {
  initPopStateEvent: (arg1: string, arg2: boolean, arg3: boolean, arg4: unknown) => void;
}

export function createPopStateEvent(): IPuzzleWrappedPopStateEvent {
  const state = window.history.state;
  let evt;
  try {
    evt = new PopStateEvent('popstate', { state });
  } catch (err) {
    // https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-html5e/bd560f47-b349-4d2c-baa8-f1560fb489dd
    evt = document.createEvent('PopStateEvent');
    (evt as IPopStateEventPolyfill).initPopStateEvent('popstate', false, false, state);
  }
  (evt as IPuzzleWrappedPopStateEvent).puzzleSpa = true;
  return evt as IPuzzleWrappedPopStateEvent;
}
