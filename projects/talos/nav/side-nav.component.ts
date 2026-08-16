import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, Type, ViewEncapsulation, inject, input, output, signal } from '@angular/core';
import {
  LucideChevronsUpDown,
  LucideCircleHelp,
  LucidePanelLeft,
  LucidePanelLeftClose,
  LucidePanelLeftOpen,
  LucideSettings
} from '@lucide/angular';
import { LayoutService } from '@talos/components/layout';
import { TalosNavGroupComponent } from './nav-group.component';
import { TalosNavItemComponent } from './nav-item.component';
import { TalosNavThemeToggleComponent } from './theme-toggle.component';

export interface SideNavItem {
  id?: string;
  label: string;
  icon?: any;
  route?: string;
  active?: boolean;
  badge?: string | number;
  disabled?: boolean;
}

export interface SideNavGroup {
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  items: SideNavItem[];
}

export interface SideNavUserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

@Component({
  selector: 'talos-side-nav',
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    LucidePanelLeft,
    LucideChevronsUpDown,
    LucidePanelLeftOpen,
    LucidePanelLeftClose,
    TalosNavGroupComponent,
    TalosNavItemComponent,
    TalosNavThemeToggleComponent
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'talos-side-nav-host',
    '[class.is-collapsed]': 'layoutService.isLeftNavCollapsed()',
    '[attr.aria-hidden]': 'layoutService.isLeftNavCollapsed()',
    'role': 'navigation'
  }
})
export class SideNavComponent {
  protected readonly layoutService = inject(LayoutService);
  protected readonly LucidePanelLeftOpen = LucidePanelLeftOpen;
  protected readonly LucidePanelLeftClose = LucidePanelLeftClose;

  /** Custom header component to render entire header */
  readonly headerComponent = input<Type<unknown> | null>(null);

  /** Component inputs object to pass to headerComponent */
  readonly headerComponentInputs = input<Record<string, unknown>>({});

  /** Custom header template to render entire header */
  readonly headerTemplate = input<TemplateRef<unknown> | null>(null);

  /** Custom logo component to render in header */
  readonly logoComponent = input<Type<unknown> | null>(null);

  /** Component inputs object to pass to logoComponent */
  readonly logoComponentInputs = input<Record<string, unknown>>({});

  /** Custom logo template to render in header */
  readonly logoTemplate = input<TemplateRef<unknown> | null>(null);

  /** Custom body component to render sidebar body */
  readonly bodyComponent = input<Type<unknown> | null>(null);

  /** Component inputs object to pass to bodyComponent */
  readonly bodyComponentInputs = input<Record<string, unknown>>({});

  /** Custom body template to render sidebar body */
  readonly bodyTemplate = input<TemplateRef<unknown> | null>(null);

  /** Custom footer component to render sidebar footer */
  readonly footerComponent = input<Type<unknown> | null>(null);

  /** Component inputs object to pass to footerComponent */
  readonly footerComponentInputs = input<Record<string, unknown>>({});

  /** Custom footer template to render sidebar footer */
  readonly footerTemplate = input<TemplateRef<unknown> | null>(null);

  /** Whether to show the logo in header */
  readonly showLogo = input<boolean>(true);

  /** Whether to show the hamburger / panel toggle button in header */
  readonly showToggle = input<boolean>(true);

  /** Whether to show the dark mode / light mode theme toggle button in sidebar */
  readonly showThemeToggle = input<boolean>(true);

  /** Current dark mode status */
  readonly isDarkMode = input<boolean>(false);

  /** Output event when theme toggle is clicked */
  readonly themeToggle = output<void>();

  /** Track active item ID */
  readonly activeItemId = signal<string>('dashboards');

  /** Concise Navigation Groups for clean sidebar UI */
  readonly navGroups = input<SideNavGroup[]>([]);

  /** Secondary / Footer Navigation Items */
  readonly footerItems = input<SideNavItem[]>([
    { id: 'help', label: 'Help Center', icon: LucideCircleHelp },
    { id: 'settings', label: 'Settings', icon: LucideSettings }
  ]);

  /** User Profile Info for Bottom Footer */
  readonly userProfile = input<SideNavUserProfile>({
    name: 'Eugene Lamar',
    email: 'eugene@glan.com'
  });

  /** Output event when a nav item is clicked */
  readonly itemClick = output<SideNavItem>();

  selectItem(item: SideNavItem): void {
    if (item.disabled) return;
    if (item.id) {
      this.activeItemId.set(item.id);
    }
    this.itemClick.emit(item);
  }
}


