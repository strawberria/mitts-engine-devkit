<script lang="ts">
    import { writable, Writable } from "svelte/store";
    import IconButton from "../components/IconButton.svelte";
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import LabelToggle from "../components/LabelToggle.svelte";
    import LocationsLocationSelector from "../sections/LocationsLocationSelector.svelte";
    import LocationsMinimap from "../sections/LocationsMinimap.svelte";
    import LocationsObjectSelector from "../sections/LocationsObjectSelector.svelte";
    import Section from "../components/Section.svelte";
    import SectionCol from "../components/SectionCol.svelte";
    import SectionRow from "../components/SectionRow.svelte";
    import { selectedLocationIDStore, selectedLocationObjectIDStore } from "../utilities/constants";
    import { bundleValidStore, projectStore } from "../utilities/project";
    import type { ProjectImageData, ProjectObjectData, SelectChoiceData } from "../utilities/typings";

    let locationImageChoiceData: SelectChoiceData[] = [];
    projectStore.subscribe(projectData => {
        locationImageChoiceData = [
            { key: null, display: "", enabled: true },
            ...projectData.game.images
                .map((imageID): [string, ProjectImageData] => [imageID, projectData.data.images[imageID]])
                .map(([imageID, imageData]) => ({
                    key: imageID,
                    display: imageData.devName,
                    enabled: true
                }))
        ];
    });

    let locationObjectTypeChoiceData: SelectChoiceData[] = [
        { key: "circle", display: "Circle", enabled: true },
        { key: "vector", display: "Vector", enabled: true }
    ];

    // Yes, the name is very awkward
    let locationObjectObjectChoiceData: SelectChoiceData[] = [];
    projectStore.subscribe(projectData => {
        locationObjectObjectChoiceData = [
            { key: null, display: "", enabled: true },
            ...projectData.game.objects
                .map((objectID): [string, ProjectObjectData] => [objectID, projectData.data.objects[objectID]])
                .map(([objectID, objectData]): SelectChoiceData => ({
                    key: objectID, display: objectData.devName, enabled: true
                })),
        ];
    })

    function clearMinimapObjectArgs() {
        $projectStore.data.locations[$selectedLocationIDStore].data.locationObjects
            [$selectedLocationObjectIDStore].args = [];
    }
</script>

<SectionRow height={100}>
    <SectionCol width={30}>
        <LocationsLocationSelector />
        <Section class="shrink-0" 
            style="height: 19.5em" 
            label="Selected Location"
            hidden={$selectedLocationIDStore === null}>
            <svelte:fragment slot="content">
                <LabelTextInput class="w-full" 
                    bind:value={$projectStore.data.locations[$selectedLocationIDStore].devName}
                    label={"Development Name"}
                    placeholder={"Basement (dark)"}
                    valid={$bundleValidStore.locations.locations[$selectedLocationIDStore].devName} />
                <LabelTextInput class="w-full" 
                    bind:value={$projectStore.data.locations[$selectedLocationIDStore].name}
                    label={"Name"}
                    placeholder={"Basement"}
                    valid={$bundleValidStore.locations.locations[$selectedLocationIDStore].name} />
                <LabelSelect class="w-2/3"
                    bind:value={$projectStore.data.locations[$selectedLocationIDStore].imageID}
                    choicesData={locationImageChoiceData}
                    label={"Minimap Image"}
                    valid={$bundleValidStore.locations.locations[$selectedLocationIDStore].imageID} />
                <LabelToggle class="w-1/3" 
                    bind:value={$projectStore.data.locations[$selectedLocationIDStore].initial}
                    label={"Initially Available"} />
            </svelte:fragment>
        </Section>
    </SectionCol>
    <SectionCol style="width: calc(35% - 0.75rem)">
        {#if $selectedLocationIDStore !== null}
            <LocationsObjectSelector />
            <LocationsMinimap class="shrink-0" 
                style="height: calc(70% - 0.75rem)" />
        {/if}
    </SectionCol>
    <SectionCol style="width: calc(35% - 0.75rem)">
        <!-- Hacky failsafe -->
        {#if $selectedLocationIDStore !== null && $selectedLocationObjectIDStore !== null}
            <Section label="Selected Minimap Object"
                nogrow={true}>
                <svelte:fragment slot="header">
                    <IconButton label="Clear Hitbox"
                        onclick={clearMinimapObjectArgs}>
                        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>                  
                    </IconButton>          
                </svelte:fragment>
                <svelte:fragment slot="content">
                    <LabelTextInput class="w-full" 
                        bind:value={$projectStore.data.locations[$selectedLocationIDStore].data.locationObjects[$selectedLocationObjectIDStore].devName}
                        label={"Development Name"}
                        placeholder={"Bedroom Door (locked)"}
                        valid={$bundleValidStore.locations.locations[$selectedLocationIDStore].locationObjects[$selectedLocationObjectIDStore].devName} />
                    <div class="flex flex-row w-full space-x-3">
                        <LabelSelect class="w-2/3"
                            bind:value={$projectStore.data.locations[$selectedLocationIDStore].data.locationObjects[$selectedLocationObjectIDStore].type}
                            onchange={clearMinimapObjectArgs}
                            choicesData={locationObjectTypeChoiceData}
                            label={"Minimap Object Type"} />
                        <!-- <div class="flex flex-col grow justify-center basis-0">
                            {#if !$bundleValidStore.locations.locations[$selectedLocationIDStore].locationObjects[$selectedLocationObjectIDStore].args}
                                <p class="h-6 pt-2 text-lg text-red-700">
                                    data missing!
                                </p>
                            {/if}
                        </div> -->
                    </div>
                    <LabelSelect class="w-full"
                        bind:value={$projectStore.data.locations[$selectedLocationIDStore].data.locationObjects[$selectedLocationObjectIDStore].objectID}
                        choicesData={locationObjectObjectChoiceData}
                        label={"Referenced Object"} />
                    <LabelTextArea bind:value={$projectStore.data.locations[$selectedLocationIDStore].data.locationObjects[$selectedLocationObjectIDStore].dialog}
                        label="Dialog Text"
                        placeholder={"Within the darkness, you're barely able to make out a small key wedged underneath the shelving."}
                        valid={true}
                        rows={8} />
                    <!-- No executed interaction in this version -->
                </svelte:fragment>
            </Section>
        {/if}
    </SectionCol>
</SectionRow>