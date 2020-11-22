// node_modules
import * as tauriDialog from 'tauri/api/dialog';
import * as tauriFs from 'tauri/api/fs';
import * as tauri from 'tauri/api/tauri'

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

export async function mkdirp(dirPath: string) {
  // decode/unzip gz file
  const appDirPath: string = await tauri.promisified({
    cmd: 'mkdirp',
    argument: dirPath
  });
  // explicitly return the
  // decoded/unzipped gz file
  return appDirPath;
}

export async function getAppDirPath() {
  // decode/unzip gz file
  const appDirPath: string = await tauri.promisified({
    cmd: 'getAppDirPath'
  });
  // explicitly return the
  // decoded/unzipped gz file
  return appDirPath;
}
