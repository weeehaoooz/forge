import { TemplateRef } from '@angular/core';

export type ChipSize = 'sm' | 'md' | 'lg';

export type ChipVariant = 'filled' | 'outline' | 'subtle';

export type ChipColor =
  | 'primary'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'indigo'
  | 'purple'
  | 'cyan';

export type ChipDisplayFn<T> = (item: T) => string;
export type ChipValueFn<T> = (item: T) => unknown;
export type ChipFilterFn<T> = (item: T, search: string) => boolean;

export interface ChipHighlightPart {
  text: string;
  matched: boolean;
}

export interface FormattedChipOption<T = unknown> {
  item: T;
  display: string;
  value: unknown;
  disabled: boolean;
  selected: boolean;
  parts: ChipHighlightPart[];
}

export interface ChipItemContext<T = unknown> {
  $implicit: T;
  display: string;
  selected: boolean;
  disabled: boolean;
}
