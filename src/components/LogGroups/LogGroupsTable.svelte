<script lang="ts">
  // node_modules
  import { watchResize } from "svelte-watch-resize";
  import { Button, TextField, Card } from 'svelte-materialify/src';
  import { createEventDispatcher } from 'svelte';

  // libraries

  // models

  // components
  import LogGroupsRowCell from './LogGroupsTableRowCell.svelte';
  import LogGroupsHeaderCell from './LogGroupsTableHeaderCell.svelte';
	import VirtualTable from '../UI/Table/VirtualTable.svelte';

  // props
  export let logGroups: { id: string; auditLog: string }[] = [];

  // file constants
  const dispatch = createEventDispatcher();
  
  let virtualTableWidth = 0;


  let virtualTableColumns = [];
  $: virtualTableColumns = [
    {
      display: 'Log Group',  // What will be displayed as the column header
      dataName: 'auditLog',  // The key of a row to get the column's data from
      width: virtualTableWidth,
      cellComponent: LogGroupsRowCell,
      headerComponent: LogGroupsHeaderCell
    }
  ];
</script>

<Card>
  <div class="flex-box-row justify-content-flex-end" style="padding-top: 10px;">
    <div style="padding-right: 10px; padding-left: 10px; width: 90%;">
      <TextField>Filter</TextField>
    </div>
    <div class="text-align-right" style="padding-right: 10px; padding-left: 10px;">
      <Button class="primary-color">Apply</Button>
    </div>
  </div>
  <div class="flex-box-row justify-content-space-around">
    <div
      style="height: calc(100vh - 15em); min-height: 200px; width: calc(100vw - 2em); padding-top: 10px;"
      use:watchResize={(node) => {
        virtualTableWidth = node.clientWidth;
      }}
    >
      <VirtualTable
        rowHeight={50}
        rows={logGroups} 
        columns={virtualTableColumns}
        on:onVirtualTableRowCellClick={(event) => {
          if (event.detail.columnIndex === 0) {
            dispatch('onTableLogGroupRowCellClick', { rowIndex: event.detail.rowIndex });
          }
        }}
      />
    </div>
  </div>
  <div class="flex-box-row justify-content-flex-end" style="padding-top: 10px; padding-right: 10px; padding-left: 10px; width: 100%;">
      <Button on:click={() => {
        dispatch('onAddButtonClick', true);
      }} class="primary-color">Add</Button>
  </div>
</Card>
