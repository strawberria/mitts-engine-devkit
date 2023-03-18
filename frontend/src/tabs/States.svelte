<script lang="ts">
    import LabelNumberInput from "../components/LabelNumberInput.svelte";
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import MultipleAction from "../components/MultipleAction.svelte";
    import Section from "../components/Section.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionMultiple from "../components/SectionMultiple.svelte";
    import SectionRow from "../components/SectionRow.svelte";
    import StatesStateSelector from "../sections/StatesStateSelector.svelte";
    import { selectedStateIDStore } from "../utilities/constants";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import type { ProjectActionData, ProjectImageData, ProjectStateData, SelectChoiceData, SelectorMultipleData } from "../utilities/typings";

    const stateTypeChoiceData: SelectChoiceData[] = [
        { key: "normal", display: "Normal", enabled: true },
        { key: "transition", display: "Transition", enabled: true },
        { key: "goodEnding", display: "Good Ending", enabled: true },
        { key: "badEnding", display: "Bad Ending", enabled: true },
    ];

    let stateImageChoiceData: SelectChoiceData[] = [];
    projectStore.subscribe(projectData => {
        stateImageChoiceData = [
            { key: null, display: "", enabled: true },
            ...projectData.game.images
                .map((imageID): [string, ProjectImageData] => [imageID, projectData.data.images[imageID]])
                .map(([imageID, imageData]): SelectChoiceData => ({
                    key: imageID, display: imageData.devName, enabled: true
                })),
        ];
    });

    let stateChoiceData: SelectChoiceData[] = [];
    projectStore.subscribe(projectData => {
        stateChoiceData = [
            { key: null, display: "", enabled: true },
            ...projectData.game.states
                .map((stateID): [string, ProjectStateData] => [stateID, projectData.data.states[stateID]])
                .map(([stateID, stateData]): SelectChoiceData => ({
                    key: stateID, display: stateData.devName, enabled: true
                })),
        ];
    })

    let stateActionMultipleData: SelectorMultipleData[] = [];
    projectStore.subscribe(projectData => {
        stateActionMultipleData = projectData.game.actions
            .map((id): [string, ProjectActionData] => [id, projectData.data.actions[id]])
            .map(([id, actionData]): SelectorMultipleData => ({
                id: id,
                component: MultipleAction,
                props: { data: actionData }
            }));
    });

    const hintPlaceholderText: [string, string, string, string, string] = [
        "That key seems slightly out of reach...",
        "Is there anything nearby you can use?",
        "Use the [Broom] to [Pull] the key over.",
        "What restraints can you currently reach?",
        "Unlock the [Leather Cuffs] with the [Key].",
    ];
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <StatesStateSelector />
        <Section class="shrink-0" 
            style="height: 26em" 
            label="Selected State"
            hidden={$selectedStateIDStore === null}>
            <svelte:fragment slot="content">
                <LabelTextInput bind:value={$projectStore.data.states[$selectedStateIDStore].devName}
                    label={"Name"}
                    placeholder={"Kidnapped Stowaway"}
                    valid={$bundleValidStore.states.states[$selectedStateIDStore].devName} />
                <div class="flex flex-row space-x-3">
                    <LabelSelect class="w-1/3" 
                        bind:value={$projectStore.data.states[$selectedStateIDStore].type}
                        choicesData={stateTypeChoiceData}
                        label={"State Type"} />
                    <LabelSelect class="grow" 
                        bind:value={$projectStore.data.states[$selectedStateIDStore].imageID}
                        choicesData={stateImageChoiceData}
                        label={"State Image"} 
                        valid={$bundleValidStore.states.states[$selectedStateIDStore].imageID} />
                </div>
                <LabelTextArea bind:value={$projectStore.data.states[$selectedStateIDStore].description}
                    label="Description"
                    valid={$bundleValidStore.states.states[$selectedStateIDStore].description}
                    rows={7} />
            </svelte:fragment>
        </Section>
    </SectionCol>
    <SectionCol style="width: calc(30% - 0.75rem)">
        {#if $selectedStateIDStore !== null}
            <SectionMultiple label="Available Actions"
                selectedIDs={$projectStore.data.states[$selectedStateIDStore].availableActionIDs}
                selectorMultipleData={stateActionMultipleData}>
                <!-- <p class="text-sm">Select which actions are available</p> -->
            </SectionMultiple>
            <Section nogrow={true}>
                <svelte:fragment slot="content">
                    <LabelTextArea bind:value={$projectStore.data.states[$selectedStateIDStore].notes}
                        label="Development Notes"
                        rows={10} />
                </svelte:fragment>
            </Section> 
        {/if}
    </SectionCol>
    <SectionCol style="width: calc(35% - 0.75rem)">
        {#if $selectedStateIDStore !== null}
            <!-- <Section nogrow={true}>
                <svelte:fragment slot="content">
                    <p>Tip: Set hint required attempts to -1 to disable each hint</p>
                </svelte:fragment>
            </Section> -->
            <Section label="Hints" 
                nogrow={true}>
                <svelte:fragment slot="content">
                    {#each { length: 5 } as _, index}
                        <div class="flex flex-row w-full space-x-3">
                            <LabelNumberInput class="w-16"
                                bind:value={$projectStore.data.states[$selectedStateIDStore].hints[index].attempts}
                                label={"Attempts"}
                                placeholder="-1"
                                valid={$bundleValidStore.states.states[$selectedStateIDStore].hints[index]} />
                            <LabelTextInput class="grow"
                                bind:value={$projectStore.data.states[$selectedStateIDStore].hints[index].text}
                                label={"Hint Text"}
                                placeholder={hintPlaceholderText[index]}
                                valid={$bundleValidStore.states.states[$selectedStateIDStore].hints[index]} />
                        </div>
                    {/each}
                </svelte:fragment>
            </Section>
            <Section nogrow={true}>
                <svelte:fragment slot="content">
                    <p class="text-sm">Transition to state after maximum attempts reached</p>
                    <div class="flex flex-row w-full space-x-3">
                        <LabelNumberInput class="w-16"
                            bind:value={$projectStore.data.states[$selectedStateIDStore].maxAttempts}
                            label={"Attempts"}
                            placeholder="-1"
                            valid={$bundleValidStore.states.states[$selectedStateIDStore].transition} />
                        <LabelSelect class="grow" 
                            bind:value={$projectStore.data.states[$selectedStateIDStore].transitionStateID}
                            choicesData={stateChoiceData}
                            label={"Transition State"} 
                            valid={$bundleValidStore.states.states[$selectedStateIDStore].transition} />
                    </div> 
                </svelte:fragment>
            </Section>
            <!-- <Section /> -->
            <!-- <div class="grow" />

            <Section nogrow={true}>
                <svelte:fragment slot="content">
                    <p>
                        Tip: Duplicate states whenever possible to save development effort (much less typing, trust me!)
                    </p>
                </svelte:fragment>
            </Section> -->
        {/if}
    </SectionCol>
</SectionRow>