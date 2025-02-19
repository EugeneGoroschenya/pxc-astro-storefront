/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/env.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />
// import '@total-typescript/ts-reset';

declare namespace App {
	interface Locals extends Record<string, any> {
		store: string | null | undefined;
	}
}
