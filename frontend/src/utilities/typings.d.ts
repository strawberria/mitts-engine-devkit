import type { SvelteComponent } from "svelte";

export interface NavigationTabData { 
    [key: string]: { 
        display:   string;
        component: typeof SvelteComponent;
    }
}

export interface ProjectData {
    custodial: {
        version: string;
    };
    game: {
        metadata: {
            title:    string;
            author:   string;
            version:  string;
            synopsis: string;
        }
        actions:  string[];
        images:   string[];
        states: string[];
    }
    data: {
        actions:  StoredData<ProjectActionData>;
        images:   StoredData<ProjectImageData>;
        states: StoredData<ProjectStateData>;
    }
}

export interface ProjectConstruct {
    id: string;
}

export interface ProjectActionData extends ProjectConstruct {
    name:  string;
    verb:  string;
    order: boolean;
    two:   boolean;
}

export interface ProjectImageData extends ProjectConstruct {
    imageb64:   string | null;
    devName:    string;
    resolution: [number, number] | null;
}

export type ProjectStateType = "normal" | "transition" | "ending";
export interface ProjectHintData { attempts: number; text: string };
export interface ProjectStateData extends ProjectConstruct {
    devName:               string;
    description:           string;
    notes:                 string;
    imageID:               string | null;
    type:                  ProjectStateType;
    args:                  any[]; // next state for transition?
    availableActions:      string[];
    availableInteractions: string[];
    availableLocations:    string[];
    hints:                 [ProjectHintData, ProjectHintData, ProjectHintData];
    // locationIDs: string[];   
}

export interface SelectorRadioData {
    id:        string;
    component: typeof SvelteComponentDev, 
    props:     any;
};

export interface StoredData<T> {
    [id: string]: T
}

export interface SelectChoiceData {
    key:     any;
    display: string;
    enabled: boolean;
}