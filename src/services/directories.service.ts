// node_modules
import * as tauriDialog from 'tauri/api/dialog';
import * as tauriFs from 'tauri/api/fs';

export async function getDirectoryName(): Promise<string> {
  // ask user for log files directory
  const logDirectoryName = await tauriDialog.open({ directory: true, multiple: false });
  // return the log directoy
  // name explicitly
  return logDirectoryName as string;
}

export async function readDir(directoryPath: string) {
  // read the directory
  const logDirectory = await tauriFs.readDir(directoryPath, { recursive: true } as any);
  // return the log directoy
  // files/hierarchy explicitly
  return logDirectory;
}
