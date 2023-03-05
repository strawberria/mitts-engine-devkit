<script lang="ts">
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import Section from "../components/Section.svelte";
    import { projectStore, bundleValidStore } from "../utilities/project";
</script>

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