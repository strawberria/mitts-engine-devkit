import { Writable, writable } from "svelte/store";

export const engineVersion = "0.1.0"
export const randomIDLength = 8;

export const pulseImportStore: Writable<boolean> = writable(false);

export const selectedActionIDStore: Writable<string | null> = writable(null);
export const selectedImageIDStore: Writable<string | null> = writable(null);
export const selectedStateIDStore: Writable<string | null> = writable(null);
export const selectedRestraintLocationIDStore: Writable<string | null> = writable(null);
export const selectedRestraintIDStore: Writable<string | null> = writable(null);
export const selectedObjectIDStore: Writable<string | null> = writable(null);
export const selectedInteractionIDStore: Writable<string | null> = writable(null);
export const selectedInteractionCriteriaIDStore: Writable<string | null> = writable(null);
export const selectedInteractionResultIDStore: Writable<string | null> = writable(null);