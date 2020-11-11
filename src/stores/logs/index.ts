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
    // addLogGroups: async () => {
    //   try {
    //     // ask user for log files directory
    //     const logDirectory: string = await directoriesService.getDirectoryName();
    //     // read the directory
    //     const logDirectoryFiles = await directoriesService.readDir(logDirectory);
    //     // no filter/reduce down the results
    //     const logGroup = logDirectoryFiles.reduce((auditFile: any, file: tauriFs.FileEntry) => {
    //       if (_get(_get(file, 'name', '').split('.').slice(-1), '[0]', '').toUpperCase() === 'JSON') {
    //         auditFile = assign({}, file, { logDirectory });
    //       }
    //       return auditFile;
    //     }, undefined);
    //     // read the audit file
    //     const readLogGroup = await filesService.readTextFile(logGroup.path);
    //     const parsedReadLogGroup: any = JSON.parse(readLogGroup);
    //     // now let us take the data from the readDir
    //     // operation from above and merge it with the
    //     // log files under each auditLogFile
    //     // set log audit files in store
    //     update(
    //       state => {
    //         const updatedData = {
    //           logGroups: _.replaceOne(
    //             { auditLog: parsedReadLogGroup.auditLog },
    //             state.logGroups,
    //             assign(
    //               {},
    //               parsedReadLogGroup, 
    //               {
    //                 path: parsedReadLogGroup.path,
    //                 directory: logDirectory,
    //                 id: uuid(),
    //                 logFiles: parsedReadLogGroup.files.map((file: LogGroupFileInterface) => {
    //                   // first find the log audit file log file
    //                   // that correlates to each file returned
    //                   // from the above readDir call
    //                   const foundReadDirFile = logDirectoryFiles.find((logDirectoryFile) => logDirectoryFile.path.includes(file.name));
    //                   console.log('foundReadDirFile=', foundReadDirFile);
    //                   return assign(
    //                     {},
    //                     file,
    //                     {
    //                       path: foundReadDirFile?.path
    //                     }
    //                   )
    //                 })
    //               }
    //             )
    //           ) 
    //         };
    //         console.log('updatedData=', updatedData);
    //         // create new state
    //         const newState = _.assign(
    //           {},
    //           state,
    //           updatedData
    //         );
    //         console.log('newState=', newState);
    //         // return new state
    //         return _.assign({}, newState);
    //       }
    //     );
    //   } catch (err) {
        
    //   }
    // },
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
    }
  };
}

const logsStore = createLogsStore();

const logGroupsFiles = derived(
  logsStore,
  ($logsStore) => {
    return _.flatten($logsStore.logGroups.map(logGroup => logGroup.files as any[]))
  }
);

export { logsStore, logGroupsFiles };

// /* computed values */
// export const getTotalHeroes = derived(
//   heroStore,
//   $heroStore => $heroStore.heroes.length
// );