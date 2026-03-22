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

export default {
    dependencies: ['react', 'react-dom', 'prop-types'],
    devDependencies: [
        '@babel/preset-react',
        'eslint-config-standard-react',
        'eslint-plugin-react',
        'eslint-plugin-react-hooks',
    ],
}

export const browserExternals = {
    react: {
        var: 'React',
        umd: 'http://unpkg.pstatp.com/react/17.0.1/umd/react.development.js',
    },
    'react-dom': {
        var: 'ReactDOM',
        umd: 'http://unpkg.pstatp.com/react-dom/17.0.1/umd/react-dom.development.js',
    },
    'prop-types': {
        var: 'PropTypes',
        umd: 'https://unpkg.pstatp.com/prop-types/15.7.2/prop-types.js',
    },
}
