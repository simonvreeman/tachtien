/* Tachtien: WebMCP tools for in-browser agents.
 * Registers the five tools of the Tachtien MCP server with the same names,
 * descriptions and input schemas, and forwards each call to
 * https://mcp.tachtien.nl/mcp. Loaded only when the browser exposes
 * modelContext (see the inline guard at the end of index.html).
 * Keep the list in step with the server: npm run check:drift in
 * tachtien-mcp compares names and descriptions with the server card.
 */
(function () {
  var mc = document.modelContext || navigator.modelContext;
  if (!mc) return;

  var ENDPOINT = "https://mcp.tachtien.nl/mcp";
  var nextId = 0;

  function toolError(code, message, retryable) {
    return { error: message, code: code, retryable: retryable };
  }

  // One tools/call to the server; resolves the structured result or a
  // structured error, never rejects.
  function callServer(name, args) {
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++nextId, method: "tools/call", params: { name: name, arguments: args || {} } })
    }).then(function (res) {
      if (!res.ok) return toolError("HTTP_ERROR", "HTTP " + res.status + " from " + ENDPOINT, res.status >= 500);
      return res.text().then(function (text) {
        var data = text.split("\n").filter(function (l) { return l.indexOf("data:") === 0; })[0];
        var message = JSON.parse(data ? data.slice(5) : text);
        if (message.error) return toolError("RPC_ERROR", message.error.message, false);
        if (message.result.isError) return toolError("TOOL_ERROR", message.result.content[0].text, false);
        return message.result.structuredContent;
      });
    }).catch(function (e) {
      return toolError("NETWORK_ERROR", "Could not reach " + ENDPOINT + ": " + e.message, true);
    });
  }

  var tools = [
    {
      "name": "define",
      "description": "Define the Dutch word 'tachtien' (a cardinal number meaning 'ontelbaar veel', uncountably many): syllables, part of speech, IPA pronunciation, definition and origin, as on tachtien.nl. Content is in Dutch.",
      "inputSchema": {
        "type": "object",
        "properties": {}
      }
    },
    {
      "name": "examples",
      "description": "Example sentences that use 'tachtien', in Dutch. Each example is a short dialogue of one or more lines.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "random": {
            "description": "Return one example at random instead of all",
            "type": "boolean"
          }
        }
      }
    },
    {
      "name": "mentions",
      "description": "External mentions of 'tachtien' (tweets, press and Cityguys articles) with title, source and URL. The url is null for a mention without a link.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "source": {
            "description": "Only mentions from this source",
            "type": "string",
            "enum": [
              "twitter",
              "press",
              "cityguys"
            ]
          }
        }
      }
    },
    {
      "name": "tachtienify",
      "description": "Rewrite a text so that vague large amounts in Dutch or English ('heel veel', 'honderden', 'a lot of', 'countless', ...) become 'tachtien'. Exact numbers are left alone, because they were counted. Returns the new text and the number of replacements.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string",
            "minLength": 1,
            "maxLength": 5000,
            "description": "The text to rewrite"
          }
        },
        "required": [
          "text"
        ]
      }
    },
    {
      "name": "is_tachtien",
      "description": "Judge whether an amount counts as 'tachtien' (uncountably many) and give a tongue-in-cheek reason in Dutch. Exact numbers never do (18 is achttien, 80 is tachtig, also inside a phrase like '18 biertjes'); vague amounts like 'heel veel' or 'geen idee' do, unless negated ('niet heel veel').",
      "inputSchema": {
        "type": "object",
        "properties": {
          "amount": {
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "string",
                "minLength": 1,
                "maxLength": 200
              }
            ],
            "description": "A number, or an amount in words"
          }
        },
        "required": [
          "amount"
        ]
      }
    }
  ];

  // registerTool() is async, so register one at a time and warn per tool
  // instead of leaving an unhandled rejection.
  (async function () {
    for (var i = 0; i < tools.length; i++) {
      var tool = tools[i];
      tool.annotations = { readOnlyHint: true };
      tool.execute = callServer.bind(null, tool.name);
      try {
        await mc.registerTool(tool);
      } catch (e) {
        console.warn("[webmcp] registration failed for " + tool.name + ":", e);
      }
    }
  })();
})();
