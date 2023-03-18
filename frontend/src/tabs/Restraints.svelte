<script lang="ts">
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import RestraintsLocationSelector from "../sections/RestraintsLocationSelector.svelte";
    import RestraintsRestraintSelector from "../sections/RestraintsRestraintSelector.svelte";
    import RestraintsRestraintTagSelector from "../sections/RestraintsRestraintTagSelector.svelte";
    import Section from "../components/Section.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
    import { selectedRestraintIDStore, selectedRestraintLocationIDStore } from "../utilities/constants";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import type { ProjectRestraintData, ProjectRestraintLocationData, SelectChoiceData } from "../utilities/typings";

    let restraintRestraintLocationChoiceData: SelectChoiceData[] = [];
    projectStore.subscribe(projectData => {
        restraintRestraintLocationChoiceData = [
            { key: null, display: "", enabled: true },
            ...projectData.game.restraintLocations
                .map((restraintLocationID): [string, ProjectRestraintLocationData] => 
                    [restraintLocationID, projectData.data.restraintLocations[restraintLocationID]])
                .map(([restraintLocationID, restraintLocationData]): SelectChoiceData => ({
                    key: restraintLocationID, display: restraintLocationData.name, enabled: true
                })),
        ];
    });

    let restraintLocationInitialChoiceData: SelectChoiceData[] = [];
    function updateRestraintLocationInitialChoiceData() {
        if($selectedRestraintLocationIDStore === null) { return; }
        restraintLocationInitialChoiceData = [
            { key: null, display: "", enabled: true },
            ...$projectStore.game.restraints
                .map((restraintID): [string, ProjectRestraintData] => [restraintID, $projectStore.data.restraints[restraintID]])
                .filter(([restraintID, restraintData]) => restraintData.restraintLocationID === $selectedRestraintLocationIDStore)
                .map(([restraintID, restraintData]): SelectChoiceData => ({
                    key: restraintID, display: restraintData.devName, enabled: true
                })),
        ];
    }

    projectStore.subscribe(updateRestraintLocationInitialChoiceData);
    selectedRestraintLocationIDStore.subscribe(updateRestraintLocationInitialChoiceData);
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <RestraintsLocationSelector/>
        <Section style="height: 16em" 
            label="Selected Restraint Location"
            hidden={$selectedRestraintLocationIDStore === null}>
            <svelte:fragment slot="content">
                <LabelTextInput class="w-2/3" 
                    bind:value={$projectStore.data.restraintLocations[$selectedRestraintLocationIDStore].name}
                    label={"Name"}
                    placeholder={"Hands"}
                    valid={$bundleValidStore.restraints.restraintLocations[$selectedRestraintLocationIDStore].name} />
                <LabelTextInput class="w-2/3" 
                    bind:value={$projectStore.data.restraintLocations[$selectedRestraintLocationIDStore].sentencePhrase}
                    label={"Sentence Phrase"}
                    placeholder={"your hands"}
                    valid={$bundleValidStore.restraints.restraintLocations[$selectedRestraintLocationIDStore].sentencePhrase} />
                <LabelSelect class="w-1/2" 
                    bind:value={$projectStore.data.restraintLocations[$selectedRestraintLocationIDStore].initialRestraintID}
                    choicesData={restraintLocationInitialChoiceData}
                    label={"Initial Restraint"} />
            </svelte:fragment>
        </Section>
    </SectionCol>
    <SectionCol style="width: calc(32.5% - 0.75em)">
        <RestraintsRestraintSelector height={100} />
    </SectionCol>
    <SectionCol style="width: calc(32.5% - 0.75em)">
        <Section class="shrink-0" 
            style="height: 32em"
            nogrow={true} 
            label="Selected Restraint"
            hidden={$selectedRestraintIDStore === null}>
            <svelte:fragment slot="content">
                <LabelTextInput bind:value={$projectStore.data.restraints[$selectedRestraintIDStore].devName}
                    label={"Development Name"}
                    placeholder={"Leather Cuffs (locked)"}
                    valid={$bundleValidStore.restraints.restraints[$selectedRestraintIDStore].devName} />
                <LabelTextInput bind:value={$projectStore.data.restraints[$selectedRestraintIDStore].name}
                    label={"Name"}
                    placeholder={"Leather Cuffs"}
                    valid={$bundleValidStore.restraints.restraints[$selectedRestraintIDStore].name} />
                <LabelTextInput bind:value={$projectStore.data.restraints[$selectedRestraintIDStore].sentencePhrase}
                    label={"Sentence Phrase"}
                    placeholder={"the leather cuffs"}
                    valid={$bundleValidStore.restraints.restraints[$selectedRestraintIDStore].sentencePhrase} />
                <LabelSelect class="w-1/2" 
                    bind:value={$projectStore.data.restraints[$selectedRestraintIDStore].restraintLocationID}
                    choicesData={restraintRestraintLocationChoiceData}
                    label={"Restraint Location"}
                    valid={$bundleValidStore.restraints.restraints[$selectedRestraintIDStore].restraintLocationID} />
                <LabelTextArea bind:value={$projectStore.data.restraints[$selectedRestraintIDStore].examine}
                    rows={6}
                    label={"Examine Text"}
                    placeholder={"Sturdy yet comfortable leather cuffs, locked onto your wrists with dainty little padlocks."}
                    valid={$bundleValidStore.restraints.restraints[$selectedRestraintIDStore].examine} />
            </svelte:fragment>
        </Section>
        <!-- <Section nogrow={true}>
            <svelte:fragment slot="content">
                <p>
                    Tip: Tag restraints when convenient to simplify interactions (ex: designating 'cuttable' restraints)
                </p>
            </svelte:fragment>
        </Section> -->
        <RestraintsRestraintTagSelector />
    </SectionCol>
</SectionRow>