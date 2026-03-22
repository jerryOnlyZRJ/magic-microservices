export function defaultFetch(url: string): Promise<string> {
  return window.fetch(url).then((res) => res.text());
}
