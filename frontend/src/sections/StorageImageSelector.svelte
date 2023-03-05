<script lang="ts">
    import RadioImage from "../components/RadioImage.svelte";
    import SectionRadio from "../components/SectionRadio.svelte";
    import { selectedImageIDStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { ProjectImageData, SelectorRadioData } from "../utilities/typings";

    export let height: number | null = null;

    let selectorRadioData: SelectorRadioData[] = [];
    projectStore.subscribe(projectData => {
        selectorRadioData = projectData.game.images
            .map((id): [string, ProjectImageData] => [id, projectData.data.images[id]])
            .map(([id, actionData]): SelectorRadioData => ({
                id: id,
                component: RadioImage,
                props: { data: actionData }
            })
        );
    });

    const deselectable = true;
    function handleClick(event: any) {
        if($selectedImageIDStore !== event.detail.id) {
            $selectedImageIDStore = event.detail.id;
        } else if(deselectable) {
            $selectedImageIDStore = null;
        }
    }
</script>

<!-- allowUnlinking={false} -->
<SectionRadio height={height}
    label="Game Images"
    selectedIDStore={selectedImageIDStore}
    selectorRadioData={selectorRadioData}
    order={$projectStore.game.images}
    data={$projectStore.data.images}
    defaultValue={{ imageb64: null, devName: "", resolution: null }}
    on:dispatchClick={handleClick}>
</SectionRadio>