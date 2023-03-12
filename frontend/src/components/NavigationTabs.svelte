<script lang="ts">
    import Game from "../Game.svelte";
    import { playGameStore, pulseImportStore, selectedTabStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";
    import type { NavigationTabData } from "../utilities/typings";

    // By default, show the first tab on startup
    export let navigationTabsData: NavigationTabData;
</script>

{#if !$pulseImportStore}
    <div class="relative grow">
        {#each Object.entries(navigationTabsData) as [navigationTabKey, navigationTabData]}
            <div class="absolute inset-0 bg-slate-900 text-slate-300 p-3"
                class:shown={$selectedTabStore === navigationTabKey}
                class:not-shown={$selectedTabStore !== navigationTabKey}>
                <svelte:component this={navigationTabData.component} />
            </div>
        {/each}
        {#if $playGameStore}
            <div class="absolute inset-0 bg-slate-900 text-slate-300 p-3 z-40">
                <Game gameDataStore={projectStore}
                    usingDevkit={true} />
            </div>
        {/if}
    </div>  
{/if}

<style>
    .shown { z-index: 20 }
    .not-shown { z-index: 10 }
</style>