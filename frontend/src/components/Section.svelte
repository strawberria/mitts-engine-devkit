<script lang="ts">
    export let height = null;
    export let width = null;
    export let label = "";
    let customClass: string = "";
    export let innerClass: string = "";
    export { customClass as class };
</script>

<div class={`w-full
    flex flex-col items-center space-y-1
    pb-2 pl-3 pr-3 pt-2 rounded
    bg-slate-800
    ${customClass}
    ${height === null && width === null ? "grow" : ""}`}
    style={(width !== null ? `width: ${width}%;` : "")
        + (height !== null ? `height: ${height}%;` : "")}>
    {#if label !== ""}
        <div class="flex flex-row w-full
            select-none
            mb-2 mt-1 pl-4 pr-4">
            <p class={`text-xl ${$$slots.header ? "" : "w-full"}`}>{label}</p>
            <div class="grow" />
            <slot name="header" />
        </div>
    {/if}
    <div class={`w-full space-y-2 ${innerClass}`}>
        <slot name="content" />
    </div>
</div>