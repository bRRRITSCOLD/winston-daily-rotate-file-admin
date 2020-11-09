<script lang="ts">
  // node_modules
  import { push } from 'svelte-spa-router'

  // components
  import LogDirectoriesTable from '../components/LogDirectories/LogDirectoriesTable.svelte';

  // stores
  import { logsStore } from '../stores/logs';

  // props
  export let params: any = {};
</script>

<main>
  <div class="flex-box-column">
    <LogDirectoriesTable
      logDirectories={$logsStore.logAuditFiles}
      on:onAddDirectoryButtonClick={async () => {
        await logsStore.addLogDirectory();
      }}
      on:onTableDirectoryRowCellClick={(event) => {
        // find the log audit file clicked on
        const clickedLogAudigFile = $logsStore.logAuditFiles[event.detail.rowIndex];
        console.log(clickedLogAudigFile)
        // route to correct details page
        push(`/logs/${clickedLogAudigFile.id}/details`);
      }}
    />
  </div>
</main>


<style></style>
