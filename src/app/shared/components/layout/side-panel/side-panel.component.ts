import { Component, Type, input, output } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-side-panel',
  imports: [NgComponentOutlet],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
  host: {
    'role': 'complementary',
    'class': 'side-panel-host',
    '[class.is-open]': 'isOpen()',
    '[class.is-overlay]': 'mode() === "overlay"',
    '[class.is-inline]': 'mode() === "inline"',
    '[style.--panel-width]': 'width()',
    '[attr.aria-label]': 'title() || "Details Panel"'
  }
})
export class SidePanelComponent {
  /** Whether the panel is currently open and visible */
  readonly isOpen = input<boolean>(true);

  /** Panel title displayed in header */
  readonly title = input<string>('Details');

  /** Custom panel width (e.g. '380px', '500px', '100%') */
  readonly width = input<string>('380px');

  /** Panel mode: 'overlay' (floating) or 'inline' (push content) */
  readonly mode = input<'overlay' | 'inline'>('overlay');

  /** Dynamic component to instantiate via NgComponentOutlet */
  readonly component = input<Type<unknown> | null>(null);

  /** Inputs object to pass to the dynamically injected component */
  readonly componentInputs = input<Record<string, unknown>>({});

  /** Event emitted when the close button is clicked */
  readonly close = output<void>();

  onClose(): void {
    this.close.emit();
  }
}
