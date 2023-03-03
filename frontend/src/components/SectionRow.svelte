<script lang="ts">
    export let height;
    let customClass = "";
    export { customClass as class };
</script>

<div class={`w-full
    flex flex-row items-stretch space-x-3
    ${customClass}`}
    style={`height: ${height}%`}>
    <slot />
</div>