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

import { spawnSync, SpawnSyncReturns, StdioOptions } from 'child_process'

export function runShell(
    shell: string | string[],
    context?: string,
    stdio: StdioOptions = 'inherit',
): Promise<SpawnSyncReturns<Buffer>> {
    return new Promise((resolve, reject): void => {
        const shellArr = shell instanceof Array ? shell : shell.split(/\s+/)
        const spawnResult = spawnSync(shellArr.shift(), shellArr, {
            cwd: context,
            stdio,
        })
        const error = spawnResult.stderr || spawnResult.error
        if (error || spawnResult.status !== 0) {
            const errorMsg = error || `状态码(${spawnResult.status})`
            reject(errorMsg)
            return
        }
        resolve(spawnResult)
    })
}
