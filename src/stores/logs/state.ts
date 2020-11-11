// models
import type { LogGroup, LogGroupFile } from '../../models';

export interface LogStoreStateInterface {
  logGroups: LogGroup[];
  logGroupsFiles?: LogGroupFile[];
}

export const initialLogsStoreState: LogStoreStateInterface = {
  logGroups: []
};
