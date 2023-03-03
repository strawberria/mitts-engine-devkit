<script lang="ts">
    export let width = null;
    let customClass = "";
    export { customClass as class };
</script>

<div class={`h-full
    flex flex-col items-stretch space-y-3
    ${customClass} ${width === null ? "grow" : ""}`}
    style={width != null
        ? `width: ${width}%` : ""}>
    <slot />
</div>