<script lang="ts">
    import { projectStore } from "../utilities/project";
    import type { SelectorMultipleData } from "../utilities/typings";
    import Section from "./Section.svelte";
    import SelectorMultiple from "./SelectorMultiple.svelte";

    export let height = null;
    export let width = null;
    export let selectedIDs: string[] = [];
    // export let allowUnlinking: boolean = true;
    export let selectorMultipleData: SelectorMultipleData[];
    
    function select(event: any) { 
        const id = event.detail.id;
        const idIndex = selectedIDs.indexOf(id);
        if(idIndex !== -1) {
            selectedIDs.splice(idIndex, 1);
        } else {
            selectedIDs.push(id);
        }

        // Force update including selectedIDs
        $projectStore = $projectStore;
    }

    // Copied from Section
    export let label: string;
    let customClass: string = "";
    let customStyle: string = "";
    export let innerClass: string = "";
    export { customClass as class, customStyle as style };
</script>

<Section height={height}
    width={width}
    label={label}
    class={customClass}
    innerClass={`scrollbar-thin scrollbar-thumb-slate-700 overflow-x-hidden
        pr-4 
        ${innerClass}`}
    style={customStyle}>
    <svelte:fragment slot="content">
        <slot name="content" />
        <SelectorMultiple selectedIDs={selectedIDs}
            selectorMultipleData={selectorMultipleData}
            on:dispatchClick={select} />
    </svelte:fragment>
</Section>