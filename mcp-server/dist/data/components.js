export const TALOS_COMPONENTS = [
    {
        id: 'button',
        name: 'Button',
        category: 'Button',
        kind: 'directive',
        selector: 'button[talosButton], a[talosButton], button[talos-btn], a[talos-btn]',
        exportName: 'TalosButtonDirective',
        secondaryEntrypoint: '@talos/components/button',
        rootExport: '@talos/components',
        description: 'High-performance interactive button directive supporting variants, sizes, pill shapes, loading states, and pointer ripple effects.',
        inputs: [
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'danger' | 'success' | 'link'", default: "'primary'", description: 'Button visual style variant.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size variant.' },
            { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Square aspect ratio for icon-only display.' },
            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Expands button to fill 100% parent container width.' },
            { name: 'pill', type: 'boolean', default: 'false', description: 'Applies fully rounded pill border radius.' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Displays spinner animation and disables interaction.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables button interaction and updates ARIA disabled attribute.' }
        ],
        tags: ['button', 'btn', 'cta', 'action', 'pill', 'loading'],
        docs: `
### TalosButtonDirective
Applies modern styling to standard HTML \`<button>\` and \`<a>\` tags with animated ripple feedback and accessibility support.

**Usage:**
\`\`\`html
<button talosButton variant="primary" size="md">Click Me</button>
<button talosButton variant="outline" [loading]="isLoading()">Submit</button>
<button talosButton variant="ghost" [iconOnly]="true" aria-label="Settings">
  <lucide-icon name="settings" />
</button>
\`\`\`
`
    },
    {
        id: 'button-group',
        name: 'Button Group',
        category: 'Button',
        kind: 'component',
        selector: 'talos-button-group',
        exportName: 'TalosButtonGroupComponent, TalosButtonGroupItemDirective, TalosButtonGroupModule',
        secondaryEntrypoint: '@talos/components/button-group',
        rootExport: '@talos/components',
        description: 'Container for grouping buttons into segmented controls or toolbars supporting single/multi selection models.',
        inputs: [
            { name: 'value', type: 'T | T[]', description: 'Two-way bindable model value or signal model.' },
            { name: 'multiple', type: 'boolean', default: 'false', description: 'Enables multi-selection mode.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size propagated to child buttons.' },
            { name: 'variant', type: 'ButtonVariant', default: "'secondary'", description: 'Variant style applied across the group.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all buttons within the group.' }
        ],
        outputs: [
            { name: 'valueChange', type: 'EventEmitter<T | T[]>', description: 'Emitted when the selected value changes.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['button-group', 'segmented-control', 'toggle-group', 'toolbar', 'tabs'],
        docs: `
### TalosButtonGroupComponent
Used for segmented views, filter bars, and toggleable button groups.

**Usage:**
\`\`\`html
<talos-button-group [(value)]="selectedView" variant="secondary" size="sm">
  <button talosButtonGroupItem value="list">List</button>
  <button talosButtonGroupItem value="grid">Grid</button>
  <button talosButtonGroupItem value="map">Map</button>
</talos-button-group>
\`\`\`
`
    },
    {
        id: 'input',
        name: 'Input & Textarea',
        category: 'Form',
        kind: 'directive',
        selector: 'input[talosInput], textarea[talosInput], input[talosTextarea], textarea[talosTextarea]',
        exportName: 'TalosInputDirective',
        secondaryEntrypoint: '@talos/components/form/input',
        rootExport: '@talos/components',
        description: 'Directive for native input and textarea elements with unified sizing, focus ring, invalid error borders, and dark mode support.',
        inputs: [
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sizing variation for input/textarea.' },
            { name: 'invalid', type: 'boolean', default: 'false', description: 'Sets invalid error state styling.' }
        ],
        formsIntegration: 'Direct input binding',
        tags: ['input', 'text', 'textarea', 'form-control', 'textbox', 'field'],
        docs: `
### TalosInputDirective
Standard styling for text fields and textareas. Seamlessly integrates with Angular \`formControl\` or \`ngModel\`.

**Usage:**
\`\`\`html
<input talosInput type="text" placeholder="Enter username..." [formControl]="usernameControl" size="md" [invalid]="usernameControl.invalid && usernameControl.touched" />
<textarea talosInput rows="4" placeholder="Description..." [formControl]="descControl"></textarea>
\`\`\`
`
    },
    {
        id: 'select-input',
        name: 'Select Input',
        category: 'Form',
        kind: 'component',
        selector: 'talos-select-input',
        exportName: 'SelectInputComponent, OptionComponent, OptionGroupComponent, SelectInputModule',
        secondaryEntrypoint: '@talos/components/form/select-input',
        rootExport: '@talos/components',
        description: 'Custom dropdown select with searchable filtering, option groups, clear button, keyboard navigation, and full ControlValueAccessor integration.',
        inputs: [
            { name: 'placeholder', type: 'string', default: "'Select an option'", description: 'Placeholder label when empty.' },
            { name: 'searchable', type: 'boolean', default: 'false', description: 'Enables search filter input inside dropdown.' },
            { name: 'searchPlaceholder', type: 'string', default: "'Search options...'", description: 'Placeholder text for internal search.' },
            { name: 'clearable', type: 'boolean', default: 'false', description: 'Shows clear icon button when a value is selected.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables select dropdown.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'sm'", description: 'Select trigger size.' }
        ],
        outputs: [
            { name: 'selectionChange', type: 'output<unknown>()', description: 'Emits when selected option changes.' },
            { name: 'opened', type: 'output<void>()', description: 'Emits when dropdown opens.' },
            { name: 'closed', type: 'output<void>()', description: 'Emits when dropdown closes.' },
            { name: 'searchChange', type: 'output<string>()', description: 'Emits search query input.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['select', 'dropdown', 'combobox', 'picker', 'options', 'form'],
        docs: `
### SelectInputComponent (\`talos-select-input\`)
Accessible, keyboard-navigable dropdown select.

**Usage:**
\`\`\`html
<talos-select-input [formControl]="countryControl" [searchable]="true" placeholder="Choose a country" size="md">
  @for (country of countries; track country.code) {
    <talos-option [value]="country.code" [label]="country.name">{{ country.name }}</talos-option>
  }
</talos-select-input>
\`\`\`
`
    },
    {
        id: 'autocomplete',
        name: 'Autocomplete',
        category: 'Form',
        kind: 'component',
        selector: 'talos-autocomplete',
        exportName: 'TalosAutocompleteComponent, TalosAutocompleteOptionComponent, TalosAutocompleteModule',
        secondaryEntrypoint: '@talos/components/form/autocomplete',
        rootExport: '@talos/components',
        description: 'Dynamic autocomplete input component supporting async/remote search, custom item templates, loading spinner, and keyboard navigation.',
        inputs: [
            { name: 'placeholder', type: 'string', default: "'Type to search...'", description: 'Placeholder for input.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'sm'", description: 'Input sizing.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables autocomplete.' },
            { name: 'searching', type: 'boolean', default: 'false', description: 'Displays spinner for async backend queries.' },
            { name: 'clearable', type: 'boolean', default: 'true', description: 'Shows clear button when text exists.' }
        ],
        outputs: [
            { name: 'search', type: 'output<string>()', description: 'Emitted when user types to trigger async search.' },
            { name: 'selected', type: 'output<unknown>()', description: 'Emitted when an option is selected.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['autocomplete', 'typeahead', 'search', 'async-search', 'suggest'],
        docs: `
### TalosAutocompleteComponent (\`talos-autocomplete\`)
Ideal for remote API searching with debouncing and custom rendering templates.

**Usage:**
\`\`\`html
<talos-autocomplete
  [formControl]="techControl"
  placeholder="Search framework..."
  [searching]="isSearching()"
  (search)="onSearch($event)"
  (selected)="onSelected($event)">
  @for (item of results(); track item.id) {
    <talos-autocomplete-option [value]="item.id" [label]="item.name">
      <strong>{{ item.name }}</strong> - <span>{{ item.category }}</span>
    </talos-autocomplete-option>
  }
</talos-autocomplete>
\`\`\`
`
    },
    {
        id: 'checkbox',
        name: 'Checkbox & Checkbox Group',
        category: 'Form',
        kind: 'component',
        selector: 'talos-checkbox, talos-checkbox-group, input[talosCheckbox]',
        exportName: 'CheckboxComponent, CheckboxDirective, CheckboxGroupComponent, CheckboxParentDirective, CheckboxModule',
        secondaryEntrypoint: '@talos/components/form/checkbox',
        rootExport: '@talos/components',
        description: 'Checkbox component and directives supporting intermediate/indeterminate parent checkboxes, group value collections, and custom checkbox styling.',
        inputs: [
            { name: 'checked', type: 'boolean', default: 'false', description: 'Checked state.' },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate/mixed state.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Checkbox size.' }
        ],
        outputs: [
            { name: 'checkedChange', type: 'EventEmitter<boolean>', description: 'Emits on checked status change.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['checkbox', 'check', 'toggle', 'checkbox-group', 'indeterminate'],
        docs: `
### CheckboxComponent (\`talos-checkbox\`)
Supports standalone boolean bindings, parent indeterminate logic, and grouped array selections.

**Usage:**
\`\`\`html
<!-- Standalone -->
<talos-checkbox [formControl]="agreeControl">I agree to the Terms</talos-checkbox>

<!-- Parent indeterminate -->
<talos-checkbox [checked]="isAllSelected()" [indeterminate]="isPartiallySelected()" (checkedChange)="toggleAll($event)">Select All</talos-checkbox>
\`\`\`
`
    },
    {
        id: 'radio',
        name: 'Radio & Radio Group',
        category: 'Form',
        kind: 'component',
        selector: 'talos-radio, talos-radio-group, input[talosRadio]',
        exportName: 'RadioComponent, RadioGroupComponent, RadioDirective, RadioModule',
        secondaryEntrypoint: '@talos/components/form/radio',
        rootExport: '@talos/components',
        description: 'Radio button and radio group components for single option selection with smooth animations and keyboard navigation.',
        inputs: [
            { name: 'value', type: 'T', description: 'Value of the radio option or group.' },
            { name: 'name', type: 'string', description: 'Radio group name attribute.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the radio button.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['radio', 'radio-group', 'options', 'single-select'],
        docs: `
### RadioGroupComponent (\`talos-radio-group\`)
**Usage:**
\`\`\`html
<talos-radio-group [formControl]="planControl">
  <talos-radio value="starter">Starter Plan ($9/mo)</talos-radio>
  <talos-radio value="pro">Pro Plan ($29/mo)</talos-radio>
  <talos-radio value="enterprise">Enterprise</talos-radio>
</talos-radio-group>
\`\`\`
`
    },
    {
        id: 'slide-toggle',
        name: 'Slide Toggle (Switch)',
        category: 'Form',
        kind: 'component',
        selector: 'talos-slide-toggle, input[talosSlideToggle]',
        exportName: 'TalosSlideToggleComponent, TalosSlideToggleDirective, TalosSlideToggleModule',
        secondaryEntrypoint: '@talos/components/form/slide-toggle',
        rootExport: '@talos/components',
        description: 'Sleek animated switch toggle component for boolean settings and toggles.',
        inputs: [
            { name: 'checked', type: 'boolean', default: 'false', description: 'Current toggle state.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of toggle switch.' }
        ],
        outputs: [
            { name: 'checkedChange', type: 'EventEmitter<boolean>', description: 'Emitted when toggle value changes.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['switch', 'toggle', 'slide-toggle', 'boolean'],
        docs: `
### TalosSlideToggleComponent (\`talos-slide-toggle\`)
**Usage:**
\`\`\`html
<talos-slide-toggle [formControl]="notificationsEnabled">
  Enable push notifications
</talos-slide-toggle>
\`\`\`
`
    },
    {
        id: 'range-input',
        name: 'Range Input (Slider)',
        category: 'Form',
        kind: 'component',
        selector: 'talos-range-input, input[talosRangeInput]',
        exportName: 'RangeInputComponent, RangeInputDirective, RangeInputModule',
        secondaryEntrypoint: '@talos/components/form/range-input',
        rootExport: '@talos/components',
        description: 'Single and dual-handle slider input for numeric values and ranges with custom tooltip value formatters.',
        inputs: [
            { name: 'min', type: 'number', default: '0', description: 'Minimum allowed value.' },
            { name: 'max', type: 'number', default: '100', description: 'Maximum allowed value.' },
            { name: 'step', type: 'number', default: '1', description: 'Step interval.' },
            { name: 'showValue', type: 'boolean', default: 'true', description: 'Displays value label bubble.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables slider.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['range', 'slider', 'number', 'range-input', 'dual-range'],
        docs: `
### RangeInputComponent (\`talos-range-input\`)
**Usage:**
\`\`\`html
<talos-range-input [min]="0" [max]="100" [step]="5" [formControl]="volumeControl"></talos-range-input>
\`\`\`
`
    },
    {
        id: 'date-picker',
        name: 'Date Picker',
        category: 'Form',
        kind: 'component',
        selector: 'talos-date-picker',
        exportName: 'DatePickerComponent',
        secondaryEntrypoint: '@talos/components/form/date-picker',
        rootExport: '@talos/components',
        description: 'Calendar-based date picker supporting min/max constraints, custom date formatting (date-fns), and responsive popovers.',
        inputs: [
            { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Placeholder label.' },
            { name: 'minDate', type: 'string | Date', description: 'Minimum selectable date.' },
            { name: 'maxDate', type: 'string | Date', description: 'Maximum selectable date.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'sm'", description: 'Input sizing.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables date picker.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['date', 'calendar', 'date-picker', 'day'],
        docs: `
### DatePickerComponent (\`talos-date-picker\`)
**Usage:**
\`\`\`html
<talos-date-picker [formControl]="birthdayControl" minDate="1950-01-01" maxDate="2026-12-31" placeholder="YYYY-MM-DD"></talos-date-picker>
\`\`\`
`
    },
    {
        id: 'date-range-picker',
        name: 'Date Range Picker',
        category: 'Form',
        kind: 'component',
        selector: 'talos-date-range-picker',
        exportName: 'DateRangePickerComponent, DateRangeValue',
        secondaryEntrypoint: '@talos/components/form/date-range-picker',
        rootExport: '@talos/components',
        description: 'Dual-calendar date range selection component returning an object with { startDate, endDate }.',
        inputs: [
            { name: 'placeholder', type: 'string', default: "'Select date range'", description: 'Placeholder text.' },
            { name: 'minDate', type: 'string | Date', description: 'Earliest selectable start date.' },
            { name: 'maxDate', type: 'string | Date', description: 'Latest selectable end date.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'sm'", description: 'Input size.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables date range picker.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['date-range', 'range-picker', 'calendar-range', 'start-date', 'end-date'],
        docs: `
### DateRangePickerComponent (\`talos-date-range-picker\`)
**Usage:**
\`\`\`html
<talos-date-range-picker [formControl]="bookingRangeControl" size="md"></talos-date-range-picker>
\`\`\`
`
    },
    {
        id: 'date-time-picker',
        name: 'Date Time Picker',
        category: 'Form',
        kind: 'component',
        selector: 'talos-date-time-picker',
        exportName: 'DateTimePickerComponent',
        secondaryEntrypoint: '@talos/components/form/date-time-picker',
        rootExport: '@talos/components',
        description: 'Integrated date calendar and time picker with hour/minute selectors in 12h or 24h formats.',
        inputs: [
            { name: 'placeholder', type: 'string', default: "'Select date & time'", description: 'Placeholder text.' },
            { name: 'minDateTime', type: 'string | Date', description: 'Minimum allowed timestamp.' },
            { name: 'maxDateTime', type: 'string | Date', description: 'Maximum allowed timestamp.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'sm'", description: 'Input sizing.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['date-time', 'time-picker', 'timestamp', 'schedule'],
        docs: `
### DateTimePickerComponent (\`talos-date-time-picker\`)
**Usage:**
\`\`\`html
<talos-date-time-picker [formControl]="eventScheduleControl" size="sm"></talos-date-time-picker>
\`\`\`
`
    },
    {
        id: 'date-time-range-picker',
        name: 'Date Time Range Picker',
        category: 'Form',
        kind: 'component',
        selector: 'talos-date-time-range-picker',
        exportName: 'DateTimeRangePickerComponent',
        secondaryEntrypoint: '@talos/components/form/date-time-range-picker',
        rootExport: '@talos/components',
        description: 'Comprehensive date and time range picker component for precise booking and scheduling spans.',
        inputs: [
            { name: 'placeholder', type: 'string', default: "'Select date & time range'", description: 'Placeholder text.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'sm'", description: 'Input sizing.' }
        ],
        formsIntegration: 'ControlValueAccessor',
        tags: ['date-time-range', 'schedule-range', 'calendar-time'],
        docs: `
### DateTimeRangePickerComponent (\`talos-date-time-range-picker\`)
**Usage:**
\`\`\`html
<talos-date-time-range-picker [formControl]="reservationPeriodControl"></talos-date-time-range-picker>
\`\`\`
`
    },
    {
        id: 'layout',
        name: 'Layout & Side Panel',
        category: 'Layout',
        kind: 'component',
        selector: 'talos-main-layout, talos-side-panel',
        exportName: 'MainLayoutComponent, SidePanelComponent, LayoutService',
        secondaryEntrypoint: '@talos/components/layout',
        rootExport: '@talos/components',
        description: 'Application layout scaffolding shell with collapsible side panel, header, content area, and reactive LayoutService state.',
        tags: ['layout', 'main-layout', 'side-panel', 'sidebar', 'drawer', 'shell'],
        docs: `
### MainLayoutComponent & SidePanelComponent
**Usage:**
\`\`\`html
<talos-main-layout>
  <div header-content>
    <h1>My Application</h1>
  </div>
  
  <div main-content>
    <router-outlet />
  </div>

  <talos-side-panel #drawer>
    <p>Side panel contents</p>
  </talos-side-panel>
</talos-main-layout>
\`\`\`
`
    },
    {
        id: 'nav',
        name: 'Side Navigation',
        category: 'Navigation',
        kind: 'component',
        selector: 'talos-side-nav',
        exportName: 'SideNavComponent',
        secondaryEntrypoint: '@talos/components/nav',
        rootExport: '@talos/components',
        description: 'Collapsible side navigation bar with nested navigation items, icon badges, and active route detection.',
        tags: ['nav', 'sidebar', 'navigation', 'menu', 'side-nav'],
        docs: `
### SideNavComponent (\`talos-side-nav\`)
**Usage:**
\`\`\`html
<talos-side-nav [navItems]="navConfig"></talos-side-nav>
\`\`\`
`
    },
    {
        id: 'snackbar',
        name: 'Snackbar & Toast Service',
        category: 'Feedback',
        kind: 'service',
        exportName: 'TalosSnackbarService, TalosSnackbarComponent, TalosSnackbarModule',
        secondaryEntrypoint: '@talos/components/snackbar',
        rootExport: '@talos/components',
        description: 'Global notification toast system supporting success, error, warning, info variants, auto-dismiss progress bar, action buttons, and custom templates.',
        tags: ['snackbar', 'toast', 'notification', 'alert', 'feedback'],
        docs: `
### TalosSnackbarService
Injectable service to trigger rich notifications.

**Usage:**
\`\`\`typescript
const snackbar = inject(TalosSnackbarService);

// Quick helpers:
snackbar.success('Item saved!', { duration: 3000, position: 'bottom-right' });
snackbar.error('Failed to sync changes.', { actionLabel: 'Retry', onAction: () => retry() });
snackbar.warning('Low storage remaining');
snackbar.info('Update downloaded');
\`\`\`
`
    },
    {
        id: 'tooltip',
        name: 'Tooltip Directive',
        category: 'Feedback',
        kind: 'directive',
        selector: '[talosTooltip]',
        exportName: 'TalosTooltipDirective',
        secondaryEntrypoint: '@talos/components/tooltip',
        rootExport: '@talos/components',
        description: 'Lightweight, accessible floating tooltip directive with position control (top, bottom, left, right) and delay timings.',
        inputs: [
            { name: 'talosTooltip', type: 'string', required: true, description: 'Text content to display in tooltip.' },
            { name: 'tooltipPosition', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred placement.' },
            { name: 'tooltipDelay', type: 'number', default: '200', description: 'Hover delay in milliseconds.' }
        ],
        tags: ['tooltip', 'popover', 'hint', 'help', 'hover'],
        docs: `
### TalosTooltipDirective (\`[talosTooltip]\`)
**Usage:**
\`\`\`html
<button talosButton variant="secondary" talosTooltip="Export current report to PDF" tooltipPosition="top">
  Export
</button>
\`\`\`
`
    },
    {
        id: 'heatmap',
        name: 'Heatmap Matrix',
        category: 'Visualization',
        kind: 'component',
        selector: 'talos-heatmap',
        exportName: 'HeatmapComponent, HeatmapModule',
        secondaryEntrypoint: '@talos/components/heatmap',
        rootExport: '@talos/components',
        description: 'Interactive 2D matrix heatmap visualization with color gradient scales, cell hover tooltips, and click event callbacks.',
        tags: ['heatmap', 'matrix', 'chart', 'visualization', 'analytics'],
        docs: `
### HeatmapComponent (\`talos-heatmap\`)
**Usage:**
\`\`\`html
<talos-heatmap [data]="matrixData" [colorScale]="'emerald'" (cellClick)="onCellClick($event)"></talos-heatmap>
\`\`\`
`
    },
    {
        id: 'category-bar',
        name: 'Category Bar',
        category: 'Visualization',
        kind: 'component',
        selector: 'talos-category-bar',
        exportName: 'CategoryBarComponent, CategoryBarModule',
        secondaryEntrypoint: '@talos/components/category-bar',
        rootExport: '@talos/components',
        description: 'Segmented progress / ratio bar for visualizing multi-category distributions, budgets, and percentages.',
        tags: ['category-bar', 'progress-bar', 'segmented-bar', 'ratio', 'distribution'],
        docs: `
### CategoryBarComponent (\`talos-category-bar\`)
**Usage:**
\`\`\`html
<talos-category-bar [categories]="categoryDistribution"></talos-category-bar>
\`\`\`
`
    },
    {
        id: 'status-tag',
        name: 'Status Tag & Indicators',
        category: 'Visualization',
        kind: 'component',
        selector: 'talos-status-tag, [talosStatusTag]',
        exportName: 'TalosStatusTagComponent, TalosStatusTagModule',
        secondaryEntrypoint: '@talos/components/status-tag',
        rootExport: '@talos/components',
        description: 'Standardized status tags and indicators for workflow orchestration engines (NEW, PENDING, IN-PROGRESS, PAUSED, RETRYING, SKIPPED, SUCCESS, COMPLETED, ERROR, TERMINATED, EXPIRED) with semantic symbols, labels, and customizable CSS tokens.',
        inputs: [
            { name: 'status', type: "TalosWorkflowStatus | string", required: true, description: 'Workflow status name or alias (e.g. NEW, IN-PROGRESS, SUCCESS, ERROR, PAUSED, etc).' },
            { name: 'label', type: 'string', description: 'Custom label override (defaults to canonical status label).' },
            { name: 'variant', type: "'subtle' | 'solid' | 'outline' | 'dot'", default: "'subtle'", description: 'Visual presentation variant style.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Tag sizing scale.' },
            { name: 'shape', type: "'rounded' | 'pill' | 'square'", default: "'rounded'", description: 'Border radius shape.' },
            { name: 'showIcon', type: 'boolean', default: 'true', description: 'Whether to render the semantic icon.' },
            { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Whether to display icon only without label text.' },
            { name: 'pulse', type: 'boolean', default: 'false', description: 'Enables animated pulsing beacon for active/waiting states.' },
            { name: 'icon', type: 'Type<unknown>', description: 'Custom Lucide icon override component.' },
            { name: 'ariaLabel', type: 'string', description: 'Custom accessibility ARIA label.' }
        ],
        tags: ['status-tag', 'status', 'badge', 'indicator', 'tag', 'workflow', 'pipeline', 'dag'],
        docs: `
### TalosStatusTagComponent (\`talos-status-tag\`)
Standardized visual indicator for workflow orchestration systems and tasks.

**Usage:**
\`\`\`html
<!-- Default subtle variant -->
<talos-status-tag status="IN-PROGRESS" [pulse]="true" />
<talos-status-tag status="SUCCESS" />
<talos-status-tag status="ERROR" />

<!-- Solid / Outline / Dot variants -->
<talos-status-tag status="PAUSED" variant="solid" />
<talos-status-tag status="RETRYING" variant="outline" />
<talos-status-tag status="NEW" variant="dot" />

<!-- Custom text via input or projected content -->
<talos-status-tag status="IN-PROGRESS" label="Executing Batch 3/10" />
<talos-status-tag status="TERMINATED">Cancelled by user</talos-status-tag>
\`\`\`
`
    }
];
