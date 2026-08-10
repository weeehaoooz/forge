import { Injectable, Type, computed, signal } from '@angular/core';

export interface RightPanelOptions {
  /** Title displayed in the panel header shell */
  title?: string;
  /** Custom width for the panel (e.g. '400px', '500px') */
  width?: string;
  /** Panel rendering mode: 'overlay' (floating over content) or 'inline' (pushes content) */
  mode?: 'overlay' | 'inline';
  /** Whether to blur and lock background interactions on main content area */
  blurBackdrop?: boolean;
  /** Whether clicking backdrop closes panel (defaults to true if blurBackdrop is enabled) */
  closeOnBackdropClick?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Reactive Signals for layout state
  readonly isLeftNavCollapsed = signal<boolean>(false);
  readonly isRightPanelOpen = signal<boolean>(false);
  readonly isMainContentExpanded = signal<boolean>(false);

  // Dynamic component injection signals
  readonly rightPanelComponent = signal<Type<unknown> | null>(null);
  readonly rightPanelInputs = signal<Record<string, unknown>>({});
  readonly rightPanelOptions = signal<RightPanelOptions>({});

  // Computed state for backdrop blur
  readonly shouldBlurMainContent = computed(() => {
    return (
      this.isRightPanelOpen() &&
      (this.rightPanelOptions().mode ?? 'overlay') === 'overlay' &&
      !!this.rightPanelOptions().blurBackdrop
    );
  });

  // Computed state for inline panel mode
  readonly isRightPanelInline = computed(() => {
    return this.isRightPanelOpen() && this.rightPanelOptions().mode === 'inline';
  });

  // Action methods
  toggleLeftNav(): void {
    this.isLeftNavCollapsed.update((state) => !state);
  }

  setLeftNavCollapsed(collapsed: boolean): void {
    this.isLeftNavCollapsed.set(collapsed);
  }

  toggleMainContentExpanded(): void {
    this.isMainContentExpanded.update((state) => !state);
  }

  setMainContentExpanded(expanded: boolean): void {
    this.isMainContentExpanded.set(expanded);
  }

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Dynamically open the right side panel with a specified component and inputs.
   */
  openRightPanel<T>(
    component: Type<T>,
    inputs: Record<string, unknown> = {},
    options: RightPanelOptions = {}
  ): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }

    this.rightPanelComponent.set(component as Type<unknown>);
    this.rightPanelInputs.set(inputs);
    this.rightPanelOptions.set({
      mode: 'overlay',
      closeOnBackdropClick: true,
      ...options
    });
    this.isRightPanelOpen.set(true);
  }

  /**
   * Close the right side panel and clear injected component state after animation completes.
   */
  closeRightPanel(): void {
    this.isRightPanelOpen.set(false);

    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }

    this.closeTimeout = setTimeout(() => {
      this.rightPanelComponent.set(null);
      this.rightPanelInputs.set({});
      this.rightPanelOptions.set({});
      this.closeTimeout = null;
    }, 300);
  }
}
