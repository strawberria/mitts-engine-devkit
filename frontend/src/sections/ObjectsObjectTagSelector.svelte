<script lang="ts">
    import { writable, Writable } from "svelte/store";
    import IconButton from "../components/IconButton.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import RadioObjectTag from "../components/RadioObjectTag.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedObjectIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let selectorRadioData: SelectorRadioData[] = [];
    // Somehow subscribe not working
    function updateSelectorRadioData() { 
        if($selectedObjectIDStore === null) { return; }
        selectorRadioData = Object.entries($projectStore.data.objects[$selectedObjectIDStore].tags)
            .map(([index, tag]): SelectorRadioData => ({
                id: index,
                component: RadioObjectTag,
                props: { index: index, tag: tag }
            })); 
    }
    projectStore.subscribe(updateSelectorRadioData);
    selectedObjectIDStore.subscribe(updateSelectorRadioData);

    let dummyIDStore: Writable<string | null> = writable(null)
    let objectTagInput: string = "";
    function submitAddTag() {
        if(objectTagInput === ""
            || $projectStore.data.objects[$selectedObjectIDStore].tags
                .indexOf(objectTagInput) !== -1) { return; }
        $projectStore.data.objects[$selectedObjectIDStore].tags.push(objectTagInput);
        $projectStore = $projectStore;
        objectTagInput = "";
    }
    function submitDeleteTag(event) {
        const index = event.detail.index;
        $projectStore.data.objects[$selectedObjectIDStore].tags.splice(index, 1);
        $projectStore = $projectStore;
    }
</script>

<SectionRadio class="min-h-0" 
    height={height} 
    label="Object Tags"
    nobuttons={true}
    noheader={true}
    overridepointer={true}
    selectedIDStore={dummyIDStore}
    selectorRadioData={selectorRadioData}
    order={[]}
    data={{}}
    defaultValue={null}
    on:dispatchClick={submitDeleteTag}>
    <svelte:fragment slot="pre-content">
        <div class="flex flex-row w-full space-x-3 pb-2">
            <LabelTextInput class="grow"
                bind:value={objectTagInput}
                placeholder={"unlocks-star_key"}
                on:submit={submitAddTag} />
            <IconButton label="Add"
                onclick={submitAddTag} />
        </div>
    </svelte:fragment>
</SectionRadio>