<script>
  import Button from 'svelte-materialify/src/components/Button';
  import Icon from 'svelte-materialify/src/components/Icon';
  import { mdiDelete } from '@mdi/js';
</script>


<div class="d-flex flex-row justify-center" >
  <Button on:click fab size="x-small" class="red white-text">
    <Icon path={mdiDelete} />
  </Button>
</div>