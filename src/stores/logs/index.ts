// node_modules
import { writable } from "svelte/store";
import { get as _get, assign } from 'lodash';

// libraries
import { _ } from '../../lib/utils';

// store specific
import { cachedLogsStoreState, initialLogsStoreState } from "./state";
import { LOGS_STORE_KEY } from "./keys";
import { createLogsStoreActions } from "./actions";
import { createLogsStoreThunks } from "./thunks";



function createLogsStore() {
  // get persisted item
  const storedLogsStore = JSON.parse(sessionStorage.getItem(LOGS_STORE_KEY));
  // create writable
  const _logsStore = writable(assign({}, initialLogsStoreState, _.isObject(storedLogsStore) ? storedLogsStore : {}));
  _logsStore.subscribe(value => {
    sessionStorage.setItem(LOGS_STORE_KEY, JSON.stringify(cachedLogsStoreState(value)));
  });
  // create actions
  const _logStoreActions = createLogsStoreActions(_logsStore);
  // create thunks
  const _logStoreThunks = createLogsStoreThunks(_logStoreActions);
  // return store
  return {
    update: _logsStore.update,
    subscribe: _logsStore.subscribe,
    reset: () => _logsStore.set(initialLogsStoreState),
    ..._logStoreActions,
    ..._logStoreThunks
  };
}

const logsStore = createLogsStore();

export { logsStore };
