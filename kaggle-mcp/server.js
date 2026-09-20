import express from "express";
import crypto from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const PORT = process.env.PORT || 3000;
// Secret qui protege CE serveur (obligatoire, sinon tout est refuse)
const AUTH = process.env.MCP_AUTH_TOKEN || "";
// Identifiants Kaggle : soit un token (KGAT_...), soit username + key
const KAGGLE_TOKEN = process.env.KAGGLE_API_TOKEN || "";
const KAGGLE_USER = process.env.KAGGLE_USERNAME || "";
const KAGGLE_KEY = process.env.KAGGLE_KEY || "";
const BASE = "https://www.kaggle.com/api/v1";

function kaggleAuthHeader() {
  if (KAGGLE_USER && KAGGLE_KEY) {
    return "Basic " + Buffer.from(`${KAGGLE_USER}:${KAGGLE_KEY}`).toString("base64");
  }
  if (KAGGLE_TOKEN) return "Bearer " + KAGGLE_TOKEN;
  throw new Error("Identifiants Kaggle manquants (KAGGLE_API_TOKEN ou KAGGLE_USERNAME + KAGGLE_KEY).");
}

async function kaggle(path, { method = "GET", query, body } = {}) {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(query || {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: kaggleAuthHeader(),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Kaggle ${res.status}: ${text.slice(0, 500)}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const ok = (data) => ({
  content: [
    {
      type: "text",
      text: typeof data === "string" ? data : JSON.stringify(data, null, 2).slice(0, 20000),
    },
  ],
});
const fail = (e) => ({ isError: true, content: [{ type: "text", text: String(e.message || e) }] });
const wrap = (fn) => async (args) => {
  try {
    return ok(await fn(args));
  } catch (e) {
    return fail(e);
  }
};

function buildServer() {
  const s = new McpServer({ name: "kaggle-mcp-perso", version: "1.0.0" });

  s.tool(
    "competitions_list",
    "Lister ou chercher des competitions Kaggle",
    { search: z.string().optional(), page: z.number().int().optional() },
    wrap((a) => kaggle("/competitions/list", { query: a }))
  );

  s.tool(
    "datasets_list",
    "Lister ou chercher des datasets Kaggle",
    { search: z.string().optional(), page: z.number().int().optional() },
    wrap((a) => kaggle("/datasets/list", { query: a }))
  );

  s.tool(
    "kernels_list",
    "Lister ou chercher des notebooks/scripts Kaggle",
    {
      search: z.string().optional(),
      user: z.string().optional(),
      page: z.number().int().optional(),
      pageSize: z.number().int().optional(),
    },
    wrap((a) => kaggle("/kernels/list", { query: a }))
  );

  s.tool(
    "kernel_status",
    "Statut d'execution d'un notebook (user + slug)",
    { user: z.string(), slug: z.string() },
    wrap((a) => kaggle("/kernels/status", { query: { userName: a.user, kernelSlug: a.slug } }))
  );

  s.tool(
    "kernel_output",
    "Fichiers de sortie d'un notebook termine (URLs de telechargement)",
    { user: z.string(), slug: z.string() },
    wrap((a) => kaggle("/kernels/output", { query: { userName: a.user, kernelSlug: a.slug } }))
  );

  s.tool(
    "kernel_push",
    "Creer ou mettre a jour un notebook/script et le lancer, avec GPU optionnel. slug = 'utilisateur/nom-du-kernel'",
    {
      slug: z.string(),
      title: z.string(),
      code: z.string(),
      language: z.enum(["python", "r"]).optional(),
      kernelType: z.enum(["script", "notebook"]).optional(),
      enableGpu: z.boolean().optional(),
      enableInternet: z.boolean().optional(),
      isPrivate: z.boolean().optional(),
    },
    wrap((a) =>
      kaggle("/kernels/push", {
        method: "POST",
        body: {
          slug: a.slug,
          newTitle: a.title,
          text: a.code,
          language: a.language || "python",
          kernelType: a.kernelType || "script",
          isPrivate: a.isPrivate ?? true,
          enableGpu: a.enableGpu ?? false,
          enableInternet: a.enableInternet ?? true,
        },
      })
    )
  );

  return s;
}

function safeEq(a, b) {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

// Le secret peut venir du chemin (/mcp/<secret>) ou de l'en-tete Authorization: Bearer <secret>
function authorized(req) {
  if (!AUTH) return false; // ferme par defaut
  const fromPath = req.params.secret || "";
  const fromHeader = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  return (fromPath && safeEq(fromPath, AUTH)) || (fromHeader && safeEq(fromHeader, AUTH));
}

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => res.status(200).send("kaggle-mcp ok"));

app.post(["/mcp", "/mcp/:secret"], async (req, res) => {
  if (!authorized(req)) return res.status(401).json({ error: "unauthorized" });
  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (e) {
    console.error("mcp error:", e.message);
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal error" }, id: null });
    }
  }
});

app.all(["/mcp", "/mcp/:secret"], (_req, res) => res.status(405).json({ error: "method not allowed" }));

app.listen(PORT, () => console.log(`kaggle-mcp en ecoute sur ${PORT}`));
