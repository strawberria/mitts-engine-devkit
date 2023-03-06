<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import IconButton from "./IconButton.svelte";

    export let index: number;
    export let tag: string;
    export let selected: boolean;
    let customClass: string;
    export { customClass as class };

    const dispatch = createEventDispatcher();
    function handleClick() { dispatch("dispatchClick", { index: index }); }
</script>

<div class={`flex flex-row items-center justify-between space-x-1
    rounded border 
    p-2 pl-4 pr-2
    text-slate-400 bg-slate-775 border-slate-700
    ${customClass}`}
    >
    <p class="text-left w-11/12 min-w-0 truncate">
        {tag} 
    </p>
    <IconButton onclick={handleClick}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    </IconButton>
</div>