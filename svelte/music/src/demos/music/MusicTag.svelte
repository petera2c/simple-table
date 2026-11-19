<script lang="ts">
  let {
    text,
    variant,
    c,
  }: {
    text: string;
    variant: "green" | "red" | "default";
    c: Record<string, string>;
  } = $props();

  const s = $derived.by(() => {
    const colorMap: Record<string, { bg: string; text: string; border?: string }> = {
      green: { bg: c.successBg, text: c.success },
      red: { bg: c.errorBg, text: c.error },
      default: { bg: c.tagBg, text: c.tagText, border: `1px solid ${c.tagBorder}` },
    };
    return colorMap[variant] || colorMap.default;
  });
</script>

<span
  style="background-color:{s.bg};color:{s.text};padding:0 7px;font-size:11px;line-height:20px;border-radius:4px;display:inline-block;{s.border
    ? `border:${s.border};`
    : ''}"
>{text}</span>
