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

const livereload = require('livereload');
const path = require('path');

const server = livereload.createServer();
server.watch([path.resolve(__dirname, '../dev'), path.resolve(__dirname, '../dist')]);
console.log('\u001b[1m\u001b[32mLiveReload enabled😄\u001b[39m\u001b[22m');