<script lang="ts">
    // node_modules
  
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

    let logGroupFiles: LogGroupFile[] = [];
    $: logGroupFiles = _.get($logsStore.logGroups.slice().find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', [] as LogGroupFile[]).map((file) => _.assign(
      {},
      file,
      { selected: false }
    ));

    // handlers
    function onTableRowSelectedCellClick(event) {
      const newArr = logGroupFiles.slice();
      logGroupFiles[event.detail.rowIndex].selected = !logGroupFiles[event.detail.rowIndex].selected;
      newArr[_.findIndex(newArr, { logGroupFileId: logGroupFiles[event.detail.rowIndex].logGroupFileId })] = logGroupFiles[event.detail.rowIndex];
      logGroupFiles = newArr;
    }
  </script>
  
  <main>
    <div class="flex-box-column">
      <LogGroupDetailsTable
        logGroupFiles={logGroupFiles}
        on:onTableRowSelectedCellClick={onTableRowSelectedCellClick}
      />
    </div>
  </main>
  
  
  <style></style>
  