---
name: tachtien
description: Look up and use the Dutch word "tachtien" (a cardinal number meaning "ontelbaar veel", uncountably many) through the public Tachtien MCP server at https://mcp.tachtien.nl/mcp. Use when someone mentions tachtien, asks what it means or where it comes from, or wants a text rewritten with tachtien.
---

# Tachtien

Tachtien (tach·tien, /tɑxtin/) is a Dutch cardinal number meaning *ontelbaar veel*: uncountably many. It began in 2014 as a slip of the tongue by Julia van den Bergh. The source is https://tachtien.nl/.

## Using the word

- Tachtien stands for a vague, large amount: "gisteren tachtien kopstootjes".
- It is never an exact number. 18 is achttien and 80 is tachtig; a counted amount is not tachtien.

## Connecting

The MCP server is public, read-only and needs no login. Transport is Streamable HTTP:

    https://mcp.tachtien.nl/mcp

In Claude Code:

    claude mcp add --transport http tachtien https://mcp.tachtien.nl/mcp

The server card is at https://mcp.tachtien.nl/.well-known/mcp/server-card.json.

## Tools

| Tool | Use it to |
| --- | --- |
| `define` | get syllables, part of speech, IPA, definition and origin |
| `examples` | get example dialogues; pass `random: true` for one |
| `mentions` | list external mentions; filter with `source`: `twitter`, `press` or `cityguys` |
| `tachtienify` | rewrite vague large amounts in a Dutch or English text as tachtien |
| `is_tachtien` | judge whether an amount counts as tachtien, with a reason in Dutch |

Resource `tachtien://entry` is the whole entry as Markdown. Content is in Dutch, and every tool also returns `structuredContent`.

In a browser that supports WebMCP, https://tachtien.nl/ registers the same five tools.
