<script lang="ts">
    import RadioRestraint from "../components/RadioRestraint.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedRestraintIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectRestraintData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let selectorRadioData: SelectorRadioData[] = [];
    projectStore.subscribe(projectData => {
        selectorRadioData = projectData.game.restraints
            .map((id): [string, ProjectRestraintData] => [id, projectData.data.restraints[id]])
            .map(([id, restraintData]): SelectorRadioData => ({
                id: id,
                component: RadioRestraint,
                props: { data: restraintData }
            }));
    });

    const deselectable = true;
    function handleClick(event: any) {
        if($selectedRestraintIDStore !== event.detail.id) {
            $selectedRestraintIDStore = event.detail.id;
        } else if(deselectable) {
            $selectedRestraintIDStore = null;
        }
    }
</script>

<!-- allowUnlinking={false} -->
<SectionRadio height={height}
    label="Restraints"
    selectedIDStore={selectedRestraintIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.restraints}
    data={$projectStore.data.restraints}
    defaultValue={{ "name": "", "devName": "", "restraintLocationID": null,
        "examine": "", "tags": [] }}
    on:dispatchClick={handleClick}>
</SectionRadio>