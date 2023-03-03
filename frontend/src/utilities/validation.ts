import { get } from "svelte/store";
import { projectStore } from "./project";

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
    const metadata = get(projectStore).game.metadata;

    const titleValid = metadata.title !== "";
    const authorValid = metadata.author !== "";
    const versionValid = metadata.version !== "";
    const synopsisValid = metadata.synopsis !== "";

    const bundled = {
        title: titleValid,
        author: authorValid,
        version: versionValid,
        synopsis: synopsisValid,
    }
    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}