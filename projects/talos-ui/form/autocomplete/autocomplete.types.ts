import { TemplateRef } from '@angular/core';

export type AutocompleteSize = 'sm' | 'md' | 'lg';

export type AutocompleteDisplayFn<T> = (item: T) => string;

export type AutocompleteValueFn<T> = (item: T) => unknown;

export type AutocompleteFilterFn<T> = (item: T, query: string) => boolean;

export interface AutocompleteHighlightPart {
  text: string;
  isMatch: boolean;
}

export interface FormattedAutocompleteOption<T = unknown> {
  id: string;
  label: string;
  value: unknown;
  raw: T;
  highlightParts: AutocompleteHighlightPart[];
}

export interface AutocompleteItemContext<T = unknown> {
  $implicit: T;
  index: number;
  selected: boolean;
  active: boolean;
  highlightParts: AutocompleteHighlightPart[];
}
