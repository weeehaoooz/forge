# Forge Component Library (`@forge/components`)

Forge is a modern, modular Angular shared component library built for Angular 20+. It provides layout managers, customizable navigation sidebars, drawer panels, standardized design system buttons, and custom form controls designed with clean styling, dynamic animations, and developer ergonomics in mind.

---

## Installation & Setup

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
- `@angular/cdk`: `^21.1.0`
- `@lucide/angular`: `^1.31.0`
- `moment`: `^2.30.0`
- `rxjs`: `~7.8.0`

---

## Exported Components & Features

### 1. Standardized Button System (`ForgeButtonDirective`)
A high-performance button design system supporting multiple visual variants, sizing modifiers, interactive states, and built-in CSS ripple animations.

```html
<button type="button" forgeButton variant="primary" size="md" [loading]="isSubmitting()">
  Submit Form
</button>

<!-- Icon-only button -->
<button type="button" forgeButton variant="ghost" size="sm" [iconOnly]="true" aria-label="Close">
  <svg lucideX [size]="16"></svg>
</button>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'success' \| 'link'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button height (32px / 36px / 42px) |
| `iconOnly` | `boolean` | `false` | Square aspect ratio for icon-only buttons |
| `fullWidth` | `boolean` | `false` | Expands to 100% container width |
| `pill` | `boolean` | `false` | Fully rounded pill border radius |
| `loading` | `boolean` | `false` | Shows spinner and disables interaction |
| `disabled` | `boolean` | `false` | Disables interaction and updates ARIA state |

---

### 2. Layout Management (`MainLayoutComponent`, `SidePanelComponent`, `LayoutService`)
Responsive app shell with a left sidebar slot, main content area, and an optional right slide-over drawer panel.

```html
<forge-main-layout>
  <forge-side-nav side-nav />

  <main class="demo-page-content">
    <router-outlet />
  </main>
</forge-main-layout>
```

**Opening a side panel via service:**
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
A collapsible sidebar with navigation sections, active state matching, badges, logo projection, and a user profile footer.

```html
<forge-side-nav>
  <div side-nav-logo class="app-logo">
    <span>The Forge</span>
  </div>
</forge-side-nav>
```

---

### 4. Text Input & Textarea (`ForgeInputDirective`)
A lightweight directive that applies Forge styling and validation states to native `<input>` and `<textarea>` elements.

```html
<input type="text" forgeInput size="md" [invalid]="hasError()" />
<textarea forgeInput size="lg"></textarea>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height scaling for the input |
| `invalid` | `boolean` | `false` | Applies the invalid/error visual state |

---

### 5. Select Input (`SelectInputComponent`, `OptionComponent`, `OptionGroupComponent`)
Signal-friendly select inputs supporting single and multiple selections, search filtering, grouped options, and custom triggers.

```html
<forge-select-input [(value)]="selectedItem" placeholder="Select item...">
  <forge-option-group label="Category 1">
    <forge-option value="item1">Item 1</forge-option>
    <forge-option value="item2">Item 2</forge-option>
  </forge-option-group>
</forge-select-input>
```

---

### 6. Checkbox (`ForgeCheckboxDirective`, `ForgeCheckboxComponent`)
An accessible checkbox directive and standalone component with size, variant, indeterminate, and validation state support.

**Standalone usage:**
```html
<!-- As a directive on a native input -->
<input type="checkbox" forgeCheckbox [checked]="isChecked()" (checkedChange)="onCheck($event)" />

<!-- As a component with label -->
<forge-checkbox [checked]="isChecked()" (checkedChange)="onCheck($event)">
  Accept terms
</forge-checkbox>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Whether the checkbox is checked |
| `value` | `any` | `undefined` | Value used when part of a checkbox group |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Checkbox size |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger'` | `'primary'` | Visual color variant |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `invalid` | `boolean` | `false` | Applies the error/invalid visual state |
| `indeterminate` | `boolean` | `false` | Sets the indeterminate visual and DOM state |

| Output | Type | Description |
|---|---|---|
| `checkedChange` | `boolean` | Emitted when the checked state changes |

---

