import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	site: "https://minji0214.github.io",
	base: "minglog",
	integrations: [
		mdx(),
		sitemap({
			customUrl: (page) => `https://minji0214.github.io/minglog${page}`,
		}),
		react(),
	],
});
