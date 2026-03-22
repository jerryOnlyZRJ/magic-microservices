const pkg = require('../package.json')
const runCommand = require('../lib/commands').default

describe('test runCommand', () => {
    test('test getVersion command', () => {
        expect(runCommand('getVersion')).toBe(pkg.version)
    })
})
