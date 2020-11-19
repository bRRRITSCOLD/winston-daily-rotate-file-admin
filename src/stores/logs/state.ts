//node_modules
import { _ } from '../../lib/utils';

// models
import type { AnyObject, LogGroup, LogGroupFile } from '../../models';

export interface LogStoreStateInterface {
  logGroups: LogGroup[];
  addLogGroupsError?: Error | AnyObject;
}

export const initialLogsStoreState: LogStoreStateInterface = {
  logGroups: [],
  addLogGroupsError: undefined
};

export function cachedLogsStoreState(logsStoreState: LogStoreStateInterface): Partial<LogStoreStateInterface> {
  return _.assign(
    {},
    { logGroups: logsStoreState.logGroups }
  );
}
