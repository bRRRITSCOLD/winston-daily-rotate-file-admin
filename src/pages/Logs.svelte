<script lang="ts">
  // node_modules
  import { push } from 'svelte-spa-router'
  import { watchResize } from "svelte-watch-resize";
  import { Button, TextField } from 'svelte-materialify/src';

  // libraries

  // models

  // components
  import LogDirectoriesRowCell from '../components/LogDirectories/LogDirectoriesTableRowCell.svelte';
  import LogDirectoriesHeaderCell from '../components/LogDirectories/LogsDirectoriesTableHeaderCell.svelte';
	import VirtualTable from '../components/UI/Table/VirtualTable.svelte';

  // stores
  import { logsStore } from '../stores/logs'

  // file constants
  let virtualTableWidth = 0;

  let virtualTableColumns = [];
  $: virtualTableColumns = [
    {
      display: 'Directory',  // What will be displayed as the column header
      dataName: 'directory',  // The key of a row to get the column's data from
      width: virtualTableWidth,
      cellComponent: LogDirectoriesRowCell,
      headerComponent: LogDirectoriesHeaderCell
    }
  ];
  // props
  export let params: any = {};
</script>

<main>
  <div class="flex-box-column">
    <div class="flex-box-row">
      <TextField>Filter</TextField>
      <div class="text-align-right">
        <Button on:click={async () => {
          await logsStore.addLogDirectory();
        }} class="primary-color">Add Directory</Button>
      </div>
    </div>
    <div
      class='container'
      style="height: calc(100vh - 15em); min-height: 200px;"
      use:watchResize={(node) => {
        virtualTableWidth = node.clientWidth;
      }}
    >
      <VirtualTable
        rows={$logsStore.logAuditFiles} 
        columns={virtualTableColumns}
        on:onVirtualTableRowCellClick={(event) => {
          if (event.detail.columnIndex === 0) {
            // find the log audit file clicked on
            const clickedLogAudigFile = $logsStore.logAuditFiles[event.detail.rowIndex];
            console.log(clickedLogAudigFile)
            // route to correct details page
            push(`/logs/${clickedLogAudigFile.id}/details`);
          }
        }}
      />
    </div>
  </div>
</main>


<style></style>
