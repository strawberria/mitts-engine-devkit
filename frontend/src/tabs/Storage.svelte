<script lang="ts">
    import StorageImagePreview from "../sections/StorageImagePreview.svelte";
    import StorageImageSelector from "../sections/StorageImageSelector.svelte";
    import StorageSelectedImage from "../sections/StorageSelectedImage.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <StorageImageSelector height={60} />
        <StorageSelectedImage />
    </SectionCol>
    <!-- Have to set width otherwise image expands -->
    <!-- class="basis-0"  -->
    <SectionCol style="width: calc(65% - 0.75em)">
        <StorageImagePreview />
    </SectionCol>
</SectionRow>