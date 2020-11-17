<script lang="ts">
  // node_modules
  import { querystring } from 'svelte-spa-router';
  import qs from 'qs';
  import { onMount } from 'svelte';

  // libraries
  import { _ } from '../lib/utils';

  // models
  import type { AnyObject, LogGroup, LogGroupFile } from '../models';

  // components
  import LogGroupDetailsTable from '../components/LogGroup/LogGroupDetailsTable.svelte';

  // stores
  import { logsStore } from '../stores/logs';
import LogGroupSearchTable from '../components/LogGroup/LogGroupSearchTable.svelte';

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
  $: filteredLogGroups = logGroupFileMessageFilter === ''
    ? _.get($logsStore.logGroups.find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', []).filter((logGroupFile) => parsedQuerystring.logGroupFileIds.split(',').includes(logGroupFile.logGroupFileId)).filter((selectedLogGroupFile) => selectedLogGroupFile.data !== undefined)
    : _.get($logsStore.logGroups.find((logGroup) => logGroup.logGroupId === params.logGroupId), 'files', []).filter((logGroupFile) => parsedQuerystring.logGroupFileIds.split(',').includes(logGroupFile.logGroupFileId)).filter((selectedLogGroupFile) => selectedLogGroupFile.data !== undefined).map((parsedLogGroupFile) => {
      console.log('logGroupFileMessageFilter=', logGroupFileMessageFilter)
      console.log('parsedLogGroupFile.data=', parsedLogGroupFile.data)
      const copy = _.assign({}, parsedLogGroupFile);
      const data = _.flatten(copy.data.filter((data) => {
        const index = data.message.toString().indexOf(logGroupFileMessageFilter);
        console.log('index=', index)
        return index > -1
      }));
      copy.data = data;
      return copy;
    });
  // handlers

  // lifecycles
  onMount(async () => {
    if (logGroup) {
      // console.log(selectedLogGroupFiles.map((selectedLogGroupFile) => `${logGroup.directoryPath}/${selectedLogGroupFile.name.split('/').slice(-1)[0]}`));
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

<main style="width: 100%;">
  <div class="flex-box-column">
    <LogGroupSearchTable
      on:onApplyButtonClick={(event) => {
        logGroupFileMessageFilter = event.detail.replaceAll('“', '"').replaceAll('”', '"');
      }}
      logGroupFiles={filteredLogGroups}
    />
  </div>
</main>


<style></style>
