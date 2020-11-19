// node_modules
import { v4 as uuid } from 'uuid';

// libraries
import { _ } from '../../lib/utils';

// models
import { LogGroup } from "../../models";

// services
import { filesService } from "../../services";

// store specific
import type { LogsStoreActionsInterface } from "./actions";

export const createLogsStoreThunks = (logsStoreActions: LogsStoreActionsInterface) => {

  return {
    addLogGroups: async () => {
      try {
        // reset any errors that we may have had
        // and indicate that we are adding log groups
        logsStoreActions.setAddLogGroupsError(undefined);
        logsStoreActions.setIsAddingLogGroups(true);
        // ask user for log audit files
        const fileNames: string[] = await filesService.getFileNames();
        // filter out only audit files
        const logGroupNames = fileNames
          .filter((fileName: string) => fileName.toLowerCase().endsWith('-audit.json'));
        // map over each file selected and read them
        const readLogGroups = await Promise.all(
          logGroupNames
            .map(async (logGroup: string) => {
              // read a single file
              const readLogGroup = await filesService.readTextFile(logGroup);
              console.log(JSON.stringify(JSON.parse(readLogGroup), undefined, 2));
              // parse and return
              return JSON.parse(readLogGroup);
            })
        );
        // create holder for log groups
        const logGroups: LogGroup[] = [];
        // create log groups
        for (const [readLogGroupIndex, readLogGroup] of readLogGroups.entries()) {
          const splitLogGroupName = logGroupNames[readLogGroupIndex].split('/');
          // remove log aufit file name - we need dir name
          splitLogGroupName.pop();
          // replace in state
          logGroups.push(
            new LogGroup(_.assign(
              {},
              readLogGroup, 
              {
                directoryPath: splitLogGroupName.join('/'),
                logGroupId: uuid()
              }
            ))
          ); 
        }
        // update store
        logsStoreActions.replaceManyLogGroups(logGroups);
        logsStoreActions.setIsAddingLogGroups(false);
        // return explicitly
        return;
      } catch (err) {
        // update store
        logsStoreActions.setAddLogGroupsError(err);
        logsStoreActions.setIsAddingLogGroups(false);
      }
    }
  }
}