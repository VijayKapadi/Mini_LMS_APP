import { signal } from '@angular/core';


export const isLoggedInSignal = signal<boolean>(false);
export const userRoleSignal = signal<string | null>(null);