<script lang="ts">
    import InteractionsCriteriaSelector from "../sections/InteractionsCriteriaSelector.svelte";
    import InteractionsInteractionSelector from "../sections/InteractionsInteractionSelector.svelte";
    import InteractionsResultSelector from "../sections/InteractionsResultSelector.svelte";
    import InteractionsSelectedCriteria from "../sections/InteractionsSelectedCriteria.svelte";
    import InteractionsSelectedResult from "../sections/InteractionsSelectedResult.svelte";
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import Section from "../components/Section.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
    import { selectedInteractionCriteriaIDStore, selectedInteractionIDStore, selectedInteractionResultIDStore } from "../utilities/constants";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import type { ProjectActionData, ProjectObjectData, ProjectRestraintData, ProjectRestraintLocationData, ProjectStateData, SelectChoiceData } from "../utilities/typings";
    import { writable, Writable } from "svelte/store";

    let interactionActionChoiceData: SelectChoiceData[] = [];
    projectStore.subscribe(projectData => {
        interactionActionChoiceData = [
            { key: null, display: "", enabled: true },
            ...projectData.game.actions
                .map((actionID): [string, ProjectActionData] => [actionID, projectData.data.actions[actionID]])
                .map(([actionID, actionData]) => ({
                    key: actionID,
                    display: actionData.name,
                    enabled: true,
                }))
        ];
    });

    let interactionStateChoiceData: SelectChoiceData[] = [];
    projectStore.subscribe(projectData => {
        interactionStateChoiceData = [
            { key: null, display: "", enabled: true },
            ...projectData.game.states
                .map((stateID): [string, ProjectStateData] => [stateID, projectData.data.states[stateID]])
                .map(([stateID, stateData]) => ({
                    key: stateID,
                    display: stateData.devName,
                    enabled: true,
                }))
        ]
    })

    let interactionComponentChoiceData: [SelectChoiceData[], SelectChoiceData[]] = [[], []];
    function updateinteractionComponentChoiceData() {
        if($selectedInteractionIDStore === null) { return; }
        for(const componentIndex of [0, 1]) {
            // Hacky solution but hey... it works I guess
            if($projectStore.data.interactions[$selectedInteractionIDStore] === undefined) { return; }
            if($projectStore.data.interactions[$selectedInteractionIDStore].componentTypes[componentIndex] === "restraints") {
                interactionComponentChoiceData[componentIndex] = [
                    { key: null, display: "", enabled: true },
                    { key: "anything", display: "( anything )", enabled: true },
                    ...$projectStore.game.restraints
                        .map((restraintID): [string, ProjectRestraintData] => [restraintID, $projectStore.data.restraints[restraintID]])
                        .map(([restraintID, restraintData]): SelectChoiceData => ({
                            key: restraintID, display: restraintData.devName, enabled: true
                        })),
                ];
            } else if($projectStore.data.interactions[$selectedInteractionIDStore].componentTypes[componentIndex] === "objects") {
                interactionComponentChoiceData[componentIndex] = [
                    { key: null, display: "", enabled: true },
                    { key: "anything", display: "( anything )", enabled: true },
                    ...$projectStore.game.objects
                        .map((objectID): [string, ProjectObjectData] => [objectID, $projectStore.data.objects[objectID]])
                        .map(([objectID, objectData]): SelectChoiceData => ({
                            key: objectID, display: objectData.devName, enabled: true
                        })),
                ];
            } else {
                interactionComponentChoiceData[componentIndex] = [
                    { key: null, display: "", enabled: true },
                    ...$projectStore.game.restraintLocations
                        .map((restraintLocationID): [string, ProjectRestraintLocationData] => 
                            [restraintLocationID, $projectStore.data.restraintLocations[restraintLocationID]])
                        .map(([restraintLocationID, restraintLocationData]): SelectChoiceData => ({
                            key: restraintLocationID, display: restraintLocationData.name, enabled: true
                        })),
                ];
            }
        }
    }

    projectStore.subscribe(updateinteractionComponentChoiceData);
    selectedInteractionIDStore.subscribe(updateinteractionComponentChoiceData);

    const interactionActionHasTwoStore: Writable<boolean> = writable(false);
    projectStore.subscribe(projectData => {
        // Absolutely no clue why I need this, crashes otherwise
        if($selectedInteractionIDStore !== null && 
            projectData.data.interactions[$selectedInteractionIDStore] === undefined) {
            return;
        }
        
        $interactionActionHasTwoStore = $selectedInteractionIDStore !== null
            ? projectData.data.interactions[$selectedInteractionIDStore].actionID !== null
                ? projectData.data.actions[projectData.data.interactions[$selectedInteractionIDStore].actionID].two
                : false
            : false;
        if($selectedInteractionIDStore !== null && !$interactionActionHasTwoStore
            && $projectStore.data.interactions[$selectedInteractionIDStore].componentIDs[1] !== null) {
            $projectStore.data.interactions[$selectedInteractionIDStore].componentIDs[1] = null;
        }
    });

    const interactionComponentTypeChoiceData: SelectChoiceData[] = [
        { key: "restraints", display: "Restraint", enabled: true },
        { key: "restraintLocations", display: "Restraint Location", enabled: true },
        { key: "objects", display: "Object", enabled: true },
    ];
