import {
  PORTAL_HTML_TAG,
  MagicPortalElement,
  IDefaultPortalProps,
} from '@byted-cg/open-source-portal';
import {
  IPortalHtmlParserResult,
  ICustomDOMMatcher,
} from '@byted-cg/open-source-portal-utils';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export const HTML_ENTRY_ATTRIBUTE_NAME = 'src' as const;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface IntrinsicElements {
      [PORTAL_HTML_TAG]: DetailedHTMLProps<
        HTMLAttributes<MagicPortalElementWithHTMLEntry>,
        MagicPortalElementWithHTMLEntry
      > &
        PortalElementWithHTMLEntryProps;
    }
  }

  interface HTMLElementTagNameMap {
    [PORTAL_HTML_TAG]: MagicPortalElement;
  }
}

export interface MagicPortalElementWithHTMLEntry
  extends MagicPortalElement,
    PortalElementWithHTMLEntryProps {}

export interface IPortalHtmlEntryLoaderResult {
  manifest: IPortalHtmlParserResult;
  initialUrl: string;
}

export interface PortalElementWithHTMLEntryProps extends IDefaultPortalProps {
  [HTML_ENTRY_ATTRIBUTE_NAME]?: string;
}

export interface IPortalHtmlEntryLoaderOptions {
  fetch?: (url: string) => Promise<string>;
  matchers?: ICustomDOMMatcher[];
}
