import { PuzzleSPA } from '@byted-cg/open-source-puzzle';

import {
  useProps,
  isPortalRegister,
  portalRegister,
  portalElementCreator,
} from '@byted-cg/open-source-portal';

import PortalHtmlEntryPlugin, {
  PortalElementWithHTMLEntryProps,
} from '@byted-cg/portal-html-entry-plugin';

import type { IPuzzleSPAOptions, PuzzleSPAInstance } from '@byted-cg/open-source-puzzle';

export * from '@byted-cg/open-source-puzzle';

export { useProps };

export function puzzleSPA(options: IPuzzleSPAOptions): PuzzleSPAInstance {
  return PuzzleSPA({
    serviceMode: 'wc',
    ...options,
  });
}

export async function puzzle<
  T extends PortalElementWithHTMLEntryProps = PortalElementWithHTMLEntryProps,
>(props?: T) {
  if (!isPortalRegister()) {
    await portalRegister({
      plugins: [new PortalHtmlEntryPlugin()],
    });
  }
  return portalElementCreator(props);
}
