<script lang="ts">
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import LabelToggle from "../components/LabelToggle.svelte";
    import MetadataActionSelector from "../sections/MetadataActionSelector.svelte";
    import Section from "../components/Section.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
    import { selectedActionIDStore } from "../utilities/constants";
    import { projectStore, bundleValidStore } from "../utilities/project";
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <MetadataActionSelector height={60}/>
        {#if $selectedActionIDStore !== null}
            <Section label="Selected Action">
                <svelte:fragment slot="content">
                    <LabelTextInput bind:value={$projectStore.data.actions[$selectedActionIDStore].name}
                        label={"Name"}
                        placeholder={"Use"}
                        valid={$bundleValidStore.metadata.actions[$selectedActionIDStore].name} />
                    <LabelTextInput bind:value={$projectStore.data.actions[$selectedActionIDStore].verb}
                        label={"Verb"}
                        placeholder={"with"}
                        valid={$bundleValidStore.metadata.actions[$selectedActionIDStore].verb} />
                    <!-- <div class="flex flex-row space-x-6"> -->
                    <LabelToggle bind:value={$projectStore.data.actions[$selectedActionIDStore].order}
                        label={"Order Matters"} />
                    <LabelToggle bind:value={$projectStore.data.actions[$selectedActionIDStore].two}
                        label={"Optional Second Argument"} />
                    <!-- </div> -->
                </svelte:fragment>
            </Section>
        {/if}
    </SectionCol>
    <SectionCol width={40}>
        <Section label="Game Information">
            <svelte:fragment slot="content">
                <LabelTextInput bind:value={$projectStore.game.metadata.title}
                    label={"Title"}
                    placeholder={"Mae's Perilous Escape Attempt"}
                    valid={$bundleValidStore["metadata"]["title"]} />
                <div class="flex flex-row items-center space-x-3">
                    <LabelTextInput class="grow" 
                        bind:value={$projectStore.game.metadata.author}
                        label={"Author"}
                        placeholder={"strawber!ria"}
                        valid={$bundleValidStore["metadata"]["author"]} />
                    <LabelTextInput class="grow" 
                        bind:value={$projectStore.game.metadata.version}
                        label={"Version"}
                        placeholder={"1.0.0"}
                        valid={$bundleValidStore["metadata"]["version"]} />
                </div>
                <LabelTextArea bind:value={$projectStore.game.metadata.synopsis}
                    rows={10}
                    label={"Synopsis"}
                    placeholder={"Mae awakens within a dark basement, alone and heavily restrained..."}
                    valid={$bundleValidStore["metadata"]["synopsis"]} />
            </svelte:fragment>
        </Section>
    </SectionCol>
</SectionRow>