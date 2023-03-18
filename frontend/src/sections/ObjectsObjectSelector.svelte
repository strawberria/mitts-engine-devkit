<script lang="ts">
    import { writable, Writable } from "svelte/store";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import RadioObject from "../components/RadioObject.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedObjectIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectObjectData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let filterTextStore: Writable<string> = writable("");
    let combined: string;
    let selectorRadioData: SelectorRadioData[] = [];
    function updateSelectorRadioData() {
        selectorRadioData = $projectStore.game.objects
            .map((objectID): [string, ProjectObjectData] => 
                [objectID, $projectStore.data.objects[objectID]])
            .filter(([objectID, objectData]) => {
                combined = [objectData.devName, objectData.name, objectData.id]
                    .join("|").toLowerCase();

                return $filterTextStore.toLowerCase().split(",")
                    .map(term => term.trim().toLowerCase())
                    .every(term => combined.includes(term));
            })
            .map(([objectID, objectData]): SelectorRadioData => ({
                id: objectID,
                component: RadioObject,
                props: { data: objectData }
            }));
    }

    projectStore.subscribe(updateSelectorRadioData);
    filterTextStore.subscribe(updateSelectorRadioData);

    const deselectable = true;
    function handleClick(event: any) {
        if($selectedObjectIDStore !== event.detail.id) {
            $selectedObjectIDStore = event.detail.id;
        } else if(deselectable) {
            $selectedObjectIDStore = null;
        }
    }
</script>

<!-- allowUnlinking={false} -->
<SectionRadio height={height}
    label="Objects"
    selectedIDStore={selectedObjectIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.objects}
    data={$projectStore.data.objects}
    defaultValue={{ "name": "", "devName": "", "examine": "", "tags": [], "initial": false }}
    on:dispatchClick={handleClick}>
    <svelte:fragment slot="pre-content">
        <div class="flex flex-row items-start w-full pr-2">
            <LabelTextInput class="w-full pb-2 mr-2"
                label="Filter Interactions (delimit terms with comma)"
                bind:value={$filterTextStore} />
        </div>
    </svelte:fragment>
</SectionRadio>