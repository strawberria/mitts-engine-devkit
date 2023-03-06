<script lang="ts">
    import IconButton from "../components/IconButton.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import Section from "../components/Section.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
    import StorageImageSelector from "../sections/StorageImageSelector.svelte";
    import { LoadImage } from "../../wailsjs/go/main/Bridge";
    import { selectedImageIDStore } from "../utilities/constants";
    import { bundleValidStore, projectStore } from "../utilities/project";

    async function uploadImage() {
        const imageb64 = await LoadImage();
        if(imageb64 === "") { return; } // No image selected
        const resolution: [number, number] = await new Promise((resolve) => {
            const image = new Image();
            image.onload = function() {
                resolve([image.width, image.height]);
            }
            image.src = imageb64;
        });
        $projectStore.data.images[$selectedImageIDStore].imageb64 = imageb64;
        $projectStore.data.images[$selectedImageIDStore].resolution = resolution;
    }

    function deleteImage() {
        $projectStore.data.images[$selectedImageIDStore].imageb64 = null;
        $projectStore.data.images[$selectedImageIDStore].resolution = null;
    }
</script>

<SectionRow height={100}>
    <SectionCol width={35}>
        <StorageImageSelector height={70} />
        {#if $selectedImageIDStore !== null}
            <Section label="Selected Image">
                <svelte:fragment slot="content">
                    <LabelTextInput class="w-3/4" 
                        bind:value={$projectStore.data.images[$selectedImageIDStore].devName}
                        label={"Development Name"}
                        placeholder={"Bedroom (darkened)"}
                        valid={$bundleValidStore.storage.images[$selectedImageIDStore].devName} />
                    <div class="flex flex-row items-center space-x-4 w-full h-12">
                        <div class="flex flex-row space-x-2">
                            <!-- hacky h-10 to ensure buttons are same height -->
                            <IconButton label="Upload"
                                class={`h-10 w-22 border border-red-700 ${$bundleValidStore.storage.images[$selectedImageIDStore].imageb64
                                    ? "border-opacity-0" : ""}`}
                                onclick={uploadImage}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </IconButton>
                            {#if $projectStore.data.images[$selectedImageIDStore].imageb64 !== null}
                                <IconButton class="h-10 w-10" 
                                    onclick={deleteImage}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </IconButton>
                            {/if}
                        </div>
                        {#if $projectStore.data.images[$selectedImageIDStore].imageb64 !== null}
                            <p class="text-slate-400 text-start">
                                Resolution: {$projectStore.data.images[$selectedImageIDStore].resolution.join(" x ")}
                            </p>
                        {/if}
                    </div>
                </svelte:fragment>
            </Section>
        {/if}
    </SectionCol>
    <!-- Have to set width otherwise image expands -->
    <!-- class="basis-0"  -->
    <SectionCol style="width: calc(65% - 0.75em)">
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
    </SectionCol>
</SectionRow>