export default function getVersion(): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require('../../../package.json')
    return pkg.version
}
