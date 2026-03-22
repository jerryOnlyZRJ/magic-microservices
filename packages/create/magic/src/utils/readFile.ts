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

function readFile(fileName: string, encoding = 'utf-8'): Promise<string> {
    return new Promise((resolve, reject): void => {
        fs.readFile(fileName, encoding, (err, data): void => {
            if (err) {
                console.error('读文件失败: ', err)
                reject(err)
                return
            }
            resolve(data)
        })
    })
}

export default readFile
