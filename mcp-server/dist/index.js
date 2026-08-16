#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { TALOS_COMPONENTS } from './data/components.js';
import { TALOS_EXAMPLES } from './data/examples.js';
import { TALOS_DESIGN_TOKENS } from './data/tokens.js';
// Initialize the MCP server
const server = new Server({
    name: 'talos-components-mcp',
    version: '1.0.0'
}, {
    capabilities: {
        tools: {},
        resources: {},
        prompts: {}
    }
});
/**
 * -----------------------------------------------------------------------------
 * MCP Tools
 * -----------------------------------------------------------------------------
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'talos_list_components',
                description: 'Lists all available Angular UI components, directives, and services in the @talos/components library categorized by type.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        category: {
                            type: 'string',
                            enum: ['All', 'Button', 'Form', 'Layout', 'Navigation', 'Feedback', 'Visualization'],
                            description: 'Optional filter by component category (default: "All").'
                        }
                    }
                }
            },
            {
                name: 'talos_search_components',
                description: 'Searches Talos components, directives, and design tokens by keywords, selectors, or use-case queries (e.g. "date range", "dropdown", "switch", "toast", "dark mode").',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Keywords or concept to search for.'
                        }
                    },
                    required: ['query']
                }
            },
            {
                name: 'talos_get_component_doc',
                description: 'Retrieves complete API specifications, selector, signal inputs/outputs, imports, and usage instructions for a specific Talos component.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        componentId: {
                            type: 'string',
                            description: 'The ID or name of the component (e.g. "button", "select-input", "date-range-picker", "autocomplete", "snackbar", "slide-toggle").'
                        }
                    },
                    required: ['componentId']
                }
            },
            {
                name: 'talos_get_example',
                description: 'Retrieves complete, copy-pasteable Angular v20+ code examples (TypeScript + HTML + reactive form setup) for a component or use-case.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        componentId: {
                            type: 'string',
                            description: 'The ID of the component (e.g. "button", "input", "select-input", "autocomplete", "date-range-picker", "snackbar").'
                        }
                    },
                    required: ['componentId']
                }
            },
            {
                name: 'talos_get_styles_and_tokens',
                description: 'Returns the design tokens, CSS variables, SCSS imports, dark mode support, and typography classes for styling applications with Talos.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        section: {
                            type: 'string',
                            enum: ['all', 'colors', 'typography', 'forms', 'buttons', 'dark-mode', 'setup'],
                            description: 'Specific token section to retrieve (default: "all").'
                        }
                    }
                }
            },
            {
                name: 'talos_generate_template',
                description: 'Generates a ready-to-use Angular component template following Angular v20+ best practices (signals, standalone, control flow) configured with specified Talos components.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        componentName: {
                            type: 'string',
                            description: 'Name of the Angular component to generate (e.g. "UserProfileForm" or "FilterToolbar").'
                        },
                        usedComponents: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'List of Talos component IDs to include (e.g. ["input", "button", "select-input", "date-picker"]).'
                        },
                        withReactiveForm: {
                            type: 'boolean',
                            description: 'Whether to wire the components to an Angular FormGroup with reactive controls.'
                        }
                    },
                    required: ['componentName', 'usedComponents']
                }
            }
        ]
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case 'talos_list_components': {
            const category = args?.category || 'All';
            const filtered = category === 'All'
                ? TALOS_COMPONENTS
                : TALOS_COMPONENTS.filter((c) => c.category.toLowerCase() === category.toLowerCase());
            const summaryList = filtered.map((c) => ({
                id: c.id,
                name: c.name,
                category: c.category,
                kind: c.kind,
                selector: c.selector || 'N/A',
                exportName: c.exportName,
                importPath: c.secondaryEntrypoint,
                description: c.description
            }));
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            totalCount: summaryList.length,
                            category,
                            components: summaryList
                        }, null, 2)
                    }
                ]
            };
        }
        case 'talos_search_components': {
            const query = String(args?.query || '').toLowerCase().trim();
            if (!query) {
                throw new McpError(ErrorCode.InvalidParams, 'Search query cannot be empty.');
            }
            const matchedComponents = TALOS_COMPONENTS.filter((c) => {
                return (c.id.toLowerCase().includes(query) ||
                    c.name.toLowerCase().includes(query) ||
                    c.description.toLowerCase().includes(query) ||
                    c.tags.some((t) => t.toLowerCase().includes(query)) ||
                    (c.selector && c.selector.toLowerCase().includes(query)));
            });
            const matchedExamples = TALOS_EXAMPLES.filter((ex) => {
                return (ex.title.toLowerCase().includes(query) ||
                    ex.description.toLowerCase().includes(query));
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            query,
                            matchedComponents: matchedComponents.map((c) => ({
                                id: c.id,
                                name: c.name,
                                category: c.category,
                                selector: c.selector,
                                importPath: c.secondaryEntrypoint,
                                description: c.description
                            })),
                            matchedExamples: matchedExamples.map((e) => ({
                                id: e.id,
                                title: e.title,
                                componentId: e.componentId,
                                description: e.description
                            }))
                        }, null, 2)
                    }
                ]
            };
        }
        case 'talos_get_component_doc': {
            const target = String(args?.componentId || '').toLowerCase().trim();
            const component = TALOS_COMPONENTS.find((c) => c.id.toLowerCase() === target || c.name.toLowerCase() === target);
            if (!component) {
                const available = TALOS_COMPONENTS.map((c) => c.id).join(', ');
                throw new McpError(ErrorCode.InvalidParams, `Component "${target}" not found. Available components: ${available}`);
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(component, null, 2)
                    }
                ]
            };
        }
        case 'talos_get_example': {
            const target = String(args?.componentId || '').toLowerCase().trim();
            const examples = TALOS_EXAMPLES.filter((ex) => ex.componentId.toLowerCase() === target || ex.id.toLowerCase() === target);
            if (examples.length === 0) {
                // Fallback: check if component has docs with snippet
                const comp = TALOS_COMPONENTS.find((c) => c.id.toLowerCase() === target);
                if (comp) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `# ${comp.name} Usage Snippet\n\n${comp.docs}`
                            }
                        ]
                    };
                }
                const available = TALOS_EXAMPLES.map((e) => e.componentId).join(', ');
                throw new McpError(ErrorCode.InvalidParams, `No examples found for "${target}". Available examples for: ${available}`);
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(examples, null, 2)
                    }
                ]
            };
        }
        case 'talos_get_styles_and_tokens': {
            const section = args?.section || 'all';
            let result = TALOS_DESIGN_TOKENS;
            if (section === 'colors')
                result = TALOS_DESIGN_TOKENS.colorSystem;
            else if (section === 'typography')
                result = TALOS_DESIGN_TOKENS.typography;
            else if (section === 'forms')
                result = TALOS_DESIGN_TOKENS.formControls;
            else if (section === 'buttons')
                result = TALOS_DESIGN_TOKENS.buttons;
            else if (section === 'dark-mode')
                result = TALOS_DESIGN_TOKENS.darkMode;
            else if (section === 'setup')
                result = { summary: TALOS_DESIGN_TOKENS.summary, importGuide: TALOS_DESIGN_TOKENS.importGuide };
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2)
                    }
                ]
            };
        }
        case 'talos_generate_template': {
            const componentName = args?.componentName || 'CustomWidget';
            const usedIds = args?.usedComponents || [];
            const withForm = Boolean(args?.withReactiveForm);
            const matchedComps = TALOS_COMPONENTS.filter((c) => usedIds.includes(c.id));
            const importNames = matchedComps.map((c) => c.exportName).join(', ');
            const importsArray = [
                ...matchedComps.map((c) => c.exportName.split(',')[0].trim()),
                ...(withForm ? ['ReactiveFormsModule'] : [])
            ];
            const templateHtml = `
<section class="talos-widget-container p-6 space-y-4">
  <header>
    <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">${componentName}</h2>
  </header>

  ${withForm ? '<form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">' : '<div class="space-y-4">'}
    ${matchedComps.map((c) => `<!-- ${c.name} -->\n    <div>${c.docs.match(/```html([\s\S]*?)```/)?.[1]?.trim() || `<div>${c.name} placeholder</div>`}</div>`).join('\n\n    ')}

    ${withForm ? '<button talosButton variant="primary" type="submit">Submit</button>' : ''}
  ${withForm ? '</form>' : '</div>'}
</section>
      `.trim();
            const tsSource = `
import { Component, signal } from '@angular/core';
${withForm ? "import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';" : ''}
import { ${importNames} } from '@talos/components';

@Component({
  selector: 'app-${componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}',
  imports: [${importsArray.join(', ')}],
  templateUrl: './${componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}.component.html',
  styleUrl: './${componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}.component.scss'
})
export class ${componentName}Component {
  ${withForm ? `readonly form = new FormGroup({\n    // Define form controls here\n  });\n\n  onSubmit(): void {\n    if (this.form.valid) {\n      console.log('Submitted:', this.form.value);\n    }\n  }` : '// Component logic here'}
}
      `.trim();
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            componentName,
                            tsCode: tsSource,
                            htmlCode: templateHtml
                        }, null, 2)
                    }
                ]
            };
        }
        default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
});
/**
 * -----------------------------------------------------------------------------
 * MCP Resources
 * -----------------------------------------------------------------------------
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: 'talos://components/all',
                name: 'All Talos Components Catalog',
                mimeType: 'application/json',
                description: 'Complete catalog and API overview of all components in @talos/components'
            },
            {
                uri: 'talos://styles/tokens',
                name: 'Talos Design Tokens & CSS Variables',
                mimeType: 'application/json',
                description: 'CSS Custom Properties, SCSS variables, and Dark Theme guidelines'
            },
            {
                uri: 'talos://guide/getting-started',
                name: 'Talos Quickstart & Integration Guide',
                mimeType: 'text/markdown',
                description: 'Installation, Angular setup, and imports best practices'
            }
        ]
    };
});
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    if (uri === 'talos://components/all') {
        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(TALOS_COMPONENTS, null, 2)
                }
            ]
        };
    }
    if (uri === 'talos://styles/tokens') {
        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(TALOS_DESIGN_TOKENS, null, 2)
                }
            ]
        };
    }
    if (uri === 'talos://guide/getting-started') {
        const guide = `
# Talos Angular Shared Components Guide

## 1. Installation & Imports
Import components either from the root barrel or secondary entry points (recommended for optimal tree-shaking):

\`\`\`typescript
// Secondary entry points (Recommended):
import { TalosButtonDirective } from '@talos/components/button';
import { DateRangePickerComponent } from '@talos/components/form/date-range-picker';
import { TalosSnackbarService } from '@talos/components/snackbar';

// Or root barrel:
import {
  TalosButtonDirective,
  DateRangePickerComponent,
  TalosSnackbarService
} from '@talos/components';
\`\`\`

## 2. Style Integration
In your \`src/styles.scss\`:
\`\`\`scss
@use '@talos/components/styles/index' as talos;
\`\`\`

## 3. Dark Theme Support
Toggle dark mode by applying the \`.dark\` class to \`<html>\` or setting \`data-theme="dark"\`.
    `.trim();
        return {
            contents: [
                {
                    uri,
                    mimeType: 'text/markdown',
                    text: guide
                }
            ]
        };
    }
    throw new McpError(ErrorCode.InvalidRequest, `Resource uri "${uri}" not recognized.`);
});
/**
 * -----------------------------------------------------------------------------
 * MCP Prompts
 * -----------------------------------------------------------------------------
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: [
            {
                name: 'use-talos-component',
                description: 'Prompt template to guide the AI in generating a complete modern Angular component utilizing Talos UI components.',
                arguments: [
                    {
                        name: 'taskDescription',
                        description: 'What UI feature or form to build',
                        required: true
                    }
                ]
            }
        ]
    };
});
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === 'use-talos-component') {
        const task = args?.taskDescription || 'Build an Angular UI feature';
        return {
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `Please implement the following task using @talos/components:

Task: "${task}"

Requirements:
1. Use modern Angular standalone components with signal inputs/outputs and native control flow (@if, @for).
2. Leverage @talos/components (e.g. TalosButtonDirective, TalosInputDirective, SelectInputComponent, DateRangePickerComponent, TalosSnackbarService).
3. If form controls are involved, use Angular ReactiveFormsModule.
4. Ensure full accessibility (a11y) and keyboard navigation.
`
                    }
                }
            ]
        };
    }
    throw new McpError(ErrorCode.MethodNotFound, `Prompt "${name}" not found.`);
});
/**
 * Start the MCP Server on Stdio
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Talos Components MCP Server running on Stdio');
}
main().catch((err) => {
    console.error('Fatal error starting MCP server:', err);
    process.exit(1);
});
