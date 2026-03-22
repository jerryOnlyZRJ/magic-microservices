import envinfo from 'envinfo'
import chalk from 'chalk'

export default function info(): void {
    console.log(chalk.cyan.bold('\nEnvironment Info:'))
    envinfo
        .run(
            {
                System: ['OS', 'CPU'],
                Binaries: ['Node', 'Yarn', 'npm'],
                Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
                npmGlobalPackages: ['@byted-cg/bcg'],
            },
            {
                showNotFound: true,
                duplicates: true,
                fullTree: true,
            },
        )
        .then(console.log)
}
