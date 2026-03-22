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

import chalk from 'chalk'
import didYouMean from 'didyoumean'

function suggestCommands(program, unknownCommand): void {
    const availableCommands = program.commands.map(cmd => {
        return cmd._name
    })
    const suggestion = didYouMean(unknownCommand, availableCommands)
    if (suggestion) {
        console.log('  ' + chalk.cyan(`Did you mean ${chalk.yellow.bold(suggestion)}?`))
    }
}

function enhanceErrorMessages(program, methodName, log): void {
    program.Command.prototype[methodName] = function(...args): void {
        if (methodName === 'unknownOption' && this._allowUnknownOption) {
            return
        }
        this.outputHelp()
        console.log('  ' + chalk.red(log(...args)))
        console.log()
        process.exit(1)
    }
}

export default {
    init(program): void {
        // 容错处理
        // output help information on unknown commands
        program.arguments('<command>').action(cmd => {
            program.outputHelp()
            console.log('  ' + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
            console.log()
            suggestCommands(program, cmd)
        })

        enhanceErrorMessages(program, 'missingArgument', argName => {
            return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
        })

        enhanceErrorMessages(program, 'unknownOption', optionName => {
            return `Unknown option ${chalk.yellow(optionName)}.`
        })
    },
}
