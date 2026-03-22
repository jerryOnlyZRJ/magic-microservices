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

import path from 'path'
import fs from 'fs-extra'

import installDependencies from '@/utils/installDependencies'
import CONFIG from './config'
import writeFile from '@/utils/writeFile'
import { buildConfigTransformer } from './transformer'
import readFile from '@/utils/readFIle'

async function vue(context: string): Promise<void> {
    const buildFilePath = path.resolve(context, 'build/config.js')

    await Promise.all([
        CONFIG.dependencies?.length &&
            installDependencies({
                context,
                dependenceName: CONFIG.dependencies,
                prefix: '初始化 Svelte dependencies 相关依赖',
            }),
        CONFIG.devDependencies?.length &&
            installDependencies({
                context,
                dependenceName: CONFIG.devDependencies,
                mode: 'save-dev',
                prefix: '初始化 Svelte devDependencies 相关依赖',
            }),
        (async (): Promise<void> => {
            const source = await readFile(buildFilePath)
            const res = buildConfigTransformer(source)
            await writeFile(buildFilePath, res)
        })(),
        (async (): Promise<void> => {
            await Promise.all([
                fs.copy(
                    path.resolve(__dirname, 'templates/src'),
                    path.resolve(context, 'src'),
                ),
            ])
        })(),
    ])
}

export default vue
