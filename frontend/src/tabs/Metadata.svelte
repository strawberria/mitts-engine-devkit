<script lang="ts">
    import MetadataActionSelector from "../sections/MetadataActionSelector.svelte";
    import MetadataGameInformation from "../sections/MetadataGameInformation.svelte";
    import MetadataSelectedAction from "../sections/MetadataSelectedAction.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <MetadataActionSelector height={60}/>
        <MetadataSelectedAction />
    </SectionCol>
    <SectionCol width={55}>
        <MetadataGameInformation />
    </SectionCol>
</SectionRow>