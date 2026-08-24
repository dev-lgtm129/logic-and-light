# Codebase Memory MCP Rule

Always use the **`codebase-memory` MCP server** (`codebase-memory-mcp`) for codebase indexing, structural analysis, and code search in every project session:

1. **Indexing**: Run `index_repository` on the workspace to maintain the knowledge graph.
2. **Exploration**: Use `search_graph`, `query_graph`, `get_architecture`, and `trace_path` to analyze call trees, routes, and component relationships efficiently.
