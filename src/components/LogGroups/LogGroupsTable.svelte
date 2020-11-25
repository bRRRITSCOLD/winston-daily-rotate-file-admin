<script lang="ts">
  // node_modules
  import { watchResize } from "svelte-watch-resize";
  import { Button, TextField, Card } from 'svelte-materialify/src';
  import { createEventDispatcher } from 'svelte';

  // libraries

  // models

  // components
  import LogGroupsRowCell from './LogGroupsTableRowCell.svelte';
  import LogGroupsTableRowDeleteCell from "./LogGroupsTableRowDeleteCell.svelte";
  import LogGroupsHeaderCell from './LogGroupsTableHeaderCell.svelte';
	import VirtualTable from '../UI/Table/VirtualTable.svelte';

  // props
  export let logGroups: { logGroupId: string; auditLog: string }[] = [];

  // file constants
  const dispatch = createEventDispatcher();
  
  let virtualTableWidth = 0;
  let filter = '';

  let virtualTableColumns = [];
  $: virtualTableColumns = [
    {
      display: 'Delete',  // What will be displayed as the column header
      dataName: 'delete',  // The key of a row to get the column's data from
      width: virtualTableWidth * .15,
      cellComponent: LogGroupsTableRowDeleteCell,
      headerComponent: LogGroupsHeaderCell
    },
    {
      display: 'Log Group',  // What will be displayed as the column header
      dataName: 'auditLog',  // The key of a row to get the column's data from
      width: virtualTableWidth * .85,
      cellComponent: LogGroupsRowCell,
      headerComponent: LogGroupsHeaderCell
    }
  ];
</script>

<Card>
  <div class="d-flex flex-row justify-end" style="padding-top: 25px;">
    <div style="padding-right: 10px; padding-left: 10px; width: 90%;">
      <TextField bind:value="{filter}">Filter</TextField>
    </div>
    <div class="text-align-right" style="padding-right: 10px; padding-left: 10px;">
      <Button on:click={() => {
        dispatch('onApplyButtonClick', filter);
      }} class="primary-color">Apply</Button>
    </div>
  </div>
  <div class="d-flex flex-row justify-space-around">
    <div
      style="height: calc(100vh - 15em); min-height: 200px; width: 100%;padding-top: 10px;"
      use:watchResize={(node) => {
        virtualTableWidth = node.clientWidth;
      }}
    >
      <VirtualTable
        rowHeight={50}
        rows={logGroups} 
        columns={virtualTableColumns}
        on:onVirtualTableRowCellComponentClick={(event) => {
          if (event.detail.columnIndex === 0) {
            dispatch('onTableRowDeleteCellComponentClick', { rowIndex: event.detail.rowIndex });
          }
        }}
        on:onVirtualTableRowCellClick={(event) => {
          if (event.detail.columnIndex === 1) {
            dispatch('onTableRowLogGroupCellClick', { rowIndex: event.detail.rowIndex });
          }
        }}
      />
    </div>
  </div>
  <div class="d-flex flex-row justify-end" style="padding-top: 10px; padding-right: 10px; padding-left: 10px; width: 100%;">
    <Button
      on:click={() => {
        dispatch('onAddButtonClick', true);
      }}
      class="primary-color"
    >
      Add
    </Button>
  </div>
</Card>
