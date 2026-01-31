import { getCollection } from "astro:content";

export async function GET() {
	const siteUrl = "https://minji0214.github.io";
	const posts = await getCollection("blog");

	const result = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc></url>
  <url><loc>${siteUrl}/blog/</loc></url>
  <url><loc>${siteUrl}/about/</loc></url>
  <url><loc>${siteUrl}/resume/</loc></url>
  ${posts
		.map((post) => {
			const lastMod = (
				post.data.updatedDate ?? post.data.pubDate
			).toISOString();
			const postUrl = new URL(`/blog/${post.slug}/`, siteUrl);
			return `<url><loc>${postUrl}</loc><lastmod>${lastMod}</lastmod></url>`;
		})
		.join("\n  ")}
</urlset>`.trim();

	return new Response(result, {
		headers: {
			"Content-Type": "application/xml",
		},
	});
}
