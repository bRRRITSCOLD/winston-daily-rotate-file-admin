<script lang="ts">
import { map } from 'lodash';

  // node_modules
  import { onMount } from 'svelte';
  import Router, { location, push, querystring, link } from 'svelte-spa-router';

  // components
  import NavigationBar from "./components/UI/Navigation/NavigationBar.svelte";

  // routes
  import routes from './routes';

  // props

  // reactive vars/consts
  let splitLocation;
  $: splitLocation = $location.split('/');
  let navigationBarCrumbs = []
  $: navigationBarCrumbs = splitLocation
    .reduce((crumbs: any[], locationPart: string, locationPartIndex: number) => {
      if (
        locationPart !== ''
        && ['logs', 'details', 'search'].includes(locationPart)
      ) {
        crumbs.push({
          label: locationPart.toUpperCase(),
          link: splitLocation.slice(0, locationPartIndex + 1).join('/'),
          disabled: locationPartIndex + 1 === splitLocation.length
        });
      }
      return crumbs;
    }, []);

  onMount(() => {
    if ($location === '/') {
      push('/logs');
    }
    })
</script>

<div style="padding-bottom: 20px;">
  <NavigationBar crumbs={navigationBarCrumbs} />
</div>
<Router {routes}/>

<style>
  :global(.flex-box-column) {
    display: flex;
    flex-direction: column;
  }

  :global(.flex-box-row) {
    display: flex;
    flex-direction: row;
  }

  :global(.justify-content-space-around) {
    justify-content: space-around;
  }

  :global(.justify-content-center) {
    justify-content: center;
  }

  :global(.justify-content-flex-end) {
    justify-content: flex-end;
  }

  :global(.align-items-center) {
    align-items: center;
  }

  :global(.align-items-flex-end) {
    align-items: flex-end;
  }

  :global(.text-align-center) {
    text-align: center;
  }

  :global(.text-align-right) {
    text-align: right;
  }

  :global(.text-align-left) {
    text-align: left;
  }
</style>