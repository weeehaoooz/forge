export type RangeInputSize = 'sm' | 'md' | 'lg';

export type RangeInputVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type RangeInputValue = number | [number, number];

export type RangeInputTooltipMode = 'always' | 'hover' | 'drag' | 'none';

export interface RangeInputMark {
  value: number;
  label?: string;
  tooltip?: string;
}

export interface RangeInputTick {
  value: number;
  percent: number;
  label?: string;
  tooltip?: string;
  active: boolean;
}

export interface RangeInputChangeEvent {
  value: RangeInputValue;
  source: 'drag' | 'keyboard' | 'input' | 'track-click';
}
