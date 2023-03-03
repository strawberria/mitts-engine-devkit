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
    pb-3.5 pl-3 pr-3 pt-2 rounded
    bg-slate-800
    ${customClass}
    ${height === null && width === null ? "grow" : ""}`}
    style={(width !== null ? `width: ${width}%;` : "")
        + (height !== null ? `height: ${height}%;` : "")}>
    <div class="flex flex-row space-x-6 mb-2 mt-1">
        <p class="w-full text-xl">{label}</p>
        <slot name="header" />
    </div>
    <div class={`w-full space-y-2 ${innerClass}`}>
        <slot name="content" />
    </div>
</div>