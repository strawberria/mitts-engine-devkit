<script lang="ts">
    import RadioLocation from "../components/RadioLocation.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedLocationIDStore, selectedLocationObjectIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectLocationData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;
    export let style: string | "" = "";

    let selectorRadioData: SelectorRadioData[] = [];
    projectStore.subscribe(projectData => {
        selectorRadioData = projectData.game.locations
            .map((locationID): [string, ProjectLocationData] => 
                [locationID, projectData.data.locations[locationID]])
            .map(([locationID, locationData]): SelectorRadioData => ({
                id: locationID,
                component: RadioLocation,
                props: { data: locationData }
            }));
    });

    const deselectable = true;
    let previousLocationID: string | null = null;
    function handleClick(event: any) {
        const resultLocationID = $selectedLocationIDStore !== event.detail.id
            ? event.detail.id : deselectable
                ? null : $selectedLocationIDStore;

        if(previousLocationID !== resultLocationID) {
            $selectedLocationObjectIDStore = null;
        }

        $selectedLocationIDStore = resultLocationID;
        // previousLocationID = event.detail.id;
        previousLocationID = resultLocationID;
    }
</script>

<!-- allowUnlinking={false} -->
<SectionRadio height={height}
    style={style}
    label="Locations"
    selectedIDStore={selectedLocationIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.locations}
    data={$projectStore.data.locations}
    defaultValue={{ "name": "", "devName": "", "initial": false, "imageID": null,
        "order": { "locationObjects": [] }, "data": { "locationObjects": {} } }}
    on:dispatchClick={handleClick}>
</SectionRadio>