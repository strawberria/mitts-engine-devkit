<script lang="ts">
    import RadioAction from "../components/RadioAction.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedActionIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { SelectorRadioData } from "../utilities/typings";

    let selectorRadioData: SelectorRadioData[] = [];
    projectStore.subscribe(projectData => {
        selectorRadioData = Object.entries(projectData.data.actions).map(
            ([id, actionData]) => ({
                id: id,
                component: RadioAction,
                props: { data: actionData }
            })
        );
    });
</script>

<SectionRadio label="Game Actions"
    selectedIDStore={selectedActionIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.actions}
    data={$projectStore.data.actions}
    defaultValue={{"name": "", "verb": "", "order": false, "two": false}}
    on:dispatchClick={(e) => { $selectedActionIDStore = e.detail.id }}>
</SectionRadio>