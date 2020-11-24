<script lang="ts">
  // node_modules
  import { querystring } from 'svelte-spa-router';
  import qs from 'qs';
  import { onMount } from 'svelte';
    import { Snackbar, Button } from 'svelte-materialify/src';

  // libraries
  import { _ } from '../lib/utils';

  // models
  import type { LogGroup } from '../models/logs';

  // components
  import LogGroupSearchTable from '../components/LogGroup/LogGroupSearchTable.svelte';

  // stores
  import { logsStore } from '../stores/logs';

  // props
  export let params: any = {};

  // reactive vars
  let parsedQuerystring;
  $: parsedQuerystring = qs.parse($querystring);

  let logGroup: LogGroup;
  $: logGroup = $logsStore.logGroups.find((logGroup) => logGroup.logGroupId === params.logGroupId);

  let selectedLogGroupFiles = [];
  $: selectedLogGroupFiles = _.get($logsStore.logGroups.find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', []).filter((logGroupFile) => parsedQuerystring.logGroupFileIds.split(',').includes(logGroupFile.logGroupFileId));
  
  // reactive vars
  let logGroupFileMessageFilter = '';
  $: logGroupFileMessageFilter;

  let filteredLogGroups;
  $: {
    const logGroupFilesData = _.get($logsStore.logGroups.find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', []).filter((logGroupFile) => parsedQuerystring.logGroupFileIds.split(',').includes(logGroupFile.logGroupFileId)).filter((selectedLogGroupFile) => selectedLogGroupFile.data !== undefined);
    filteredLogGroups = logGroupFileMessageFilter === ''
    ? logGroupFilesData
    : logGroupFilesData.map((parsedLogGroupFile) => {
      const copy = _.assign({}, parsedLogGroupFile);
      const data = _.flatten(copy.data.filter((data) => data.message.toString().indexOf(logGroupFileMessageFilter) > -1));
      copy.data = data;
      return copy;
    });
  }
  // handlers

  // lifecycles
  onMount(async () => {
    console.log('$logsStore.isParsingLogGroupFiles', $logsStore.isParsingLogGroupFiles)
    if (logGroup) {
      await logsStore.parseLogGroupFiles(
        _.assign(
          {},
          logGroup,
          {
            files: selectedLogGroupFiles
          }
        )
      );
    }
  });
</script>

<Snackbar style="background: red; top: -10px;" class="justify-space-between" active={$logsStore.parseLogGroupFilesError} top center>
  {_.get($logsStore.parseLogGroupFilesError, 'message')}
  <Button
    text
    on:click={() => {
      logsStore.setParseLogGroupFilesError(undefined);
    }}>
    Dismiss
  </Button>
</Snackbar>

<main style="width: 100%;">
  <div class="flex-box-column">
    {#if $logsStore.isParsingLogGroupFiles}
      <div>LOADING.....</div>
    {:else}
      <LogGroupSearchTable
        on:onApplyButtonClick={(event) => {
          logGroupFileMessageFilter = event.detail.replaceAll('“', '"').replaceAll('”', '"');
        }}
        logGroupFiles={filteredLogGroups}
      />
    {/if}
  </div>
</main>


<style></style>
