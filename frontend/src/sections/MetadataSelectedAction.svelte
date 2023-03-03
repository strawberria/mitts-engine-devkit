<script lang="ts">
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import LabelToggle from "../components/LabelToggle.svelte";
    import { projectStore } from "../utilities/project";
    import Section from "../components/Section.svelte";
    import { selectedActionIDStore } from "../utilities/constants";

    selectedActionIDStore
</script>

{#if $selectedActionIDStore !== null}
    <Section label="Selected Action">
        <svelte:fragment slot="content">
            <LabelTextInput class="w-3/4"
                bind:value={$projectStore.data.actions[$selectedActionIDStore].name}
                label={"Name"}
                placeholder={"Use"} />
            <LabelTextInput class="w-1/2"
                bind:value={$projectStore.data.actions[$selectedActionIDStore].verb}
                label={"Verb"}
                placeholder={"with"} />
            <LabelToggle bind:value={$projectStore.data.actions[$selectedActionIDStore].order}
                label={"Order Matters"} />
            <LabelToggle bind:value={$projectStore.data.actions[$selectedActionIDStore].two}
                label={"Optional Second Argument"} />
        </svelte:fragment>
    </Section>
{/if}