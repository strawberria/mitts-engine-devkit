<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { SelectorMultipleData } from "../utilities/typings";

    export let selectedIDs: string[];
    export let selectorMultipleData: SelectorMultipleData[];
    
    const dispatch = createEventDispatcher();
    function forward(event: any) { dispatch("dispatchClick", event.detail); }
</script>

{#each selectorMultipleData as multipleData}
    <svelte:component this={multipleData.component}
        {...multipleData.props}
        class={"cursor-pointer select-none"}
        id={multipleData.id}
        selected={selectedIDs.indexOf(multipleData.id) !== -1}
        on:dispatchClick={forward} />
{/each}