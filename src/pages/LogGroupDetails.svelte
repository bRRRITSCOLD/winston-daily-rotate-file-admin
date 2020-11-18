<script lang="ts">
  // node_modules
  import { push } from 'svelte-spa-router';

  // libraries
  import { _ } from '../lib/utils';

  // models
  import type { LogGroupFile } from '../models';

  // components
  import LogGroupDetailsTable from '../components/LogGroup/LogGroupDetailsTable.svelte';

  // stores
  import { logsStore } from '../stores/logs';

  // props
  export let params: any = {};

  // reactive vars
  let selectedLogGroupFiles: LogGroupFile[] = [];
  $: selectedLogGroupFiles;

  // let logGroupFiles: LogGroupFile[] = [];
  // $: logGroupFiles = _.get($logsStore.logGroups.slice().find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', [] as LogGroupFile[]).map((file) => _.assign(
  //   {},
  //   file,
  //   { selected: false }
  // ));

  // reactive vars
  let logGroupFilesFilter = '';
  $: logGroupFilesFilter;

  let filteredLogGroupFiles: LogGroupFile[] = [];
  $: {
    const logGroupFiles = _.get($logsStore.logGroups.slice().find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', [] as LogGroupFile[]).map((file) => _.assign(
      {},
      file,
      { selected: false }
    ));
    if (logGroupFiles.length) filteredLogGroupFiles = logGroupFiles;
    if (logGroupFilesFilter !== '')  filteredLogGroupFiles = logGroupFiles.reduce((fltrdLogGroupFiles: LogGroupFile[], logGroupFile: LogGroupFile) => {
      let matched = false;
      for (const logGroupFileKey of Object.keys(logGroupFile)) {
        if (logGroupFile[logGroupFileKey] && logGroupFile[logGroupFileKey].toString().indexOf(logGroupFilesFilter) > -1) {
          matched = true;
        }
      }
      if (matched) fltrdLogGroupFiles.push(logGroupFile);
      return fltrdLogGroupFiles;
    }, []);
  }

  // reactive vars

  // let filteredLogGroups;
  // $: {
  //   const logGroupFilesData = _.get($logsStore.logGroups.find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', []).filter((logGroupFile) => parsedQuerystring.logGroupFileIds.split(',').includes(logGroupFile.logGroupFileId)).filter((selectedLogGroupFile) => selectedLogGroupFile.data !== undefined);
  //   filteredLogGroups = logGroupFileMessageFilter === ''
  //   ? logGroupFilesData
  //   : logGroupFilesData.map((parsedLogGroupFile) => {
  //     const copy = _.assign({}, parsedLogGroupFile);
  //     const data = _.flatten(copy.data.filter((data) => data.message.toString().indexOf(logGroupFileMessageFilter) > -1));
  //     copy.data = data;
  //     return copy;
  //   });
  // }
</script>

<main>
  <div class="d-flex flex-column">
    <LogGroupDetailsTable
      logGroupFiles={filteredLogGroupFiles}
      on:onApplyButtonClick={(event) => {
        logGroupFilesFilter = event.detail.replaceAll('“', '"').replaceAll('”', '"');
      }}
      on:onTableRowSelectedCellClick={(event) => {
        const newArr = filteredLogGroupFiles.slice();
        filteredLogGroupFiles[event.detail.rowIndex].selected = !filteredLogGroupFiles[event.detail.rowIndex].selected;
        newArr[_.findIndex(newArr, { logGroupFileId: filteredLogGroupFiles[event.detail.rowIndex].logGroupFileId })] = filteredLogGroupFiles[event.detail.rowIndex];
        filteredLogGroupFiles = newArr;
      }}
      on:onSearchButtonClick={(event) => {
        push(`/log-groups/${
          params.logGroupId
        }/details/search?logGroupFileIds=${
          filteredLogGroupFiles
            .filter((logGroupFile) => logGroupFile.selected)
            .map((logGroupFile) => logGroupFile.logGroupFileId)
        }`);
      }}
    />
  </div>
</main>


<style></style>
  