<script lang="ts">
    export let label: string;
    export let placeholder: string = "";
    export let value: string;
    export let valid: boolean = true;
    let customClass: string = "";
    export { customClass as class };
</script>

<div class={`flex flex-col items-start space-y-0.5
    ${customClass}`}>
    <p class="pl-1 
        text-slate-400 text-sm">
        {label}
    </p>
    <input class={`w-full grow
        bg-inherit
        rounded-sm border placeholder-slate-500 focus:outline-none
        text-l text-slate-350
        pl-2 pr-2 pt-1 pb-1
        ${!valid ? "border-red-800 focus:border-red-600" : "border-slate-500 focus:border-slate-400"}`}
        placeholder={placeholder} 
        bind:value={value} />
</div>