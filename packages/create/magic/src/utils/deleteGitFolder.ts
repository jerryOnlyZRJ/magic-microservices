import path from 'path'

import deleteFile from '@/utils/deleteFile'

/**
 * @description 删去template下的.git目录
 * @param {String} projectBasePath 项目根路径
 */
function deleteGitFolder(projectBasePath: string): Promise<void> {
    const templateGitPath = path.resolve(projectBasePath, './.git')
    return deleteFile(templateGitPath)
}

export default deleteGitFolder
