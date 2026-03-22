type ResourcePath = string;

class Prefetcher {
  prefetch(paths: ResourcePath | ResourcePath[]) {
    paths = Array.isArray(paths) ? paths : [paths];

    const head = document.head;
    const fragment = document.createDocumentFragment();

    paths.forEach(path => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'prefetch');
      link.setAttribute('href', path);
      link.dataset.puzzlePrefetcher = 'puzzle-prefetcher';
      fragment.appendChild(link);
    });

    head.appendChild(fragment);
  }

  clear() {
    const toRemove = document.head.querySelectorAll('[data-puzzle-prefetcher="puzzle-prefetcher"]');
    toRemove.forEach(link => {
      link.parentNode?.removeChild(link);
    });
  }
}

export default Prefetcher;