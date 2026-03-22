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
