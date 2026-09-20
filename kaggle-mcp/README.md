# kaggle-mcp (perso)

Serveur MCP (Streamable HTTP, sans session) qui appelle l'API Kaggle.

Variables d'environnement (a definir dans Render, jamais dans le code) :
- `MCP_AUTH_TOKEN` : secret qui protege ce serveur (obligatoire)
- `KAGGLE_API_TOKEN` : token Kaggle (ou `KAGGLE_USERNAME` + `KAGGLE_KEY`)

Endpoint : `POST /mcp/<MCP_AUTH_TOKEN>` (ou `POST /mcp` avec `Authorization: Bearer <MCP_AUTH_TOKEN>`).

Outils : competitions_list, datasets_list, kernels_list, kernel_status, kernel_output, kernel_push.
