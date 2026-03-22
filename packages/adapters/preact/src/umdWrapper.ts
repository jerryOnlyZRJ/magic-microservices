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
