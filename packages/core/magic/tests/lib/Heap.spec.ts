import type { PropTypesMap } from '@/lib/Heap';

describe('test Heap', () => {
  const globalHeapKey = '__MAGIC_HEAP__';
  const loadHeap = async () => (await import('@/lib/Heap')).default;

  afterEach(() => {
    delete window[globalHeapKey];
    jest.resetModules();
  });

  test('getPropsValue use default propTypes and return raw value', async () => {
    delete window[globalHeapKey];
    const heap = await loadHeap();

    expect(heap.getPropsValue('name', 'Jerry')).toBe('Jerry');
  });

  test('constructor reuse existing heap store', async () => {
    const presetHeap = { existed: true };
    window[globalHeapKey] = presetHeap;

    const heap = await loadHeap();

    expect(heap.dataMap).toBe(presetHeap);
  });

  test('getPropsValue convert typed values and recycle heap props', async () => {
    delete window[globalHeapKey];
    const heap = await loadHeap();
    const callback = jest.fn();
    const callbackId = heap.useProps(callback);
    const propTypes: PropTypesMap<Record<string, unknown>> = {
      enabled: Boolean,
      age: Number,
      callback: Function,
    };

    expect(heap.getPropsValue('enabled', '')).toBe('');
    expect(heap.getPropsValue('enabled', 'false', propTypes)).toBe(false);
    expect(heap.getPropsValue('enabled', '', propTypes)).toBe(true);
    expect(heap.getPropsValue('age', '18', propTypes)).toBe(18);
    expect(heap.getPropsValue('callback', callbackId, propTypes)).toBe(callback);
    expect(heap.dataMap[callbackId]).toBeUndefined();
  });
});
