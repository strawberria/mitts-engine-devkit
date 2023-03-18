<script lang="ts">
    import { writable, Writable } from "svelte/store";
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import Section from "../components/Section.svelte";
    import { selectedInteractionResultIDStore, selectedInteractionIDStore } from "../utilities/constants";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import type { ProjectInteractionResultType, ProjectLocationData, ProjectObjectData, ProjectRestraintData, ProjectRestraintLocationData, ProjectStateData, SelectChoiceData } from "../utilities/typings";

    let interactionResultTypeStore: Writable<ProjectInteractionResultType> = writable("restraintAdd");
    function updateInteractionResultType() {
        if($selectedInteractionIDStore === null || $selectedInteractionResultIDStore === null
            || $projectStore.data.interactions[$selectedInteractionIDStore] === undefined
            || $projectStore.data.interactions[$selectedInteractionIDStore]
                .data.results[$selectedInteractionResultIDStore] === undefined) { return; }
        $interactionResultTypeStore = $projectStore.data.interactions[$selectedInteractionIDStore]
            .data.results[$selectedInteractionResultIDStore].type;
    }
    projectStore.subscribe(updateInteractionResultType);
    selectedInteractionIDStore.subscribe(updateInteractionResultType);
    selectedInteractionResultIDStore.subscribe(updateInteractionResultType);

    let resultLabelPlaceholderClass: { [key in ProjectInteractionResultType]: [string, string, string][] } = {
        "restraintAdd": [["Restraint", "", "w-full"]],
        "restraintRemove": [["Restraint", "", "w-full"]],
        "addRevealTarget": [["Which Target", "", "w-1/2"]],
        "removeHideTarget": [["Which Target", "", "w-1/2"]],
        "objectReveal": [["Object", "", "w-full"]],
        "objectHide": [["Object", "", "w-full"]],
        "setState": [["State", "", "w-2/3"]],
        "setFlag": [["Flag Key", "doorStatus", "w-2/3"], ["Flag Value", "unlocked", "w-2/3"]],
        "showDialog": [["Dialog Text", "After seemingly hours of sawing with the rusty knife, you finally "
            + "manage to cut through the sturdy leather cuffs encircling your wrists.", "w-full"]],
        "locationAdd": [["Location", "", "w-2/3"]],
        "locationRemove": [["Location", "", "w-2/3"], ["Backup Location", "", "w-2/3"]],
    };
    let interactionResultChoiceData: SelectChoiceData[] = [
        ...Object.keys(resultLabelPlaceholderClass).map(resultType => ({
            key: resultType, display: resultType, enabled: true 
        }))  
    ];

    let targetChoiceData: SelectChoiceData[] = [
        { key: 0, display: "Component 1", enabled: true },
        { key: 1, display: "Component 2", enabled: true }
    ]
    let restraintChoiceData: SelectChoiceData[] = [];
    let objectChoiceData: SelectChoiceData[] = [];
    let stateChoiceData: SelectChoiceData[] = [];
    let locationChoiceData: SelectChoiceData[] = [];
    let resultSelectChoiceData: [SelectChoiceData[], SelectChoiceData[]] = [[], []];
    function updateResultSelectChoiceData() {
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
        stateChoiceData = [
            { key: null, display: "", enabled: true },
            ...$projectStore.game.states
                .map((stateID): [string, ProjectStateData] => [stateID, $projectStore.data.states[stateID]])
                .map(([stateID, stateData]): SelectChoiceData => ({
                    key: stateID, display: stateData.devName, enabled: true
                })),
        ];
        locationChoiceData = [
            { key: null, display: "", enabled: true },
            ...$projectStore.game.locations
                .map((locationID): [string, ProjectLocationData] => [locationID, $projectStore.data.locations[locationID]])
                .map(([locationID, locationData]): SelectChoiceData => ({
                    key: locationID, display: locationData.devName, enabled: true
                })),
        ];
        // TODO add location once implemented

        if($selectedInteractionResultIDStore === null) { return; }

        if(["setFlag", "showDialog"].includes($interactionResultTypeStore)) {
            resultSelectChoiceData[0] = [];   
            resultSelectChoiceData[1] = [];            
        } else if(["restraintAdd", "restraintRemove"].includes($interactionResultTypeStore)) {
            resultSelectChoiceData[0] = restraintChoiceData;
            resultSelectChoiceData[1] = [];            
        } else if(["addRevealTarget", "removeHideTarget"].includes($interactionResultTypeStore)) {
            resultSelectChoiceData[0] = targetChoiceData;
            resultSelectChoiceData[1] = [];            
        } else if(["objectReveal", "objectHide"].includes($interactionResultTypeStore)) {
            resultSelectChoiceData[0] = objectChoiceData;
            resultSelectChoiceData[1] = [];            
        } else if(["setState"].includes($interactionResultTypeStore)) {
            resultSelectChoiceData[0] = stateChoiceData;
            resultSelectChoiceData[1] = [];            
        } else if(["locationAdd"].includes($interactionResultTypeStore)) {
            resultSelectChoiceData[0] = locationChoiceData;
            resultSelectChoiceData[1] = [];  
        } else if(["locationRemove"].includes($interactionResultTypeStore)) {
            resultSelectChoiceData[0] = locationChoiceData;
            resultSelectChoiceData[1] = locationChoiceData;
        }
    }
    projectStore.subscribe(updateResultSelectChoiceData);
    selectedInteractionResultIDStore.subscribe(updateResultSelectChoiceData);
    interactionResultTypeStore.subscribe(updateResultSelectChoiceData);

    function clearInteractionResultArgs() {
        $projectStore.data.interactions[$selectedInteractionIDStore]
            .data.results[$selectedInteractionResultIDStore].args = [];
    }
