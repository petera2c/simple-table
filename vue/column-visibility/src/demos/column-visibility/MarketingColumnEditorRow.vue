<script lang="ts">
import { defineComponent, h } from "vue";
import type { ColumnEditorRowRendererProps } from "@simple-table/vue";

export default defineComponent({
  name: "MarketingColumnEditorRow",
  props: {
    header: { type: Object, required: true },
    components: { type: Object, required: true },
  },
  setup(props: ColumnEditorRowRendererProps) {
    return () =>
      h(
        "div",
        {
          style: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            paddingRight: "8px",
          },
        },
        [
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
              },
            },
            [
              props.components.expandIcon,
              props.components.checkbox,
              props.components.labelContent,
            ].filter((v) => v != null && v !== false),
          ),
          h(
            "div",
            { style: { display: "flex", alignItems: "center" } },
            [props.components.dragIcon].filter((v) => v != null && v !== false),
          ),
        ],
      );
  },
});
</script>
