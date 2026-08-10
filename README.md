# Forge Component Library (`@forge/components`)

Forge is a modern, modular Angular shared component library built for Angular 20+. It provides layout managers, customizable navigation sidebars, drawer panels, and custom form controls designed with clean styling and developer ergonomics in mind.

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

### 1. Layout Management (`MainLayoutComponent`, `SidePanelComponent`, `LayoutService`)
Provides a responsive app layout container with left sidebar slot, main content area, and optional right expandable slide-over drawer panel.

**Usage:**
```html
<forge-main-layout>
  <!-- Left Navigation Slot -->
  <ng-container slot="nav">
    <forge-side-nav [navSections]="sections" [user]="user" />
  </ng-container>

  <!-- Main View Area -->
  <router-outlet />

  <!-- Right Drawer Slot -->
  <ng-container slot="side-panel">
    <forge-side-panel title="Details">
      <p>Drawer content goes here...</p>
    </forge-side-panel>
  </ng-container>
</forge-main-layout>
```

**Layout Control via Service:**
```typescript
import { inject } from '@angular/core';
import { LayoutService } from '@forge/components';

export class MyComponent {
  private layoutService = inject(LayoutService);

  openPanel() {
    this.layoutService.openSidePanel();
  }
}
```

---

### 2. Navigation Sidebar (`SideNavComponent`)
A collapsable sidebar with support for navigation sections, active state matching, badges, collapsible groups, and user profile summary footer.

**Usage:**
```html
<forge-side-nav
  [navSections]="navSections"
  [user]="currentUser"
  (collapsedChange)="onSidebarToggle($event)"
/>
```

---

### 3. Custom Form Controls (`SelectInputComponent`, `OptionComponent`, `OptionGroupComponent`)
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

## 🛠 Project Scripts

| Script | Command | Description |
|---|---|---|
| Development Demo | `npm start` | Launches local Angular dev server with showcase app |
| Build Library | `npm run build:lib` | Compiles `@forge/components` into `dist/forge` via `ng-packagr` |
| Test | `npm test` | Runs unit tests via Vitest |

---

## 🎨 Global Styles & SCSS Variables

Forge includes customizable SASS variables for themes and design system tokens. You can import variables into your app's global stylesheets:

```scss
@use '@forge/components/styles/variables' as *;
```
