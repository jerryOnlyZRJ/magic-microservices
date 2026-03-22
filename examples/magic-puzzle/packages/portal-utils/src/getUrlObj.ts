/**
 * @description: 解析url，生成urlObject
 * @param url: url地址
 */
export function getUrlObj(url: string) {
  // 因为兼容性考虑，未使用new URL()
  const a = document.createElement('a');
  a.href = url;
  return a;
}
