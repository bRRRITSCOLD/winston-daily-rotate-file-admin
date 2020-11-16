<script lang="ts">
    // node_modules
    import { push } from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import FuzzySearch from 'fuzzy-search';
  
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
      : $logsStore.logGroups.filter((logGroup) => logGroup.auditLog.includes(logGroupFilter));
</script>

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
