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

import findExisting from './findExisting'

interface ValidateResult {
    status: boolean;
    message: string;
}

/**
 * @description 校验项目名称是否合法
 * @param {String} context cli 执行上下文
 * @param {String} projectName  项目名称
 */
function validateProjectName(context: string, projectName: string): ValidateResult {
    const projectNameRegExp = /^([a-z]|_|-|[0-9])+$/
    if (!projectNameRegExp.test(projectName)) {
        return {
            status: false,
            message: '项目名称只能由小写字母(a-z)和下划线(_)或中划线(-)组成！',
        }
    } else if (findExisting(context, projectName)) {
        return {
            status: false,
            message: '该目录下已存在同名项目！',
        }
    }
    return {
        status: true,
        message: '项目创建成功！',
    }
}

export default validateProjectName
