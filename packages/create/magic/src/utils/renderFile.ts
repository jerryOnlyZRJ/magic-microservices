import path from 'path'
import fs from 'fs-extra'

import cons from 'consolidate'

import deleteFile from './deleteFile'

/**
 * @description 渲染template模板
 * @param {String} input 入口文件
 * @param {String} output 输出文件
 * @param {Object} metadata 渲染元数据
 * @param {String} context 执行上下文
 */
function renderFile(
    input: string,
    output: string,
    metadata: object,
    context?: string,
    deleteSource = true,
): Promise<void> {
    if (context) {
        input = path.resolve(context, input)
        output = path.resolve(context, output)
    }
    return new Promise((resolve, reject): void => {
        cons.swig(
            input,
            metadata,
            async (err, renderString): Promise<void> => {
                if (err) {
                    console.error('模板渲染失败(模板渲染): ', err)
                    reject(err)
                    return
                }
                if (input !== output && deleteSource) {
                    await deleteFile(input)
                }
                fs.outputFile(output, renderString, (err): void => {
                    if (err) {
                        console.error('模板渲染失败(写文件): ', err)
                        reject(err)
                        return
                    }
                    resolve()
                })
            },
        )
    })
}

export default renderFile
