<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { SelectorRadioData } from "../utilities/typings";

    export let selectedID: string | null;
    export let selectorRadioData: SelectorRadioData[];
    export let overridepointer = false;
    
    const dispatch = createEventDispatcher();
    function forward(event: any) { dispatch("dispatchClick", event.detail); }
</script>

{#each selectorRadioData as radioData}
    <svelte:component this={radioData.component}
        {...radioData.props}
        class={!overridepointer ? "cursor-pointer select-none" : ""}
        id={radioData.id}
        selected={selectedID === radioData.id}
        on:dispatchClick={forward} />
{/each}