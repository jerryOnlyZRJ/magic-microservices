/*
 * Copyright 2021 ByteDance and/or its affiliates.
 *
 * This source code is licensed under the MIT License.
 * You may obtain a copy of the License at
 *
 *     https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface HtmlTagObject {
  /**
   * Attributes of the html tag
   * E.g. `{'disabled': true, 'value': 'demo'}`
   */
  attributes?: Record<string, string>;
  /**
   * The tag name e.g. `'div'`
   */
  tagName: string;
  /**
   * The inner HTML
   */
  innerHTML?: string;
  /**
   * Whether this html must not contain innerHTML
   * @see https://www.w3.org/TR/html5/syntax.html#void-elements
   */
  voidTag?: boolean;
}

/**
 * All html tag elements which must not contain innerHTML
 * @see https://www.w3.org/TR/html5/syntax.html#void-elements
 */
const voidTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

export function renderHtmlTagObjectToHtmlElement(tagDefinition: HtmlTagObject): HTMLElement {
  const tagElement = document.createElement(tagDefinition.tagName);
  Object.keys(tagDefinition.attributes || {}).forEach((attributeName) => {
    tagElement.setAttribute(attributeName, tagDefinition.attributes?.[attributeName] || '');
  });
  if (!tagDefinition.voidTag && tagDefinition.innerHTML) {
    tagElement.innerHTML = tagDefinition.innerHTML;
  }
  return tagElement;
}

export function renderHtmlTagObjectsToFragment(tagDefinitions: HtmlTagObject[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  tagDefinitions.forEach((tagDefinition) => {
    const element = renderHtmlTagObjectToHtmlElement(tagDefinition);
    fragment.appendChild(element);
  });
  return fragment;
}

type AttributesType = Record<string, string>;

export function createHtmlTagObject(tagName: string, attributes: AttributesType, innerHTML?: string): HtmlTagObject {
  return {
    tagName,
    voidTag: voidTags.indexOf(tagName) !== -1,
    attributes: attributes,
    innerHTML,
  };
}

const tagMetaData = {
  scripts: (sourceUrl: string): HtmlTagObject =>
    createHtmlTagObject('script', {
      type: 'text/javascript',
      src: sourceUrl,
    }),
  styles: (sourceUrl: string): HtmlTagObject =>
    createHtmlTagObject('link', {
      rel: 'stylesheet',
      type: 'text/css',
      href: sourceUrl,
    }),
};

export function formatScripts8StylesTagAlias(
  type: 'scripts' | 'styles',
  tagOption: HtmlTagObject | string,
): HtmlTagObject {
  if (typeof tagOption === 'string') {
    return tagMetaData[type](tagOption);
  }
  return tagOption;
}
