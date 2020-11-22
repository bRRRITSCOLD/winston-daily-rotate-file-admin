// node_modules
import * as tauri from 'tauri/api/tauri'
import { LogGroup } from '../models';

export function parseLogGroupFile(logGroupFile: string): { level: string; message: string; }[] {
  // parse log group file
  const parsedLogFile = logGroupFile
    .split('\n')
    .filter((item: string) => item.length > 0)
    .map((item: string) => JSON.parse(item));
  // explicitly return the
  // parsed log group file
  return parsedLogFile;
}

export function parseLogGroupFiles(logGroupFiles: string[]): { level: string; message: string; }[][] {
  // parse the log group files
  const parsedLogFiles = logGroupFiles.map((logGroupFile) => parseLogGroupFile(logGroupFile));
  // explicitly return the
  // parsed log group files
  return parsedLogFiles;
}

export async function loadLogGroups() {
  try {
    const loadedLogGroups: any[] = await tauri.promisified({
      cmd: 'loadLogGroups'
    });
    // return explicity log
    // group instances
    return loadedLogGroups.map((loadedLogGroup) => new LogGroup(loadedLogGroup));
  } catch (err) {
    console.log('loadLogGroupsErr=', err)
    throw err;
  }
}


