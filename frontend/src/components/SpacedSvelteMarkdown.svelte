<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";

    export let source: string;
</script>

<div class="w-full flex flex-col space-y-2">
    {#each source.split("\n") as line}
        <SvelteMarkdown source={line} />
    {/each}
</div>