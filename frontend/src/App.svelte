<script lang="ts">
    import NavigationSidebar from "./components/NavigationSidebar.svelte";
    import NavigationTabs from "./components/NavigationTabs.svelte";
    import Interactions from "./tabs/Interactions.svelte";
    import Metadata from "./tabs/Metadata.svelte";
    import Minimap from "./tabs/Minimap.svelte";
    import Objects from "./tabs/Objects.svelte";
    import Progress from "./tabs/Progress.svelte";
    import Restraints from "./tabs/Restraints.svelte";
    import Storage from "./tabs/Storage.svelte";
    import type { NavigationTabData } from "./utilities/typings";

    // Navigation data representing individual tabs for navigation
    const navigationTabsData: NavigationTabData = {
        "metadata": { display: "Metadata", component: Metadata },
        "storage": { display: "Storage", component: Storage },
        "progress": { display: "Progress", component: Progress },
        "restraints": { display: "Restraints", component: Restraints },
        "objects": { display: "Objects", component: Objects },
        "interactions": { display: "Interactions", component: Interactions },
        "minimap": { display: "Minimap", component: Minimap },
    };
    const initialTab: string = Object.keys(navigationTabsData)[0];

    // Currently selected and displayed tab - should layering be used?
    let selectedTab: string = initialTab;
</script>

<div class="h-full w-full 
    flex flex-row 
    absolute inset-0">
    <NavigationSidebar navigationTabsData={navigationTabsData}
        bind:selectedTab={selectedTab} />
    <NavigationTabs navigationTabsData={navigationTabsData}
        bind:selectedTab={selectedTab} />
</div>