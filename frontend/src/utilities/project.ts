import _ from "lodash-es"
import { Writable, get, writable } from "svelte/store";
import { ExportProject, ImportProject } from "../../wailsjs/go/main/Bridge"
import type { ProjectData, StoredData } from "./typings";
import { engineVersion, randomIDLength, selectedActionIDStore, selectedImageIDStore, 
    selectedRestraintIDStore, selectedRestraintLocationIDStore, selectedStateIDStore, 
    selectedObjectIDStore, 
    selectedInteractionIDStore,
    pulseImportStore,
    selectedInteractionCriteriaIDStore,
    selectedInteractionResultIDStore,
    selectedLocationObjectIDStore,
    selectedLocationIDStore,
    selectedTabStore} from "./constants";
import { metadataValid, imagesValid, statesValid, restraintsValid, objectsValid,
    interactionsValid, 
    locationsValid} from "./validation";

export const projectStore: Writable<ProjectData> = writable<ProjectData>({
    custodial: {
        version: engineVersion,
    },
    game: {
        metadata: {
            title: "",
            author: "",
            version: "",
            synopsis: "",
        },
        actions: [],
        images: [],
        states: [],
        restraintLocations: [],
        restraints: [],
        objects: [],
        interactions: [],
        locations: [],
    },
    data: {
        actions: {},
        images: {},
        states: {},
        restraintLocations: {},
        restraints: {},
        objects: {},
        interactions: {},
        locations: {},
    }
});

export const bundleValidStore: Writable<{ [key: string]: any }> = writable({});
export const validStore: Writable<{ [key: string]: boolean }> = writable({});

// Check whether each is invalid
projectStore.subscribe(projectData => {
    const bundleValidData = get(bundleValidStore);
    const validData = get(validStore);

    [validData["metadata"], bundleValidData["metadata"]] = metadataValid(projectData);
    [validData["images"], bundleValidData["images"]] = imagesValid(projectData);
    [validData["states"], bundleValidData["states"]] = statesValid(projectData);
    [validData["restraints"], bundleValidData["restraints"]] = restraintsValid(projectData);
    [validData["objects"], bundleValidData["objects"]] = objectsValid(projectData);
    [validData["interactions"], bundleValidData["interactions"]] = interactionsValid(projectData);
    [validData["locations"], bundleValidData["locations"]] = locationsValid(projectData);

    bundleValidStore.set(bundleValidData);
    validStore.set(validData);
});

