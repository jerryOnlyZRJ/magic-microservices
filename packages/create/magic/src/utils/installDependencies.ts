import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import ora from 'ora'
import deleteFile from './deleteFile'
import chalk from 'chalk'

interface InstallDependenciesParams {
    context: string;
    dependenceName?: string | string[];
    mode?: string;
    registry?: string;
    prefix?: string;
}

/**
 * @description 项目拉取后初始化项目依赖
 * @param {String} projectBasePath 项目根路径
 */
async function installDependencies({
    context,
    dependenceName,
    mode = 'save',
    registry = 'http://bnpm.byted.org',
    prefix,
}: InstallDependenciesParams): Promise<void> {
    const prefixStr = prefix ? chalk.cyan(prefix + '：') : ''
    let installSource = 'npm i'
    if (dependenceName && dependenceName instanceof Array) {
        dependenceName = dependenceName.join(' ')
    }
    if (fs.existsSync(path.resolve(context, 'yarn.lock'))) {
        if (!dependenceName) {
            installSource = 'yarn install'
            // 删去 yarn.lock 安装最新版依赖
            await deleteFile(path.resolve(context, 'yarn.lock'))
        } else {
            installSource = 'yarn add'
        }
    }
    const installShell = [
        installSource,
        dependenceName && ` ${dependenceName}`,
        `--${mode}`,
        `--registry=${registry}`,
    ].join(' ')
    return await new Promise((resolve, reject): void => {
        const spinner = ora(prefixStr + '安装项目依赖中...').start()
        exec(
            installShell,
            {
                cwd: context,
            },
            (err): void => {
                if (err) {
                    console.error(prefixStr + '项目依赖安装失败', err)
                    spinner.fail()
                    reject(err)
                    return
                }
                spinner.succeed(prefixStr + '项目依赖安装完毕！😊')
                resolve()
            },
        )
    })
}

export default installDependencies
