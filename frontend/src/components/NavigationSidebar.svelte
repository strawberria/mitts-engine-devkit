<script lang="ts">
    import { engineVersion } from "../utilities/constants";
    import { mutate, validStore } from "../utilities/project";
    import type { NavigationTabData } from "../utilities/typings";
    import IconButton from "./IconButton.svelte";

    export let navigationTabsData: NavigationTabData = {};
    export let selectedTab: string;
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

    {#each Object.entries(navigationTabsData) as [navigationTabKey, navigationTabData]}
        <div class={`w-full pl-4 pr-2 pt-1 pb-1
            text-l text-left flex flex-row
            cursor-pointer select-none
            ${selectedTab === navigationTabKey
                ? "text-slate-200 bg-slate-600"
                : "text-slate-350 hover:text-slate-300 hover:bg-slate-700"}`}
            on:click={() => { selectedTab = navigationTabKey; }}>
                <p>{navigationTabData.display}</p>
                <div class="grow" />
                {#if !$validStore[navigationTabKey]}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ef4444" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                {/if}
        </div>
    {/each}

    <div class="grow" />

    <div class="flex flex-row items-center space-x-3
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
</div>