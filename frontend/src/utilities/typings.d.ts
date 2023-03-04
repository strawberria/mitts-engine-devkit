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
        actions: string[];
        images:  string[];
    }
    data: {
        actions: StoredData<ProjectActionData>;
        images:  StoredData<ProjectImageData>;
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
    name:       string;
    devName:    string;
    resolution: [number, number] | null;
}

export interface SelectorRadioData {
    id:        string;
    component: typeof SvelteComponentDev, 
    props:     any;
};

export interface StoredData<T> {
    [id: string]: T
}