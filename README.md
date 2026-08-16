# Talos Component Library (`@talos/components`)

Talos is an enterprise-grade, modern Angular shared component library built for **Angular 20+**. It leverages signals for reactive state management, standalone component architecture, native control flow, and comprehensive accessibility (WCAG AA compliant). It comes complete with a dedicated **Model Context Protocol (MCP)** server for AI-accelerated frontend development.

---

## 📦 Quick Installation Guide

Follow these steps to integrate `@talos/components` into any Angular application.

### 🚀 Method 1: Automatic Setup via `ng add` (Recommended)

You can set up `@talos/components` and configure all dependencies, styles, and theming in one command:

```bash
ng add @talos/components
```

The schematic will interactively:
1. 📦 Install required peer dependencies (`@angular/cdk`, `@lucide/angular`, `date-fns`, `rxjs`).
2. 🎨 Automatically import Talos global SCSS styles & design tokens into `src/styles.scss`.
3. 🌗 Configure light or dark theme support.

---

### 🛠 Method 2: Manual Installation

If you prefer to configure dependencies manually:

```bash
# 1. Install @talos/components and peer dependencies
npm install @talos/components @angular/cdk @lucide/angular date-fns rxjs

# If consuming locally in a monorepo / linked workspace
npm run build:lib
npm install /path/to/talos/dist/talos
```

#### Peer Dependencies Compatibility Matrix

| Package | Supported Version | Purpose |
|---|---|---|
| `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router` | `^20.0.0 \|\| ^21.0.0 \|\| ^22.0.0` | Angular Framework |
| `@angular/cdk` | `^21.0.0 \|\| ^22.0.0` | Overlay, Portal & Accessibility utilities |
| `@lucide/angular` | `^1.31.0` | Icon system |
| `date-fns` | `^4.1.0` | Tree-shakeable date operations |
| `rxjs` | `~7.8.0` | Reactive streams |

---

### 2. Configure Global Styles & Design Tokens

Include the Talos stylesheet in your project's main stylesheet (`src/styles.scss`) or in `angular.json`:

#### Option A: SCSS Import (Recommended)
```scss
/* src/styles.scss */
@use '@talos/components/styles/index';

/* Or import granular SCSS modules */
// @use '@talos/components/styles/variables';
// @use '@talos/components/styles/buttons';
// @use '@talos/components/styles/form-controls';
```

#### Option B: `angular.json`
```json
"styles": [
  "node_modules/@talos/components/styles/index.scss",
  "src/styles.scss"
]
```

---

### 3. Setup Dark Mode & Theming

Talos components automatically adapt to light and dark modes via CSS custom properties. To enable dark mode, set `data-theme="dark"` on your root `<html>` or `<body>` element:

```html
<!-- Light Mode (Default) -->
<html>
  ...
</html>

<!-- Dark Mode -->
<html data-theme="dark">
  ...
</html>
```

You can customize primary brand colors and design tokens by overriding CSS variables:

```css
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --border-radius: 0.5rem;
}

[data-theme="dark"] {
  --bg-color: #0b1329;
  --card-bg: #111d40;
  --border-color: #1e293b;
  --text-color: #f8fafc;
}
```

---

### 4. Configure Lucide Icons (Optional)

Talos integrates with `@lucide/angular`. You can provide icons globally in `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideLucideIcons, LucideSun, LucideMoon, LucideChevronDown, LucideSearch, LucideX } from '@lucide/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLucideIcons({
      LucideSun,
      LucideMoon,
      LucideChevronDown,
      LucideSearch,
      LucideX
    })
  ]
};
```

---

### 5. Import & Use Standalone Components

Import components directly into your standalone components. For optimal tree-shaking, secondary entry points are supported:

```typescript
import { Component, signal } from '@angular/core';
import { TalosButtonDirective } from '@talos/components/button';
import { SelectInputComponent, OptionComponent } from '@talos/components/select-input';
import { DatePickerComponent } from '@talos/components/date-picker';
import { TalosSnackbarService } from '@talos/components/snackbar';

@Component({
  selector: 'app-dashboard',
  imports: [
    TalosButtonDirective,
    SelectInputComponent,
    OptionComponent,
    DatePickerComponent
  ],
  template: `
    <div class="space-y-4">
      <button talosButton variant="primary" (click)="notify()">
        Save Changes
      </button>

      <talos-select-input [(value)]="selectedRole" placeholder="Select role...">
        <talos-option value="admin">Administrator</talos-option>
        <talos-option value="editor">Editor</talos-option>
        <talos-option value="viewer">Viewer</talos-option>
      </talos-select-input>

      <talos-date-picker [(value)]="selectedDate" placeholder="Pick a date" />
    </div>
  `
})
export class DashboardComponent {
  selectedRole = signal('admin');
  selectedDate = signal<Date | null>(new Date());
  private snackbar = inject(TalosSnackbarService);

  notify() {
    this.snackbar.success('Settings saved successfully!');
  }
}
```

