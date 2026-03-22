import fs from 'fs'
import path from 'path'

/**
 * @description 校验文件是否存在
 * @param {String} context 文件上下文
 * @param {String | String[]} files 文件名称
 */
function findExisting(context: string, files: string | string[]): undefined | string {
    if (typeof files === 'string' && fs.existsSync(path.resolve(context, files))) {
        return path.resolve(context, files)
    } else if (files instanceof Array) {
        for (const file of files) {
            if (findExisting(context, file)) {
                return path.resolve(context, file)
            }
        }
    }
    return undefined
}

export default findExisting
