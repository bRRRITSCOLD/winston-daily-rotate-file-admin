<script lang="ts">
  // node_modules
  import { watchResize } from "svelte-watch-resize";
  import { Button, TextField, Card } from 'svelte-materialify/src';
  import { createEventDispatcher } from 'svelte';

  // libraries

  // models

  // components
  import LogDirectoriesRowCell from './LogDirectoriesTableRowCell.svelte';
  import LogDirectoriesHeaderCell from './LogsDirectoriesTableHeaderCell.svelte';
	import VirtualTable from '../UI/Table/VirtualTable.svelte';

  // props
  export let logDirectories: { id: string; directory: string }[] = [];

  // file constants
  const dispatch = createEventDispatcher();
  
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

  let applyFilterButtonRef;
  let applyFilterButtonWidth;
  $: if (applyFilterButtonRef && applyFilterButtonRef.clientWidth) applyFilterButtonWidth = applyFilterButtonRef.clientWidth;

  let filterRowRef;
  let filterRowWidth;
  $: if (filterRowRef && filterRowRef.clientWidth) filterRowWidth = filterRowRef.clientWidth;

</script>

<Card bind:this={filterRowRef}>
  <div class="flex-box-row justify-content-flex-end" style="padding-top: 10px;">
    <div style="padding-right: 10px; padding-left: 10px; width: 90%;">
      <TextField>Filter</TextField>
    </div>
    <div class="text-align-right" style="padding-right: 10px; padding-left: 10px;">
      <Button bind:this={applyFilterButtonRef} class="primary-color">Apply Filter</Button>
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
        rows={logDirectories} 
        columns={virtualTableColumns}
        on:onVirtualTableRowCellClick={(event) => {
          if (event.detail.columnIndex === 0) {
            dispatch('onTableDirectoryRowCellClick', { rowIndex: event.detail.rowIndex });
          }
        }}
      />
    </div>
  </div>
  <div class="flex-box-row justify-content-flex-end" style="padding-top: 10px; padding-right: 10px; padding-left: 10px; width: 100%;">
      <Button on:click={() => {
        dispatch('onAddDirectoryButtonClick', true);
      }} class="primary-color">Add Directory</Button>
  </div>
</Card>


<!-- <script>
  import {
    Card,
    CardTitle,
    CardSubtitle,
    CardActions,
    Button,
    Icon,
    Divider,
  } from 'svelte-materialify/src';
  import { slide } from 'svelte/transition';

  let active = false;
  function toggle() {
    active = !active;
  }
</script>

<div class="d-flex justify-center mt-4 mb-4">
  <Card style="max-width:350px;">
    <img src="//picsum.photos/350" alt="background" />
    <CardTitle>Top western road trips</CardTitle>
    <CardSubtitle>1,000 miles of wonder</CardSubtitle>
    <CardActions>
      <Button text>Button</Button>
      <Button text fab size="small" class="ml-auto" on:click={toggle}>
        <Icon class="mdi mdi-chevron-down" rotate={active ? 180 : 0} />
      </Button>
    </CardActions>
    {#if active}
      <Divider />
      <div transition:slide class="pl-4 pr-4 pt-2 pb-2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita autem,
        asperiores dolores, doloremque ea atque suscipit dolore, ut adipisci amet possimus
        dicta at voluptas consequatur!
      </div>
    {/if}
  </Card>
</div> -->