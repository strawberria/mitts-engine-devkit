<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ProjectActionData } from "../utilities/typings";

    export let id: string;
    export let selected: boolean;
    export let data: ProjectActionData;
    let customClass: string;
    export { customClass as class };

    const dispatch = createEventDispatcher();
    function handleClick() { dispatch("dispatchClick", { id: id }); }
</script>

<div class={`flex flex-row justify-between space-x-1
    rounded border 
    p-2 pl-4 pr-4
    ${customClass} ${selected === true
        ? "text-slate-300 bg-slate-700 border-slate-500"
        : "text-slate-400 bg-slate-750 border-slate-600"}`}
    on:click={handleClick}>
    <p class="text-left w-11/12 min-w-0 truncate">
        {data.name} {data.verb !== "" ? `[A ${data.verb} B]` : ""}
    </p>
    <p class={`font-mono ${selected === true
        ? "text-slate-500"
        : "text-slate-600"}`}>
        {id}
    </p>
</div>