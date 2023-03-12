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
            verb: !actionData.two || actionData.verb !== "",
        };
    }

    const bundled = {
        title: titleValid,
        author: authorValid,
        version: versionValid,
        synopsis: synopsisValid,
        actions: actionsValid,
        _hasAction: projectData.game.actions.length >= 1,
    };
    
    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}

export function imagesValid(projectData: ProjectData): [boolean, any] {
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
        _hasStartingState: Object.values(projectData.data.states)
            .filter(stateData => ["normal", "transition"].includes(stateData.type))
            .length >= 1,
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
        // _hasRestraintLocation: projectData.game.restraintLocations.length >= 1
    };

    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}

export function objectsValid(projectData: ProjectData): [boolean, any] {
    const objectsValid = {};
    for(const [id, objectData] of Object.entries(projectData.data.objects)) {
        objectsValid[id] = {
            name: objectData.name !== "",
            devName: objectData.devName !== "",
            examine: objectData.examine !== "",
        }
    }

    const bundled = {
        objects: objectsValid,
    };

    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}

function alsoNotUndefined(test, value) {
    return test !== value && test !== undefined;
}
export function interactionsValid(projectData: ProjectData): [boolean, any] {
    const interactionsValid = {};
    for(const [id, interactionData] of Object.entries(projectData.data.interactions)) {
        interactionsValid[id] = {
            devName: interactionData.devName !== "",
            actionID: interactionData.actionID !== null,
            componentIDs: [interactionData.componentIDs[0] !== null, true],
            criteria: {},
            results: {}
        };
        if(interactionData.actionID !== null) {
            const actionData = projectData.data.actions[interactionData.actionID];
            // interactionsValid[id].componentIDs[1] = !actionData.two 
            //     || interactionData.componentIDs[1] !== null;
        }

        for(const [criteriaID, interactionCriteriaData] of Object.entries(interactionData.data.criteria)) {
            interactionsValid[id].criteria[criteriaID] = {
                devName: interactionCriteriaData.devName !== "",
                args: [], // Just in case
            };
            if(["flagEquals", "flagNotEquals"].includes(interactionCriteriaData.type)) {
                interactionsValid[id].criteria[criteriaID].args[0] = alsoNotUndefined(interactionCriteriaData.args[0], "");
                interactionsValid[id].criteria[criteriaID].args[1] = alsoNotUndefined(interactionCriteriaData.args[1], "");
            } else if(["restraintWearing", "restraintNotWearing", "objectFound", "objectNotFound"]
                .includes(interactionCriteriaData.type)) {
                    interactionsValid[id].criteria[criteriaID].args[0] = alsoNotUndefined(interactionCriteriaData.args[0], null);
                    interactionsValid[id].criteria[criteriaID].args[1] = true;
            } else if(["restraintWearingTag", "restraintNotWearingTag", "objectFoundTag", "objectNotFoundTag", "targetTag_component1", "targetTag_component2"]
                .includes(interactionCriteriaData.type)) {
                    interactionsValid[id].criteria[criteriaID].args[0] = alsoNotUndefined(interactionCriteriaData.args[0], "");
                    interactionsValid[id].criteria[criteriaID].args[1] = true;
            } else {
                interactionsValid[id].criteria[criteriaID].args[0] = true;
                interactionsValid[id].criteria[criteriaID].args[1] = true;
            }
        }

        for(const [resultID, interactionResultData] of Object.entries(interactionData.data.results)) {
            interactionsValid[id].results[resultID] = {
                devName: interactionResultData.devName !== "",
                args: [], // Just in case
            };
            if(["restraintAdd", "restraintRemove", "objectReveal", "objectHide", "setState", "locationAdd", "locationRemove"]
                .includes(interactionResultData.type)) {
                    interactionsValid[id].results[resultID].args[0] = alsoNotUndefined(interactionResultData.args[0], null);
                    interactionsValid[id].results[resultID].args[1] = true;
            } else if(["setFlag"].includes(interactionResultData.type)) {
                interactionsValid[id].results[resultID].args[0] = alsoNotUndefined(interactionResultData.args[0], "");
                interactionsValid[id].results[resultID].args[1] = alsoNotUndefined(interactionResultData.args[1], "");
            } else if(["showDialog"].includes(interactionResultData.type)) {
                interactionsValid[id].results[resultID].args[0] = alsoNotUndefined(interactionResultData.args[0], "");
                interactionsValid[id].results[resultID].args[1] = true;
            } else { // restraintAddTarget, restraintRemoveTarget
                interactionsValid[id].results[resultID].args[0] = true;
                interactionsValid[id].results[resultID].args[1] = true;
            }
        }
    }

    const bundled = {
        interactions: interactionsValid,
    };

    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}

export function locationsValid(projectData: ProjectData): [boolean, any] {
    const locationsValid = {};
    for(const [id, locationData] of Object.entries(projectData.data.locations)) {
        locationsValid[id] = {
            name: locationData.name !== "",
            devName: locationData.devName !== "",
            imageID: locationData.imageID !== null,
            locationObjects: {}
        };

        for(const [locationObjectID, locationObjectData] of Object.entries(locationData.data.locationObjects)) {
            locationsValid[id].locationObjects[locationObjectID] = {
                devName: locationObjectData.devName !== "",
                args: locationObjectData.type === "circle"
                    ? locationObjectData.args.length == 2 
                    : locationObjectData.args.length >= 3,
            };
        }
    }

    const bundled = {
        locations: locationsValid,
        _hasStartingLocation: Object.values(projectData.data.locations)
            .filter(locationData => locationData.initial)
            .length >= 1,
    };

    const valid = recursiveCheckValid(bundled);

    return [valid, bundled];
}