<script lang="ts">
    // node_modules
    // import { push } from 'svelte-spa-router'
  
    // libraries
    import { _ } from '../lib/utils';

    // components
  import LogGroupDetailsTable from '../components/LogGroup/LogGroupDetailsTable.svelte';
  
    // stores
    import { logsStore } from '../stores/logs';
import type { LogGroupFile } from '../models';
  
    // props
    export let params: any = {};
  
    // reactive vars
    let selectedLogGroupFiles = [];
    $: selectedLogGroupFiles;

    let logGroupFiles = [];
    // @ts-ignore
    $: logGroupFiles = _.get($logsStore.logGroups.find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', [] as LogGroupFile[]).map((file) => {
      // check to see if the item is currently selected
      const foundSelectedLogGroupFile = selectedLogGroupFiles.find((selectedLogGroupFile: string) => selectedLogGroupFile === file.logGroupFileId)
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
        logGroupFiles={logGroupFiles}
        on:onAddButtonClick={async () => {
          await logsStore.addLogGroups();
        }}
        on:onTableLogGroupRowCellClick={(event) => {
          console.log(event)
        }}
      />
    </div>
  </main>
  
  
  <style></style>
  