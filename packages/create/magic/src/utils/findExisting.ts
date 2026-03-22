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

import fs from 'fs'
import path from 'path'

/**
 * @description 校验文件是否存在
 * @param {String} context 文件上下文
 * @param {String | String[]} files 文件名称
 */
function findExisting(context: string, files: string | string[]): undefined | string {
    if (typeof files === 'string' && fs.existsSync(path.resolve(context, files))) {
        return path.resolve(context, files)
    } else if (files instanceof Array) {
        for (const file of files) {
            if (findExisting(context, file)) {
                return path.resolve(context, file)
            }
        }
    }
    return undefined
}

export default findExisting