### 7. Checkbox Group (`ForgeCheckboxGroupDirective`, `ForgeCheckboxGroupComponent`)
A group container for managing multi-selection across a set of checkboxes. Implements `ControlValueAccessor` for reactive forms.

```html
<div forgeCheckboxGroup [(ngModel)]="selectedFruits" direction="horizontal">
  <input type="checkbox" forgeCheckbox value="apple" /> Apple
  <input type="checkbox" forgeCheckbox value="banana" /> Banana
  <input type="checkbox" forgeCheckbox value="cherry" /> Cherry
</div>
```

**With a parent "Select All" checkbox:**
```html
<div forgeCheckboxGroup #fruitGroup="forgeCheckboxGroup" [(ngModel)]="selectedFruits">
  <input type="checkbox" forgeCheckbox forgeCheckboxParent [values]="allFruitValues" /> Select All
  <input type="checkbox" forgeCheckbox value="apple" /> Apple
  <input type="checkbox" forgeCheckbox value="banana" /> Banana
</div>
```

| Input (Group) | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto-generated | Name attribute for the group |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Propagated size to all child checkboxes |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger'` | `'primary'` | Propagated variant to all child checkboxes |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction of the group |
| `disabled` | `boolean` | `false` | Disables the entire group |
| `invalid` | `boolean` | `false` | Applies error state to the group |

| Input (Parent/Select-All) | Type | Default | Description |
|---|---|---|---|
| `values` | `any[]` | `[]` | All selectable values this parent checkbox manages |
| `group` | `ForgeCheckboxGroupDirective` | (ancestor) | Explicit group reference if not a descendant |

---

### 8. Radio Button (`ForgeRadioComponent`, `ForgeRadioGroupComponent`)
An accessible radio group with keyboard arrow-key navigation, size/variant cascading, and `ControlValueAccessor` support.

```html
<forge-radio-group [(ngModel)]="selectedPlan" direction="horizontal" variant="primary">
  <forge-radio value="basic">Basic</forge-radio>
  <forge-radio value="pro">Pro</forge-radio>
  <forge-radio value="enterprise">Enterprise</forge-radio>
</forge-radio-group>
```

| Input (Group) | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto-generated | Shared name for all child radio inputs |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Propagated size to child radios |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger'` | `'primary'` | Propagated variant to child radios |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction of the group |
| `disabled` | `boolean` | `false` | Disables all radios in the group |
| `invalid` | `boolean` | `false` | Applies error state to the group |

| Input (Radio) | Type | Default | Description |
|---|---|---|---|
| `value` | `unknown` | required | The value this radio option represents |
| `disabled` | `boolean` | `false` | Disables this specific radio option |
| `size` | `'sm' \| 'md' \| 'lg'` | (from group) | Overrides group size for this option |
| `variant` | `'primary' \| ...` | (from group) | Overrides group variant for this option |

---

### 9. Date Picker (`DatePickerComponent`)
A feature-rich date (and optional time) picker with calendar popover, month/year drill-down views, min/max constraints, and reactive forms integration.

```html
<forge-date-picker
  [(ngModel)]="selectedDate"
  placeholder="Select date"
  size="md"
  [clearable]="true"
  [minDate]="'2020-01-01'"
  [maxDate]="'2030-12-31'"
/>

<!-- With time picking -->
<forge-date-picker
  [(ngModel)]="selectedDateTime"
  [showTime]="true"
  [use24Hour]="true"
  [showSeconds]="false"
  [minuteStep]="15"
/>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `'Select date'` | Trigger placeholder text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size of the picker |
| `disabled` | `boolean` | `false` | Disables the picker |
| `clearable` | `boolean` | `true` | Shows a clear button when a value is set |
| `displayFormat` | `string` | `'YYYY-MM-DD'` | Moment format string for display |
| `valueFormat` | `string` | `'YYYY-MM-DD'` | Moment format string for emitted value (`'moment'` or `'date'` also accepted) |
| `showTime` | `boolean` | `false` | Enables time selection panel |
| `use24Hour` | `boolean` | `true` | 24-hour vs 12-hour time format |
| `showSeconds` | `boolean` | `false` | Shows seconds column in time panel |
| `minuteStep` | `number` | `1` | Minute increment step |
| `minDate` | `string \| Date \| Moment \| null` | `null` | Minimum selectable date |
| `maxDate` | `string \| Date \| Moment \| null` | `null` | Maximum selectable date |
| `firstDayOfWeek` | `number` | `0` | First day of week (`0` = Sunday, `1` = Monday) |
| `filterDate` | `(date: Moment) => boolean \| null` | `null` | Custom function to disable specific dates |

| Output | Type | Description |
|---|---|---|
| `dateChange` | `unknown` | Emitted when a date is selected or cleared |
| `opened` | `void` | Emitted when the calendar opens |
| `closed` | `void` | Emitted when the calendar closes |

---

### 10. Date-Time Picker (`DateTimePickerComponent`)
A convenience alias for `DatePickerComponent` with `showTime` pre-enabled, using the same API.

```html
<forge-date-time-picker
  [(ngModel)]="selectedDateTime"
  [use24Hour]="false"
  [showSeconds]="true"
