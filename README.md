[Tachtien](https://tachtien.nl)
======================

The definition and origin of the Dutch word *tachtien*: ontelbaar veel (uncountably many). A static site on Cloudflare Pages, no build step.

## For AI agents

- **MCP server:** `https://mcp.tachtien.nl/mcp`, read-only, no login. Source: [simonvreeman/tachtien-mcp](https://github.com/simonvreeman/tachtien-mcp).
- **WebMCP:** `webmcp.js` registers the same five tools in browsers that support `document.modelContext`, and forwards each call to the MCP server.
- **Discovery:** `/llms.txt`, `/.well-known/api-catalog`, `/.well-known/ai-catalog.json`, `/.well-known/agent-skills/`, and `/.well-known/mcp/server-card.json` (a redirect to the MCP server's card), all announced in the `Link` header in `_headers`.
- **Personal Agent Protocol:** `/.well-known/poppy.json` declares the website only (`web: {}`).
- **No OAuth:** the MCP server is public and needs no login, so there is no OAuth metadata or `auth.md`.
- **robots.txt:** Content Signals `search=yes, ai-input=yes, ai-train=yes`.

## Keep in sync

- **Examples or mentions changed?** Update `src/entry.js` in tachtien-mcp, then run `npm run check:drift` there. It checks both directions.
- **`.well-known/agent-skills/tachtien/SKILL.md` changed?** Update its `sha256` digest in `.well-known/agent-skills/index.json`.
- **The inline WebMCP guard in `index.html` changed?** Update its hash in the `Content-Security-Policy` in `_headers`.
- **A tool renamed or redescribed in the MCP?** Regenerate `webmcp.js` from the server's `tools/list`.

`npm run check:drift` in tachtien-mcp catches the first, second and fourth.

Built and maintained by [Simon Vreeman](https://vreeman.com).
