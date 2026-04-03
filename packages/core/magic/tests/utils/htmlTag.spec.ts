import {
  createHtmlTagObject,
  formatScripts8StylesTagAlias,
  renderHtmlTagObjectToHtmlElement,
  renderHtmlTagObjectsToFragment,
} from '@/utils/htmlTag';

describe('test htmlTag utils', () => {
  test('renderHtmlTagObjectToHtmlElement handle empty attribute values and missing attributes on re-read', () => {
    let attributesReadCount = 0;
    const tagDefinition = {
      tagName: 'div',
      get attributes() {
        attributesReadCount += 1;
        return attributesReadCount === 1 ? { 'data-empty': '' } : undefined;
      },
    };

    const element = renderHtmlTagObjectToHtmlElement(tagDefinition);

    expect(element.getAttribute('data-empty')).toBe('');
    expect(element.innerHTML).toBe('');
  });

  test('renderHtmlTagObjectToHtmlElement skip innerHTML for void tags', () => {
    const element = renderHtmlTagObjectToHtmlElement(
      createHtmlTagObject(
        'link',
        {
          rel: 'stylesheet',
        },
        'ignored',
      ),
    );

    expect(element.tagName.toLowerCase()).toBe('link');
    expect(element.innerHTML).toBe('');
  });

  test('renderHtmlTagObjectsToFragment and formatScripts8StylesTagAlias support alias and raw objects', () => {
    const rawTag = createHtmlTagObject(
      'div',
      {
        class: 'demo',
      },
      'content',
    );
    const scriptTag = formatScripts8StylesTagAlias('scripts', 'https://cdn.byted.org/app.js');
    const styleTag = formatScripts8StylesTagAlias('styles', 'https://cdn.byted.org/app.css');

    expect(formatScripts8StylesTagAlias('scripts', rawTag)).toBe(rawTag);

    const fragment = renderHtmlTagObjectsToFragment([scriptTag, styleTag, rawTag]);
    const scriptElement = fragment.childNodes[0] as HTMLScriptElement;
    const styleElement = fragment.childNodes[1] as HTMLLinkElement;
    const rawElement = fragment.childNodes[2] as HTMLDivElement;

    expect(scriptElement.getAttribute('src')).toBe('https://cdn.byted.org/app.js');
    expect(styleElement.getAttribute('href')).toBe('https://cdn.byted.org/app.css');
    expect(rawElement.innerHTML).toBe('content');
  });
});