---

## 🤖 Setting Up the Talos MCP Server (AI-Assisted Development)

Talos includes a **Model Context Protocol (MCP)** server (`talos-mcp-server`) that enables AI assistants (such as **Antigravity**, **Claude Desktop**, **Cursor**, and **VS Code Cline/Roo Code**) to:
- 🔍 Discover all available UI components, directives, and services.
- 📖 Retrieve comprehensive API documentation with signal inputs, outputs, and two-way model bindings.
- 📋 Query ready-to-use, working Angular v20+ code examples.
- 🎨 Look up design tokens, CSS variables, and dark mode configuration.
- ⚡ Automatically generate component boilerplates.

---

### 1. Build the MCP Server

From the root directory of the Talos repository:

```bash
# Install MCP server dependencies & build
npm run mcp:build
```

The compiled output will be generated at `mcp-server/dist/index.js`.

---

### 2. Configure Your AI Assistant

Add the `talos-components` MCP server configuration to your AI assistant's settings:

#### A. Google Antigravity / Gemini CLI (`mcp_config.json`)
Add to your project's or global `mcp_config.json`:
```json
{
  "mcpServers": {
    "talos-components": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/talos/mcp-server/dist/index.js"]
    }
  }
}
```

#### B. Claude Desktop
Add to `claude_desktop_config.json`:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "talos-components": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/talos/mcp-server/dist/index.js"]
    }
  }
}
```

#### C. Cursor & VS Code MCP Extensions (Cline / Roo Code / Continue)
Add to your MCP settings (`cline_mcp_settings.json` or equivalent):
```json
{
  "mcpServers": {
    "talos-components": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/talos/mcp-server/dist/index.js"]
    }
  }
}
```

> **Note**: Replace `/ABSOLUTE/PATH/TO/talos` with the actual absolute path to your cloned Talos repository.

---

### 3. MCP Tools Reference

Once connected, the AI assistant gains access to the following specialized tools:

| MCP Tool | Description | Key Parameters |
|---|---|---|
| `talos_list_components` | Lists all UI components, directives, and services by category | `category` (`'All'`, `'Button'`, `'Form'`, `'Layout'`, `'Navigation'`, `'Feedback'`, `'Visualization'`) |
| `talos_search_components` | Fuzzy search for components, tokens, and guides by keyword | `query` (e.g., `"segmented switch"`, `"toast"`, `"calendar"`) |
| `talos_get_component_doc` | Fetches full API documentation, inputs, outputs, and selectors | `componentId` (e.g., `"button"`, `"select-input"`, `"snackbar"`) |
| `talos_get_example` | Returns complete, copy-pasteable Angular v20+ code examples | `componentId` (e.g., `"autocomplete"`, `"date-range-picker"`) |
| `talos_get_styles_and_tokens` | Inspects CSS custom properties, SCSS imports, and dark mode palette | `section` (`'all'`, `'colors'`, `'typography'`, `'forms'`, `'buttons'`, `'dark-mode'`, `'setup'`) |
| `talos_generate_template` | Generates a complete standalone component boilerplate configured with Talos | `componentName`, `usedComponents`, `withReactiveForm` |

---

## 📚 Component Catalog & API Reference

### 1. Button System (`TalosButtonDirective`)
High-performance button directive supporting variants, sizes, loading states, and ripple effects.

```html
<!-- Primary Button -->
<button talosButton variant="primary" size="md">Primary Action</button>

<!-- Loading State -->
<button talosButton variant="outline" [loading]="isLoading()">Submitting...</button>

<!-- Icon-Only Button -->
<button talosButton variant="ghost" size="sm" [iconOnly]="true" aria-label="Close">
  <svg lucideX [size]="16"></svg>
