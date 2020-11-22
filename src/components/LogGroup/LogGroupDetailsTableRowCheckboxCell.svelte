
<script>
  import Checkbox from 'svelte-materialify/src/components/Checkbox';

  export let data;
  export let dataName;

  let checked;
  $: checked = data[dataName] ? data[dataName] : false;

  function change() {
    if (data[dataName]) {
      checked = true;
    } else {
      checked = false;
    }
  }

  let background = 'white'
</script>

<div
  class="d-flex justify-center"
  style="height: 100%; width: 100%; background: {background}; cursor: pointer;"
  on:mouseover={() => { background = 'lightgray' }}
  on:mouseleave={() => { background = 'white' }}
>
  <Checkbox bind:checked={checked} on:change={change} on:change></Checkbox>
</div>

<style>
</style>
  