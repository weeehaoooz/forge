/*
 * Public API Surface of @daedal-dev/talos-ui
 *
 * This root barrel re-exports everything for backward compatibility.
 * Each feature module is also individually accessible via its own
 * secondary entry points (e.g. '@daedal-dev/talos-ui/button').
 */

// Layout components & services
export * from './layout/layout.service';
export * from './layout/main-layout/main-layout.component';
export * from './layout/side-panel/side-panel.component';
export * from './layout/card';

// Nav components & models
export * from './nav/side-nav/side-nav.component';
export * from './nav/nav-group/nav-group.component';
export * from './nav/nav-item/nav-item.component';
export * from './nav/theme-toggle/theme-toggle.component';
export * from './nav/side-nav.module';

// Select input components & module
export * from './form/select-input/select-input/select-input.component';
export * from './form/select-input/option/option.component';
export * from './form/select-input/option-group/option-group.component';
export * from './form/select-input/select-input.module';

// Button directive & types
export * from './button/button.directive';

// Button group component, directive & module
export * from './button-group/button-group/button-group.component';
export * from './button-group/button-group-item/button-group-item.directive';
export * from './button-group/button-group.module';

// Tooltip directive
export * from './tooltip/tooltip.directive';

// Input & Textarea directive
export * from './form/input/input.directive';

// Form Field wrapper component & module
export * from './form/form-field/form-field.component';
export * from './form/form-field/form-field.module';

// Checkbox directive, group, parent directive, component & module
export * from './form/checkbox/checkbox/checkbox.directive';
export * from './form/checkbox/checkbox-group/checkbox-group.directive';
export * from './form/checkbox/checkbox-group/checkbox-group.component';
export * from './form/checkbox/checkbox-parent/checkbox-parent.directive';
export * from './form/checkbox/checkbox/checkbox.component';
export * from './form/checkbox/checkbox.module';

// DatePicker, DateTimePicker & Range Picker components
export * from './core/date-utils';
export * from './form/date-picker/date-picker.component';
export * from './form/date-time-picker/date-time-picker.component';
export * from './form/date-range-picker/date-range-picker.component';
export * from './form/date-range-picker/date-range-types';
export * from './form/date-time-range-picker/date-time-range-picker.component';

// Radio directive, group, component & module
export * from './form/radio/radio/radio.directive';
export * from './form/radio/radio-group/radio-group.component';
export * from './form/radio/radio/radio.component';
export * from './form/radio/radio.module';

// Snackbar service, components & module
export * from './snackbar/snackbar.types';
export * from './snackbar/snackbar.service';
export * from './snackbar/snackbar/snackbar.component';
export * from './snackbar/snackbar-container/snackbar-container.component';
export * from './snackbar/snackbar.module';

// Slide toggle directive, component & module
export * from './form/slide-toggle/slide-toggle.directive';
export * from './form/slide-toggle/slide-toggle.component';
export * from './form/slide-toggle/slide-toggle.module';

// Autocomplete component, module & types
export * from './form/autocomplete/autocomplete.types';
export * from './form/autocomplete/autocomplete.component';
export * from './form/autocomplete/autocomplete.module';

// Heatmap component, module & types
export * from './heatmap/heatmap.types';
export * from './heatmap/heatmap.component';
export * from './heatmap/heatmap.module';

// Category Bar component, module & types
export * from './category-bar/category-bar.types';
export * from './category-bar/category-bar.component';
export * from './category-bar/category-bar.module';

// Range Input component, directive, module & types
export * from './form/range-input/range-input.types';
export * from './form/range-input/range-input.directive';
export * from './form/range-input/range-input.component';
export * from './form/range-input/range-input.module';

// Status Tag component, module & types
export * from './status-tag/status-tag.types';
export * from './status-tag/status-tag.component';
export * from './status-tag/status-tag.module';

// Chips component, module & types
export * from './form/chips/chips.types';
export * from './form/chips/chip/chip.component';
export * from './form/chips/chips/chips.component';
export * from './form/chips/chips.module';

// Dialog / Modal service, components, directives, module & types
export * from './dialog/dialog.types';
export * from './dialog/dialog-ref';
export * from './dialog/dialog.service';
export * from './dialog/dialog.directives';
export * from './dialog/dialog-header/dialog-header.component';
export * from './dialog/dialog-content/dialog-content.component';
export * from './dialog/dialog-footer/dialog-footer.component';
export * from './dialog/confirm-dialog/confirm-dialog.component';
export * from './dialog/dialog.module';

// Drop Zone component, directive, module & types
export * from './form/drop-zone/drop-zone.types';
export * from './form/drop-zone/drop-zone.directive';
export * from './form/drop-zone/drop-zone.component';
export * from './form/drop-zone/drop-zone.module';


