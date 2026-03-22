import glob from 'glob'

const commands = glob.sync('./*/index.js', {
    cwd: __dirname,
})

function getScriptName(path): string {
    const regExp = /\.\/(.*?)\//
    regExp.test(path)
    return RegExp.$1
}

const scriptsObj = commands.reduce(<T>(acc: T, currentValue: string): T => {
    acc[getScriptName(currentValue)] = require(currentValue).default
    return acc
}, {})

export default function runCommand<T>(command: string, ...args): T {
    return scriptsObj[command](...args)
}
