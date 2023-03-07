<script lang="ts">
    import RadioInteractionCriteria from "../components/RadioInteractionCriteria.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedInteractionCriteriaIDStore, selectedInteractionIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectInteractionCriteriaData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let selectorRadioData: SelectorRadioData[] = [];
    function updateSelectorRadioData() {
        if($selectedInteractionIDStore === null) { return; }
        const interactionData = $projectStore.data.interactions[$selectedInteractionIDStore];
        selectorRadioData = interactionData.order.criteria
            .map((interactionCriteriaID): [string, ProjectInteractionCriteriaData] => 
                [interactionCriteriaID, interactionData.data.criteria[interactionCriteriaID]])
            .map(([interactionCriteriaID, interactionCriteriadata]): SelectorRadioData => ({
                id: interactionCriteriaID,
                component: RadioInteractionCriteria,
                props: { data: interactionCriteriadata }
            }));
    }
    projectStore.subscribe(updateSelectorRadioData);
    selectedInteractionIDStore.subscribe(updateSelectorRadioData);
    selectedInteractionCriteriaIDStore.subscribe(updateSelectorRadioData);

    const deselectable = true;
    function handleClick(event: any) {
        if($selectedInteractionCriteriaIDStore !== event.detail.id) {
            $selectedInteractionCriteriaIDStore = event.detail.id;
        } else if(deselectable) {
            $selectedInteractionCriteriaIDStore = null;
        }
    }
</script>

<!-- Necessary because in separate component -->
<!-- allowUnlinking={false} -->
{#if $selectedInteractionIDStore !== null}
    <SectionRadio height={height}
        label="Criteria"
        selectedIDStore={selectedInteractionCriteriaIDStore}
        selectorRadioData={selectorRadioData}
        order={$projectStore.data.interactions[$selectedInteractionIDStore].order.criteria}
        data={$projectStore.data.interactions[$selectedInteractionIDStore].data.criteria}
        defaultValue={{ "devName": "", "type": "flagEquals", "args": [] }}
        on:dispatchClick={handleClick}>
    </SectionRadio>
{/if}