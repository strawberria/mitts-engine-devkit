<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown'
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
    <SectionCol width={30}>
        <MetadataActionSelector />
        <Section class="shrink-0" 
            style="height: 19em" 
            label="Selected Action"
            hidden={$selectedActionIDStore === null}>
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
    </SectionCol>
    <SectionCol style="width: calc(35% - 0.75em)">
        <Section label="Game Information">
            <svelte:fragment slot="content">
                <LabelTextInput bind:value={$projectStore.game.metadata.title}
                    label={"Title"}
                    placeholder={"Mae's Perilous Escape Attempt"}
                    valid={$bundleValidStore.metadata.title} />
                <div class="flex flex-row items-center space-x-3">
                    <LabelTextInput class="grow" 
                        bind:value={$projectStore.game.metadata.author}
                        label={"Author"}
                        placeholder={"strawber!ria"}
                        valid={$bundleValidStore.metadata.author} />
                    <LabelTextInput class="grow" 
                        bind:value={$projectStore.game.metadata.version}
                        label={"Version"}
                        placeholder={"1.0.0"}
                        valid={$bundleValidStore.metadata.version} />
                </div>
                <LabelTextArea bind:value={$projectStore.game.metadata.synopsis}
                    rows={12}
                    label={"Synopsis"}
                    placeholder={"Mae awakens within a dark basement, alone and heavily restrained..."}
                    valid={$bundleValidStore.metadata.synopsis} />
            </svelte:fragment>
        </Section>
    </SectionCol>
    <SectionCol style="width: calc(35% - 0.75em)">
        <Section nogrow={true}>
            <svelte:fragment slot="content">
                <p>
                    Tip: most long-form text including synopsis, state descriptions, examine text, and other dialog content support very basic markdown!
                    Here are some examples:
                </p>
                <div class="text-left">
                    <SvelteMarkdown source={"\\*\\*bold text\\*\\* = **bold text**"} />
                    <SvelteMarkdown source={"\\*\\*italics text\\*\\* = *italics text*"} />
                </div>
                <p>(other features currently not supported...)</p>
            </svelte:fragment>
        </Section>
        <Section innerClass="grow">
            <svelte:fragment slot="content">
                <LabelTextArea class="grow" 
                    bind:value={$projectStore.game.metadata.notes}
                    label="Development Notes"
                    valid={true} />
            </svelte:fragment>
        </Section> 
    </SectionCol>
</SectionRow>