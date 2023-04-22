<p align="center">
  <a href="https://github.com/pashak09/ts-expect-error-validator/actions">
    <image src="https://github.com/pashak09/ts-expect-error-validator/actions/workflows/ci.yml/badge.svg" alt="test" />
  </a>
  <a href="https://coveralls.io/github/pashak09/ts-expect-error-validator?branch=main">
    <img src="https://coveralls.io/repos/github/pashak09/ts-expect-error-validator/badge.svg?branch=main" alt="Coverage Status" />
  </a>
  <a href="https://www.npmjs.com/package/ts-expect-error-validator">
    <img src="https://img.shields.io/npm/v/ts-expect-error-validator" alt="npm shield" />
  </a>
</p>

# TS Expected Errors Validator

Since ts-expect-error does not have the ability to specify only the errors that we want to ignore, and instead
suppresses all errors, it makes managing errors more challenging. This package provides a command-line tool to validate
expected TypeScript errors with the main goal of making error management easier.

## Installation

Install the package:

```bash
yarn add -D ts-expect-error-validator
```

## An example of usage:

```typescript
export class GuestUser {
    // @ts-expect-error [TS6133] - ignore the 'myNumber' is declared but its value is never read message
    private myNumber: undefined;
}

function getMyData(): string | undefined {
    return 'myData';
}

// @ts-expect-error [TS2532 - Object is possibly 'undefined'] - You can specify the message and a ts code for validation for `strict` mode.
getMyData().length;

// You can also ignore a line like this:
getMyData().length; // @ts-expect-error [TS2532]
```

#### Cli Options:

| Option                    | Description                                                                                                                                                                                                                                                                                                     |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--tsConfigPath=<PATH>`   | Path to the `tsconfig.json` file to use. Defaults to the `tsconfig.json` in the current directory.                                                                                                                                                                                                              |
| `--restore`               | Since we have to change all @ts-expect-error to something else, this changes the content file. You can use this option to restore files.                                                                                                                                                                        |
| `--sourcePath=<PATH>`     | Path to the directory or the file containing @ts-expect-error to validate. You can specify several folders or files to make search more productive.                                                                                                                                                             |
| `--outputFormat=<FORMAT>` | The output format. Can be either `json` or `human`. Defaults to `human`.                                                                                                                                                                                                                                        |
| `--quiet`                 | If present, suppresses all output except for report results.                                                                                                                                                                                                                                                    |
| `--validationMode=<MODE>` | Specifies the validation mode to use. Can be either `default` or `strict`. In default `mode`, only the expected error codes are validated. In `strict` mode, the error code and the first line of the error description are validated. **Notice that `strict` mode is in alpha version**. Default is `default`. |

### Example Usage:

```bash
//a package.json file
...
"scripts": {
  "ts-expect-error-validator": "ts-expect-error-validator --tsConfigPath=tsconfig.json --restore --sourcePath=src/myDir --sourcePath=src/someTsFile.ts --reportFormat=json --quiet"
}
...

//a cli comand
yarn ts-expect-error-validator
```

## Hits

In your pull request, you don't have to scan all project sources. You can check only the changed files by running this
command:

```bash
 yarn ts-expect-error-validator $(git diff --name-only HEAD | grep "\.ts$" | xargs -I {} echo "--sourcePath={}" | tr '\n' ' ')
```

## License

This library is released under the MIT License.
