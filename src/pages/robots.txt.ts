import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
	const robotsTxt = `
User-agent: *
Allow: /

Sitemap: https://minji0214.github.io/sitemap-index.xml
`.trim();

	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain",
		},
	});
};
