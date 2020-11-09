// node_modules
import { writable, readable, derived, get } from "svelte/store";
import type * as tauriFs from 'tauri/api/fs';
import { v4 as uuid } from 'uuid';
import { get as _get, assign } from 'lodash';

// libraries
import { _ } from '../../lib/utils';

// models
import type { LogAuditFile, LogAuditFileInterface, LogAuditFileLogFileInterface } from '../../models';

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
  const { subscribe, update, set } = writable(assign({}, initialLogsStoreState, _.isObject(storedLogsStore) ? storedLogsStore : {}));
  subscribe(value => {
    sessionStorage.setItem(LOGS_STORE_KEY, JSON.stringify(value));
  });

  return {
    update,
    subscribe,
    reset: () => set(initialLogsStoreState),
    // addLogGroups: async () => {
    //   try {
    //     // ask user for log files directory
    //     const logDirectory: string = await directoriesService.getDirectoryName();
    //     // read the directory
    //     const logDirectoryFiles = await directoriesService.readDir(logDirectory);
    //     // no filter/reduce down the results
    //     const logAuditFile = logDirectoryFiles.reduce((auditFile: any, file: tauriFs.FileEntry) => {
    //       if (_get(_get(file, 'name', '').split('.').slice(-1), '[0]', '').toUpperCase() === 'JSON') {
    //         auditFile = assign({}, file, { logDirectory });
    //       }
    //       return auditFile;
    //     }, undefined);
    //     // read the audit file
    //     const readLogAuditFile = await filesService.readTextFile(logAuditFile.path);
    //     const parsedReadLogAuditFile: any = JSON.parse(readLogAuditFile);
    //     // now let us take the data from the readDir
    //     // operation from above and merge it with the
    //     // log files under each auditLogFile
    //     // set log audit files in store
    //     update(
    //       state => {
    //         const updatedData = {
    //           logAuditFiles: _.replaceOne(
    //             { auditLog: parsedReadLogAuditFile.auditLog },
    //             state.logAuditFiles,
    //             assign(
    //               {},
    //               parsedReadLogAuditFile, 
    //               {
    //                 path: parsedReadLogAuditFile.path,
    //                 directory: logDirectory,
    //                 id: uuid(),
    //                 logFiles: parsedReadLogAuditFile.files.map((file: LogAuditFileLogFileInterface) => {
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
      const logAuditFileNames = fileNames
        .filter((fileName: string) => fileName.toLowerCase().endsWith('-audit.json'));
      // map over each file selected and read them
      const readLogAuditFiles = await Promise.all(
        logAuditFileNames
          .map(async (logAuditFile: string) => {
            // read a single file
            const readLogAuditFile = await filesService.readTextFile(logAuditFile);
            console.log(JSON.stringify(JSON.parse(readLogAuditFile), undefined, 2));
            // parse and return
            return JSON.parse(readLogAuditFile);
          })
      );
      // update store
      update(
        state => {
          // for each read audit file
          // replace it in the current state
          let updatedLogAuditFiles = state.logGroups.slice();
          for (const [readLogAuditFileIndex, readLogAuditFile] of readLogAuditFiles.entries()) {
            const splitLogAuditFileName = logAuditFileNames[readLogAuditFileIndex].split('/');
            // remove log aufit file name - we need dir name
            splitLogAuditFileName.pop();
            // replace in state
            updatedLogAuditFiles = _.replaceOne(
              { auditLog: readLogAuditFile.auditLog },
              updatedLogAuditFiles,
              assign(
                {},
                readLogAuditFile, 
                {
                  path: readLogAuditFile.path,
                  directoryPath: splitLogAuditFileName.join('/'),
                  id: uuid()
                }
              )
            ) 
          }
          console.log('updatedLogAuditFiles=', updatedLogAuditFiles);
          // create new state
          const newState = _.assign(
            {},
            state,
            { logGroups: updatedLogAuditFiles }
          );
          console.log('newState=', newState);
          // return new state
          return _.assign({}, newState);
        }
      );
      // console.log(readLogAuditFiles);
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