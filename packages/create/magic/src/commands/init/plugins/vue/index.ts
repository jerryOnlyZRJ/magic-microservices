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
import {
    browserExternalsTransformer,
    buildConfigTransformer,
    htmlTransformer,
} from './transformer'
import readFile from '@/utils/readFIle'

async function vue(context: string): Promise<void> {
    const eslintRcPath = path.resolve(context, '.eslintrc')
    const buildFilePath = path.resolve(context, 'build/config.js')
    const browserExternalsFilePath = path.resolve(context, 'build/browserExternals.js')
    const htmlTemplatePath = path.resolve(context, 'dev/index.html')
    const packageJsonPath = path.resolve(context, 'package.json')

    await Promise.all([
        installDependencies({
            context,
            dependenceName: CONFIG.dependencies,
            prefix: '初始化 Vue 相关依赖',
        }),
        installDependencies({
            context,
            dependenceName: CONFIG.devDependencies,
            mode: 'save-dev',
            prefix: '初始化 Vue 相关依赖',
        }),
        (async (): Promise<void> => {
            const eslintConfigSource = await readFile(eslintRcPath)
            const eslintConfig = JSON.parse(eslintConfigSource)
            eslintConfig.extends.push('plugin:vue/essential')
            eslintConfig.plugins.push('vue')
            delete eslintConfig.parser
            await writeFile(eslintRcPath, JSON.stringify(eslintConfig, null, 2))
        })(),
        (async (): Promise<void> => {
            const packageJsonSource = await readFile(packageJsonPath)
            const packageJson = JSON.parse(packageJsonSource)
            packageJson.scripts['stylelint:fix'] = packageJson.scripts[
                'stylelint:fix'
            ].replace('css', 'vue')
            await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
        })(),
        (async (): Promise<void> => {
            const source = await readFile(browserExternalsFilePath)
            const res = browserExternalsTransformer(source)
            await writeFile(browserExternalsFilePath, res)
        })(),
        (async (): Promise<void> => {
            const source = await readFile(buildFilePath)
            const res = buildConfigTransformer(source)
            await writeFile(buildFilePath, res)
        })(),
        (async (): Promise<void> => {
            const source = await readFile(htmlTemplatePath)
            const res = await htmlTransformer(source)
            await writeFile(htmlTemplatePath, res)
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
