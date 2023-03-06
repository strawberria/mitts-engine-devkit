<script lang="ts">
    import RadioObject from "../components/RadioObject.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedObjectIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectObjectData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let selectorRadioData: SelectorRadioData[] = [];
    projectStore.subscribe(projectData => {
        selectorRadioData = projectData.game.objects
            .map((objectID): [string, ProjectObjectData] => 
                [objectID, projectData.data.objects[objectID]])
            .map(([objectID, objectData]): SelectorRadioData => ({
                id: objectID,
                component: RadioObject,
                props: { data: objectData }
            }));
    });

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
    label="Game Objects"
    selectedIDStore={selectedObjectIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.objects}
    data={$projectStore.data.objects}
    defaultValue={{ "name": "", "devName": "", "examine": "", "tags": [], "initial": false }}
    on:dispatchClick={handleClick}>
</SectionRadio>