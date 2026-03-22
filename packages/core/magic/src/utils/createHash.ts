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
function createHash(num: number): string {
  const hashArr = new Array(num);
  for (let i = 0; i < num; i++) {
    hashArr[i] = ((Math.random() * 16) | 0).toString(16);
  }
  return hashArr.join('');
}

export default createHash;
