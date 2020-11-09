<script lang="ts">
  // node_modules
  import { push } from 'svelte-spa-router'

  // components
  import LogGroups from '../components/LogGroups/LogGroupsTable.svelte';

  // stores
  import { logsStore } from '../stores/logs';

  // props
  export let params: any = {};
</script>

<main>
  <div class="flex-box-column">
    <LogGroups
      logGroups={$logsStore.logGroups}
      on:onAddButtonClick={async () => {
        await logsStore.addLogGroups();
      }}
      on:onTableLogGroupRowCellClick={(event) => {
        // find the log audit file clicked on
        const clickedLogAudigFile = $logsStore.logGroups[event.detail.rowIndex];
        console.log(clickedLogAudigFile)
        // route to correct details page
        push(`/log-groups/${clickedLogAudigFile.id}/details`);
      }}
    />
  </div>
</main>


<style></style>
