<script lang="ts">
    import { recursiveCheckValid } from "../utilities/validation";
    import { createEventDispatcher } from "svelte";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import type { ProjectRestraintData } from "../utilities/typings";

    export let id: string;
    export let selected: boolean;
    export let data: ProjectRestraintData;
    let customClass: string;
    export { customClass as class };

    const dispatch = createEventDispatcher();
    function handleClick() { dispatch("dispatchClick", { id: id }); }

    let valid = false;
    function updateValid() {
        valid = recursiveCheckValid($bundleValidStore.restraints.restraints[id]); 
    }
    bundleValidStore.subscribe(updateValid);
    $: { id; data; updateValid(); }
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
    <div class="flex flex-col min-w-0">
        <p class="text-left truncate h-6">
            {data.devName}
        </p>
        <p class={`text-left text-sm truncate h-5
            ${selected === true ? "text-slate-400" : "text-slate-500"}`}>
            {data.restraintLocationID !== null
                ? $projectStore.data.restraintLocations[data.restraintLocationID].name
                : ""}
        </p>
    </div>
    <div class="grow" />
    <p class={`font-mono ${selected === true
        ? "text-slate-500"
        : "text-slate-600"}`}>
        {id}
    </p>
</div>