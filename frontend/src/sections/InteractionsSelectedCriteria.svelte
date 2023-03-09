<script lang="ts">
    import { writable, Writable } from "svelte/store";
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import Section from "../components/Section.svelte";
    import { selectedInteractionCriteriaIDStore, selectedInteractionIDStore } from "../utilities/constants";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import type { ProjectInteractionCriteriaType, ProjectObjectData, ProjectRestraintData, ProjectRestraintLocationData, SelectChoiceData } from "../utilities/typings";

    let interactionCriteriaTypeStore: Writable<ProjectInteractionCriteriaType> = writable("flagEquals");
    function updateInteractionCriteriaType() {
        if($selectedInteractionIDStore === null || $selectedInteractionCriteriaIDStore === null
            || $projectStore.data.interactions[$selectedInteractionIDStore]
                .data.criteria[$selectedInteractionCriteriaIDStore] === undefined) { return; }
        $interactionCriteriaTypeStore = $projectStore.data.interactions[$selectedInteractionIDStore]
            .data.criteria[$selectedInteractionCriteriaIDStore].type;
    }
    projectStore.subscribe(updateInteractionCriteriaType);
    selectedInteractionIDStore.subscribe(updateInteractionCriteriaType);
    selectedInteractionCriteriaIDStore.subscribe(updateInteractionCriteriaType);

    let criteriaLabelPlaceholderClass: { [key in ProjectInteractionCriteriaType]: [string, string, string][] } = {
        "flagEquals": [["Flag Key", "doorStatus", "w-1/2"], ["Flag Value", "unlocked", "w-1/2"]],
        "flagNotEquals": [["Flag Key", "doorStatus", "w-1/2"], ["Flag Value", "unlocked", "w-1/2"]],
        "restraintWearing": [["Restraint", "", "w-2/3"]],
        "restraintNotWearing": [["Restraint", "", "w-2/3"]],
        "restraintWearingTag": [["Restraint Tag", "locked-star_key", "w-1/2"]],
        "restraintNotWearingTag": [["Restraint Tag", "locked-star_key", "w-1/2"]],
        "objectFound": [["Object", "", "w-2/3"]],
        "objectNotFound": [["Object", "", "w-2/3"]],
        "objectFoundTag": [["Object Tag", "unlocks-star_key", "w-1/2"]],
        "objectNotFoundTag": [["Object Tag", "unlocks-star_key", "w-1/2"]],
    };
    let interactionCriteriaChoiceData: SelectChoiceData[] = [
        ...Object.keys(criteriaLabelPlaceholderClass).map(criteriaType => ({
            key: criteriaType, display: criteriaType, enabled: true 
        }))  
    ];

    let restraintChoiceData: SelectChoiceData[] = [];
    let objectChoiceData: SelectChoiceData[] = [];
    let criteriaSelectChoiceData: [SelectChoiceData[], SelectChoiceData[]] = [[], []];
    function updateCriteriaSelectChoiceData() {
        restraintChoiceData = [
            { key: null, display: "", enabled: true },
            ...$projectStore.game.restraints
                .map((restraintID): [string, ProjectRestraintData] => 
                    [restraintID, $projectStore.data.restraints[restraintID]])
                .filter(([restraintID, restraintData]) => restraintData.restraintLocationID !== null)
                .map(([restraintID, restraintData]): [string, ProjectRestraintData, ProjectRestraintLocationData] =>
                    [restraintID, restraintData, $projectStore.data.restraintLocations[restraintData.restraintLocationID]])
                .map(([restraintID, restraintData, restraintLocationData]): SelectChoiceData => ({
                    key: restraintID, display: `${restraintLocationData.name !== ""
                        ? '(' + restraintLocationData.name + ') ' : ""} ${restraintData.devName}`, enabled: true
                })),
        ];
        objectChoiceData = [
            { key: null, display: "", enabled: true },
            ...$projectStore.game.objects
                .map((objectID): [string, ProjectObjectData] => [objectID, $projectStore.data.objects[objectID]])
                .map(([objectID, objectData]): SelectChoiceData => ({
                    key: objectID, display: objectData.devName, enabled: true
                })),
        ];

        if($selectedInteractionCriteriaIDStore === null) { return; }

        if(["flagEquals", "flagNotEquals", "restraintWearingTag", "restraintNotWearingTag", 
                "objectFoundTag", "objectNotFoundTag"]
                    .includes($interactionCriteriaTypeStore)) {
                        criteriaSelectChoiceData[0] = [];   
                        criteriaSelectChoiceData[1] = [];            
        } else if(["restraintWearing", "restraintNotWearing"].includes($interactionCriteriaTypeStore)) {
            criteriaSelectChoiceData[0] = restraintChoiceData;
            criteriaSelectChoiceData[1] = [];            
        } else if(["objectFound", "objectNotFound"].includes($interactionCriteriaTypeStore)) {
            criteriaSelectChoiceData[0] = objectChoiceData;
            criteriaSelectChoiceData[1] = [];            
        }
    }
    projectStore.subscribe(updateCriteriaSelectChoiceData);
    selectedInteractionCriteriaIDStore.subscribe(updateCriteriaSelectChoiceData);
    interactionCriteriaTypeStore.subscribe(updateCriteriaSelectChoiceData);

    function clearInteractionCriteriaArgs() {
        $projectStore.data.interactions[$selectedInteractionIDStore]
            .data.criteria[$selectedInteractionCriteriaIDStore].args = [];
    }
