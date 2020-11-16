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
  $: logGroup = $logsStore.logGroups.slice().find((logGroup) => logGroup.logGroupId === params.logGroupId);
  // $: console.log(logGroup);

  let logGroupFiles = [];
  $: logGroupFiles = _.get(logGroup, 'files', []);
  // $: console.log(logGroupFiles);

  let selectedLogGroupFiles = [];
  $: selectedLogGroupFiles = logGroupFiles.filter((logGroupFile) => parsedQuerystring.logGroupFileIds.split(',').includes(logGroupFile.logGroupFileId));
  // $: console.log(selectedLogGroupFiles);

  let parsedLogGroupFiles: any[];
  $: parsedLogGroupFiles = selectedLogGroupFiles.filter((selectedLogGroupFile) => selectedLogGroupFile.data !== undefined);
  
  // reactive vars
  let logGroupFileMessageFilter = '';
  $: logGroupFileMessageFilter;

  let filteredLogGroups;
  $: filteredLogGroups = logGroupFileMessageFilter === ''
    ? parsedLogGroupFiles
    : parsedLogGroupFiles.map((parsedLogGroupFile) => {
      console.log('logGroupFileMessageFilter=', logGroupFileMessageFilter)
      const data = _.flatten(parsedLogGroupFile.data.filter((data) => data.message.includes(logGroupFileMessageFilter)));
      parsedLogGroupFile.data = data;
      return parsedLogGroupFile;
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
        logGroupFileMessageFilter = event.detail;
      }}
      logGroupFiles={filteredLogGroups}
    />
  </div>
</main>


<style></style>

<!-- <script>
  $: {
    rows = sourceDefinition.fetch(sortBy, sortAsc, search, query);
    console.log('Updated rows:', rows);
  };
</script>

{#await rows}
  Loading...
{:then resolvedRows}
  <DataTable {columns} rows={resolvedRows} />
{:catch error}
  <p class="text-red-500">{error.message}</p>
{/await} -->


<!-- 
// first find the log file
const foundLogFile = logFiles.find((logFile) => logFile.hash === hash);
// only act if file is found
if (foundLogFile) {
  // depending on if the file is gzipped or not
  // then act accordingly
  let splitReadLogFile: any[];
  // depending on if the item is gzipped
  // or not then act accordingly
  if (foundLogFile.path?.includes('.gz')) {
    console.log('gzipped file');
    const readLogFile: string = await tauri.promisified({
      cmd: 'readParseLogFiles',
      argument: foundLogFile?.path
    });
    splitReadLogFile = readLogFile
      .split('\n')
      .filter((item: string) => item.length > 0)
      .map((item: string) => JSON.parse(item));
  } else {
    console.log('non-gzipped file');
    const readLogFile = await tauriFs.readTextFile(foundLogFile?.path as string);
    splitReadLogFile = readLogFile
      .split('\n')
      .filter((item: string) => item.length > 0)
      .map((item: string) => JSON.parse(item))
      .map((logFileItem: any) => {
        return logFileItem
      });
  }
  console.log('splitReadLogFile=', splitReadLogFile);
  // find the file and replace it in the current log audit file
  logAuditFile?.replaceLogFile({ hash }, assign({}, foundLogFile, { data: splitReadLogFile }));
  // update the stored logAuditFile
  logsStoreActions.replaceLogAuditFile(logAuditFile);
} else {
  console.log('log file not found');
} -->