// node_modules
import { v4 as uuid } from 'uuid';

// libraries
import { promiseUtils, _ } from '../../lib/utils';

// models
import { LogGroup } from "../../models/logs";

// services
import { directoriesService, filesService, logsService } from "../../services";

// store specific
import type { LogsStoreActionsInterface } from "./actions";
import { LOG_GROUPS_SAVED_DATA_FILENAME_KEY } from './keys';

export const createLogsStoreThunks = (logsStoreActions: LogsStoreActionsInterface) => {

  return {
    loadLogGroups: async () => {
      try {
        // reset any errors that we may have had
        // and indicate that we are loading log groups
        logsStoreActions.setLoadLogGroupsError(undefined);
        logsStoreActions.setIsLoadingLogGroups(true);
        // get the applications directory -
        // we will use this to build the path
        // to any saved data we need to load
        // from other isntanes of this process
        const appDirPath = await directoriesService.getAppDirPath();
        console.log('appDirPath=', appDirPath);
        // see if saved file exists
        const doesFileExist = await filesService.doesFileExist(`${appDirPath}/${LOG_GROUPS_SAVED_DATA_FILENAME_KEY}`);
        // if the file eixsts then load it
        if (doesFileExist) {
          // read the log groups
          // saved data file
          const readTextFile = await filesService.readTextFile(`${appDirPath}/${LOG_GROUPS_SAVED_DATA_FILENAME_KEY}`);
          // parse the saved data file
          const logGroups = JSON.parse(readTextFile);
          console.log('loadLogGroups.logGroups', logGroups)
          // update the state
          logsStoreActions.replaceLogGroups(logGroups);
        }
        console.log('doesFileExist=', doesFileExist);
        // inidicate we are no longer
        // loading log groups
        logsStoreActions.setIsLoadingLogGroups(false);
        // return explicitly
        return;
      } catch (err) {
        console.log('loadLogGroups.error', err)
        // inidicate we are no longer
        // loading log groups and that we
        // received errors
        logsStoreActions.setLoadLogGroupsError(err);
        logsStoreActions.setIsLoadingLogGroups(false);
      }
    },
    saveLogGroups: async (logGroups: LogGroup[]) => {
      try {
        // reset any errors that we may have had
        // and indicate that we are saving log groups
        logsStoreActions.setSaveLogGroupsError(undefined);
        logsStoreActions.setIsSavingLogGroups(true);
        // get the applications directory -
        // we will use this to build the path
        // to the directory where we can save
        // data for another instance of the
        // application to load at run time
        // in the future
        const appDirPath = await directoriesService.getAppDirPath();
        // create dir incase it does not exist -
        // (more of a local development thing)
        await directoriesService.mkdirp(appDirPath);
        // now save the data
        await filesService.writeFile({ path: `${appDirPath}/${LOG_GROUPS_SAVED_DATA_FILENAME_KEY}`, contents: JSON.stringify(logGroups)});
        // inidicate we are no longer
        // saving log groups
        logsStoreActions.setIsSavingLogGroups(false);
        // return explicitly
        return;
      } catch (err) {
        console.log('saveLogGroups.error', err)
        // inidicate we are no longer
        // saving log groups and that we
        // received errors
        logsStoreActions.setSaveLogGroupsError(err);
        logsStoreActions.setIsSavingLogGroups(false);
      }
    },
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
        logsStoreActions.replaceLogGroups(logGroups);
        logsStoreActions.setIsAddingLogGroups(false);
        // return explicitly
        return;
      } catch (err) {
        // update store
        logsStoreActions.setAddLogGroupsError(err);
        logsStoreActions.setIsAddingLogGroups(false);
        // return explicitly
        return;
      }
    },
    parseLogGroupFiles: async (logGroup) => {
      try {
        // reset any errors that we may have had
        // and indicate that we are parsing log group files
        logsStoreActions.setParseLogGroupFilesError(undefined);
        logsStoreActions.setIsParsingLogGroupFiles(true);
        // create new instance of a
        // log group to use internally
        const newLogGroup = new LogGroup(logGroup);
        // read directory - we do this to
        // determine the file type of
        // each file passed in
        const readDirectory = await directoriesService.readDir(newLogGroup.directoryPath);
        // parse each log group file that was provided
        const parsedLogGroupFiles = await Promise.all(newLogGroup.files.map(async (file) => {
          // find the file in the read directory
          const foundReadDirectoryFile = readDirectory.find((readDirectoryFile) => {
            if (readDirectoryFile.name.endsWith('.gz')) {
              const splitDirectoryFileName = readDirectoryFile.name.split('.');
              splitDirectoryFileName.pop();
              return splitDirectoryFileName.join('.') === file.name.split('/').slice(-1)[0]
            } else if (!readDirectoryFile.name.endsWith('.gz') && !readDirectoryFile.name.endsWith('.json')) {
              return readDirectoryFile.name === file.name.split('/').slice(-1)[0]
            }
          });
          // parse file
          let parsedFoundReadDirectoryFile;
          if (foundReadDirectoryFile.name.endsWith('.gz')) {
            // deocde file
            const decodedGzFile = await filesService.decodeGzFile(foundReadDirectoryFile.path);
            // parse and store file
            parsedFoundReadDirectoryFile = logsService.parseLogGroupFile(decodedGzFile);
          } else if (!foundReadDirectoryFile.name.endsWith('.gz') && !foundReadDirectoryFile.name.endsWith('.json')) {
            // read file
            const readTextFile = await filesService.readTextFile(foundReadDirectoryFile.path);
            // parse and store file
            parsedFoundReadDirectoryFile = logsService.parseLogGroupFile(readTextFile);
          }
          // set data of the log group file instance
          file.data = parsedFoundReadDirectoryFile;
          // return explicitly
          return file;
        }));
        // await promiseUtils.delay(10000);
        // update store
        logsStoreActions.replaceLogGroupFiles({ logGroupId: newLogGroup.logGroupId, files: parsedLogGroupFiles });
        logsStoreActions.setIsParsingLogGroupFiles(false);
        // return explicitly
        return;
      } catch (err) {
        // update store
        logsStoreActions.setParseLogGroupFilesError(err);
        logsStoreActions.setIsParsingLogGroupFiles(false);
        // return explicitly
        return;
      }
    }
  }
}
