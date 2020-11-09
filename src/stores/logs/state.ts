// models
import type { LogAuditFile } from '../../models';

export interface LogStoreStateInterface {
  logGroups: LogAuditFile[];
}

export const initialLogsStoreState: LogStoreStateInterface = {
  logGroups: [],
};
