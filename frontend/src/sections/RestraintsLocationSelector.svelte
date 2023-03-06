<script lang="ts">
    import RadioRestraintLocation from "../components/RadioRestraintLocation.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedRestraintLocationIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectRestraintLocationData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let selectorRadioData: SelectorRadioData[] = [];
    projectStore.subscribe(projectData => {
        selectorRadioData = projectData.game.restraintLocations
            .map((restraintLocationID): [string, ProjectRestraintLocationData] => 
                [restraintLocationID, projectData.data.restraintLocations[restraintLocationID]])
            .map(([restraintLocationID, restraintLocationData]): SelectorRadioData => ({
                id: restraintLocationID,
                component: RadioRestraintLocation,
                props: { data: restraintLocationData }
            }));
    });

    const deselectable = true;
    function handleClick(event: any) {
        if($selectedRestraintLocationIDStore !== event.detail.id) {
            $selectedRestraintLocationIDStore = event.detail.id;
        } else if(deselectable) {
            $selectedRestraintLocationIDStore = null;
        }
    }
</script>

<!-- allowUnlinking={false} -->
<SectionRadio height={height}
    label="Restraint Locations"
    selectedIDStore={selectedRestraintLocationIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.restraintLocations}
    data={$projectStore.data.restraintLocations}
    defaultValue={{ "name": "", "initialRestraintID": null }}
    on:dispatchClick={handleClick}>
</SectionRadio>