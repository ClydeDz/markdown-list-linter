import { lintMarkdownList } from 'markdown-list-linter'
import {
  getInput,
  setOutput,
  setFailed,
  info,
  warning,
  getBooleanInput,
} from '@actions/core'

async function runMarkdownListLinterAction(): Promise<void> {
  const markdownFile = getInput('file')
  const failOnError = getBooleanInput('fail-on-error')

  if (!markdownFile) {
    setFailed('Markdown file not provided')
    return
  }

  const result = lintMarkdownList(markdownFile)

  info(result.formattedMessage || '')
  setOutput('name', 'markdown-list-linter')
  setOutput('summary', result.summary)
  setOutput('errors', result.errorObject)
  setOutput('formattedMessage', result.formattedMessage)

  if (!result.errorObject) {
    return
  }

  failOnError ? setFailed(result.summary) : warning(result.summary)
}

export async function main(): Promise<void> {
  try {
    await runMarkdownListLinterAction()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    setFailed(error)
  }
}

main()
