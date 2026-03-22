import { spawnSync, SpawnSyncReturns, StdioOptions } from 'child_process'

export function runShell(
    shell: string | string[],
    context?: string,
    stdio: StdioOptions = 'inherit',
): Promise<SpawnSyncReturns<Buffer>> {
    return new Promise((resolve, reject): void => {
        const shellArr = shell instanceof Array ? shell : shell.split(/\s+/)
        const spawnResult = spawnSync(shellArr.shift(), shellArr, {
            cwd: context,
            stdio,
        })
        const error = spawnResult.stderr || spawnResult.error
        if (error || spawnResult.status !== 0) {
            const errorMsg = error || `状态码(${spawnResult.status})`
            reject(errorMsg)
            return
        }
        resolve(spawnResult)
    })
}
