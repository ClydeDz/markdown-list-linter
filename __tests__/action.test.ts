import { main } from '../src/action'
import * as actionsCore from '@actions/core'
import * as markdownListLinter from 'markdown-list-linter'

jest.mock('@actions/core')
jest.mock('markdown-list-linter')

const getInputMock = jest.spyOn(actionsCore, 'getInput')
const getBooleanInputMock = jest.spyOn(actionsCore, 'getBooleanInput')
const infoMock = jest.spyOn(actionsCore, 'info')
const warningMock = jest.spyOn(actionsCore, 'warning')
const setOutputMock = jest.spyOn(actionsCore, 'setOutput')
const setFailedMock = jest.spyOn(actionsCore, 'setFailed')

const lintMarkdownListMock = jest.spyOn(markdownListLinter, 'lintMarkdownList')

describe('markdown-list-linter action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe.each([true, false])(
    'given failOnError is set to %s',
    (failOnErrorResponse: boolean) => {
      it('should function as expected with a valid file', async () => {
        getInputMock.mockReturnValueOnce('./valid_file.md')
        getBooleanInputMock.mockReturnValueOnce(failOnErrorResponse)
        lintMarkdownListMock.mockReturnValueOnce({
          summary: 'No errors',
          formattedMessage: 'Summary: No errors',
        })

        await main()

        expect(lintMarkdownListMock).toBeCalledWith('./valid_file.md')

        expect(infoMock).toBeCalledWith('Summary: No errors')
        expect(setOutputMock).toBeCalledWith('name', 'markdown-list-linter')
        expect(setOutputMock).toBeCalledWith('summary', 'No errors')
        expect(setOutputMock).toBeCalledWith('errors', undefined)
        expect(setOutputMock).toBeCalledWith(
          'formattedMessage',
          'Summary: No errors'
        )

        expect(setFailedMock).not.toBeCalled()
        expect(warningMock).not.toBeCalled()
      })

      it('should function as expected with an invalid file', async () => {
        getInputMock.mockReturnValueOnce('')
        getBooleanInputMock.mockReturnValueOnce(failOnErrorResponse)

        await main()

        expect(setFailedMock).toBeCalledWith('Markdown file not provided')

        expect(lintMarkdownListMock).not.toBeCalled()

        expect(infoMock).not.toBeCalled()
        expect(setOutputMock).not.toBeCalled()
        expect(warningMock).not.toBeCalled()
      })

      it('should function as expected with a valid file that needs to be reordered', async () => {
        const errorObject = [
          {
            type: 'Headings',
            details: [['abc']],
            message: 'Needs fixes in alphabetical order',
          },
        ]
        getInputMock.mockReturnValueOnce('./invalid_file.md')
        getBooleanInputMock.mockReturnValueOnce(failOnErrorResponse)
        lintMarkdownListMock.mockReturnValueOnce({
          summary: 'Needs fixes',
          formattedMessage: 'Summary: Needs fixes',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          errorObject,
        })

        await main()

        expect(lintMarkdownListMock).toBeCalledWith('./invalid_file.md')

        expect(infoMock).toBeCalledWith('Summary: Needs fixes')
        expect(setOutputMock).toBeCalledWith('name', 'markdown-list-linter')
        expect(setOutputMock).toBeCalledWith('summary', 'Needs fixes')
        expect(setOutputMock).toBeCalledWith('errors', errorObject)
        expect(setOutputMock).toBeCalledWith(
          'formattedMessage',
          'Summary: Needs fixes'
        )

        if (failOnErrorResponse) {
          expect(setFailedMock).toBeCalledWith('Needs fixes')
          expect(warningMock).not.toBeCalled()
        } else {
          expect(setFailedMock).not.toBeCalled()
          expect(warningMock).toBeCalledWith('Needs fixes')
        }
      })

      it('should handle exception when one occurs in the main method', async () => {
        getInputMock.mockReturnValueOnce('./file.md')
        getBooleanInputMock.mockReturnValueOnce(failOnErrorResponse)
        lintMarkdownListMock.mockImplementationOnce(() => {
          throw new Error('Sample error')
        })

        await main()

        expect(setFailedMock).toBeCalledWith('Sample error')

        expect(infoMock).not.toBeCalled()
        expect(setOutputMock).not.toBeCalled()
        expect(warningMock).not.toBeCalled()
      })
    }
  )
})
