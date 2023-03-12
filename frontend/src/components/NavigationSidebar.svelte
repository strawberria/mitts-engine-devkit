<script lang="ts">
    import IconButton from "./IconButton.svelte";
    import { engineVersion, playGameStore, selectedTabStore } from "../utilities/constants";
    import { bundleValidStore, mutate, validStore } from "../utilities/project";
    import type { NavigationTabData } from "../utilities/typings";
    import { recursiveCheckValid } from "../utilities/validation";

    export let navigationTabsData: NavigationTabData = {};

    let overallValid = false;
    bundleValidStore.subscribe(bundleValidData => { overallValid = recursiveCheckValid(bundleValidData); });
</script>

<div class="h-full w-60
    flex flex-col items-center
    bg-slate-800
    pt-2 pb-2">
    <p class="pl-3 pr-3 pb-0.5
        text-xl font-medium text-slate-300 hover:text-slate-350
        cursor-pointer hover:underline">
        Captive-Engine Development Kit
    </p>
    <p class="text-l text-slate-300 
        pointer-events-none">
        Version {engineVersion}
    </p>

    <span class="h-3" />

    {#if !$playGameStore}
        {#each Object.entries(navigationTabsData) as [navigationTabKey, navigationTabData]}
            <div class={`w-full pl-4 pr-2 pt-1 pb-1
                text-l text-left flex flex-row
                cursor-pointer select-none
                ${$selectedTabStore === navigationTabKey
                    ? "text-slate-200 bg-slate-600"
                    : "text-slate-350 hover:text-slate-300 hover:bg-slate-700"}`}
                on:click={() => { $selectedTabStore = navigationTabKey; }}>
                    <p>{navigationTabData.display}</p>
                    <div class="grow" />
                    {#if !$validStore[navigationTabKey]}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ef4444" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    {/if}
            </div>
        {/each}
    {/if}

    <div class="grow" />

    {#if !$playGameStore}
        <div class="flex flex-row items-center space-x-2
            mb-2">
            <IconButton label="Import"
                class="w-22"
                onclick={mutate.importProject}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </IconButton>
            <IconButton label="Export"
                class="w-24"
                onclick={mutate.exportProject}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </IconButton>
        </div>
    {/if}
    <div class="flex flex-row items-center space-x-2
        mb-2">
        <IconButton class={`w-32 ${!overallValid ? "cursor-not-allowed" : ""}`}
            label={$playGameStore ? "Stop Game" : "Play Game"}
            disabled={!recursiveCheckValid($bundleValidStore)}
            onclick={() => { $playGameStore = !$playGameStore; }}>
            {#if $playGameStore}
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>        
            {/if}
        </IconButton>
    </div>
</div>