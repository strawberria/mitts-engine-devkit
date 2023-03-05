<script lang="ts">
    import type { NavigationTabData } from "../utilities/typings";

    // By default, show the first tab on startup
    export let navigationTabsData: NavigationTabData;
    export let selectedTab: string;
</script>

<div class="relative grow">
    {#each Object.entries(navigationTabsData) as [navigationTabKey, navigationTabData]}
        <div class="absolute inset-0 bg-slate-900 text-slate-300 p-3"
            class:shown={selectedTab === navigationTabKey}
            class:not-shown={selectedTab !== navigationTabKey}>
            <svelte:component this={navigationTabData.component} />
        </div>
    {/each}
</div>  

<style>
    .shown { z-index: 20 }
    .not-shown { z-index: 10 }
</style>