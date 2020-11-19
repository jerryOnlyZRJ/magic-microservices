/**
  * Copyright (c) 2020 Bytedance Inc.
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE file in the root directory of this source tree.
  */
import magicUmdModule from '@/umdWrapper';

test('test magic module', () => {
  expect(typeof magicUmdModule).toBe('function');
  expect('useProps' in magicUmdModule).toBeTruthy();
  expect('isModuleRegistered' in magicUmdModule).toBeTruthy();
});
