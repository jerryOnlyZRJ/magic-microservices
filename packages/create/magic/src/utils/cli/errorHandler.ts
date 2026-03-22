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
