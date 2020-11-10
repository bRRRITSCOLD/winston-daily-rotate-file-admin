<script lang="ts">
  // node_modules
  import { watchResize } from "svelte-watch-resize";
  import { Button, TextField, Card } from 'svelte-materialify/src';
  import { createEventDispatcher } from 'svelte';

  // libraries

  // models

  // components
  import LogGroupDetailsTableRowCell from './LogGroupDetailsTableRowCell.svelte';
  import LogGroupDetailsTableHeaderCell from './LogGroupDetailsTableHeaderCell.svelte';
	import VirtualTable from '../UI/Table/VirtualTable.svelte';

  // props
  export let logGroupFiles: { selected: boolean; date: number; name: string; hash: string }[] = [];

  // file constants
  const dispatch = createEventDispatcher();
  
  let virtualTableWidth = 0;


  let virtualTableColumns = [];
  $: virtualTableColumns = [
    {
      display: 'Selected',  // What will be displayed as the column header
      dataName: 'selected',  // The key of a row to get the column's data from
      width: virtualTableWidth * .10,
      cellComponent: LogGroupDetailsTableRowCell,
      headerComponent: LogGroupDetailsTableHeaderCell
    },
    {
      display: 'Date',  // What will be displayed as the column header
      dataName: 'date',  // The key of a row to get the column's data from
      width: virtualTableWidth * .20,
      cellComponent: LogGroupDetailsTableRowCell,
      headerComponent: LogGroupDetailsTableHeaderCell
    },
    {
      display: 'Hash',  // What will be displayed as the column header
      dataName: 'hash',  // The key of a row to get the column's data from
      width: virtualTableWidth * .35,
      cellComponent: LogGroupDetailsTableRowCell,
      headerComponent: LogGroupDetailsTableHeaderCell
    },
    {
      display: 'Name',  // What will be displayed as the column header
      dataName: 'name',  // The key of a row to get the column's data from
      width: virtualTableWidth * .35,
      cellComponent: LogGroupDetailsTableRowCell,
      headerComponent: LogGroupDetailsTableHeaderCell
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
        rows={logGroupFiles} 
        columns={virtualTableColumns}
        on:onVirtualTableRowCellClick={(event) => {
          if (event.detail.columnIndex === 0) {
            dispatch('onTableLogGroupRowCellClick', { rowIndex: event.detail.rowIndex });
          }
        }}
      />
    </div>
  </div>
</Card>
