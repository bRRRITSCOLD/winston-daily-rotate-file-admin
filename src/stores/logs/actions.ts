import type { Writable } from "svelte/store";
import type { LogStoreStateInterface } from "./state";
import { _ } from '../../lib/utils';

// models
import { LogGroup } from "../../models/logs";
import type { LogGroupFile } from "../../models/logs";
import type { AnyObject } from "../../models/common";

export interface LogsStoreActionsInterface {
  deleteLogGroup: (logGroupId: LogGroup) => void;
  replaceLogGroups: (logGroups: LogGroup[]) => void;
  replaceLogGroupFiles: (replaceLogGroupFilesRequest: { logGroupId: string; files: LogGroupFile[] }) => void;
  setIsLoadingLogGroups: (setIsLoadingLogGroups: boolean) => void;
  setLoadLogGroupsError: (error: Error | AnyObject) => void;
  setIsSavingLogGroups: (setIsSaveingLogGroups: boolean) => void;
  setSaveLogGroupsError: (error: Error | AnyObject) => void;
  setIsAddingLogGroups: (setIsAddingLogGroups: boolean) => void;
  setAddLogGroupsError: (error: Error | AnyObject) => void;
  setIsParsingLogGroupFiles: (setIsAddingLogGroups: boolean) => void;
  setParseLogGroupFilesError: (error: Error | AnyObject) => void;
}

export const createLogsStoreActions = (logsStore: Writable<LogStoreStateInterface & object>): LogsStoreActionsInterface => {

  return {
    deleteLogGroup: (logGroup: LogGroup) => {
      logsStore.update(state => {
        // first create a copy
        let newLogGroups = state.logGroups.slice();
        // find index of item
        const foundLogGroupIndex = _.findIndex(newLogGroups, { logGroupId: logGroup.logGroupId })
        // remove log group at specific
        // index if found
        if (foundLogGroupIndex > -1) newLogGroups.splice(foundLogGroupIndex, 1);
        // return the new state
        return _.assign(
          {},
          state,
          { logGroups: newLogGroups }
        )
      })
    },
    replaceLogGroups: (logGroups: LogGroup[]) => {
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
    setIsLoadingLogGroups: (isLoadingLogGroups: boolean) => {
      logsStore.update(state => {
        return _.assign(
          {},
          state,
          { isLoadingLogGroups: isLoadingLogGroups }
        )
      })
    },
    setLoadLogGroupsError: (error: Error | AnyObject) => {
      logsStore.update(state => {
        return _.assign(
          {},
          state,
          { loadLogGroupsError: error }
        )
      })
    },
    setIsSavingLogGroups: (isSavingLogGroups: boolean) => {
      logsStore.update(state => {
        return _.assign(
          {},
          state,
          { isSavingLogGroups: isSavingLogGroups }
        )
      })
    },
    setSaveLogGroupsError: (error: Error | AnyObject) => {
      logsStore.update(state => {
        return _.assign(
          {},
          state,
          { saveLogGroupsError: error }
        )
      })
    },
    setIsAddingLogGroups: (isAddingLogGroups: boolean) => {
      logsStore.update(state => {
        return _.assign(
          {},
          state,
          { isAddingLogGroups: isAddingLogGroups }
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
    },
    replaceLogGroupFiles: (replaceLogGroupFilesRequest: { logGroupId: string; files: LogGroupFile[] }) => {
      // deconstruct for ease
      const { logGroupId, files } = replaceLogGroupFilesRequest;
      // update state
      logsStore.update((state) => {
        console.log(state);
        const foundLogGroupIndex = _.findIndex(state.logGroups, { logGroupId });
        console.log('foundLogGroupIndex=', foundLogGroupIndex);
        const foundLogGroup = new LogGroup(_.assign({}, state.logGroups[foundLogGroupIndex]));
        console.log('foundLogGroup=', foundLogGroup);
        for (const logGroupFile of replaceLogGroupFilesRequest.files) {
          foundLogGroup.replaceFile({ hash: logGroupFile.hash }, logGroupFile);
        }
        // create a new stae based on the old state
        const newState = _.assign(
          {},
          state
        );
        // replace/mutate/update the old state here
        newState.logGroups[foundLogGroupIndex] = foundLogGroup;
        console.log('newState=', newState)
        // return new state
        return _.assign({}, newState);
      });
    },
    setIsParsingLogGroupFiles: (isParsingLogGroupFiles: boolean) => {
      logsStore.update(state => {
        return _.assign(
          {},
          state,
          { isParsingLogGroupFiles: isParsingLogGroupFiles }
        )
      })
    },
    setParseLogGroupFilesError: (error: Error | AnyObject) => {
      logsStore.update(state => {
        return _.assign(
          {},
          state,
          { parseLogGroupFilesError: error }
        )
      })
    }
  }
}