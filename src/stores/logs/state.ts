//node_modules
import { _ } from '../../lib/utils';

// models
import type { AnyObject, LogGroup, LogGroupFile } from '../../models';

export interface LogStoreStateInterface {
  logGroups: LogGroup[];
  isLoadingLogGroups?: boolean;
  loadLogGroupsError?: Error | AnyObject;
  isSavingLogGroups?: boolean;
  saveLogGroupsError?: Error | AnyObject;
  isAddingLogGroups?: boolean;
  addLogGroupsError?: Error | AnyObject;
  isParsingLogGroupFiles?: boolean;
  parseLogGroupFilesError?: Error | AnyObject;
}

export const initialLogsStoreState: LogStoreStateInterface = {
  logGroups: [],
  isLoadingLogGroups: false,
  loadLogGroupsError: undefined,
  isSavingLogGroups: false,
  saveLogGroupsError: undefined,
  isAddingLogGroups: false,
  addLogGroupsError: undefined,
  isParsingLogGroupFiles: false,
  parseLogGroupFilesError: undefined
};

export function cachedLogsStoreState(logsStoreState: LogStoreStateInterface): Partial<LogStoreStateInterface> {
  return _.assign(
    {},
    { logGroups: logsStoreState.logGroups }
  );
}
