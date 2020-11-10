// models
import type { LogGroup, LogGroupFile } from '../../models';

export interface LogStoreStateInterface {
  logGroups: LogGroup[];
  allLogGroupsFiles?: LogGroupFile[];
}

export const initialLogsStoreState: LogStoreStateInterface = {
  logGroups: []
};
