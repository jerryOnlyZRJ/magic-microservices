import fs from 'fs'

function readFile(fileName: string, encoding = 'utf-8'): Promise<string> {
    return new Promise((resolve, reject): void => {
        fs.readFile(fileName, encoding, (err, data): void => {
            if (err) {
                console.error('读文件失败: ', err)
                reject(err)
                return
            }
            resolve(data)
        })
    })
}

export default readFile
