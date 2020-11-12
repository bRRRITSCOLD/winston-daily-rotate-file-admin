// node_modules
import { writable, readable, derived, get } from "svelte/store";
import type * as tauriFs from 'tauri/api/fs';
import { v4 as uuid } from 'uuid';
import { get as _get, assign } from 'lodash';

// libraries
import { _ } from '../../lib/utils';

// models
import { LogGroup, LogGroupInterface, LogGroupFileInterface } from '../../models';

// services
import {
  directoriesService,
  filesService,
  logsService
} from "../../services";

// store specific
import { initialLogsStoreState } from "./state";
import { LOGS_STORE_KEY } from "./keys";



function createLogsStore() {
  // get persisted item
  const storedLogsStore = JSON.parse(sessionStorage.getItem(LOGS_STORE_KEY));
  // create writable
  const _logsStore = writable(assign({}, initialLogsStoreState, _.isObject(storedLogsStore) ? storedLogsStore : {}));
  _logsStore.subscribe(value => {
    sessionStorage.setItem(LOGS_STORE_KEY, JSON.stringify(value));
  });

  return {
    update: _logsStore.update,
    subscribe: _logsStore.subscribe,
    reset: () => _logsStore.set(initialLogsStoreState),
    addLogGroups: async () => {
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
      // update store
      _logsStore.update(
        state => {
          // for each read audit file
          // replace it in the current state
          let updatedLogGroups = state.logGroups.slice();
          for (const [readLogGroupIndex, readLogGroup] of readLogGroups.entries()) {
            const splitLogGroupName = logGroupNames[readLogGroupIndex].split('/');
            // remove log aufit file name - we need dir name
            splitLogGroupName.pop();
            // replace in state
            updatedLogGroups = _.replaceOne(
              { auditLog: readLogGroup.auditLog },
              updatedLogGroups,
              assign(
                {},
                readLogGroup, 
                {
                  directoryPath: splitLogGroupName.join('/'),
                  logGroupId: uuid()
                }
              )
            ); 
          }
          // create new state
          const newState = _.assign(
            {},
            state,
            { logGroups: updatedLogGroups.map((logGroup) => new LogGroup(logGroup)) }
          );
          // return new state
          return _.assign({}, newState);
        }
      );
      // console.log(readLogGroups);
    },
    parseLogGroupFiles: async (logGroupFilePaths: string[]) => {
      try {
        console.log('logGroupFilePaths=', logGroupFilePaths);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  };
}

const logsStore = createLogsStore();

export { logsStore };

// /* computed values */
// export const getTotalHeroes = derived(
//   heroStore,
//   $heroStore => $heroStore.heroes.length
// );