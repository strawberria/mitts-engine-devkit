<script lang="ts">
    export let height = null;
    export let width = null;
    export let label = "";
    let customClass: string = "";
    export let customStyle: string = "";
    export let innerClass: string = "";
    export { customClass as class, customStyle as style };
</script>

<div class={`w-full
    flex flex-col items-center space-y-1
    pb-3 pl-3 pr-3 pt-2 rounded-md
    bg-slate-800
    ${customClass}
    ${height === null && width === null && customStyle === "" ? "grow" : ""}`}
    style={`${customStyle}; ` + (width !== null ? `width: ${width}%;` : "")
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
    <div class={`w-full space-y-2 text-slate-400 ${innerClass}`}>
        <slot name="content" />
    </div>
</div>