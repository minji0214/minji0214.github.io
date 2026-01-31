import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
const site = "https://minji0214.github.io";
// #region agent log
fetch('http://127.0.0.1:7242/ingest/25c61b5f-513d-4879-955e-4dbd49277375',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1',location:'astro.config.mjs:8',message:'astro config loaded',data:{site,githubActions:process.env.GITHUB_ACTIONS,ci:process.env.CI,nodeEnv:process.env.NODE_ENV},timestamp:Date.now()})}).catch(()=>{});
// #endregion
export default defineConfig({
	site,
	integrations: [
		mdx(),
		react(),
		sitemap()
	],
});
