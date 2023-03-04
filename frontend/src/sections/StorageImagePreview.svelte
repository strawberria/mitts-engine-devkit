<script lang="ts">
    import Section from "../components/Section.svelte";
    import { selectedImageIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
</script>

{#if $selectedImageIDStore !== null 
    && $projectStore.data.images[$selectedImageIDStore].imageb64 !== null}
    <Section class="h-full" 
        innerClass="flex flex-row items-center justify-center h-full">
        <svelte:fragment slot="content">
            <img class="h-full"
                src={$projectStore.data.images[$selectedImageIDStore].imageb64}
                style="object-fit: scale-down" />
        </svelte:fragment>
    </Section>
{/if}