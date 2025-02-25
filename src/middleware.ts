import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
	// correct store is in locals on rewrite
	if (!context.locals.store) {
		const pathname = context.url.pathname;

		context.locals.store =
			context.params.store || (pathname.startsWith('/stores/') ? pathname.split('/')[2] : null);
	}

	return next();
});
