<script lang="ts">
    import NavigationSidebar from "./components/NavigationSidebar.svelte";
    import NavigationTabs from "./components/NavigationTabs.svelte";
    import Interactions from "./tabs/Interactions.svelte";
    import Metadata from "./tabs/Metadata.svelte";
    import Locations from "./tabs/Locations.svelte";
    import Objects from "./tabs/Objects.svelte";
    import States from "./tabs/States.svelte";
    import Restraints from "./tabs/Restraints.svelte";
    import Images from "./tabs/Images.svelte";
    import { playGameStore } from "./utilities/constants";
    import type { NavigationTabData } from "./utilities/typings";

    // Navigation data representing individual tabs for navigation
    const navigationTabsData: NavigationTabData = {
        "metadata": { display: "Metadata", component: Metadata },
        "images": { display: "Images", component: Images },
        "states": { display: "States", component: States },
        "restraints": { display: "Restraints", component: Restraints },
        "objects": { display: "Objects", component: Objects },
        "interactions": { display: "Interactions", component: Interactions },
        "locations": { display: "Locations", component: Locations },
    };
</script>

<div class="h-full w-full 
    flex flex-row 
    absolute inset-0">
    <NavigationSidebar navigationTabsData={navigationTabsData} />
    <NavigationTabs navigationTabsData={navigationTabsData} />
</div>