<script lang="ts">
    // node_modules
  
    // libraries
    import { _ } from '../lib/utils';

    // models
    import type { LogGroupFile } from '../models';

    // components
    import LogGroupDetailsTable from '../components/LogGroup/LogGroupDetailsTable.svelte';
  
    // stores
    import { allLogGroupsFiles, logsStore } from '../stores/logs';
  
    // props
    export let params: any = {};
  
    // reactive vars
    let selectedLogGroupFiles: LogGroupFile[] = [];
    $: selectedLogGroupFiles;

    let copyLogGroups = [];
    $: copyLogGroups = $logsStore.logGroups.slice();

    let logGroupFiles: LogGroupFile[] = [];
    // @ts-ignore
    $: logGroupFiles = _.get(copyLogGroups.find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', [] as LogGroupFile[]).map((file) => {
      // check to see if the item is currently selected
      const foundSelectedLogGroupFile = selectedLogGroupFiles.find((selectedLogGroupFile) => selectedLogGroupFile.logGroupFileId === file.logGroupFileId)
      // if it is selected then set to true
      if (foundSelectedLogGroupFile) {
        file.selected = true;
      // else set to false
      } else {
        file.selected = false;
      }
      return file;
    });
  </script>
  
  <main>
    <div class="flex-box-column">
      <LogGroupDetailsTable
        logGroupFiles={$allLogGroupsFiles}
        on:onAddButtonClick={async () => {
          await logsStore.addLogGroups();
        }}
        on:onTableRowSelectedCellClick={(event) => {
          console.log(event);
          const clickedLogAudigFile = logGroupFiles[event.detail.rowIndex];
          const newArr = selectedLogGroupFiles.slice();
          const index = _.findIndex(newArr, { logGroupFileId: clickedLogAudigFile.logGroupFileId });
          console.log(index);
          if (index === -1) {
            newArr.push(clickedLogAudigFile);
            selectedLogGroupFiles = newArr;
          } else {
            newArr.splice(index, 1);
            console.log(newArr);
            selectedLogGroupFiles = newArr;
          }
          console.log('finalNewArr=', newArr)
        }}
      />
    </div>
  </main>
  
  
  <style></style>
  