</script>

<!-- Necessary because in separate component -->
{#if $selectedInteractionCriteriaIDStore !== null}
    <Section label="Selected Interaction Criteria">
        <svelte:fragment slot="content">
            <LabelTextInput bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                    .data.criteria[$selectedInteractionCriteriaIDStore].devName}
                label={"Development Name"}
                placeholder={"(interaction criteria name, too lazy for placeholder)"}
                valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].criteria
                    [$selectedInteractionCriteriaIDStore].devName} />
            <LabelSelect class="w-1/2" 
                bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                    .data.criteria[$selectedInteractionCriteriaIDStore].type}
                onchange={clearInteractionCriteriaArgs}
                choicesData={interactionCriteriaChoiceData}
                label={"State Type"} />
            <!-- Index 0 -->
            {#if ["flagEquals", "flagNotEquals", "restraintWearingTag", "restraintNotWearingTag", 
                "objectFoundTag", "objectNotFoundTag"]
                    .includes($interactionCriteriaTypeStore)}
                        <LabelTextInput class={criteriaLabelPlaceholderClass[$interactionCriteriaTypeStore][0][2]}
                            bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                                .data.criteria[$selectedInteractionCriteriaIDStore].args[0]}
                            label={criteriaLabelPlaceholderClass[$interactionCriteriaTypeStore][0][0]}
                            placeholder={criteriaLabelPlaceholderClass[$interactionCriteriaTypeStore][0][1]}
                            valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].criteria
                                [$selectedInteractionCriteriaIDStore].args[0]} />
            {:else if ["restraintWearing", "restraintNotWearing", "objectFound", "objectNotFound"]
                .includes($interactionCriteriaTypeStore)}
                    <LabelSelect class={criteriaLabelPlaceholderClass[$interactionCriteriaTypeStore][0][2]}
                        bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                            .data.criteria[$selectedInteractionCriteriaIDStore].args[0]}
                        choicesData={criteriaSelectChoiceData[0]}
                        label={criteriaLabelPlaceholderClass[$interactionCriteriaTypeStore][0][0]}
                        valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].criteria
                            [$selectedInteractionCriteriaIDStore].args[0]} />
            {/if}
            <!-- Index 1 -->
            {#if ["flagEquals", "flagNotEquals"]
                .includes($interactionCriteriaTypeStore)}
                    <LabelTextInput class={criteriaLabelPlaceholderClass[$interactionCriteriaTypeStore][1][2]}
                        bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                            .data.criteria[$selectedInteractionCriteriaIDStore].args[1]}
                        label={criteriaLabelPlaceholderClass[$interactionCriteriaTypeStore][1][0]}
                        placeholder={criteriaLabelPlaceholderClass[$interactionCriteriaTypeStore][1][1]}
                        valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].criteria
                            [$selectedInteractionCriteriaIDStore].args[1]} />
            {/if}
        </svelte:fragment>
    </Section>
{/if}