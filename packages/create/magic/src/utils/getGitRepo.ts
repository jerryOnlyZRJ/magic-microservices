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

import { spawnSync } from 'child_process'
import ora from 'ora'

/**
 * @description 拉取 git repo
 * @param {String} context 命令执行上下文
 * @param {String} gitRepo git repo http url
 * @param {String} filename 本地项目名称
 */
function getGitRepo(
    context: string,
    gitRepo: string,
    filename?: string,
    branch = 'master',
): Promise<void> {
    return new Promise((resolve, reject): void => {
        const getRepoSpinner = ora('拉取模板中...\n').start()
        const getGitRepoCp = spawnSync(
            'git',
            ['clone', '--depth=1', `--branch=${branch}`, gitRepo, filename],
            {
                cwd: context,
                stdio: 'inherit',
            },
        )
        const error = getGitRepoCp.stderr || getGitRepoCp.error
        if (error || getGitRepoCp.status !== 0) {
            const errorMsg = error || `状态码(${getGitRepoCp.status})`
            getRepoSpinner.fail('模板拉取失败！😢')
            console.error('脚手架repo拉取失败: ', errorMsg)
            reject(errorMsg)
            return
        }
        getRepoSpinner.succeed('模板拉取完成！😊')
        resolve()
    })
}

export default getGitRepo