</button>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'subtle' \| 'danger' \| 'success' \| 'link'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Sizing modifier (32px / 36px / 42px) |
| `iconOnly` | `boolean` | `false` | Square aspect ratio for icon buttons |
| `fullWidth` | `boolean` | `false` | Expands to fill parent width |
| `pill` | `boolean` | `false` | Fully rounded pill border radius |
| `loading` | `boolean` | `false` | Shows animated spinner and disables interaction |
| `disabled` | `boolean` | `false` | Disables button and applies ARIA state |

---

### 2. Button Group (`TalosButtonGroupComponent`, `TalosButtonGroupItemDirective`)
Segmented control and cohesive button grouping for single-select, multi-select, or grouped toolbars.

```html
<talos-button-group [(value)]="selectedView" variant="outline" size="sm">
  <button talosButtonGroupItem value="day">Day</button>
  <button talosButtonGroupItem value="week">Week</button>
  <button talosButtonGroupItem value="month">Month</button>
</talos-button-group>
```

---

### 3. Layout & Application Shell (`MainLayoutComponent`, `SidePanelComponent`, `LayoutService`)
Complete app shell with responsive collapsible navigation, header bar, and dynamic slide-over side drawer.

```html
<talos-main-layout>
  <talos-side-nav side-nav />
  <main class="main-content">
    <router-outlet />
  </main>
</talos-main-layout>
```

**Opening a Side Drawer programmatically:**
```typescript
import { inject } from '@angular/core';
import { LayoutService } from '@talos/components/layout';

export class MyComponent {
  private layoutService = inject(LayoutService);

  openDetails() {
    this.layoutService.openRightPanel(
      DetailPanelComponent,
      { entityId: '123' },
      { title: 'Item Details', width: '480px' }
    );
  }
}
```

---

### 4. Navigation Sidebar (`SideNavComponent`)
Collapsible sidebar with grouped navigation items, active route indicators, badge notifications, and user footer.

```html
<talos-side-nav>
  <div side-nav-logo class="app-logo">
    <span class="font-bold text-lg">Talos App</span>
  </div>
</talos-side-nav>
```

---

### 5. Form Input & Textarea (`TalosInputDirective`)
Applies standardized design system styles and validation feedback to native inputs and textareas.

```html
<input type="text" talosInput size="md" [invalid]="hasError()" placeholder="Enter your username" />
<textarea talosInput size="lg" rows="4" placeholder="Enter description..."></textarea>
```

---

### 6. Select Input (`SelectInputComponent`, `OptionComponent`, `OptionGroupComponent`)
Modern searchable dropdown supporting single & multiple selections, option filtering, and group headers.

```html
<talos-select-input [(value)]="selectedCountry" placeholder="Choose a country" [searchable]="true">
  <talos-option-group label="North America">
    <talos-option value="us">United States</talos-option>
    <talos-option value="ca">Canada</talos-option>
  </talos-option-group>
  <talos-option-group label="Europe">
    <talos-option value="uk">United Kingdom</talos-option>
    <talos-option value="de">Germany</talos-option>
  </talos-option-group>
</talos-select-input>
```

---

### 7. Autocomplete (`TalosAutocompleteComponent`)
Combobox with dynamic asynchronous filtering, keyboard navigation, clearable triggers, and highlight matching.

```html
<talos-autocomplete
  [(value)]="selectedFruit"
  [options]="fruitOptions"
  placeholder="Search fruits..."
  [allowCustomValue]="false"
  (searchChange)="onSearch($event)"
/>
```

---

### 8. Checkboxes & Checkbox Groups (`TalosCheckboxComponent`, `TalosCheckboxGroupComponent`, `TalosCheckboxParentDirective`)
Accessible checkbox with support for indeterminate states, color variants, and hierarchical "Select All" parent groups.

```html
<!-- Standalone Checkbox -->
<talos-checkbox [(checked)]="agreeToTerms">
  I accept the terms and conditions
</talos-checkbox>

<!-- Hierarchical Group with Select All -->
<div talosCheckboxGroup [(ngModel)]="selectedItems">
  <input type="checkbox" talosCheckbox talosCheckboxParent [values]="['opt1', 'opt2', 'opt3']" /> Select All
  <input type="checkbox" talosCheckbox value="opt1" /> Option 1
  <input type="checkbox" talosCheckbox value="opt2" /> Option 2
  <input type="checkbox" talosCheckbox value="opt3" /> Option 3
</div>
```

---

### 9. Radio Buttons (`TalosRadioComponent`, `TalosRadioGroupComponent`)
Radio group supporting keyboard arrow navigation, horizontal/vertical layouts, and reactive forms.

