import path from 'path'

import chalk from 'chalk'
import inquirer from 'inquirer'
import notifier from 'node-notifier'

import promptsMap, { InitAnswers } from './config/prompts'
import functionExecutor from '@/utils/functionExecutor'
import getGitRepo from '@/utils/getGitRepo'
import formateCamelCase from '@/utils/formateCamelCase'
import getGitUser from '@/utils/getGitUser'
import renderFile from '@/utils/renderFile'
import { MagicCliRcConfig } from './typings'
import deleteGitFolder from '@/utils/deleteGitFolder'
import copyfile from '@/utils/copyFile'
import deleteFile from '@/utils/deleteFile'
import installDependencies from '@/utils/installDependencies'
import usePlugin from './plugins/usePlugin'
import { runShell } from '@/utils/runShell'

export default async function init(context): Promise<void> {
    const prompts = Object.values(promptsMap).map(item => functionExecutor(item, context))
    try {
        const answers: InitAnswers = await inquirer.prompt(prompts)
        const gitUser = getGitUser()
        const { name, framework } = answers

        const renderConfig = {
            ...answers,
            moduleName: formateCamelCase(name),
            author: gitUser,
        }

        // 拉取 git 项目
        await getGitRepo(
            context,
            'git@code.byted.org:cgfe/magic-microservice-component-template.git',
            name,
            'master',
        )
        const projectBasePath = path.resolve(context, `./${name}`)
        const magicCliRcPath = path.resolve(projectBasePath, '.magicclirc')

        // 渲染 .magicclirc
        await renderFile(magicCliRcPath, magicCliRcPath, renderConfig, projectBasePath)
        const magicCliRcConfig: MagicCliRcConfig = await import(magicCliRcPath)

        await Promise.all(
            [deleteGitFolder(projectBasePath)]
                // 渲染文件
                .concat(
                    magicCliRcConfig?.files2Render instanceof Array
                        ? magicCliRcConfig.files2Render.map(
                            (item): Promise<void> => {
                                return renderFile(
                                    item.input,
                                    item.output,
                                    renderConfig,
                                    projectBasePath,
                                    item.deleteSource,
                                )
                            },
                        )
                        : [],
                )
                // 复制文件
                .concat(
                    magicCliRcConfig?.files2copy instanceof Array
                        ? magicCliRcConfig.files2copy.map(
                            (item): Promise<void> => {
                                return copyfile(
                                    item.input,
                                    item.output,
                                    projectBasePath,
                                    true,
                                )
                            },
                        )
                        : [],
                ),
        )
        await deleteFile(magicCliRcPath)
        await installDependencies({ context: projectBasePath, prefix: '项目依赖初始化' })
        if (['react', 'vue', 'svelte'].includes(framework)) {
            await usePlugin(framework, projectBasePath)
        }
        await runShell('npm run lint:fix', path.resolve(context, name))
        notifier.notify({
            title: 'Magic Component',
            message: `微应用 ${name} 创建成功!`,
        })
    } catch (err) {
        console.error(chalk.bold.red('ERROR：项目创建失败！'), err)
    }
}
