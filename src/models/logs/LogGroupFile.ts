// node_modules
import { assign, get } from "lodash";
import { v4 as uuid } from 'uuid';

export interface LogGroupFileInterface {
  logGroupFileId?: string;
  date: number | string;
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
  public date!: number | string;
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
      date: new Date(get(logGroupFile, 'date', '')).toDateString(),
      name: get(logGroupFile, 'name'),
      hash: get(logGroupFile, 'hash'),
      selected: get(logGroupFile, 'selected'),
      data: get(logGroupFile, 'data'),
    })
  }
}