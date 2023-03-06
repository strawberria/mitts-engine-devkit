<script lang="ts">
    import RadioAction from "../components/RadioAction.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedActionIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectActionData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let selectorRadioData: SelectorRadioData[] = [];
    projectStore.subscribe(projectData => {
        selectorRadioData = projectData.game.actions
            .map((id): [string, ProjectActionData] => [id, projectData.data.actions[id]])
            .map(([id, actionData]): SelectorRadioData => ({
                id: id,
                component: RadioAction,
                props: { data: actionData }
            }));
    });

    const deselectable = true;
    function handleClick(event: any) {
        if($selectedActionIDStore !== event.detail.id) {
            $selectedActionIDStore = event.detail.id;
        } else if(deselectable) {
            $selectedActionIDStore = null;
        }
    }
</script>

<!-- allowUnlinking={false} -->
<SectionRadio height={height}
    label="Game Actions"
    selectedIDStore={selectedActionIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.actions}
    data={$projectStore.data.actions}
    defaultValue={{"name": "", "verb": "", "order": false, "two": false}}
    on:dispatchClick={handleClick}>
</SectionRadio>