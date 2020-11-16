<script lang="ts">
  // node_modules
  import * as _ from 'lodash';
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
  export let logGroupFiles: any[] = [];

  // file constants
  const dispatch = createEventDispatcher();
  
  let virtualTableWidth = 0;
  let filter = '';

  let virtualTableColumns = [];
  // $: virtualTableColumns = [
  //   {
  //     display: 'Level',  // What will be displayed as the column header
  //     dataName: 'level',  // The key of a row to get the column's data from
  //     width: virtualTableWidth * .20,
  //     cellComponent: LogGroupDetailsTableRowDefaultCell,
  //     headerComponent: LogGroupDetailsTableHeaderCell
  //   },
  //   {
  //     display: 'Message',  // What will be displayed as the column header
  //     dataName: 'message',  // The key of a row to get the column's data from
  //     width: virtualTableWidth * .80,
  //     cellComponent: LogGroupDetailsTableRowDefaultCell,
  //     headerComponent: LogGroupDetailsTableHeaderCell
  //   }
  // ];
  $: virtualTableColumns = [
    {
      display: 'Message',  // What will be displayed as the column header
      dataName: 'message',  // The key of a row to get the column's data from
      width: virtualTableWidth,
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
      style="height: calc(100vh - 15em); min-height: 200px; width: calc(100vw - 2em); padding-top: 10px;"
      use:watchResize={(node) => {
        virtualTableWidth = node.clientWidth;
      }}
    >
      <VirtualTable
        rowHeight={50}
        rows={_.flatten(logGroupFiles.map((logGroupFile) => logGroupFile.data))} 
        columns={virtualTableColumns}
      />
    </div>
  </div>
</Card>
