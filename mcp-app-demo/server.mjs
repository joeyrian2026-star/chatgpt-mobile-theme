import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const PORT = Number(process.env.PORT || 8787);
const WIDGET_URI = "ui://widget/joey-echo-panel-v1.html";

const widgetHtml = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Joey × Echo UI Demo</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #09090d;
      --panel: rgba(255, 255, 255, 0.075);
      --panel-2: rgba(255, 255, 255, 0.11);
      --border: rgba(255, 255, 255, 0.16);
      --text: rgba(255, 255, 255, 0.92);
      --muted: rgba(255, 255, 255, 0.63);
      --pink: #f4a7c9;
      --blue: #9ac7ff;
      --green: #93e6c0;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 18% 0%, rgba(244, 167, 201, 0.23), transparent 30%),
        radial-gradient(circle at 92% 12%, rgba(154, 199, 255, 0.22), transparent 32%),
        linear-gradient(145deg, #08080c, #12121c 58%, #0b0b10);
      padding: 18px;
    }

    .wrap {
      width: min(860px, 100%);
      margin: 0 auto;
      border: 1px solid var(--border);
      border-radius: 26px;
      background: rgba(255, 255, 255, 0.06);
      box-shadow: 0 22px 80px rgba(0, 0, 0, 0.35);
      overflow: hidden;
    }

    .hero {
      padding: 24px;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(135deg, rgba(244, 167, 201, 0.12), rgba(154, 199, 255, 0.1));
    }

    .eyebrow {
      color: var(--muted);
      font-size: 13px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    h1 {
      margin: 0;
      font-size: clamp(26px, 5vw, 44px);
      line-height: 1.05;
      letter-spacing: -0.04em;
    }

    .subtitle {
      margin: 12px 0 0;
      color: var(--muted);
      line-height: 1.65;
      font-size: 15px;
      max-width: 680px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      padding: 16px;
    }

    .card {
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--panel);
      padding: 16px;
      min-height: 142px;
    }

    .card strong {
      display: block;
      margin-bottom: 8px;
      font-size: 16px;
    }

    .card p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.55;
    }

    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      margin-right: 8px;
      background: var(--green);
      box-shadow: 0 0 20px rgba(147, 230, 192, 0.75);
    }

    .footer {
      padding: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-top: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.16);
    }

    .status {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }

    button {
      appearance: none;
      border: 0;
      border-radius: 999px;
      padding: 12px 16px;
      background: linear-gradient(135deg, var(--pink), var(--blue));
      color: #11131a;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
    }

    button:active { transform: translateY(1px); }

    @media (max-width: 680px) {
      body { padding: 12px; }
      .grid { grid-template-columns: 1fr; }
      .footer { align-items: stretch; flex-direction: column; }
      button { width: 100%; }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <div class="eyebrow">MCP App · Embedded UI</div>
      <h1>Joey × Echo UI Demo</h1>
      <p class="subtitle">这是一个最小通路测试：MCP tool 返回 structuredContent，ChatGPT 打开 iframe 组件，并把数据交给这张卡片渲染。</p>
    </section>

    <section class="grid" id="cards"></section>

    <section class="footer">
      <div class="status" id="status"><span class="dot"></span>正在读取 tool 结果…</div>
      <button id="next">让 ChatGPT 继续</button>
    </section>
  </main>

  <script>
    const fallback = {
      title: "Joey × Echo UI Demo",
      cards: [
        { title: "记忆卡片", body: "以后这里可以显示 Joey × Echo 的记忆锚点、人物设定和项目状态。" },
        { title: "日记时间线", body: "跑通后可以接 Notion 或 Supabase，把每天的记录变成可视化时间线。" },
        { title: "任务队列", body: "也可以变成 Codex 任务面板：待办、运行中、已完成，一眼看懂。" }
      ],
      status: "demo-ready"
    };

    const openai = window.openai || {};
    const data = openai.toolOutput || openai.structuredContent || fallback;
    const cards = Array.isArray(data.cards) ? data.cards : fallback.cards;

    document.getElementById("cards").innerHTML = cards.map((card) => `
      <article class="card">
        <strong>${escapeHtml(card.title || "Untitled")}</strong>
        <p>${escapeHtml(card.body || "")}</p>
      </article>
    `).join("");

    document.getElementById("status").innerHTML = `<span class="dot"></span>${escapeHtml(data.status || fallback.status)} · ${new Date().toLocaleString("zh-CN")}`;

    document.getElementById("next").addEventListener("click", async () => {
      const prompt = "Joey × Echo UI Demo 已经显示成功。请继续帮我规划下一步：把 demo 改造成记忆卡片、日记时间线或 Codex 任务队列。";
      try {
        if (typeof openai.sendFollowUpMessage === "function") {
          await openai.sendFollowUpMessage({ prompt });
          return;
        }
        if (typeof openai.postMessage === "function") {
          openai.postMessage({ type: "ui/message", prompt });
          return;
        }
      } catch (error) {
        console.error(error);
      }
      document.getElementById("status").textContent = "UI 已显示；当前环境没有暴露 follow-up message bridge。";
    });

    function escapeHtml(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  </script>
</body>
</html>`;

function createServer() {
  const server = new McpServer({
    name: "joey-echo-ui-demo",
    version: "0.1.0"
  });

  server.registerResource(
    "joey_echo_panel",
    WIDGET_URI,
    {
      title: "Joey × Echo Panel",
      description: "A minimal embedded UI component for ChatGPT Apps SDK testing.",
      mimeType: "text/html+skybridge"
    },
    async () => ({
      contents: [
        {
          uri: WIDGET_URI,
          mimeType: "text/html+skybridge",
          text: widgetHtml,
          _meta: {
            "openai/widgetDescription": "Joey × Echo 的最小内嵌 UI demo，用于验证 MCP tool 到 ChatGPT iframe 组件的链路。",
            "openai/widgetPrefersBorder": true,
            "openai/widgetCSP": {
              connect_domains: [],
              resource_domains: []
            }
          }
        }
      ]
    })
  );

  server.registerTool(
    "show_joey_panel",
    {
      title: "Show Joey × Echo Panel",
      description: "Show the Joey × Echo embedded UI demo card inside ChatGPT.",
      inputSchema: {},
      _meta: {
        "openai/outputTemplate": WIDGET_URI,
        "openai/toolInvocation/invoking": "正在打开 Joey × Echo UI Demo…",
        "openai/toolInvocation/invoked": "Joey × Echo UI Demo 已打开"
      }
    },
    async () => ({
      structuredContent: {
        title: "Joey × Echo UI Demo",
        status: "demo-ready",
        cards: [
          { title: "记忆卡片", body: "以后这里可以显示 Joey × Echo 的记忆锚点、人物设定和项目状态。" },
          { title: "日记时间线", body: "跑通后可以接 Notion 或 Supabase，把每天的记录变成可视化时间线。" },
          { title: "任务队列", body: "也可以变成 Codex 任务面板：待办、运行中、已完成，一眼看懂。" }
        ]
      },
      content: [
        {
          type: "text",
          text: "Joey × Echo UI Demo 已准备好，应该会在对话中以内嵌组件显示。"
        }
      ]
    })
  );

  return server;
}

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => {
  res.type("text/plain").send("Joey × Echo MCP App demo is running. MCP endpoint: /mcp\n");
});

app.post("/mcp", async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined
  });

  res.on("close", () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get("/mcp", (_req, res) => {
  res.status(405).json({ error: "Use POST /mcp for stateless Streamable HTTP." });
});

app.delete("/mcp", (_req, res) => {
  res.status(405).json({ error: "Stateless demo does not keep sessions." });
});

app.listen(PORT, () => {
  console.log(`Joey × Echo MCP App demo running on http://127.0.0.1:${PORT}`);
  console.log(`MCP endpoint: http://127.0.0.1:${PORT}/mcp`);
});
