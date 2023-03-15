<script lang="ts">
    import RadioLocationObject from "../components/RadioLocationObject.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedLocationIDStore, selectedLocationObjectIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectLocationObjectData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;
    export let style: string | "" = "";

    let selectorRadioData: SelectorRadioData[] = [];
    function updateSelectorRadioData() {
        if($selectedLocationIDStore === null) { return; }
        selectorRadioData = $projectStore.data.locations[$selectedLocationIDStore]
                .order.locationObjects
            .map((locationObjectID): [string, ProjectLocationObjectData] => 
                [locationObjectID, $projectStore.data.locations[$selectedLocationIDStore]
                    .data.locationObjects[locationObjectID]])
            .map(([locationObjectID, locationObjectData]): SelectorRadioData => ({
                id: locationObjectID,
                component: RadioLocationObject,
                props: { data: locationObjectData }
            }));
    }
    projectStore.subscribe(updateSelectorRadioData);
    selectedLocationIDStore.subscribe(updateSelectorRadioData);

    const deselectable = true;
    function handleClick(event: any) {
        if($selectedLocationObjectIDStore !== event.detail.id) {
            $selectedLocationObjectIDStore = event.detail.id;
        } else if(deselectable) {
            $selectedLocationObjectIDStore = null;
        }
    }
</script>

<!-- allowUnlinking={false} -->
{#if $selectedLocationIDStore !== null}
    <SectionRadio height={height}
        class="basis-0"
        style={style}
        label="Minimap Objects"
        selectedIDStore={selectedLocationObjectIDStore}
        selectorRadioData={selectorRadioData}
        order={$projectStore.data.locations[$selectedLocationIDStore].order.locationObjects}
        data={$projectStore.data.locations[$selectedLocationIDStore].data.locationObjects}
        defaultValue={{ "devName": "", "type": "circle", "args": [], "dialog": "", "objectID": null }}
        on:dispatchClick={handleClick}>
    </SectionRadio>
{/if}