<script lang="ts">
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import LabelToggle from "../components/LabelToggle.svelte";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import Section from "../components/Section.svelte";
    import { selectedActionIDStore } from "../utilities/constants";
</script>

{#if $selectedActionIDStore !== null}
    <Section label="Selected Action">
        <svelte:fragment slot="content">
            <LabelTextInput class="w-3/4" 
                bind:value={$projectStore.data.actions[$selectedActionIDStore].name}
                label={"Name"}
                placeholder={"Use"}
                valid={$bundleValidStore.metadata.actions[$selectedActionIDStore].name} />
            <LabelTextInput class="w-3/4" 
                bind:value={$projectStore.data.actions[$selectedActionIDStore].verb}
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