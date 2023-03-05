<script lang="ts">
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import Section from "../components/Section.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
    import StatesSelector from "./StatesSelector.svelte";
    import { selectedStateIDStore } from "../utilities/constants";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import type { ProjectImageData, ProjectStateType, SelectChoiceData } from "../utilities/typings";

    const stateTypeChoiceData: SelectChoiceData[] = [
        { key: "normal", display: "Normal", enabled: true },
        { key: "transition", display: "Transition", enabled: true },
        { key: "ending", display: "Ending", enabled: true },
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
    })
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <StatesSelector height={50} />
        {#if $selectedStateIDStore !== null}
            <Section label="Selected State - Basic">
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
                            valid={$bundleValidStore.states.states[$selectedStateIDStore].imageID}
                            label={"State Image"} />
                    </div>
                    <LabelTextArea bind:value={$projectStore.data.states[$selectedStateIDStore].notes}
                        label="Development Notes"
                        rows={7} />
                </svelte:fragment>
            </Section>
        {/if}
    </SectionCol>
    <SectionCol style="width: calc(40% - 0.75rem)">
        {#if $selectedStateIDStore !== null}
            <Section height={70} />
            <Section />
        {/if}
    </SectionCol>
    <SectionCol style="width: calc(25% - 0.75rem)">
        {#if $selectedStateIDStore !== null}
            <Section height={30} />
            <Section />
        {/if}
    </SectionCol>
</SectionRow>