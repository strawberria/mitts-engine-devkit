import { get } from "svelte/store";
import { projectStore } from "./project";
import type { ProjectActionData } from "./typings";

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

export function metadataValid(): any { 
    const projectData = get(projectStore);

    const titleValid = projectData.game.metadata.title !== "";
    const authorValid = projectData.game.metadata.author !== "";
    const versionValid = projectData.game.metadata.version !== "";
    const synopsisValid = projectData.game.metadata.synopsis !== "";

    const actionsValid = {};
    for(const [id, actionData] of Object.entries(projectData.data.actions)) {
        actionsValid[id] = actionData.name !== "" && actionData.verb !== "";
    }

    const bundled = {
        title: titleValid,
        author: authorValid,
        version: versionValid,
        synopsis: synopsisValid,
        actions: actionsValid,
    }
    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}