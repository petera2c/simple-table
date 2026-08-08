<script lang="ts">
  import StatefulHeader from "./StatefulHeader.svelte";
  import type { HeaderRendererProps } from "../../index";

  // Thin pass-through used when columns rebuild with a new component identity.
  let props: HeaderRendererProps = $props();
</script>

<StatefulHeader {...props} />