/>
```

Accepts all the same inputs and outputs as `DatePickerComponent`.

---

### 11. Date Range Picker (`DateRangePickerComponent`)
A dual-calendar date range picker with optional time selection, range span constraints, and built-in preset shortcuts.

```html
<forge-date-range-picker
  [(ngModel)]="dateRange"
  placeholder="Select date range"
  [clearable]="true"
  [minDate]="'2020-01-01'"
  [maxDate]="'2030-12-31'"
  [presets]="myPresets"
/>
```

The `ngModel` / form value is a `DateRangeValue` object:
```typescript
interface DateRangeValue {
  start: string | null; // formatted per valueFormat
  end: string | null;
}
```

| Input | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `'Select date range'` | Trigger placeholder text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size of the picker |
| `disabled` | `boolean` | `false` | Disables the picker |
| `clearable` | `boolean` | `true` | Shows a clear button when a range is set |
| `displayFormat` | `string` | `'YYYY-MM-DD'` | Moment format string for display |
| `valueFormat` | `string` | `'YYYY-MM-DD'` | Moment format string for emitted value |
| `showTime` | `boolean` | `false` | Enables time selection panels |
| `use24Hour` | `boolean` | `true` | 24-hour vs 12-hour time format |
| `showSeconds` | `boolean` | `false` | Shows seconds column in time panels |
| `minuteStep` | `number` | `1` | Minute increment step |
| `minDate` | `string \| Date \| Moment \| null` | `null` | Minimum selectable date |
| `maxDate` | `string \| Date \| Moment \| null` | `null` | Maximum selectable date |
| `minSpan` | `number \| null` | `null` | Minimum required range span in days |
| `maxSpan` | `number \| null` | `null` | Maximum allowed range span in days |
| `firstDayOfWeek` | `number` | `0` | First day of week (`0` = Sunday, `1` = Monday) |
| `presets` | `DateRangePreset[] \| null` | `null` | Quick-select preset ranges |
| `presetType` | `'all' \| 'calendar' \| 'duration'` | `'all'` | Filters which preset categories are shown |
| `filterDate` | `(date: Moment) => boolean \| null` | `null` | Custom function to disable specific dates |

| Output | Type | Description |
|---|---|---|
| `rangeChange` | `DateRangeValue \| null` | Emitted when the range selection changes |
| `opened` | `void` | Emitted when the picker opens |
| `closed` | `void` | Emitted when the picker closes |

---

### 12. Date-Time Range Picker (`DateTimeRangePickerComponent`)
A convenience alias for `DateRangePickerComponent` with `showTime` pre-enabled, using the same API.

```html
<forge-date-time-range-picker
  [(ngModel)]="dateTimeRange"
  [use24Hour]="true"
  [showSeconds]="false"
/>
```

Accepts all the same inputs and outputs as `DateRangePickerComponent`.

---

## Global Styles & SCSS Variables

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

## Project Scripts

| Script | Command | Description |
|---|---|---|
| Development Demo | `npm start` | Launches local Angular dev server with showcase app |
| Build Library | `npm run build:lib` | Compiles `@forge/components` into `dist/forge` via `ng-packagr` |
| Build App | `npm run build` | Builds production application bundle |
| Test | `npm test` | Runs unit test suite |
