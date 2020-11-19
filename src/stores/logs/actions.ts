import type { Writable } from "svelte/store";
import type { LogStoreStateInterface } from "./state";
import { _ } from '../../lib/utils';
import type { AnyObject, LogGroup } from "../../models";

export interface LogsStoreActionsInterface {
  replaceManyLogGroups: (logGroups: LogGroup[]) => void;
  setIsAddingLogGroups: (setIsAddingLogGroups: boolean) => void;
  setAddLogGroupsError: (error: Error | AnyObject) => void;
}

export const createLogsStoreActions = (logsStore: Writable<LogStoreStateInterface & object>): LogsStoreActionsInterface => {

  return {
    replaceManyLogGroups: (logGroups: LogGroup[]) => {
      logsStore.update(state => {
        // first create a copy
        let newLogGroups = state.logGroups.slice();
        // for each log group passed in - replace its
        // correlated self in the newLogGroups array
        for (const logGroup of logGroups) {
          newLogGroups = _.replaceOne(
            { auditLog: logGroup.auditLog },
            newLogGroups,
            logGroup
          );
        }
        // return the new state
        return _.assign(
          {},
          state,
          { logGroups: newLogGroups }
        )
      })
    },
    setIsAddingLogGroups: (setIsAddingLogGroups: boolean) => {
      logsStore.update(state => {
        return _.assign(
          {},
          state,
          { setIsAddingLogGroups: setIsAddingLogGroups }
        )
      })
    },
    setAddLogGroupsError: (error: Error | AnyObject) => {
      logsStore.update(state => {
        return _.assign(
          {},
          state,
          { addLogGroupsError: error }
        )
      })
    }
  }
}