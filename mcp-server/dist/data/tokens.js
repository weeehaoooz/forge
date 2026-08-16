export const TALOS_DESIGN_TOKENS = {
    summary: `The Talos design system utilizes modern CSS Custom Properties with SCSS tokens, fully supporting responsive density and dark mode theming via the \`.dark\` class or \`data-theme="dark"\`.`,
    importGuide: `
### Including Talos Styles in Angular

In your root \`src/styles.scss\`:
\`\`\`scss
@use '@talos/components/styles/index' as talos;

// Or import specific subsystems:
// @use '@talos/components/styles/variables' as vars;
// @use '@talos/components/styles/buttons';
// @use '@talos/components/styles/form-controls';
\`\`\`
`,
    colorSystem: {
        name: 'Color Tokens',
        description: 'Core semantic palette and contextual surfaces.',
        tokens: [
            { name: 'Primary', cssVar: '--talos-primary', description: 'Brand primary action color (default: Indigo/Violet #4f46e5).' },
            { name: 'Primary Hover', cssVar: '--talos-primary-hover', description: 'Hover state for primary action elements.' },
            { name: 'Primary Light', cssVar: '--talos-primary-light', description: 'Subtle light tint for active selections and badges.' },
            { name: 'Background Base', cssVar: '--talos-bg-base', description: 'Main page and viewport background.' },
            { name: 'Background Surface', cssVar: '--talos-bg-surface', description: 'Card, modal, and popover container background.' },
            { name: 'Border', cssVar: '--talos-border', description: 'Default border color for cards and form controls.' },
            { name: 'Text Primary', cssVar: '--talos-text-primary', description: 'High-contrast foreground typography.' },
            { name: 'Text Secondary', cssVar: '--talos-text-secondary', description: 'Muted descriptive labels and hints.' },
            { name: 'Success', cssVar: '--talos-success', description: 'Success actions and confirmation states (#10b981).' },
            { name: 'Danger / Error', cssVar: '--talos-danger', description: 'Destructive actions and validation errors (#ef4444).' },
            { name: 'Warning', cssVar: '--talos-warning', description: 'Warning banners and caution states (#f59e0b).' },
            { name: 'Info', cssVar: '--talos-info', description: 'Informational toasts and indicators (#3b82f6).' }
        ]
    },
    typography: {
        name: 'Typography Classes & Utilities',
        description: 'Clean sans-serif hierarchical typography scales.',
        tokens: [
            { name: 'Heading 1', scssVar: '.talos-h1', description: 'Large section and page titles (font-size: 2rem, font-weight: 700).' },
            { name: 'Heading 2', scssVar: '.talos-h2', description: 'Secondary page headings (font-size: 1.5rem, font-weight: 600).' },
            { name: 'Heading 3', scssVar: '.talos-h3', description: 'Card and modal titles (font-size: 1.25rem, font-weight: 600).' },
            { name: 'Body Regular', scssVar: '.talos-body', description: 'Default body text (font-size: 0.875rem / 14px).' },
            { name: 'Caption / Muted', scssVar: '.talos-caption', description: 'Small helper text, timestamp, and captions (font-size: 0.75rem / 12px).' }
        ]
    },
    formControls: {
        name: 'Form Control Dimensions & Sizes',
        description: 'Heights, paddings, and border radiuses across sm, md, and lg sizes.',
        tokens: [
            { name: 'Size Small (sm)', cssVar: '--talos-control-height-sm', value: '32px', description: 'Compact table filter & toolbars.' },
            { name: 'Size Medium (md)', cssVar: '--talos-control-height-md', value: '38px', description: 'Standard form input size.' },
            { name: 'Size Large (lg)', cssVar: '--talos-control-height-lg', value: '44px', description: 'Prominent search & hero inputs.' },
            { name: 'Border Radius', cssVar: '--talos-radius-md', value: '8px', description: 'Default rounded corners for inputs and dropdowns.' },
            { name: 'Focus Ring', cssVar: '--talos-focus-ring', value: '0 0 0 3px rgba(79, 70, 229, 0.25)', description: 'Accessible focus indicator.' }
        ]
    },
    buttons: {
        name: 'Button Variants & Classes',
        description: 'Style classes supported by the talosButton directive.',
        tokens: [
            { name: 'Primary', cssVar: '.talos-btn-primary', description: 'High emphasis filled button with primary brand color.' },
            { name: 'Secondary', cssVar: '.talos-btn-secondary', description: 'Neutral grey filled button for secondary actions.' },
            { name: 'Outline', cssVar: '.talos-btn-outline', description: 'Bordered button with transparent background.' },
            { name: 'Ghost / Subtle', cssVar: '.talos-btn-ghost', description: 'Borderless button that highlights on hover.' },
            { name: 'Danger', cssVar: '.talos-btn-danger', description: 'Red emphasis button for irreversible or destructive actions.' },
            { name: 'Success', cssVar: '.talos-btn-success', description: 'Green confirmation button.' },
            { name: 'Link', cssVar: '.talos-btn-link', description: 'Underline styled action button.' }
        ]
    },
    darkMode: {
        strategy: 'Add class `.dark` to `<html>` or `<body>`, or attribute `data-theme="dark"`',
        variables: {
            '--talos-bg-base': { light: '#f8fafc', dark: '#0f172a' },
            '--talos-bg-surface': { light: '#ffffff', dark: '#1e293b' },
            '--talos-border': { light: '#e2e8f0', dark: '#334155' },
            '--talos-text-primary': { light: '#0f172a', dark: '#f8fafc' },
            '--talos-text-secondary': { light: '#64748b', dark: '#94a3b8' }
        }
    }
};
