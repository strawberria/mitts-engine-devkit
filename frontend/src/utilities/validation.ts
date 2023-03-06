import { get } from "svelte/store";
import { projectStore } from "./project";
import type { ProjectData } from "./typings";

export function recursiveCheckValid(checkData: any) {
    if(typeof checkData !== "object") {
        return checkData === true;
    } else if(checkData !== null) {
        for(const data of Object.values(checkData)) {
            // Object (dictionary) or array
            if(!recursiveCheckValid(data)) {
                return false;
            }
        }
    }

    return true;
}

export function metadataValid(projectData: ProjectData): [boolean, any] { 
    const titleValid = projectData.game.metadata.title !== "";
    const authorValid = projectData.game.metadata.author !== "";
    const versionValid = projectData.game.metadata.version !== "";
    const synopsisValid = projectData.game.metadata.synopsis !== "";

    const actionsValid = {};
    for(const [id, actionData] of Object.entries(projectData.data.actions)) {
        actionsValid[id] = {
            name: actionData.name !== "",
            verb: actionData.verb !== "",
        };
    }

    const bundled = {
        title: titleValid,
        author: authorValid,
        version: versionValid,
        synopsis: synopsisValid,
        actions: actionsValid,
    };
    
    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}

export function storageValid(projectData: ProjectData): [boolean, any] {
    const imagesValid = {};
    for(const [id, imageData] of Object.entries(projectData.data.images)) {
        imagesValid[id] = {
            imageb64: imageData.imageb64 !== null,
            devName: imageData.devName !== "",   
        };
    }

    const bundled = {
        images: imagesValid,
    };

    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}

export function statesValid(projectData: ProjectData): [boolean, any] {
    const statesValid = {};
    for(const [id, stateData] of Object.entries(projectData.data.states)) {
        statesValid[id] = {
            devName: stateData.devName !== "",
            description: stateData.description !== "",
            imageID: stateData.imageID !== null,
            hints: Object.values(stateData.hints)
                .map(hintData => hintData.attempts === -1 || hintData.text !== "")
        }
    }

    const bundled = {
        states: statesValid,
    };

    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}

export function restraintsValid(projectData: ProjectData): [boolean, any] {
    const restraintLocationsValid = {};
    for(const [id, restraintLocationData] of Object.entries(projectData.data.restraintLocations)) {
        restraintLocationsValid[id] = {
            name: restraintLocationData.name !== "",
        }
    }

    const restraintsValid = {}
    for(const [id, restraintData] of Object.entries(projectData.data.restraints)) {
        restraintsValid[id] = {
            name: restraintData.name !== "",
            devName: restraintData.devName !== "",
            restraintLocationID: restraintData.restraintLocationID !== null,
            examine: restraintData.examine !== "",
        }
    }

    const bundled = {
        restraintLocations: restraintLocationsValid,
        restraints: restraintsValid,
    };

    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}