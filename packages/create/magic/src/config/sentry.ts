import process from 'process'
import Sentry from '@sentry/node'

/**
 * @description sentry  初始化逻辑
 */
Sentry.init({
    dsn: '',
})

/**
 * @description 为普通Error追加执行命令
 * @param {Error} error
 */
function decoratorError(error): Error {
    error.errorCommand = process.argv.slice(1).join(' ')
    Sentry.captureException(error)
    return error
}

export default {
    init(): void {
        process.on('uncaughtException', err => {
            decoratorError(err)
        })

        process.on('unhandledRejection', err => {
            decoratorError(err)
        })
    },
}
