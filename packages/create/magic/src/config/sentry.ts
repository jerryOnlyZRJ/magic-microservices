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

import process from 'process'
import Sentry from '@sentry/node'

/**
 * @description sentry  初始化逻辑
 */
Sentry.init({
    dsn: '',
})

/**
 * @description 为普通Error追加执行命令
 * @param {Error} error
 */
function decoratorError(error): Error {
    error.errorCommand = process.argv.slice(1).join(' ')
    Sentry.captureException(error)
    return error
}

export default {
    init(): void {
        process.on('uncaughtException', err => {
            decoratorError(err)
        })

        process.on('unhandledRejection', err => {
            decoratorError(err)
        })
    },
}
