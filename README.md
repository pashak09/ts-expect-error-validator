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
class User {
   // Specify only a TS code for validation
   // @ts-expect-error [TS6133]
   private myNumber: string | undefined;
}

function getMyData(): string | undefined {
   return 'myData';
}

// Specify the message and a TS code for validation for `strict` mode
// @ts-expect-error [TS2532 - Object is possibly 'undefined']
getMyData().length;

// Other approach for ignoring a line:
getMyData().length; // @ts-expect-error [TS2532]

// Specify several TS code errors for validation for a line: 
// @ts-expect-error [TS2322, TS6133]
const object: { a: number } = { b: 5 };

// Specify several TS code errors with message description for validation
// @ts-expect-error [TS6133 - 'object' is declared but its value is never read, TS2322 - Type '{ b: number; }' is not assignable to type '{ a: number; }']
const sample: { a: number } = { b: 5 };
```

By default, the file extensions analyzed are `tsx` and `ts`.

#### Cli Options:

| Option                    | Description                                                                                                                                                                                                                                                                                                     |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--tsConfigPath=<PATH>`   | Path to the `tsconfig.json` file to use. Defaults to the `tsconfig.json` in the current directory.                                                                                                                                                                                                              |
| `--restore`               | Since we have to change all @ts-expect-error to something else, this changes the content file. You can use this option to restore changed files.                                                                                                                                                                |
| `--sourcePath=<PATH>`     | Path to the directory or the file containing @ts-expect-error to validate. You can specify several folders or files to make search more productive.                                                                                                                                                             |
| `--outputFormat=<FORMAT>` | The output format. Can be either `json` or `human`. Defaults to `human`.                                                                                                                                                                                                                                        |
| `--quiet`                 | If present, suppresses all output except for report results.                                                                                                                                                                                                                                                    |
| `--validationMode=<MODE>` | Specifies the validation mode to use. Can be either `default` or `strict`. In default `mode`, only the expected error codes are validated. In `strict` mode, the error code and the first line of the error description are validated. **Notice that `strict` mode is in alpha version**. Default is `default`. |

### Example Usage:

```
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

-  There is no need to scan all project sources for pull requests, instead it's more useful to check only the changed files by running this
command:
    ```bash
     yarn ts-expect-error-validator $(git diff --name-only HEAD | grep "\.ts$" | xargs -I {} echo "--sourcePath={}" | tr '\n' ' ')
    ```
* There is an [ES Rule](https://github.com/pashak09/eslint-plugin-ts-expect-error-validator) to ensure that code includes signatures for the validator.

## License

This library is released under the MIT License.
