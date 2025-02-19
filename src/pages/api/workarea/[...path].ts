import type { APIRoute } from 'astro';
import { getImage } from 'storefront:client';

export const GET: APIRoute = ({ params }) => getImage(params.path);