</script>

<!-- Necessary because in separate component -->
{#if $selectedInteractionResultIDStore !== null}
    <Section label="Selected Interaction Result">
        <svelte:fragment slot="content">
            <LabelTextInput bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                    .data.results[$selectedInteractionResultIDStore].devName}
                label={"Development Name"}
                placeholder={"(interaction result name, too lazy)"}
                valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].results
                    [$selectedInteractionResultIDStore].devName} />
            <LabelSelect class="w-2/3" 
                bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                    .data.results[$selectedInteractionResultIDStore].type}
                onchange={clearInteractionResultArgs}
                choicesData={interactionResultChoiceData}
                label={"State Type"} />
            <!-- Index 0 -->
            {#if ["setFlag"]
                    .includes($interactionResultTypeStore)}
                        <LabelTextInput class={resultLabelPlaceholderClass[$interactionResultTypeStore][0][2]}
                            bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                                .data.results[$selectedInteractionResultIDStore].args[0]}
                            label={resultLabelPlaceholderClass[$interactionResultTypeStore][0][0]}
                            placeholder={resultLabelPlaceholderClass[$interactionResultTypeStore][0][1]}
                            valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].results
                                [$selectedInteractionResultIDStore].args[0]} />
            {:else if ["restraintAdd", "restraintRemove", "addRevealTarget", "removeHideTarget", 
                "objectReveal", "objectHide", "setState", "locationAdd", "locationRemove"]
                    .includes($interactionResultTypeStore)}
                        <LabelSelect class={resultLabelPlaceholderClass[$interactionResultTypeStore][0][2]}
                            bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                                .data.results[$selectedInteractionResultIDStore].args[0]}
                            choicesData={resultSelectChoiceData[0]}
                            label={resultLabelPlaceholderClass[$interactionResultTypeStore][0][0]}
                            valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].results
                                [$selectedInteractionResultIDStore].args[0]} />
            {:else if ["showDialog"]
                .includes($interactionResultTypeStore)}
                    <LabelTextArea class={resultLabelPlaceholderClass[$interactionResultTypeStore][0][2]}
                        bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                            .data.results[$selectedInteractionResultIDStore].args[0]}
                        label={resultLabelPlaceholderClass[$interactionResultTypeStore][0][0]}
                        placeholder={resultLabelPlaceholderClass[$interactionResultTypeStore][0][1]}
                        rows={6}
                        valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].results
                            [$selectedInteractionResultIDStore].args[0]} />
            {/if}
            <!-- Index 1 -->
            {#if ["setFlag"]
                .includes($interactionResultTypeStore)}
                    <LabelTextInput class={resultLabelPlaceholderClass[$interactionResultTypeStore][1][2]}
                        bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                            .data.results[$selectedInteractionResultIDStore].args[1]}
                        label={resultLabelPlaceholderClass[$interactionResultTypeStore][1][0]}
                        placeholder={resultLabelPlaceholderClass[$interactionResultTypeStore][1][1]}
                        valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].results
                            [$selectedInteractionResultIDStore].args[1]} />
            {:else if ["locationRemove"]
                .includes($interactionResultTypeStore)}
                    <LabelSelect class={resultLabelPlaceholderClass[$interactionResultTypeStore][1][2]}
                        bind:value={$projectStore.data.interactions[$selectedInteractionIDStore]
                            .data.results[$selectedInteractionResultIDStore].args[1]}
                        choicesData={resultSelectChoiceData[1]}
                        label={resultLabelPlaceholderClass[$interactionResultTypeStore][1][0]}
                        valid={$bundleValidStore.interactions.interactions[$selectedInteractionIDStore].results
                            [$selectedInteractionResultIDStore].args[1]} />
            {/if}
        </svelte:fragment>
    </Section>
{/if}