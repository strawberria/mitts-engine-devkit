<script lang="ts">
    import StorageImagePreview from "../sections/StorageImagePreview.svelte";
    import StorageImageSelector from "../sections/StorageImageSelector.svelte";
    import StorageSelectedImage from "../sections/StorageSelectedImage.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <StorageImageSelector />
        <StorageSelectedImage />
    </SectionCol>
    <!-- Have to set width otherwise image expands -->
    <SectionCol width={65}>
        <StorageImagePreview />
    </SectionCol>
</SectionRow>