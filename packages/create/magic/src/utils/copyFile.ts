import path from 'path'
import fs from 'fs'

import deleteFile from './deleteFile'

/**
 * @description 复制文件
 * @param input
 * @param output
 * @param context
 */
function copyfile(
    input: string,
    output: string,
    context?: string,
    deleteSource = false,
): Promise<void> {
    if (context) {
        input = path.resolve(context, input)
        output = path.resolve(context, output)
    }
    return new Promise((resolve, reject): void => {
        fs.copyFile(
            input,
            output,
            async (err): Promise<void> => {
                if (err) reject(err)
                if (deleteSource) {
                    await deleteFile(input)
                }
                resolve()
            },
        )
    })
}

export default copyfile
