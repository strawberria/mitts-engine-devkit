import { Writable, writable } from "svelte/store";

export const engineVersion = "0.1.0"
export const randomIDLength = 8;

export const selectedActionIDStore: Writable<string | null> = writable(null);