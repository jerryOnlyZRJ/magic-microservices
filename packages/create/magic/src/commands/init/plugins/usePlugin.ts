async function usePlugin<T>(
    pluginName: string,
    context: string,
    options?: T,
): Promise<void> {
    return await require(`./${pluginName}`).default(context, options)
}

export default usePlugin
