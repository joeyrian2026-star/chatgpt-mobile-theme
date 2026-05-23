# Joey Echo MCP App Demo

Minimal embedded UI demo for ChatGPT MCP Apps.

## Run locally

1. Open this folder.
2. Install dependencies.
3. Start the server.

Commands:

    cd mcp-app-demo
    npm install
    npm start

Local MCP endpoint:

    http://127.0.0.1:8787/mcp

## Test with a tunnel

Start a tunnel to port 8787, then connect the HTTPS `/mcp` endpoint from ChatGPT developer settings.

After connecting, ask ChatGPT to call:

    show_joey_panel

If it works, a Joey Echo UI card should appear inside the chat.

## Files

- package.json: dependencies and scripts
- server.mjs: MCP server, tool, resource, and embedded UI
- codex_prompt.md: prompt for Codex to run and improve this demo

## Next ideas

- memory cards
- diary timeline
- Supabase status panel
- Codex task queue
