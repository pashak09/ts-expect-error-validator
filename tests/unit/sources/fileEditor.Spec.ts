import * as fsPromises from 'fs/promises';

import { fileEditor } from '@app/utils/sources/fileEditor';

jest.mock('fs/promises');

describe('fileEditor', (): void => {
  const readFileMock = jest.spyOn(fsPromises, 'readFile');
  const writeFileMock = jest.spyOn(fsPromises, 'writeFile');

  it('should replace search value with replace value in all files', async (): Promise<void> => {
    const filePathsToChange = ['file1.txt', 'file2.txt'];
    const searchValue = 'foo';
    const replaceValue = 'bar';

    readFileMock.mockResolvedValue('This is some foo text');
    writeFileMock.mockResolvedValue(undefined);

    await fileEditor(filePathsToChange, searchValue, replaceValue);

    expect(readFileMock).toHaveBeenCalledTimes(filePathsToChange.length);
    expect(writeFileMock).toHaveBeenCalledTimes(filePathsToChange.length);
    expect(readFileMock).toHaveBeenCalledWith(filePathsToChange[0], 'utf-8');
    expect(writeFileMock).toHaveBeenCalledWith(
      filePathsToChange[0],
      'This is some bar text',
      'utf8',
    );
    expect(readFileMock).toHaveBeenCalledWith(filePathsToChange[1], 'utf-8');
    expect(writeFileMock).toHaveBeenCalledWith(
      filePathsToChange[1],
      'This is some bar text',
      'utf8',
    );
  });

  it('should handle empty array of file paths', async (): Promise<void> => {
    const filePathsToChange: string[] = [];
    const searchValue = 'foo';
    const replaceValue = 'bar';

    await fileEditor(filePathsToChange, searchValue, replaceValue);

    expect(readFileMock).not.toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it('should handle duplicate file paths', async (): Promise<void> => {
    const filePathsToChange = [
      'path/to/file1.ts',
      'path/to/file1.ts',
      'path/to/file2.ts',
    ];
    const searchValue = 'oldValue';
    const replaceValue = 'newValue';
    const file1Content = 'some text with oldValue';
    const file2Content = 'some other text with oldValue';

    readFileMock
      .mockResolvedValueOnce(file1Content)
      .mockResolvedValueOnce(file2Content)
      .mockResolvedValueOnce(file1Content);
    writeFileMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined);

    await fileEditor(filePathsToChange, searchValue, replaceValue);

    expect(readFileMock).toHaveBeenCalledTimes(2);
    expect(readFileMock).toHaveBeenCalledWith(filePathsToChange[0], 'utf-8');
    expect(readFileMock).toHaveBeenCalledWith(filePathsToChange[1], 'utf-8');
    expect(writeFileMock).toHaveBeenCalledTimes(2);
    expect(writeFileMock).toHaveBeenCalledWith(
      filePathsToChange[0],
      file1Content.replaceAll(searchValue, replaceValue),
      'utf8',
    );
    expect(writeFileMock).toHaveBeenCalledWith(
      filePathsToChange[1],
      file1Content.replaceAll(searchValue, replaceValue),
      'utf8',
    );
    expect(writeFileMock).toHaveBeenCalledWith(
      filePathsToChange[2],
      file2Content.replaceAll(searchValue, replaceValue),
      'utf8',
    );
  });
});
