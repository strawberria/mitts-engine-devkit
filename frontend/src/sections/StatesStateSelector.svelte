<script lang="ts">
    import RadioState from "../components/RadioState.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedStateIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectStateData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let selectorRadioData: SelectorRadioData[] = [];
    projectStore.subscribe(projectData => {
        selectorRadioData = projectData.game.states
            .map((id): [string, ProjectStateData] => [id, projectData.data.states[id]])
            .map(([id, actionData]): SelectorRadioData => ({
                id: id,
                component: RadioState,
                props: { data: actionData }
            })
        );
    });

    const deselectable = true;
    function handleClick(event: any) {
        if($selectedStateIDStore !== event.detail.id) {
            $selectedStateIDStore = event.detail.id;
        } else if(deselectable) {
            $selectedStateIDStore = null;
        }
    }
</script>

<!-- allowUnlinking={false} -->
<SectionRadio height={height}
    label="Game States"
    selectedIDStore={selectedStateIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.states}
    data={$projectStore.data.states}
    defaultValue={{ devName: "", description: "", notes: "", imageID: null, type: "normal", args: [],
        availableActionIDs: [], availableInteractionIDs: [], availableLocationIDs: [], 
        hints: [{ attempts: -1, text: "" }, { attempts: -1, text: "" }, { attempts: -1, text: "" }] }}
    on:dispatchClick={handleClick}>
</SectionRadio>