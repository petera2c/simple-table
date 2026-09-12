<script lang="ts">
import { defineComponent, h } from "vue";
import type { ColumnEditorRowRendererProps } from "@simple-table/vue";

export default defineComponent({
  name: "ColumnEditorCustomRow",
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 8px",
            borderRadius: "6px",
            background: "#f8fafc",
            marginBottom: "4px",
          },
        },
        [
          props.components.checkbox != null
            ? h("span", null, [props.components.checkbox as object])
            : null,
          h(
            "span",
            { style: { flex: "1", fontSize: "13px", fontWeight: "500" } },
            props.header.label,
          ),
          props.components.dragIcon != null
            ? h(
                "span",
                { style: { cursor: "grab", opacity: "0.5" } },
                [props.components.dragIcon as object],
              )
            : null,
        ].filter(Boolean),
      );
  },
});
</script>
