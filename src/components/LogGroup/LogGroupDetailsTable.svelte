<script lang="ts">
  // node_modules
  import { watchResize } from "svelte-watch-resize";
  import { Button, TextField, Card } from 'svelte-materialify/src';
  import { createEventDispatcher } from 'svelte';

  // libraries

  // models

  // components
  import LogGroupDetailsTableRowDefaultCell from './LogGroupDetailsTableRowDefaultCell.svelte';
  import LogGroupDetailsTableRowCheckboxCell from "./LogGroupDetailsTableRowCheckboxCell.svelte";
  import LogGroupDetailsTableRowDateCell from "./LogGroupDetailsTableRowDateCell.svelte";
  import LogGroupDetailsTableHeaderCell from './LogGroupDetailsTableHeaderCell.svelte';
	import VirtualTable from '../UI/Table/VirtualTable.svelte';

  // props
  export let logGroupFiles: { selected?: boolean; date: number | string; name: string; hash: string }[] = [];

  // file constants
  const dispatch = createEventDispatcher();
  
  let virtualTableWidth = 0;
  let filter = '';


  let virtualTableColumns = [];
  $: virtualTableColumns = [
    {
      display: 'Selected',  // What will be displayed as the column header
      dataName: 'selected',  // The key of a row to get the column's data from
      width: virtualTableWidth * .10,
      cellComponent: LogGroupDetailsTableRowCheckboxCell,
      headerComponent: LogGroupDetailsTableHeaderCell
    },
    {
      display: 'Date',  // What will be displayed as the column header
      dataName: 'date',  // The key of a row to get the column's data from
      width: virtualTableWidth * .20,
      cellComponent: LogGroupDetailsTableRowDateCell,
      headerComponent: LogGroupDetailsTableHeaderCell
    },
    // {
    //   display: 'Hash',  // What will be displayed as the column header
    //   dataName: 'hash',  // The key of a row to get the column's data from
    //   width: virtualTableWidth * .35,
    //   cellComponent: LogGroupDetailsTableRowDefaultCell,
    //   headerComponent: LogGroupDetailsTableHeaderCell
    // },
    {
      display: 'Name',  // What will be displayed as the column header
      dataName: 'name',  // The key of a row to get the column's data from
      width: virtualTableWidth * .70,
      cellComponent: LogGroupDetailsTableRowDefaultCell,
      headerComponent: LogGroupDetailsTableHeaderCell
    }
  ];
</script>

<Card>
  <div class="d-flex flex-row justify-end" style="padding-top: 10px;">
    <div style="padding-right: 10px; padding-left: 10px; width: 90%;">
      <TextField bind:value="{filter}">Filter</TextField>
    </div>
    <div class="text-align-right" style="padding-right: 10px; padding-left: 10px;">
      <Button on:click={() => {
        dispatch('onApplyButtonClick', filter);
      }} class="primary-color">Apply</Button>
    </div>
  </div>
  <div class="fd-flex flex-row justify-space-around">
    <div
      style="height: calc(100vh - 15em); min-height: 200px; width: 100%;padding-top: 10px;"
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
            dispatch('onTableRowSelectedCellClick', { rowIndex: event.detail.rowIndex });
          }
        }}
      />
    </div>
  </div>
  <div class="d-flex flex-row justify-end" style="padding-top: 10px; padding-right: 10px; padding-left: 10px; width: 100%;">
      <Button on:click={() => {
        dispatch('onSearchButtonClick', true);
      }} class="primary-color">Search</Button>
  </div>
</Card>
