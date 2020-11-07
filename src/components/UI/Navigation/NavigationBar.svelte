<script>
  import Breadcrumbs from 'svelte-materialify/src/components/Breadcrumbs/Breadcrumbs.svelte';

  const items = [
    { text: 'Dashboard', href: '/components/breadcrumbs/' },
    { text: 'Link 1', href: '/components/breadcrumbs/' },
    { text: 'Link 2', disabled: true },
  ];
</script>

<Breadcrumbs {items} let:item>
  {#if item.href}
    <a class="s-breadcrumb-item" href={item.href} class:disabled={item.disabled}>
      {item.text.toUpperCase()}
    </a>
  {:else}
    <span class="s-breadcrumb-item" class:disabled={item.disabled}>
      {item.text.toUpperCase()}
    </span>
  {/if}
</Breadcrumbs>
<!-- <script lang="ts">
  // node_modules
  import { link, location, querystring } from 'svelte-spa-router'

  // components

  // reactive vars/consts
  let splitLocation;
  $: splitLocation = $location.split('/');

  // props
  export let params: any = {};
</script>

<style>

</style>


<nav class="flex-box-row">
  {#each splitLocation as urlPart, urlParIndex}
    {#if urlPart === 'logs'}
      {#if urlParIndex + 1 === splitLocation.length}
        <a style="text-decoration: none; pointer-events: none; color: gray;">Logs</a>
      {:else}
        <a use:link="{`/logs${urlParIndex + 1 !== splitLocation.length && $querystring ? `?${$querystring}` : ''}`}">Logs</a>
      {/if}
      {#if urlParIndex + 1 !== splitLocation.length}<div style="padding-left: 10px; padding-right: 10px;">/</div>{/if}
    {:else if urlPart === 'details'}
      {#if urlParIndex + 1 === splitLocation.length}
        <a style="text-decoration: none; pointer-events: none; color: gray;">Details</a>
      {:else}
        <a use:link="{`/logs/${params.logId}/details${urlParIndex + 1 !== splitLocation.length && $querystring ? `?${$querystring}` : '' }`}">Details</a>
      {/if}
      {#if urlParIndex + 1 !== splitLocation.length}<div style="padding-left: 10px; padding-right: 10px;">/</div>{/if}
    {:else if urlPart === 'search'}
      {#if urlParIndex + 1 === splitLocation.length}
        <a style="text-decoration: none; pointer-events: none; color: gray;">Search</a>
      {:else}
        <a use:link="{`/logs/${params.logId}/search${urlParIndex + 1 !== splitLocation.length && $querystring ? `?${$querystring}` : '' }`}">Search</a>
      {/if}
      {#if urlParIndex + 1 !== splitLocation.length}<div style="padding-left: 10px; padding-right: 10px;">/</div>{/if}
    {/if}
  {/each}
</nav> -->