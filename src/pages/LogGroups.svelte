<script lang="ts">
  import { onMount } from 'svelte';
  
    // node_modules
    import { push } from 'svelte-spa-router'
  
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
</script>

<main>
  <div class="flex-box-column">
    <LogGroupsTable
      logGroups={$logsStore.logGroups}
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
