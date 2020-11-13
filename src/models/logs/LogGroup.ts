// node_modules
import { assign, findIndex, get } from "lodash";
import { v4 as uuid } from 'uuid';
import type { AnyObject } from "../common";

export interface LogGroupFileInterface {
  logGroupFileId?: string;
  date: number;
  name: string;
  hash: string;
  selected?: boolean;
  path?: string;
  data?: {
    level: string;
    message: string;
  }[];
}

export class LogGroupFile implements LogGroupFileInterface {
  public logGroupFileId?: string;
  public date!: number;
  public name!: string;
  public hash!: string;
  public selected?: boolean;
  public path?: string;
  public data?: {
    level: string;
    message: string;
  }[];

  public constructor(logGroupFile: Partial<LogGroupFileInterface>) {
    assign(this, logGroupFile, {
      logGroupFileId: get(logGroupFile, 'logGroupFileId', uuid()),
      date: get(logGroupFile, 'date'),
      name: get(logGroupFile, 'name'),
      hash: get(logGroupFile, 'hash'),
      selected: get(logGroupFile, 'selected'),
      data: get(logGroupFile, 'data'),
    })
  }
}

export interface LogGroupInterface {
  logGroupId: string;
  directoryPath: string;
  keep: {
    days?: boolean;
    amount: number;
  },
  auditLog: string;
  files?: LogGroupFileInterface[];
}

export class LogGroup implements LogGroupInterface {
  public logGroupId!: string;
  public directoryPath!: string;
  public keep!: {
    days?: boolean;
    amount: number;
  };
  public auditLog!: string;
  public files?: LogGroupFile[];

  public constructor(logGroup: LogGroupInterface) {
    assign(this, logGroup, {
      logGroupId: get(logGroup, 'logGroupId', uuid()),
      directoryPath: get(logGroup, 'directoryPath'),
      keep: get(logGroup, 'keep'),
      auditLog: get(logGroup, 'auditLog'),
      files: get(logGroup, 'files', [] as LogGroupFileInterface[]).map((file) => new LogGroupFile(file))
    });
  }

  public replaceFile(replaceCriteria: AnyObject, logGroupFile: LogGroupFileInterface) {
    // create new log audit file log file instance
    const newLogGroupFile = new LogGroupFile(logGroupFile);
    // first find the index of the current log file
    const foundFileIndex = findIndex(this.files, replaceCriteria);
    // now if found replace and if not found push into array
    if (foundFileIndex > -1) {
      this.files[foundFileIndex] = newLogGroupFile;
    } else {
      this.files.push(newLogGroupFile)
    }
    // return explicitly
    return;
  }
}