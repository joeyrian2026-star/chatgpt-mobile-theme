# Codex prompt

You are working in the `mcp-app-demo` folder.

Goal: run and verify the minimal Joey Echo MCP embedded UI demo.

Steps:

1. Install dependencies:

       npm install

2. Start the server:

       npm start

3. Confirm the local endpoint prints:

       http://127.0.0.1:8787/mcp

4. Start a public tunnel to port 8787.

5. Connect the public `/mcp` endpoint in ChatGPT developer settings.

6. In ChatGPT, call the tool:

       show_joey_panel

Expected result: ChatGPT shows an embedded Joey Echo UI card inside the conversation.

If anything fails, inspect `server.mjs`, check the MCP SDK imports, and adjust the Streamable HTTP transport wiring while keeping the app minimal.

After the minimal path works, propose one next upgrade:

- memory card panel
- diary timeline
- Supabase status panel
- Codex task queue
