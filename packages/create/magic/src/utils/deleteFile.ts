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

import rm from 'rimraf'

/**
 * @description 删除文件
 * @param {String} path
 */
function deleteFile(path: string): Promise<void> {
    return new Promise((resolve, reject): void => {
        rm(path, (err): void => {
            if (err) {
                console.error('文件删除失败：', err)
                reject(err)
            }
            resolve()
        })
    })
}

export default deleteFile
