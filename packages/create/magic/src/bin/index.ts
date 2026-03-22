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

#! /usr/bin/env node

import process from 'process'
import program from 'commander'
import chalk from 'chalk'

import errorHandler from '../utils/cli/errorHandler'
import runCommand from '../commands'

program.version(runCommand('getVersion'), '-v, --vers')

// 拿到当前 CLI 执行的 context
const context = process.cwd()

/**
 * 生成 CLI 的配置文件
 * magic-i18n init
 */
program
    .command('init')
    .description('快速创建微前端组件项目')
    .action(async () => {
        runCommand('init', context)
    })

program
    .command('info')
    .description('输出你当前环境的配置信息')
    .action(() => {
        runCommand('info')
    })

// add some useful info on help
program.on('--help', () => {
    console.log()
    console.log(
        `  Run ${chalk.cyan(
            'bcg <command> --help',
        )} for detailed usage of given command.`,
    )
    console.log()
})

errorHandler.init(program)

program.parse(process.argv)
