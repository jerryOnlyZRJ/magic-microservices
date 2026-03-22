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

/**
 * @description 格式化驼峰命名：magic-react-component -> MagicReactComponent
 * @param string
 */
function formateCamelCase(string = ''): string {
    return string
        .replace(/^(\w)/, (match, $1) => $1.toUpperCase())
        .replace(/_(\w)/g, (match, $1) => {
            return $1.toUpperCase()
        })
        .replace(/-(\w)/g, (match, $1) => {
            return $1.toUpperCase()
        })
}

export default formateCamelCase
