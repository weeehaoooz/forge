import { Component, Type, TemplateRef, inject, input, output, signal } from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  LucidePanelLeft,
  LucideLayoutDashboard,
  LucideUsers,
  LucidePackage,
  LucideTrendingUp,
  LucideCircleHelp,
  LucideSettings,
  LucideChevronsUpDown,
  LucideDynamicIcon,
  LucidePanelLeftOpen,
  LucidePanelLeftClose
} from '@lucide/angular';
import { LayoutService } from '@forge/components/layout';


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
  items: SideNavItem[];
}

export interface SideNavUserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

@Component({
  selector: 'forge-side-nav',
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    LucidePanelLeft,
    LucideChevronsUpDown,
    LucideDynamicIcon
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  host: {
    'class': 'forge-side-nav-host',
    '[class.is-collapsed]': 'layoutService.isLeftNavCollapsed()',
    '[attr.aria-hidden]': 'layoutService.isLeftNavCollapsed()',
    'role': 'navigation'
  }
})
export class SideNavComponent {
  protected readonly layoutService = inject(LayoutService);
  protected readonly LucidePanelLeftOpen = LucidePanelLeftOpen;
  protected readonly LucidePanelLeftClose = LucidePanelLeftClose;

  /** Custom logo component to render in header */
  readonly logoComponent = input<Type<unknown> | null>(null);

  /** Component inputs object to pass to logoComponent */
  readonly logoComponentInputs = input<Record<string, unknown>>({});

  /** Custom logo template to render in header */
  readonly logoTemplate = input<TemplateRef<unknown> | null>(null);

  /** Whether to show the logo in header */
  readonly showLogo = input<boolean>(true);

  /** Whether to show the hamburger / panel toggle button in header */
  readonly showToggle = input<boolean>(true);

  /** Track active item ID */
  readonly activeItemId = signal<string>('dashboards');

  /** Concise Navigation Groups for clean sidebar UI */
  readonly navGroups = input<SideNavGroup[]>([
    {
      title: 'MAIN NAVIGATION',
      items: [
        { id: 'dashboards', label: 'Dashboards', icon: LucideLayoutDashboard, active: true },
        { id: 'products', label: 'Products', icon: LucidePackage },
        { id: 'customers', label: 'Customers', icon: LucideUsers }
      ]
    },
    {
      title: 'GROWTH TOOLS',
      items: [
        { id: 'sales', label: 'Sales Performance', icon: LucideTrendingUp }
      ]
    }
  ]);

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


