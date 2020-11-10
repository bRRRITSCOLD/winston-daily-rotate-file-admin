// models
import type { LogGroup } from '../../models';

export interface LogStoreStateInterface {
  logGroups: LogGroup[];
}

export const initialLogsStoreState: LogStoreStateInterface = {
  logGroups: [],
};
