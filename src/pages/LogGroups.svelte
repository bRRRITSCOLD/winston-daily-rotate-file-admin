<script lang="ts">
    // node_modules
    import { push } from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import { Snackbar, Button } from 'svelte-materialify/src';
  
    // libraries
    import { _ } from '../lib/utils';

    // components
    import LogGroupsTable from '../components/LogGroups/LogGroupsTable.svelte';
  
    // stores
    import { logsStore } from '../stores/logs';
  
    // props
    export let params: any = {};
  
    // life cycles
    onMount(() => {
      console.log($logsStore.logGroups)
    });

    // reactive vars
    let logGroupFilter = '';
    $: logGroupFilter;

    let filteredLogGroups;
    $: filteredLogGroups = logGroupFilter === ''
      ? $logsStore.logGroups
      : $logsStore.logGroups.filter((logGroup) => logGroup.auditLog.toString().indexOf(logGroupFilter) > -1);

    let addLogGroupsError;
    $: addLogGroupsError = $logsStore.addLogGroupsError;
</script>


<Snackbar style="background: red; top: -10px;" class="justify-space-between" bind:active={addLogGroupsError} top center>
  {_.get(addLogGroupsError, 'message')}
  <Button
    text
    on:click={() => {
      logsStore.setAddLogGroupError(undefined);
    }}>
    Dismiss
  </Button>
</Snackbar>

<main>
  <div class="d-flex flex-column">
    <LogGroupsTable
      logGroups={filteredLogGroups}
      on:onApplyButtonClick={(event) => {
        logGroupFilter = event.detail;
      }}
      on:onAddButtonClick={async () => {
        await logsStore.addLogGroups();
      }}
      on:onTableRowLogGroupCellClick={(event) => {
        // find the log audit file clicked on
        const clickedLogAudigFile = $logsStore.logGroups[event.detail.rowIndex];
        console.log(clickedLogAudigFile)
        // route to correct details page
        push(`/log-groups/${clickedLogAudigFile.logGroupId}/details`);
      }}
    />
  </div>
</main>


<style></style>
