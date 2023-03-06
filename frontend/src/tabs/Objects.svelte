<script lang="ts">
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import LabelToggle from "../components/LabelToggle.svelte";
    import ObjectsObjectSelector from "../sections/ObjectsObjectSelector.svelte";
    import ObjectsObjectTagSelector from "../sections/ObjectsObjectTagSelector.svelte";
    import Section from "../components/Section.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
    import { selectedObjectIDStore } from "../utilities/constants";
    import { bundleValidStore, projectStore } from "../utilities/project";
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <ObjectsObjectSelector height={100}/>
    </SectionCol>
    <SectionCol style="width: calc(32.5% - 0.75em)">
        {#if $selectedObjectIDStore !== null}
            <Section nogrow={true} 
                label="Selected Object">
                <svelte:fragment slot="content">
                    <LabelTextInput bind:value={$projectStore.data.objects[$selectedObjectIDStore].devName}
                        label={"Development Name"}
                        placeholder={"Small Key (star-shaped lock)"}
                        valid={$bundleValidStore.objects.objects[$selectedObjectIDStore].devName} />
                    <LabelTextInput bind:value={$projectStore.data.objects[$selectedObjectIDStore].name}
                        label={"Name"}
                        placeholder={"Small Key"}
                        valid={$bundleValidStore.objects.objects[$selectedObjectIDStore].name} />
                    <LabelTextArea bind:value={$projectStore.data.objects[$selectedObjectIDStore].examine}
                        rows={4}
                        label={"Examine Text"}
                        placeholder={"A small key with a star-shaped end - hopefully it fits at least one of the locks on your restraints."}
                        valid={$bundleValidStore.objects.objects[$selectedObjectIDStore].examine} />
                    <LabelToggle bind:value={$projectStore.data.objects[$selectedObjectIDStore].initial}
                        label={"Initially Revealed"} />
                </svelte:fragment>
            </Section>
        {/if}
    </SectionCol>
    <SectionCol style="width: calc(32.5% - 0.75em)">
        {#if $selectedObjectIDStore !== null}
            <ObjectsObjectTagSelector height={60} />
        {/if}
    </SectionCol>
</SectionRow>