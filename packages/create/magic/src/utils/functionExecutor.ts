// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallbackFunc<T> = (...params: any) => T

export default function functionExecutor<T>(
    callback: CallbackFunc<T> | T,
    ...args: any[]
): T {
    return typeof callback === 'function'
        ? (callback as CallbackFunc<T>)(...args)
        : callback
}
