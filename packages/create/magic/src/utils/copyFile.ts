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
import fs from 'fs'

import deleteFile from './deleteFile'

/**
 * @description 复制文件
 * @param input
 * @param output
 * @param context
 */
function copyfile(
    input: string,
    output: string,
    context?: string,
    deleteSource = false,
): Promise<void> {
    if (context) {
        input = path.resolve(context, input)
        output = path.resolve(context, output)
    }
    return new Promise((resolve, reject): void => {
        fs.copyFile(
            input,
            output,
            async (err): Promise<void> => {
                if (err) reject(err)
                if (deleteSource) {
                    await deleteFile(input)
                }
                resolve()
            },
        )
    })
}

export default copyfile
