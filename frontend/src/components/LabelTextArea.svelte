<script lang="ts">
    export let label: string;
    export let placeholder: string = "";
    export let value: string;
    export let rows: number;
    export let valid: boolean = true;
    let customClass: string = "";
    export { customClass as class };
</script>

<div class={`flex flex-col items-start space-y-0.5
    ${customClass}`}>
    <p class="pl-1 
        text-slate-400 text-sm select-none">
        {label}
    </p>
    <div class={`grow w-full rounded-sm
        bg-inherit border focus:outline-none 
        pl-2 pr-2 pt-1 pb-1
        ${!valid ? "border-red-800 focus-within:border-red-600" 
            : "border-slate-500 focus-within:border-slate-400"}`}>
        <textarea class={`w-full h-full
            rounded bg-inherit focus:outline-none
            text-l text-slate-350 placeholder-slate-500
            resize-none overflow-y-auto
            scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden pr-3`}
            rows={rows}
            placeholder={placeholder} 
            bind:value={value} />
    </div>
    
</div>