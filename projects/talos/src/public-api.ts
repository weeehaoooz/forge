/*
 * Public API Surface of @talos/components
 *
 * This root barrel re-exports everything for backward compatibility.
 * For optimal tree-shaking, consumers should import directly from the
 * secondary entry points (e.g. '@talos/components/button').
 */

// Layout components & services
export * from './lib/layout/layout.service';
export * from './lib/layout/main-layout.component';
export * from './lib/layout/side-panel/side-panel.component';

// Nav components & models
export * from './lib/nav/side-nav.component';
export * from './lib/nav/nav-group.component';
export * from './lib/nav/nav-item.component';
export * from './lib/nav/theme-toggle.component';
export * from './lib/nav/side-nav.module';

// Select input components & module
export * from './lib/form/select-input/select-input.component';
export * from './lib/form/select-input/option/option.component';
export * from './lib/form/select-input/option-group/option-group.component';
export * from './lib/form/select-input/select-input.module';

// Button directive & types
export * from './lib/button/button.directive';

// Button group component, directive & module
export * from './lib/button-group/button-group.component';
export * from './lib/button-group/button-group-item.directive';
export * from './lib/button-group/button-group.module';

// Tooltip directive
export * from './lib/tooltip/tooltip.directive';

// Input & Textarea directive
export * from './lib/form/input/input.directive';

// Form Field wrapper component & module
export * from './lib/form/form-field/form-field.component';
export * from './lib/form/form-field/form-field.module';

// Checkbox directive, group, parent directive, component & module
export * from './lib/form/checkbox/checkbox.directive';
export * from './lib/form/checkbox/checkbox-group.directive';
export * from './lib/form/checkbox/checkbox-group.component';
export * from './lib/form/checkbox/checkbox-parent.directive';
export * from './lib/form/checkbox/checkbox.component';
export * from './lib/form/checkbox/checkbox.module';

// DatePicker, DateTimePicker & Range Picker components
export * from './lib/core/date-utils';
export * from './lib/form/date-picker/date-picker.component';
export * from './lib/form/date-time-picker/date-time-picker.component';
export * from './lib/form/date-range-picker/date-range-picker.component';
export * from './lib/form/date-range-picker/date-range-types';
export * from './lib/form/date-time-range-picker/date-time-range-picker.component';

// Radio directive, group, component & module
export * from './lib/form/radio/radio.directive';
export * from './lib/form/radio/radio-group.component';
export * from './lib/form/radio/radio.component';
export * from './lib/form/radio/radio.module';

// Snackbar service, components & module
export * from './lib/snackbar/snackbar.types';
export * from './lib/snackbar/snackbar.service';
export * from './lib/snackbar/snackbar.component';
export * from './lib/snackbar/snackbar-container.component';
export * from './lib/snackbar/snackbar.module';

// Slide toggle directive, component & module
export * from './lib/form/slide-toggle/slide-toggle.directive';
export * from './lib/form/slide-toggle/slide-toggle.component';
export * from './lib/form/slide-toggle/slide-toggle.module';

// Autocomplete component, module & types
export * from './lib/form/autocomplete/autocomplete.types';
export * from './lib/form/autocomplete/autocomplete.component';
export * from './lib/form/autocomplete/autocomplete.module';

// Heatmap component, module & types
export * from './lib/heatmap/heatmap.types';
export * from './lib/heatmap/heatmap.component';
export * from './lib/heatmap/heatmap.module';

// Category Bar component, module & types
export * from './lib/category-bar/category-bar.types';
export * from './lib/category-bar/category-bar.component';
export * from './lib/category-bar/category-bar.module';

// Range Input component, directive, module & types
export * from './lib/form/range-input/range-input.types';
export * from './lib/form/range-input/range-input.directive';
export * from './lib/form/range-input/range-input.component';
export * from './lib/form/range-input/range-input.module';

// Status Tag component, module & types
export * from './lib/status-tag/status-tag.types';
export * from './lib/status-tag/status-tag.component';
export * from './lib/status-tag/status-tag.module';

// Chips component, module & types
export * from './lib/form/chips/chips.types';
export * from './lib/form/chips/chip.component';
export * from './lib/form/chips/chips.component';
export * from './lib/form/chips/chips.module';

