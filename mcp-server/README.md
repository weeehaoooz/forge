# Talos Components MCP Server

A Model Context Protocol (MCP) Server for the `@talos/components` Angular UI shared library.

This server allows AI assistants (Antigravity, Claude Desktop, Cursor, etc.) to discover components, query API parameters (signal inputs, outputs, models), generate copy-pasteable Angular code snippets, and look up design tokens and dark mode styling variables.

---

## 🛠 Available Tools

### 1. `talos_list_components`
Lists all UI components, directives, and services in the library.
- **Parameters**: `category` (optional: `'All'`, `'Button'`, `'Form'`, `'Layout'`, `'Navigation'`, `'Feedback'`, `'Visualization'`).

### 2. `talos_search_components`
Fuzzy searches components, directives, design tokens, and examples by keywords or use case.
- **Parameters**: `query` (required string, e.g. `"date picker"`, `"dropdown"`, `"segmented switch"`, `"toast"`).

### 3. `talos_get_component_doc`
Retrieves detailed API specifications, selector, signal inputs/outputs, imports, and usage instructions for a specific component.
- **Parameters**: `componentId` (required string, e.g. `"button"`, `"select-input"`, `"autocomplete"`, `"date-range-picker"`, `"snackbar"`, `"slide-toggle"`).

### 4. `talos_get_example`
Retrieves copy-pasteable, working Angular v20+ code examples (HTML + TypeScript + reactive forms).
- **Parameters**: `componentId` (required string).

### 5. `talos_get_styles_and_tokens`
Retrieves design tokens, CSS variables, SCSS imports, dark mode support, and typography classes.
- **Parameters**: `section` (optional: `'all'`, `'colors'`, `'typography'`, `'forms'`, `'buttons'`, `'dark-mode'`, `'setup'`).

### 6. `talos_generate_template`
Generates a complete standalone Angular component boilerplate configured with specified Talos components.
- **Parameters**: `componentName` (string), `usedComponents` (array of string IDs), `withReactiveForm` (boolean).

---

## 📚 Resources Exposed

- `talos://components/all` — Full catalog of all 19+ Talos UI components and entry points.
- `talos://styles/tokens` — CSS custom properties, SCSS variables, and dark theme palette.
- `talos://guide/getting-started` — Integration guide and import recommendations.

---

## ⚡ Prompts

- `use-talos-component` — Prompt template guiding the AI to construct modern Angular components using Talos UI components.

---

## 🚀 Running & Building

From the root project directory:
```bash
# Build the MCP server
npm run mcp:build

# Run the MCP server directly via stdio
npm run mcp:start
```
