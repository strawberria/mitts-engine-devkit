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
    }
    data: {
        actions: StoredData<ProjectActionData>;
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

export interface SelectorRadioData {
    id:        string;
    component: typeof SvelteComponentDev, 
    props:     any;
};

export interface StoredData<T> {
    [id: string]: T
}