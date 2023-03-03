<script lang="ts">
    import MetadataActionSelector from "../sections/MetadataActionSelector.svelte";
    import MetadataGameInformation from "../sections/MetadataGameInformation.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <MetadataActionSelector />
    </SectionCol>
    <SectionCol width={40}>
        <MetadataGameInformation />
    </SectionCol>
</SectionRow>