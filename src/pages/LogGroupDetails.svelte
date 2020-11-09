<!-- <script lang="ts">
  // node_modules
  import { push } from 'svelte-spa-router'

  // components
  import LogDirectoryDetailsTable from '../components/LogDirectory/LogDirectoryDetailsTable.svelte';

  // stores
  import { logsStore } from '../stores/logs';

  // props
  export let params: any = {};
</script>

<main>
  <div class="flex-box-column">
    <LogDirectoryDetailsTable
      logDirectoryFiles={$logsStore.logGroups}
      on:onTableSelectedRowCellClick={(event) => {
        // find the log audit file clicked on
        const clickedLogAudigFile = $logsStore.logGroups[event.detail.rowIndex];
        console.log(clickedLogAudigFile)
        // route to correct details page
        push(`/logs/${clickedLogAudigFile.id}/details`);
      }}
    />
  </div>
</main>


<style></style> -->
