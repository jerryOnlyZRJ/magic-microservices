import fs from 'fs-extra'

function writeFile(file: string, data: string): Promise<void> {
    return new Promise((resolve, reject): void => {
        fs.outputFile(file, data, (err): void => {
            if (err) {
                console.error('模板渲染失败(写文件): ', err)
                reject(err)
                return
            }
            resolve()
        })
    })
}

export default writeFile