let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class MutateProject {
    async importProject() {
        const rawProjectData = await ImportProject(); 
        const projectData: ProjectData = JSON.parse(rawProjectData);

        pulseImportStore.set(true);

        selectedActionIDStore.set(null);
        selectedImageIDStore.set(null);
        selectedStateIDStore.set(null);
        selectedRestraintLocationIDStore.set(null);
        selectedRestraintIDStore.set(null);
        selectedObjectIDStore.set(null);
        selectedInteractionIDStore.set(null);
        selectedInteractionCriteriaIDStore.set(null);
        selectedInteractionResultIDStore.set(null);
        selectedLocationIDStore.set(null);
        selectedLocationObjectIDStore.set(null);
        
        // Force unmount and remount - 16.66 okay for 60Hz
        setTimeout(() => { 
            pulseImportStore.set(false);
            projectStore.set(projectData);
        }, 50);
    }
    async exportProject() {
        const rawProjectData = JSON.stringify(get(projectStore));
        await ExportProject(rawProjectData);
    }

    genericAdd(order: string[], data: StoredData<any>, defaultValue: any, selectedIDStore: Writable<string | null>) {
        const newID = randomID(randomIDLength);
        // Needed otherwise same reference
        const cloned = _.cloneDeep(defaultValue);
        cloned.id = newID;
        data[newID] = cloned;
        order.push(newID);

        // const selectedID = get(selectedIDStore);
        // if(selectedID === null) { selectedIDStore.set(newID); }
    }
    genericDelete(order: string[], data: StoredData<any>, selectedIDStore: Writable<string | null>) {
        const oldSelectedID = get(selectedIDStore);
        if(oldSelectedID === null) { return; }

        selectedIDStore.set(null);
        // Not sure if delay necessary to allow destroy 
        const idIndex = order.findIndex(id => id === oldSelectedID);
        order.splice(idIndex, 1);
        selectedIDStore.set(order[idIndex]
            ?? order[idIndex-1]
            ?? null);

        // Brute-force cleanup of ID references, replacing with undefined
        const projectData = get(projectStore);
        function recursiveTrimID(currentData: any) {
            // Array: iterate over data and either recursive trim or replace
            for(const [key, data] of Object.entries(currentData)) {
                if(typeof data === "object" && data !== null) {
                    // Object (dictionary) or array
                    recursiveTrimID(data); 
                } else if(data == oldSelectedID) {
                    // Could cause issues with arrays?
                    currentData[key] = Array.isArray(currentData)
                        ? undefined : null;
                }
            }
        }
        recursiveTrimID(projectData);

        // Reset any selected ID stores to null
        function resetIfValue(data: string, value: string, ...stores: Writable<any | null>[]) {
            const shouldReset = data === value;
            if(shouldReset) { stores.forEach(store => store.set(null)); }
            return data === value ? null : data; 
        }
        selectedActionIDStore.update(d => resetIfValue(d, oldSelectedID));
        selectedImageIDStore.update(d => resetIfValue(d, oldSelectedID));
        selectedStateIDStore.update(d => resetIfValue(d, oldSelectedID));
        selectedRestraintLocationIDStore.update(d => resetIfValue(d, oldSelectedID));
        selectedRestraintIDStore.update(d => resetIfValue(d, oldSelectedID));
        selectedObjectIDStore.update(d => resetIfValue(d, oldSelectedID));
        selectedInteractionIDStore.update(d => resetIfValue(d, oldSelectedID, 
            selectedInteractionCriteriaIDStore, selectedInteractionResultIDStore));
        selectedInteractionCriteriaIDStore.update(d => resetIfValue(d, oldSelectedID));
        selectedInteractionResultIDStore.update(d => resetIfValue(d, oldSelectedID));
        selectedLocationIDStore.update(d => resetIfValue(d, oldSelectedID, 
            selectedLocationObjectIDStore));
        selectedLocationObjectIDStore.update(d => resetIfValue(d, oldSelectedID));

        // Only delete after trim to prevent hiccups
        delete data[oldSelectedID];
    }
    genericDuplicate(order: string[], data: StoredData<any>, selectedIDStore: Writable<string | null>) {
        // Deep copy data using lodash utility (does set work?)
        const selectedID = get(selectedIDStore);
        if(selectedID === null) { return; }

        const newID = randomID(randomIDLength);
        const existing = data[selectedID];
        const cloned = _.cloneDeep(existing);
        cloned.id = newID;
        data[newID] = cloned;
        const idIndex = order.findIndex(id => id === selectedID);
        if(idIndex < 0) { return; } // should never occur
        order.splice(idIndex + 1, 0, newID);
    }
    // genericUnlink(order: string[], data: StoredData<any>, selectedIDStore: Writable<string | null>) {
    //     // Disallow unlinking if only reference (nothing to unlink to)
    //     const selectedID = get(selectedIDStore);
    //     if(selectedID === null) { return; }

    //     const projectData = get(projectStore);
    //     function recurseOnlyReference(currentData: any) {
    //         // Array: iterate over data and either recursive trim or replace
    //         for(const data of Object.values(currentData)) {
    //             if(typeof data === "object" && data !== null) {
    //                 // Object (dictionary) or array
    //                 recurseOnlyReference(data); 
    //             } else if(data == selectedID) {
    //                 // Could cause issues with arrays?
    //                 return false;
    //             }
    //         }

    //         return true;
    //     }
    //     const onlyReference = recurseOnlyReference(projectData);

    //     // Deep copy data using lodash utility
    //     const newID = randomID(randomIDLength);
    //     const existing = data[selectedID];
    //     const cloned = _.cloneDeep(existing);
    //     data[newID] = cloned;
    //     const idIndex = order.findIndex(id => id === selectedID);
    //     if(idIndex < 0) { return; } // should never occur
    //     order[idIndex] = newID;
    //     selectedIDStore.set(newID);

    //     // Delete previous value if only reference within project
    //     if(onlyReference) { delete data[selectedID]; }
    // }
    genericMoveUp(order: string[], selectedIDStore: Writable<string | null>) {
        const selectedID = get(selectedIDStore);
        if(selectedID === null || order.length <= 1) { return; }

        const idIndex = order.findIndex(id => id === selectedID);
        if(idIndex <= 0) { return; } // -1 should never occur
        const temporary = order[idIndex];
        order[idIndex] = order[idIndex-1];
        order[idIndex-1] = temporary;
    }
    genericMoveDown(order: string[], selectedIDStore: Writable<string | null>) {
        const selectedID = get(selectedIDStore);
        if(selectedID === null || order.length <= 1) { return; }

        const idIndex = order.findIndex(id => id === selectedID);
        if(idIndex === -1 || idIndex === order.length - 1) { return; } 
        const temporary = order[idIndex];
        order[idIndex] = order[idIndex+1];
        order[idIndex+1] = temporary;
    }
}

function randomID(length: number): string {
    let result = "";
    for(let index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export const mutate = new MutateProject();