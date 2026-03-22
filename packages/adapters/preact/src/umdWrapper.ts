/**
 * Copyright (c) 2020 Bytedance Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Module } from '@magic-microservices/magic';
import magicPreact, { IMagicPreactOptions, mountGenerator, updatedGenerator, unmountGenerator } from './index';

export interface IUmdMagicPreact<ComponentProps extends {} = Record<string, unknown>> {
  (options: IMagicPreactOptions<ComponentProps>): Module<ComponentProps>;
  mountGenerator: typeof mountGenerator;
  updatedGenerator: typeof updatedGenerator;
  unmountGenerator: typeof unmountGenerator;
}

export default Object.assign(magicPreact, { mountGenerator, updatedGenerator, unmountGenerator });
