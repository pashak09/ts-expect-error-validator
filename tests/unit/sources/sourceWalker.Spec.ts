import * as fsPromises from 'fs/promises';
import { PathLike, Stats } from 'node:fs';
import { join } from 'path';

import { SourceExpectedError } from '@app/main/expectedErrorsFinder';
import * as parseFile from '@app/utils/sources/fileParser';
import { sourceWalker } from '@app/utils/sources/sourceWalker';
import { tsExpectedErrorKeyMapGenerator } from '@app/utils/ts/tsExpectedErrorKeyMapGenerator';

import { DummyLogger } from '../../DummyLogger';

jest.mock('fs/promises');
jest.mock('@app/utils/sources/fileParser');
jest.mock('@app/utils/ts/tsExpectedErrorKeyMapGenerator');

describe('sourceWalker', (): void => {
  const sourceExpectedErrorsMap = new Map<string, SourceExpectedError>();

  const statMock = jest.spyOn(fsPromises, 'stat');
  const parseFileMock = jest.spyOn(parseFile, 'fileParser');

  beforeEach((): void => {
    sourceExpectedErrorsMap.clear();
  });

  it('should parse file and add expected errors to the expectedErrorsMap', async (): Promise<void> => {
    const filePath = 'file.ts';
    const sourceExpectedError: SourceExpectedError = {
      errorLine: 10,
      filePath: filePath,
      message: `Type 'string' is not assignable to type 'number'`,
      tsCode: 'TS2322',
    };

    statMock.mockResolvedValue(<Stats>{
      isFile: (): boolean => true,
      isDirectory: (): boolean => false,
    });

    parseFileMock.mockResolvedValueOnce([sourceExpectedError]);

    await sourceWalker(filePath, sourceExpectedErrorsMap, new DummyLogger());

    expect(statMock).toHaveBeenCalledWith(filePath);
    expect(parseFileMock).toHaveBeenCalledWith(filePath);
    expect(sourceExpectedErrorsMap.size).toBe(1);
    expect(
      sourceExpectedErrorsMap.get(
        tsExpectedErrorKeyMapGenerator(sourceExpectedError),
      ),
    ).toEqual(sourceExpectedError);
  });

  it('should not add expected errors if file is not .ts or .tsx extension', async (): Promise<void> => {
    const filePath = 'file.js';

    statMock.mockResolvedValue(<Stats>{
      isFile: (): boolean => true,
      isDirectory: (): boolean => false,
    });

    await sourceWalker(filePath, sourceExpectedErrorsMap, new DummyLogger());

    expect(statMock).toHaveBeenCalledWith(filePath);
    expect(parseFileMock).not.toHaveBeenCalled();
    expect(sourceExpectedErrorsMap.size).toBe(0);
  });

  it('should recursively call itself if the path is a directory', async (): Promise<void> => {
    const readdirMock = jest.spyOn(fsPromises, 'readdir');

    const dirPath = 'dir';
    const filePath = join('dir', 'file.ts');
    const tsError: SourceExpectedError = {
      errorLine: 10,
      filePath: filePath,
      message: `Type 'string' is not assignable to type 'number'`,
      tsCode: 'TS2322',
    };

    readdirMock.mockResolvedValue(<never>['file.ts']);
    statMock.mockImplementation(async (path: PathLike): Promise<Stats> => {
      if (path === dirPath) {
        return <Stats>{
          isFile: (): boolean => false,
          isDirectory: (): boolean => true,
        };
      }

      return <Stats>{
        isFile: (): boolean => true,
        isDirectory: (): boolean => false,
      };
    });

    parseFileMock.mockResolvedValueOnce([tsError]);

    await sourceWalker(dirPath, sourceExpectedErrorsMap, new DummyLogger());

    expect(statMock).toHaveBeenCalledTimes(2);
    expect(readdirMock).toHaveBeenCalledWith(dirPath);
    expect(parseFileMock).toHaveBeenCalledWith(filePath);
    expect(sourceExpectedErrorsMap.size).toBe(1);
    expect(
      sourceExpectedErrorsMap.get(tsExpectedErrorKeyMapGenerator(tsError)),
    ).toEqual(tsError);
  });
});
