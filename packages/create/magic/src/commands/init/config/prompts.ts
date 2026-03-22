import chalk from 'chalk'
import validateProjectName from '@/utils/validateProjectName'

export interface InitAnswers {
    name: string;
    description: string;
    packageName: string;
    framework: 'react' | 'vue' | 'svelte' | 'none';
}

export default {
    name: (context): object => ({
        type: 'input',
        name: 'name',
        message: chalk.blue('请输入组件名称：'),
        default: 'magic-component',
        validate: function(input): string | true {
            const validateResult = validateProjectName(context, input)
            return validateResult.status || validateResult.message
        },
    }),
    description: {
        type: 'input',
        name: 'description',
        message: chalk.magenta('请输入组件简介：'),
        default: 'A simple magic microservice component.',
        validate: (input): string | true => Boolean(input) || '项目描述是必填项',
    },
    packageName: {
        type: 'input',
        name: 'packageName',
        default: (answers: InitAnswers): string => {
            return `@magic-microservices/${answers.name}`
        },
        message: '请输入组件的 npm 包名：',
        validate: function(input): string | true {
            return !!input || 'npm包名是必填项！'
        },
    },
    framework: {
        type: 'list',
        name: 'framework',
        message: '请选择组件的开发的技术选型?',
        default: (answers: InitAnswers): string => {
            if (/vue/i.test(answers.name)) {
                return 'vue'
            }
            if (/svelte/i.test(answers.name)) {
                return 'svelte'
            }
            return 'react'
        },
        choices: [
            {
                name: 'React(v17)',
                value: 'react',
            },
            {
                name: 'Vue(v3)',
                value: 'vue',
            },
            {
                name: 'Svelte',
                value: 'svelte',
            },
            {
                name: 'None',
                value: 'none',
            },
        ],
    },
}
