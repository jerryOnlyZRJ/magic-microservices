import { portalHtmlParser, defaultFetch } from '@byted-cg/open-source-portal-utils';
import { Module, LifeCycle } from '@magic-microservices/magic';
import {
  IPortalHtmlEntryLoaderOptions,
  PortalElementWithHTMLEntryProps,
  HTML_ENTRY_ATTRIBUTE_NAME,
} from './interface';
export * from './interface';

export default class PortalHtmlEntryPlugin {
  options: IPortalHtmlEntryLoaderOptions;

  constructor(
    options: IPortalHtmlEntryLoaderOptions = {} as IPortalHtmlEntryLoaderOptions,
  ) {
    this.options = options;
  }

  async getManifest(url: string) {
    const { fetch = defaultFetch, matchers } = this.options;
    const htmlContent = await fetch(url);
    return portalHtmlParser(htmlContent, matchers);
  }

  formateIntialPathFromHtmlEntry(props: PortalElementWithHTMLEntryProps, src: string) {
    // initial-url属性默认使用html，initial-url可以为绝对路径也可以为相对路径
    props['initial-url'] = props['initial-url'] || src;
  }

  apply(lifeCycle: LifeCycle<PortalElementWithHTMLEntryProps>) {
    const { fetch } = this.options;
    lifeCycle.hooks.beforeOptionsInit.tap((lifeCycle) => {
      const rawModule = lifeCycle!.magicInput
        .module as Module<PortalElementWithHTMLEntryProps>;
      lifeCycle!.magicInput.module = {
        ...rawModule,
        mount: async (container, props, ...rest) => {
          if (props[HTML_ENTRY_ATTRIBUTE_NAME]) {
            props.manifest = await this.getManifest(props[HTML_ENTRY_ATTRIBUTE_NAME]!);
            props.fetch = props.fetch || fetch;
            this.formateIntialPathFromHtmlEntry(props, props[HTML_ENTRY_ATTRIBUTE_NAME]!);
          }
          await rawModule.mount(container, props, ...rest);
        },
        updated: async (attributeName, propsValue, _container, props, ...rest) => {
          let realAttributeName = attributeName;
          let realPropsValue = propsValue;
          if (attributeName === HTML_ENTRY_ATTRIBUTE_NAME) {
            realAttributeName = 'manifest';
            realPropsValue = await this.getManifest(propsValue as string);
            this.formateIntialPathFromHtmlEntry(props, props[HTML_ENTRY_ATTRIBUTE_NAME]!);
          }
          await rawModule.updated!(
            realAttributeName,
            realPropsValue,
            _container,
            props,
            ...rest,
          );
        },
      };
      lifeCycle!.magicInput.options.propTypes![HTML_ENTRY_ATTRIBUTE_NAME] = String;
    });
  }
}
