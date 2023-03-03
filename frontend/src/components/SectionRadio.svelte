<script lang="ts">
    import { mutate, projectStore } from "../utilities/project";
    import { createEventDispatcher } from "svelte";
    import { writable, Writable } from "svelte/store";
    import type { SelectorRadioData, StoredData } from "../utilities/typings";
    import IconButton from "./IconButton.svelte";
    import Section from "./Section.svelte";
    import SelectorRadio from "./SelectorRadio.svelte";

    export let selectedIDStore: Writable<string | null> = writable(null);
    export let deselectable: boolean = false;
    export let allowDuplication: boolean = true;
    export let allowUnlinking: boolean = true;
    export let selectorRadioData: SelectorRadioData[];
    export let order: string[];
    export let data: StoredData<any>;
    export let defaultValue: any;
    
    const dispatch = createEventDispatcher();
    function forward(event: any) { dispatch("dispatchClick", event.detail); }

    function callback() {
        $projectStore = $projectStore;
    }

    // Copied from Section
    export let label: string;
    let customClass: string = "";
    export let innerClass: string = "";
    export { customClass as class };
</script>

<Section label={label}
    class={customClass}
    innerClass={innerClass}>
    <svelte:fragment slot="header">
        <!-- space-x-4 -->
        <div class="flex flex-row space-x-1">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={() => { mutate.genericAdd(order, data, defaultValue, selectedIDStore); callback(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={() => { mutate.genericMoveUp(order, selectedIDStore); callback(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={() => { mutate.genericMoveDown(order, selectedIDStore); callback(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
                <IconButton onclick={() => { mutate.genericDelete(order, data, selectedIDStore); callback(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            {#if allowDuplication || allowUnlinking}
                <div class="flex flex-row space-x-1">
                    {#if allowDuplication}
                        <IconButton onclick={() => { mutate.genericDuplicate(order, data, selectedIDStore); callback(); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </IconButton>
                    {/if}
                    {#if allowUnlinking}
                        <IconButton onclick={() => { mutate.genericUnlink(order, data, selectedIDStore); callback(); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                <path stroke-linecap="round" stroke-width="3" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </IconButton>
                    {/if}
                </div>
            {/if}
        </div>
    </svelte:fragment>
    <svelte:fragment slot="body">
        <SelectorRadio selectedID={$selectedIDStore}
            selectorRadioData={selectorRadioData}
            on:dispatchClick={forward} />
    </svelte:fragment>
</Section>