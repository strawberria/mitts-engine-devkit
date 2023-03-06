<script lang="ts">
    import { mutate, projectStore } from "../utilities/project";
    import { createEventDispatcher } from "svelte";
    import { writable, Writable } from "svelte/store";
    import type { SelectorRadioData, StoredData } from "../utilities/typings";
    import IconButton from "./IconButton.svelte";
    import Section from "./Section.svelte";
    import SelectorRadio from "./SelectorRadio.svelte";

    export let height = null;
    export let width = null;
    export let nobuttons = false;
    export let noheader = false;
    export let selectedIDStore: Writable<string | null> = writable(null);
    // export let allowUnlinking: boolean = true;
    export let selectorRadioData: SelectorRadioData[];
    export let order: string[];
    export let data: StoredData<any>;
    export let defaultValue: any;
    
    const dispatch = createEventDispatcher();
    function forward(event: any) { dispatch("dispatchClick", event.detail); }

    function callback() {
        $projectStore = $projectStore;
    }

    // Copied from Section
    export let label: string;
    let customClass: string = "";
    let customStyle: string = "";
    export let innerClass: string = "";
    export { customClass as class, customStyle as style };
</script>

<Section height={height}
    width={width}
    noheader={noheader}
    label={label}
    class={customClass}
    innerClass={`scrollbar-thin scrollbar-thumb-slate-700 overflow-x-hidden
        pr-4
        ${innerClass}`}
    style={customStyle}>
    <svelte:fragment slot="header">
        <slot name="header" />
        {#if !nobuttons}
            <div class="flex flex-row space-x-1">
                <div class="flex flex-row space-x-1">
                    <IconButton onclick={() => { mutate.genericAdd(order, data, defaultValue, selectedIDStore); callback(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </IconButton>
                    <IconButton onclick={() => { mutate.genericMoveUp(order, selectedIDStore); callback(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </IconButton>
                    <IconButton onclick={() => { mutate.genericMoveDown(order, selectedIDStore); callback(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </IconButton>
                    <IconButton onclick={() => { mutate.genericDelete(order, data, selectedIDStore); callback(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </IconButton>
                    <IconButton onclick={() => { mutate.genericDuplicate(order, data, selectedIDStore); callback(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </IconButton>
                    <!-- {#if allowUnlinking}
                        <IconButton onclick={() => { mutate.genericUnlink(order, data, selectedIDStore); callback(); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="5 4 16 14" fill="currentColor">
                                <path style="fill-opacity:1;" d="M 3.035156 0.84375 L 4.019531 1.828125 C 4.410156 2.222656 4.5625 2.796875 4.410156 3.332031 C 4.261719 3.871094 3.835938 4.285156 3.296875 4.417969 L 4.164062 5.285156 C 4.914062 4.890625 5.433594 4.164062 5.5625 3.324219 C 5.691406 2.484375 5.414062 1.632812 4.8125 1.03125 L 4.625 0.84375 Z M 2.457031 1.332031 C 1.703125 1.722656 1.183594 2.449219 1.054688 3.289062 C 0.925781 4.128906 1.203125 4.976562 1.804688 5.578125 L 5.929688 9.699219 C 5.972656 9.273438 6.09375 8.855469 6.28125 8.464844 L 2.597656 4.78125 C 2 4.179688 2 3.203125 2.601562 2.601562 C 2.796875 2.398438 3.046875 2.261719 3.324219 2.203125 Z M 6.320312 2.539062 C 6.332031 2.648438 6.339844 2.757812 6.34375 2.867188 C 6.347656 3.246094 6.292969 3.625 6.175781 3.984375 L 9.589844 7.398438 C 10.019531 7.835938 10.152344 8.488281 9.921875 9.0625 C 9.695312 9.632812 9.148438 10.015625 8.53125 10.03125 C 8.507812 10.359375 8.628906 10.679688 8.863281 10.910156 L 9.050781 11.097656 C 10.007812 10.894531 10.777344 10.183594 11.054688 9.246094 C 11.332031 8.308594 11.074219 7.292969 10.386719 6.597656 Z M 12.726562 3.707031 L 12.683594 5.996094 L 13.808594 6.019531 L 13.851562 3.726562 Z M 16.570312 4.246094 L 15.273438 6.363281 L 16.234375 6.949219 L 17.53125 4.832031 Z M 19.382812 6.769531 L 17.289062 7.742188 L 17.761719 8.765625 L 19.859375 7.792969 Z M 8.480469 7.351562 C 8.203125 7.46875 7.949219 7.625 7.71875 7.816406 C 7.652344 7.871094 7.589844 7.929688 7.527344 7.992188 C 6.441406 9.082031 6.355469 10.820312 7.328125 12.011719 C 7.394531 12.089844 7.460938 12.167969 7.535156 12.242188 L 11.851562 16.558594 C 12.042969 16.75 12.261719 16.917969 12.496094 17.050781 C 12.242188 16.503906 12.132812 15.898438 12.1875 15.300781 L 8.332031 11.441406 C 8.285156 11.398438 8.242188 11.351562 8.203125 11.300781 C 8.160156 11.253906 8.125 11.203125 8.089844 11.148438 C 7.59375 10.40625 7.691406 9.417969 8.324219 8.785156 C 8.363281 8.75 8.398438 8.714844 8.441406 8.679688 C 8.675781 8.480469 8.957031 8.34375 9.257812 8.28125 C 9.222656 8.148438 9.152344 8.027344 9.054688 7.929688 Z M 11.824219 7.71875 C 11.914062 8.117188 11.933594 8.527344 11.882812 8.9375 L 12.695312 9.234375 C 12.886719 9.316406 13.109375 9.289062 13.273438 9.15625 C 13.433594 9.027344 13.511719 8.816406 13.472656 8.613281 C 13.433594 8.40625 13.285156 8.242188 13.085938 8.179688 Z M 18.277344 10.15625 L 18.246094 11.28125 L 20.382812 11.34375 L 20.417969 10.222656 Z M 15.414062 10.664062 C 15.230469 10.664062 15.054688 10.753906 14.949219 10.902344 C 14.84375 11.054688 14.820312 11.246094 14.882812 11.417969 L 15.742188 13.785156 C 15.988281 14.472656 15.816406 15.242188 15.300781 15.757812 L 15.296875 15.761719 C 15.1875 15.871094 15.070312 15.960938 14.941406 16.042969 C 14.96875 16.078125 14.996094 16.117188 15.03125 16.148438 L 15.742188 16.859375 C 15.863281 16.769531 15.980469 16.667969 16.089844 16.558594 L 16.09375 16.554688 C 16.921875 15.726562 17.195312 14.5 16.796875 13.398438 L 15.933594 11.03125 C 15.910156 10.960938 15.871094 10.894531 15.820312 10.839844 C 15.726562 10.742188 15.601562 10.683594 15.46875 10.667969 C 15.449219 10.664062 15.429688 10.664062 15.414062 10.664062 Z M 14.6875 13.089844 C 13.832031 13.402344 13.195312 14.128906 12.996094 15.019531 C 12.800781 15.910156 13.066406 16.839844 13.710938 17.484375 L 13.914062 17.683594 L 17.710938 21.480469 C 17.660156 20.996094 17.710938 20.507812 17.855469 20.042969 L 17.855469 20.039062 L 14.503906 16.6875 C 14.140625 16.320312 13.980469 15.796875 14.085938 15.289062 C 14.1875 14.78125 14.539062 14.359375 15.019531 14.164062 C 15.019531 14.160156 15.015625 14.15625 15.015625 14.148438 L 15.027344 14.160156 C 15.058594 14.148438 15.089844 14.136719 15.121094 14.128906 C 15.121094 14.125 15.121094 14.121094 15.121094 14.117188 C 15.101562 14.125 15.082031 14.128906 15.0625 14.136719 C 15.054688 14.109375 15.046875 14.074219 15.035156 14.046875 Z M 17.695312 13.910156 L 17.691406 13.914062 C 17.714844 14.089844 17.726562 14.269531 17.726562 14.445312 C 17.722656 14.605469 17.710938 14.769531 17.691406 14.929688 C 17.667969 15.089844 17.636719 15.246094 17.597656 15.402344 L 20.046875 17.855469 L 21.496094 19.304688 C 21.890625 19.699219 22.039062 20.273438 21.890625 20.808594 C 21.742188 21.347656 21.316406 21.761719 20.773438 21.894531 L 21.640625 22.761719 C 22.394531 22.367188 22.914062 21.640625 23.042969 20.800781 C 23.171875 19.960938 22.890625 19.109375 22.292969 18.507812 Z M 19.804688 18.671875 C 19.566406 18.796875 19.347656 18.957031 19.15625 19.148438 C 18.113281 20.191406 18.113281 21.882812 19.152344 22.925781 L 19.382812 23.15625 L 20.972656 23.15625 L 19.949219 22.128906 C 19.554688 21.734375 19.40625 21.160156 19.554688 20.625 C 19.703125 20.085938 20.132812 19.671875 20.671875 19.539062 Z M 19.804688 18.671875 "/>
                            </svg>
                        </IconButton>
                    {:else}
                        <div style="width: 2.25em" />
                    {/if} -->
                </div>
            </div>
        {/if}
    </svelte:fragment>
    <svelte:fragment slot="pre-content">
        <slot name="pre-content" />
    </svelte:fragment>
    <svelte:fragment slot="content">
        <SelectorRadio selectedID={$selectedIDStore}
            selectorRadioData={selectorRadioData}
            on:dispatchClick={forward} />
    </svelte:fragment>
</Section>