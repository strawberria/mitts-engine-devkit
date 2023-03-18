<script lang="ts">
    import { recursiveCheckValid } from "../utilities/validation";
    import { createEventDispatcher } from "svelte";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import type { ProjectInteractionData } from "../utilities/typings";

    export let id: string;
    export let selected: boolean;
    export let data: ProjectInteractionData;
    let customClass: string;
    export { customClass as class };

    const dispatch = createEventDispatcher();
    function handleClick() { dispatch("dispatchClick", { id: id }); }

    let valid = false;
    function updateValid() {
        valid = recursiveCheckValid($bundleValidStore.interactions.interactions[id]); 
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
        <p class="text-left min-w-0 h-6 truncate">
            {data.devName}
        </p>
        <p class={`text-left min-w-0 text-sm truncate h-5
            ${selected === true ? "text-slate-400" : "text-slate-500"}`}>
            {#if data.actionID !== null}
                {@const componentText1 = data.componentIDs[0] === "anything"
                    ? "( anything )"
                    : data.componentIDs[0] !== null
                        ? `[${$projectStore.data[data.componentTypes[0]][data.componentIDs[0]]
                            [data.componentTypes[0] === "restraintLocations" 
                                ? "name" : "devName"]}]`
                        : ""}
                {@const componentText2 = data.componentIDs[1] === "anything"
                    ? "( anything )"
                    : data.componentIDs[1] !== null
                        ? `[${$projectStore.data[data.componentTypes[1]][data.componentIDs[1]]
                            [data.componentTypes[1] === "restraintLocations" 
                                ? "name" : "devName"]}]`
                        : ""}
                {$projectStore.data.actions[data.actionID].name}
                {data.componentIDs[0] !== null
                    ? data.componentIDs[1] !== null
                        ? ` ${componentText1} ${$projectStore.data.actions[data.actionID].verb} ${componentText2}`
                        : ` ${componentText1}`
                    : ""}
            {/if}
        </p>
    </div>
    <div class="grow" />
    <p class={`font-mono ${selected === true
        ? "text-slate-500"
        : "text-slate-600"}`}>
        {id}
    </p>
</div>

<style>
    /* .line-clamp {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical; 
        overflow: hidden;
        text-overflow: ellipsis;
    } */
</style>