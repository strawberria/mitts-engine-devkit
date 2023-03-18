<script lang="ts">
    import { writable, Writable } from "svelte/store";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import RadioLocation from "../components/RadioLocation.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedLocationIDStore, selectedLocationObjectIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectLocationData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;
    export let style: string | "" = "";

    let filterTextStore: Writable<string> = writable("");
    let combined: string;
    let selectorRadioData: SelectorRadioData[] = [];
    function updateSelectorRadioData() {
        selectorRadioData = $projectStore.game.locations
            .map((locationID): [string, ProjectLocationData] => 
                [locationID, $projectStore.data.locations[locationID]])
            .filter(([locationID, locationData]) => {
                let imageText = locationData.imageID !== null
                    ? $projectStore.data.images[locationData.imageID].devName
                    : "";

                combined = [locationData.devName, locationData.name, 
                    imageText, locationData.id]
                    .join("|").toLowerCase();

                return $filterTextStore.toLowerCase().split(",")
                    .map(term => term.trim().toLowerCase())
                    .every(term => combined.includes(term));
            })
            .map(([locationID, locationData]): SelectorRadioData => ({
                id: locationID,
                component: RadioLocation,
                props: { data: locationData }
            }));
    }

    projectStore.subscribe(updateSelectorRadioData);
    filterTextStore.subscribe(updateSelectorRadioData);

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
    deleteCallback={() => { $selectedLocationObjectIDStore = null; }}
    selectedIDStore={selectedLocationIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.locations}
    data={$projectStore.data.locations}
    defaultValue={{ "name": "", "devName": "", "initial": false, "imageID": null,
        "order": { "locationObjects": [] }, "data": { "locationObjects": {} } }}
    on:dispatchClick={handleClick}>
    <svelte:fragment slot="pre-content">
        <div class="flex flex-row items-start w-full pr-2">
            <LabelTextInput class="w-full pb-2 mr-2"
                label="Filter Locations (delimit terms with comma)"
                bind:value={$filterTextStore} />
        </div>
    </svelte:fragment>
</SectionRadio>