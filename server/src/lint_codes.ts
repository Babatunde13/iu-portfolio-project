import path from 'path'
import glob from 'glob'
import eslintConfig from '../.eslintrc'

// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color - change color of console
const errorLog = (data: string) => {
    console.log('\x1b[31m', data, '\x1b[0m')
}

const successLog = (data: string) => {
    console.log('\x1b[32m', data, '\x1b[0m')
}

const infoLog = (data: string) => {
    console.log('\x1b[34m', data, '\x1b[0m')
}

interface LintResult {
    filePath: string
    messages: {
        ruleId: string
        message: string
        line: number
        column: number
        severity: number
    }[]
}

/**
 * This function is used to lint all the files in the project using eslint
 */
(async function lintFiles() {
    infoLog('Linting files...')
    
    const cwd = process.cwd()
    // Get all the files in the project
    const files = glob.sync('**/*', {
        cwd,
        ignore: ['node_modules/**', 'dist/**', '.vscode/**'],
        nodir: true
    })
    const errors = []
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ESLint } =  require('eslint')

    const filesToLint = files.filter((file) => {
        const extension = path.extname(file)

        return ['.js', '.ts'].includes(extension)
    }) // Only lint js and ts files

    // https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions
    const eslint = new ESLint({
        cwd,
        errorOnUnmatchedPattern: true,
        extensions: ['.ts', '.tsx', '.js'],
        allowInlineConfig: true,
        baseConfig: eslintConfig,
        useEslintrc: true,
        fix: true
    })

    for (const file of filesToLint) {
        infoLog(`Checking ${file}`)

        const filePath = path.join(cwd, file)
        try {
            const lintResults: LintResult[] = await eslint.lintFiles([filePath])
            await ESLint.outputFixes(lintResults)

            if (lintResults.length) {
                lintResults.forEach((r) => {
                    r.messages.forEach((m) => {
                        if (m.severity === 2) {
                            errors.push(
                                `❌ ${`eslint(${m.ruleId || ''})`} - ${m.message} at ${r.filePath}:${m.line}:${m.column}`
                            )
                        }
                    })
                })
            }
        } catch (e) {
            errors.push((e as Error).message)
        }
    }

    if (errors.length) {
        const error = 'Linting Failed:'
        console.log('\x1b[31m', '\x1b[4m', error)
        console.log('%s\x1b[0m', '\t')
        for (const err of errors) {
            errorLog(err)
            console.log()
        }
    } else {
        successLog('No linting issue found ✅.')
    }
}()).catch((e) => {
    errorLog(e.message)
    process.exit(1)
})
