# Markdown List Linter

GitHub action to lint markdown lists and warn when list items are not alphabetically ordered

Uses the [markdown-list-linter NPM package](https://github.com/ClydeDz/markdown-list-linter-npm) to lint the supplied markdown file, specifically the list items in the markdown file, and throw an error (or optionally, just warn) if the markdown list is not alphabetically sorted.

## Inputs

A little description on the inputs below and also see example usage further down to know how to customize these values.

| **Parameter** | **Description**                                                                                  | **Default value** |
| ------------- | ------------------------------------------------------------------------------------------------ | ----------------- |
| file          | The full file path to the markdown file.                                                         | N/A               |
| fail-on-error | Set this to false so that the action doesn't cause the workflow to fail if it spots lint issues. | true              |

## Outputs

### Output console

A report of the lint is printed in the step's console. Head over to the workflow and expand the step to see the output printed in the console. If `fail-on-error` is set to false, you will see a warning message but the step will pass. If `fail-on-error` is set to true, then the step will fail.

### Output variables

The following output variables will be available in the subsequent steps. A little description of what they might contain mentioned below.

| **Parameter**    | **Description**                                                       |
| ---------------- | --------------------------------------------------------------------- |
| name             | Name of the package.                                                  |
| summary          | A short summary produced by the markdown list linter.                 |
| errors           | The error object produced by the markdown list linter.                |
| formattedMessage | The console-print-ready message produced by the markdown list linter. |

## Example usage

This is what using this action might look like. You can skip the optional parameters and/or customize the values as per the range described above.

```yaml
- name: Lint markdown list
  uses: ClydeDz/markdown-list-linter@v1.0.0
  with:
    file: markdown-files/unordered_lists_and_headings.md
    fail-on-error: false
```

### Printing output variables

If you need to access output variables, you'd have to provide an id to the step and then use the desired output variable using the id defined, like the example below.

```yaml
- id: lint123
  name: Lint markdown list
  uses: ClydeDz/markdown-list-linter@v1.0.0
  with:
    file: markdown-files/unordered_lists_and_headings.md
    fail-on-error: false

- run: echo ${{ steps.lint123.outputs.summary }}
```

## A complete solution

This functionality is available to be consumed in three different ways:

- ⚡ [A GitHub Action](https://github.com/marketplace/actions/markdown-list-linter) as part of your CI/CD process

- 📦 [An NPM package](https://www.npmjs.com/package/markdown-list-linter) that can be consumed in your JavaScript or TypeScript code

- 💻 [A CLI](https://www.npmjs.com/package/markdown-list-linter-cli) that you can run in your terminal
