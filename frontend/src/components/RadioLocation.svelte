<script lang="ts">
    import { recursiveCheckValid } from "../utilities/validation";
    import { createEventDispatcher } from "svelte";
    import { bundleValidStore } from "../utilities/project";
    import type { ProjectLocationData } from "../utilities/typings";

    export let id: string;
    export let selected: boolean;
    export let data: ProjectLocationData;
    let customClass: string;
    export { customClass as class };

    const dispatch = createEventDispatcher();
    function handleClick() { dispatch("dispatchClick", { id: id }); }

    let valid = false;
    bundleValidStore.subscribe(_ => { 
        valid = recursiveCheckValid($bundleValidStore.locations.locations[id]); 
    });
</script>

<div class={`flex flex-row space-x-1
    rounded border items-center
    p-2 pl-4 pr-4
    ${customClass} ${selected === true
        ? ("text-slate-300 bg-slate-700 " + (valid 
            ? "border-slate-500" : "border-red-700"))
        : ("text-slate-400 bg-slate-750 " + (valid
            ? "border-slate-600" : "border-red-900"))}`}
    on:click={handleClick}>
    <div class="flex flex-col w-full">
        <div class="flex flex-row items-center">
            <p class="w-4 text-left font-bold font-mono">{data.initial ? "I" : ""}</p>
            <p class="text-left w-11/12 min-w-0 truncate h-6">
                {data.devName}
            </p>
        </div>
        <p class={`text-left text-sm w-11/12 min-w-0 truncate h-5
            ${selected === true ? "text-slate-400" : "text-slate-500"}`}>
            {data.name}
        </p>
    </div>
    <div class="grow" />
    <p class={`font-mono ${selected === true
        ? "text-slate-500"
        : "text-slate-600"}`}>
        {id}
    </p>
</div>