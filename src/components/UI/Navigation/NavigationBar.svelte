<script lang="ts">
  import { Breadcrumbs } from 'svelte-materialify/dist';
  import { link } from 'svelte-spa-router'

  // props
  export let crumbs: { label: string; link: string; disabled: boolean; }[] = [];
</script>

<Breadcrumbs items={crumbs} let:item>
  {#if item.link}
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="s-breadcrumb-item" use:link={item.link} class:disabled={item.disabled}>
      {item.label.toUpperCase()}
    </a>
  {:else}
    <span class="s-breadcrumb-item" class:disabled={item.disabled}>
      {item.label.toUpperCase()}
    </span>
  {/if}
</Breadcrumbs>
