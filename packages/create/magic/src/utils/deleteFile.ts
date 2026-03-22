import rm from 'rimraf'

/**
 * @description 删除文件
 * @param {String} path
 */
function deleteFile(path: string): Promise<void> {
    return new Promise((resolve, reject): void => {
        rm(path, (err): void => {
            if (err) {
                console.error('文件删除失败：', err)
                reject(err)
            }
            resolve()
        })
    })
}

export default deleteFile
