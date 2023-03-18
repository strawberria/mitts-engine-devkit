<script lang="ts">
    import RadioInteractionResult from "../components/RadioInteractionResult.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedInteractionResultIDStore, selectedInteractionIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectInteractionResultData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let selectorRadioData: SelectorRadioData[] = [];
    function updateSelectorRadioData() {
        if($selectedInteractionIDStore === null) { return; }
        const interactionData = $projectStore.data.interactions[$selectedInteractionIDStore];
        if(interactionData === undefined) { return; }

        selectorRadioData = interactionData.order.results
            .map((interactionResultID): [string, ProjectInteractionResultData] => 
                [interactionResultID, interactionData.data.results[interactionResultID]])
            .map(([interactionResultID, interactionResultdata]): SelectorRadioData => ({
                id: interactionResultID,
                component: RadioInteractionResult,
                props: { data: interactionResultdata }
            }));
    }
    projectStore.subscribe(updateSelectorRadioData);
    selectedInteractionIDStore.subscribe(updateSelectorRadioData);

    const deselectable = true;
    function handleClick(event: any) {
        if($selectedInteractionResultIDStore !== event.detail.id) {
            $selectedInteractionResultIDStore = event.detail.id;
        } else if(deselectable) {
            $selectedInteractionResultIDStore = null;
        }
    }
</script>

<!-- Necessary because in separate component -->
<!-- allowUnlinking={false} -->
{#if $selectedInteractionIDStore !== null}
    <SectionRadio height={height}
        label="Results"
        selectedIDStore={selectedInteractionResultIDStore}
        selectorRadioData={selectorRadioData}
        order={$projectStore.data.interactions[$selectedInteractionIDStore].order.results}
        data={$projectStore.data.interactions[$selectedInteractionIDStore].data.results}
        defaultValue={{ "devName": "", "type": "restraintAdd", "args": [] }}
        on:dispatchClick={handleClick}>
    </SectionRadio>
{/if}