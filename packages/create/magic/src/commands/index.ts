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

import glob from 'glob'

const commands = glob.sync('./*/index.js', {
    cwd: __dirname,
})

function getScriptName(path): string {
    const regExp = /\.\/(.*?)\//
    regExp.test(path)
    return RegExp.$1
}

const scriptsObj = commands.reduce(<T>(acc: T, currentValue: string): T => {
    acc[getScriptName(currentValue)] = require(currentValue).default
    return acc
}, {})

export default function runCommand<T>(command: string, ...args): T {
    return scriptsObj[command](...args)
}