</script>

<SectionRow height={100}>
    <SectionCol width={40}>
        <Section nogrow={true}>
            <svelte:fragment slot="content">
                <p>
                    Note: interactions are handled from top to bottom (stopping after handling the first with matching criteria)
                </p>
            </svelte:fragment>
        </Section>
        <InteractionsInteractionSelector height={50}/>
        {#if $selectedInteractionIDStore !== null}
            <Section label="Selected Interaction">
                <svelte:fragment slot="content">
                    <LabelTextInput bind:value={$projectStore.data.interactions[$selectedInteractionIDStore].devName}
                        label={"Development Name"}
                        placeholder={"Unlock [Leather Cuffs] with [Small Key]"}
                        valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].devName} />
                    <div class="flex flex-row space-x-3">
                        <LabelSelect class="w-1/3" 
                            bind:value={$projectStore.data.interactions[$selectedInteractionIDStore].actionID}
                            choicesData={interactionActionChoiceData}
                            label={"Action"}
                            valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].actionID} />
                        <LabelSelect class="grow" 
                            bind:value={$projectStore.data.interactions[$selectedInteractionIDStore].stateID}
                            choicesData={interactionStateChoiceData}
                            label={"Attached State (optional)"} />
                    </div>
                    <div class="flex flex-row space-x-3">
                        <LabelSelect class="w-1/2" 
                            bind:value={$projectStore.data.interactions[$selectedInteractionIDStore].componentTypes[0]}
                            choicesData={interactionComponentTypeChoiceData}
                            label={"Component 1 Type"} />
                        <LabelSelect class="w-1/2" 
                            bind:value={$projectStore.data.interactions[$selectedInteractionIDStore].componentTypes[1]}
                            choicesData={interactionComponentTypeChoiceData}
                            disabled={!$interactionActionHasTwoStore}
                            label={"Component 2 Type"} />
                    </div>
                    <div class="flex flex-row space-x-3">
                        <LabelSelect class="w-1/2" 
                            bind:value={$projectStore.data.interactions[$selectedInteractionIDStore].componentIDs[0]}
                            choicesData={interactionComponentChoiceData[0]}
                            label={"Component 1"}
                            valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].componentIDs[0]} />
                        <LabelSelect class="w-1/2" 
                            bind:value={$projectStore.data.interactions[$selectedInteractionIDStore].componentIDs[1]}
                            choicesData={interactionComponentChoiceData[1]}
                            label={"Component 2"}
                            disabled={!$interactionActionHasTwoStore}
                            valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].componentIDs[1]} />
                    </div>
                </svelte:fragment>
            </Section>
        {/if}
    </SectionCol>
    <SectionCol style="width: calc(30% - 0.75em)">
        {#if $selectedInteractionIDStore !== null}
            <InteractionsCriteriaSelector height={50} />
            {#if $selectedInteractionCriteriaIDStore !== null}
                <InteractionsSelectedCriteria />
            {/if}
        {/if}
    </SectionCol>
    <SectionCol style="width: calc(30% - 0.75em)">
        {#if $selectedInteractionIDStore !== null}
            <InteractionsResultSelector height={50} />
            {#if $selectedInteractionResultIDStore !== null}
                <InteractionsSelectedResult />
            {/if}
        {/if}
    </SectionCol>
</SectionRow>