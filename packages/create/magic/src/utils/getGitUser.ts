import fs from 'fs'

const authorRegExp = /name\s*=\s*([a-z0-9\@\.]+)/
const emailRegExp = /email\s*=\s*([a-z0-9\@\.]+)/
const defaultUserData = {
    name: '',
    email: '',
}

let cache = null

export interface UserData {
    name: string;
    email: string;
}

export default function getGitUser(): UserData {
    if (cache) {
        return cache
    }

    const res = defaultUserData

    try {
        const content = fs
            .readFileSync(`${process.env.HOME}/.gitconfig`, 'utf8')
            .replace('“', '')

        const emailMatch = content.match(emailRegExp)
        emailMatch && (res.email = emailMatch[1])

        const authorMatch = content.match(authorRegExp)
        if (authorMatch) {
            res.name = authorMatch[1]
        } else if (emailMatch) {
            res.name = emailMatch[1].split('@')[0].split('.')[0]
        }
    } catch (err) {
        console.error('获取用户 git 信息失败：', err)
    }

    return (cache = res)
}
