<script lang="ts">
    import type { ProjectLocationObjectData } from "src/utilities/typings";
    import { onMount } from "svelte";
    import Section from "../components/Section.svelte";
    import { selectedLocationIDStore, selectedLocationObjectIDStore, selectedTabStore } from "../utilities/constants";
    import { projectStore } from "../utilities/project";

    let customClass: string = "";
    export let style: string = "";
    export { customClass as class };

    // Setup variables for rendering minimap on canvas
    let canvas: HTMLCanvasElement;
    let canvasWidth: number;
    let canvasHeight: number;
    let context: CanvasRenderingContext2D;
    onMount(() => { context = canvas.getContext("2d") as CanvasRenderingContext2D; });

    function constructColor(color: "red" | "green", alpha: number) {
        return `rgba(${color === "red"
            ? "255, 0, 0"
            : "0, 255, 0"}, ${alpha})`;
    }

    function renderMinimapObject(minimapObjectData: ProjectLocationObjectData, color: "red" | "green", dotted: boolean = false) {
        // Render either oval or vector depending on type
        const boundingRect = canvas.getBoundingClientRect();
        context.strokeStyle = constructColor(color, 1);
        if(minimapObjectData.type === "vector") {
            // Iterate over points and draw line, then fill
            // Draw "dots" for each vector point first
            for(const [index, [ratioX, ratioY]] of minimapObjectData.args.entries()) {
                const coordX = Math.floor(ratioX * boundingRect.width);
                const coordY = Math.floor(ratioY * boundingRect.height);
                const path = new Path2D();
                path.arc(coordX, coordY, 2, 0, 2 * Math.PI);

                // Add an additional circle for the "finishing" point when selected
                if(index === 0 && color === "green") { 
                    path.arc(coordX, coordY, 4, 0, 2 * Math.PI);
                }

                context.stroke(path);
            }

            // Draw line beginning from starting point all the way back
            let starting = true;
            const path = new Path2D();
            for(const [ratioX, ratioY] of [...minimapObjectData.args, minimapObjectData.args[0]]) {
                const coordX = Math.floor(ratioX * boundingRect.width);
                const coordY = Math.floor(ratioY * boundingRect.height);
                
                // Move to initial point or draw line
                if(starting === true) {
                    starting = false;
                    path.moveTo(coordX, coordY);
                } else {
                    path.lineTo(coordX, coordY);
                }
            }

            // Reference to vector path
            context.fillStyle = constructColor(color, 0.2);
            context.lineWidth = 2;
            if(dotted === true) { context.setLineDash([5, 15]) }
            context.stroke(path);
            context.fill(path);
            context.setLineDash([]);
        } else { // if(minimapObject.type === "circle")
            // Center point should always be defined, radius not really
            let [[centerRatioX, centerRatioY], radiusPoint] = minimapObjectData.args as [[number, number], [number, number] | undefined];

            const path = new Path2D();
            const centerCoordX = Math.floor(centerRatioX * boundingRect.width);
            const centerCoordY = Math.floor(centerRatioY * boundingRect.height);
            if(radiusPoint === undefined) {
                // Radius not defined, only draw middle dot
                path.arc(centerCoordX, centerCoordY, 2, 0, 2 * Math.PI);
            } else {
                // Radius defined, draw entire circle with small middle dot
                path.arc(centerCoordX, centerCoordY, 1, 0, 2 * Math.PI);
                const radiusCoordX = Math.floor(radiusPoint[0] * boundingRect.width);
                const radiusCoordY = Math.floor(radiusPoint[1] * boundingRect.height);
                const radius = Math.sqrt(Math.pow(centerCoordX - radiusCoordX, 2) + Math.pow(centerCoordY - radiusCoordY, 2));
                path.arc(centerCoordX, centerCoordY, radius, 0, 2 * Math.PI);
            }

            // Reference to circle path
            context.fillStyle = constructColor(color, 0.2);
            context.lineWidth = 2;
            if(dotted === true) { context.setLineDash([5, 15]) }
            context.stroke(path);
            context.fill(path);
            context.setLineDash([]);
        }
    }

    function renderMinimapObjectWrapper(locationObjectData: ProjectLocationObjectData, color: "red" | "green") {
        // Can't render if there's nothing to render
        if(locationObjectData.args[0] === undefined) { 
            return;
        }

        renderMinimapObject(locationObjectData, color, false);
        if(color === "green") {
            // Dotted line around currently selected
            renderMinimapObject(locationObjectData, color, true);
        }
    } 

    // Renders a dumb number of times, can't do anything about it
    function renderCanvas(event?: MouseEvent) {
        // For efficiency, only re-render when tab is selected
        if(context === undefined || $selectedTabStore !== "locations"
            || $selectedLocationIDStore === null || canvas === null) { return; }

        // Clear canvas before re-rendering 
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Only handle onclick if minimap object is selected and points are addable
        // Note: current is undefined if $selectedLocationObjectIDStore is undefined
        const selectedMinimapObjectData = $projectStore.data.locations[$selectedLocationIDStore]
            .data.locationObjects[$selectedLocationObjectIDStore]; 
        if(event !== undefined && selectedMinimapObjectData !== undefined 
            && (selectedMinimapObjectData.type === "vector" 
                || (selectedMinimapObjectData.args[0] === undefined || selectedMinimapObjectData.args[1] === undefined))) {

                // Get position of mouse cursor on click, maintain as percentage
                const boundingRect = canvas.getBoundingClientRect();
                const ratioX = Math.max(Math.floor(event.clientX - boundingRect.left), 0) / boundingRect.width;
                const ratioY = Math.max(Math.floor(event.clientY - boundingRect.top), 0) / boundingRect.height;

                selectedMinimapObjectData.args.push([ratioX, ratioY]);

                // Force update
                $projectStore = $projectStore;
        }

        // Render non-selected objects first
        for(const [minimapObjectID, minimapObjectData] of Object.entries(
            $projectStore.data.locations[$selectedLocationIDStore].data.locationObjects)) {
                if(selectedMinimapObjectData !== undefined
                    && minimapObjectID !== selectedMinimapObjectData.id) {
                        renderMinimapObjectWrapper(minimapObjectData, "red");
                }
        }

        if(selectedMinimapObjectData !== undefined) {
            renderMinimapObjectWrapper(selectedMinimapObjectData, "green");
        }
    }

    selectedTabStore.subscribe(() => { renderCanvas() });
    selectedLocationIDStore.subscribe(() => { renderCanvas() });
    selectedLocationObjectIDStore.subscribe(() => { renderCanvas() });
    projectStore.subscribe(() => { renderCanvas() });
</script>

{#if $selectedLocationIDStore !== null}
    <!-- label="Minimap Preview" -->
    <Section class={`${customClass} aspect-square pb-3`} 
        innerClass="flex flex-row items-center justify-center h-full min-h-0 mt-1"
        nogrow={true}>
        <svelte:fragment slot="content">
            <canvas class="h-full w-full bg-inherit
                border-2 border-slate-700 rounded-sm
                top-0 left-0" 
                style={`background-image: url(${$projectStore.data.locations[$selectedLocationIDStore].imageID !== null
                        && $projectStore.data.images[$projectStore.data.locations
                            [$selectedLocationIDStore].imageID].imageb64 !== null
                                ? $projectStore.data.images[$projectStore.data.locations
                                    [$selectedLocationIDStore].imageID].imageb64
                                : ""}); 
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;`}
                bind:this={canvas}
                width={canvasWidth}
                height={canvasHeight}
                bind:clientWidth={canvasWidth}
                bind:clientHeight={canvasHeight}
                on:click={renderCanvas}>
            </canvas>
        </svelte:fragment>
    </Section>
{/if}