# Forge Component Library (`@forge/components`)

Forge is a modern, modular Angular shared component library built for Angular 20+. It provides layout managers, customizable navigation sidebars, drawer panels, standardized design system buttons, and custom form controls designed with clean styling, dynamic animations, and developer ergonomics in mind.

---

## 📦 Installation & Setup

### 1. Build the Library
Before consuming the library locally or publishing:
```bash
npm run build:lib
```

### 2. Peer Dependencies
Ensure your target application includes the required dependencies:
- `@angular/core`: `^21.1.0`
- `@angular/common`: `^21.1.0`
- `@angular/forms`: `^21.1.0`
- `@angular/router`: `^21.1.0`
- `@lucide/angular`: `^1.31.0`
- `rxjs`: `~7.8.0`

---

## 🚀 Exported Components & Features

### 1. Standardized Button System (`ForgeButtonDirective`, SASS Styles)
A standardized, high-performance button design system supporting multiple visual variants, sizing modifiers, interactive states, and built-in CSS click ripple animations.

**Directive Usage:**
```html
<button type="button" forgeButton variant="primary" size="md" [loading]="isSubmitting()">
  Submit Form
</button>

<!-- Icon Only Button (Seamless background blending until hover) -->
<button type="button" forgeButton variant="ghost" size="sm" [iconOnly]="true" aria-label="Close">
  <svg lucideX [size]="16"></svg>
</button>
```

**Button Properties & Options:**
| Input Property | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'success' \| 'link'` | `'primary'` | Visual style variant (`ghost` blends in until hovered) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button height scaling (32px, 36px, 42px) |
| `iconOnly` | `boolean` | `false` | Sets square aspect ratio for icon buttons |
| `fullWidth` | `boolean` | `false` | Expands button to fill 100% of container width |
| `pill` | `boolean` | `false` | Applies fully rounded pill border radius |
| `loading` | `boolean` | `false` | Displays spinning indicator and disables click events |
| `disabled` | `boolean` | `false` | Disables button interaction and updates ARIA state |

---

### 2. Layout Management (`MainLayoutComponent`, `SidePanelComponent`, `LayoutService`)
Provides a responsive app layout container with left sidebar slot, main content area, and optional right expandable slide-over drawer panel.

**Usage:**
```html
<forge-main-layout>
  <!-- Left Navigation Slot -->
  <forge-side-nav side-nav />

  <!-- Main View Area -->
  <main class="demo-page-content">
    <router-outlet />
  </main>
</forge-main-layout>
```

**Layout Control via Service:**
```typescript
import { inject } from '@angular/core';
import { LayoutService } from '@forge/components';

export class MyComponent {
  private layoutService = inject(LayoutService);

  openPanel() {
    this.layoutService.openRightPanel(MyPanelComponent, { data: 123 }, { title: 'Details Panel' });
  }
}
```

---

### 3. Navigation Sidebar (`SideNavComponent`)
A collapsable sidebar with support for navigation sections, active state matching, badges, logo projection slots, and user profile summary footer.

**Usage:**
```html
<forge-side-nav>
  <div side-nav-logo class="app-logo">
    <span>The Forge</span>
  </div>
</forge-side-nav>
```

---

### 4. Custom Form Controls (`SelectInputComponent`, `OptionComponent`, `OptionGroupComponent`)
Signal-friendly select inputs supporting single and multiple selections, search filtering, grouped options, and custom triggers.

**Usage:**
```html
<forge-select-input [(value)]="selectedItem" placeholder="Select item...">
  <forge-option-group label="Category 1">
    <forge-option value="item1">Item 1</forge-option>
    <forge-option value="item2">Item 2</forge-option>
  </forge-option-group>
</forge-select-input>
```

---

## 🎨 Global Styles & SCSS Variables

Forge includes customizable SASS variables for themes, form controls, and button design tokens:

```scss
/* Import main Forge SCSS theme bundle */
@use '@forge/components/styles/index';

/* Or import individual SCSS modules */
@use '@forge/components/styles/variables';
@use '@forge/components/styles/buttons';
@use '@forge/components/styles/form-controls';
```

---

## 🛠 Project Scripts

| Script | Command | Description |
|---|---|---|
| Development Demo | `npm start` | Launches local Angular dev server with showcase app |
| Build Library | `npm run build:lib` | Compiles `@forge/components` into `dist/forge` via `ng-packagr` |
| Build App | `npm run build` | Builds production application bundle |
| Test | `npm test` | Runs unit test suite |