```html
<talos-radio-group [(ngModel)]="selectedPlan" direction="horizontal" variant="primary">
  <talos-radio value="starter">Starter</talos-radio>
  <talos-radio value="professional">Professional</talos-radio>
  <talos-radio value="enterprise">Enterprise</talos-radio>
</talos-radio-group>
```

---

### 10. Slide Toggle (`SlideToggleComponent`, `TalosSlideToggleDirective`)
Accessible switch component with animated thumb transition, size options, and inline label support.

```html
<talos-slide-toggle [(checked)]="enableNotifications" size="md" variant="primary">
  Enable Push Notifications
</talos-slide-toggle>
```

---

### 11. Range & Slider (`RangeInputComponent`, `TalosRangeInputDirective`)
Single and dual-handle range sliders with tooltip labels, step snapping, and progress bar fill.

```html
<talos-range-input
  [(ngModel)]="volumeLevel"
  [min]="0"
  [max]="100"
  [step]="5"
  [showValue]="true"
/>
```

---

### 12. Date & Time Pickers (`DatePickerComponent`, `DateTimePickerComponent`)
High-performance date picker powered by `date-fns`. Supports quick selection decade grids, min/max restrictions, and integrated time panels.

```html
<!-- Single Date -->
<talos-date-picker
  [(ngModel)]="birthDate"
  placeholder="Select date"
  [clearable]="true"
  [maxDate]="today"
/>

<!-- Date and Time Picker -->
<talos-date-time-picker
  [(ngModel)]="appointmentTime"
  [use24Hour]="true"
  [minuteStep]="15"
/>
```

---

### 13. Date Range Pickers (`DateRangePickerComponent`, `DateTimeRangePickerComponent`)
Dual calendar range picker with preset shortcuts (e.g. *Today*, *Last 7 Days*, *This Month*).

```html
<talos-date-range-picker
  [(ngModel)]="selectedRange"
  placeholder="Select date range"
  [clearable]="true"
  [minSpan]="1"
  [maxSpan]="30"
/>
```

---

### 14. Toast & Snackbars (`TalosSnackbarService`, `TalosSnackbarContainerComponent`)
Global notification service supporting stackable toasts, action buttons, custom durations, and progress timers.

```typescript
import { inject } from '@angular/core';
import { TalosSnackbarService } from '@talos/components/snackbar';

export class FeatureComponent {
  private snackbar = inject(TalosSnackbarService);

  showFeedback() {
    this.snackbar.success('Changes successfully published!', {
      duration: 4000,
      action: {
        label: 'Undo',
        run: () => console.log('Undone')
      }
    });
  }
}
```

---

### 15. Tooltips (`TalosTooltipDirective`)
Lightweight tooltip directive with positioning (`top`, `bottom`, `left`, `right`), delay timers, and smart arrow offsets.

```html
<button talosButton variant="ghost" talosTooltip="View full analytics report" tooltipPosition="top">
  Analytics
</button>
```

---

### 16. Heatmap Visualization (`TalosHeatmapComponent`)
Interactive contribution / matrix heatmap with customizable color scales, tooltips, and click callbacks.

```html
<talos-heatmap
  [data]="activityData"
  [startDate]="yearStart"
  [endDate]="yearEnd"
  (cellClick)="onCellClick($event)"
/>
```

---

### 17. Category Bar Visualization (`TalosCategoryBarComponent`)
Segmented horizontal proportion bar with multi-color categories, value legends, and percentage breakdowns.

```html
<talos-category-bar
  [categories]="[
    { label: 'Completed', value: 75, color: '#16a34a' },
    { label: 'In Progress', value: 15, color: '#2563eb' },
    { label: 'Pending', value: 10, color: '#d97706' }
  ]"
/>
```

---

## 🛠 Project Scripts & Maintenance

| Script | Command | Description |
|---|---|---|
| **Demo Showcase** | `npm start` | Launches local Angular development server with interactive demo showcase |
| **Build Library** | `npm run build:lib` | Compiles `@talos/components` into `dist/talos` using `ng-packagr` |
| **Build Demo App** | `npm run build` | Builds production bundle for the demo application |
| **Run Unit Tests** | `npm test` | Runs the test suite via Vitest / Jasmine |
| **Build MCP Server** | `npm run mcp:build` | Compiles the Talos Model Context Protocol server (`mcp-server/dist`) |
| **Run MCP Server** | `npm run mcp:start` | Runs the Talos MCP server via stdio |

---

## 📄 License

MIT © Talos Design System Team
