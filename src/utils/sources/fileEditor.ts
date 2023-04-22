import { readFile, writeFile } from 'fs/promises';

export async function fileEditor(
  filePathsToChange: readonly string[],
  searchValue: string,
  replaceValue: string,
): Promise<void> {
  const uniqueFilePathsToChange = new Set<string>(filePathsToChange);

  await Promise.all(
    [...uniqueFilePathsToChange].map(
      async (filePathToChange: string): Promise<void> => {
        const content = await readFile(filePathToChange, 'utf-8');

        await writeFile(
          filePathToChange,
          content.replaceAll(searchValue, replaceValue),
          'utf8',
        );
      },
    ),
  );
}
