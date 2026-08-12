import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { MainLayoutComponent, SideNavComponent, LayoutService } from '@forge/components';
import type { SideNavGroup, SideNavItem } from '@forge/components';
import {
  LucideHexagon,
  LucideMousePointerClick,
  LucideTextCursorInput,
  LucideChevronDown,
  LucideCalendarDays,
  LucideSquareCheck,
  LucideLayout
} from '@lucide/angular';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MainLayoutComponent,
    SideNavComponent,
    LucideHexagon
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);

  protected readonly navGroups = signal<SideNavGroup[]>([
    {
      title: 'BUTTONS',
      items: [
        { id: 'buttons', label: 'Buttons', icon: LucideMousePointerClick, route: '/buttons' }
      ]
    },
    {
      title: 'FIELDS',
      items: [
        { id: 'inputs', label: 'Inputs', icon: LucideTextCursorInput, route: '/inputs' },
        { id: 'select', label: 'Select', icon: LucideChevronDown, route: '/select' },
        { id: 'date-pickers', label: 'Date Pickers', icon: LucideCalendarDays, route: '/date-pickers' },
        { id: 'checkboxes', label: 'Checkboxes', icon: LucideSquareCheck, route: '/checkboxes' }
      ]
    },
    {
      title: 'LAYOUT',
      items: [
        { id: 'layout', label: 'Layout', icon: LucideLayout, route: '/layout' }
      ]
    }
  ]);

  constructor() {
    // Sync active nav item with current route
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        const segment = url.split('/')[1];
        this._setActiveItem(segment);
      });

    // Set initial active item from current URL
    const initialSegment = this.router.url.split('/')[1];
    this._setActiveItem(initialSegment);
  }

  private _setActiveItem(segment: string): void {
    this.navGroups.update(groups =>
      groups.map(group => ({
        ...group,
        items: group.items.map(item => ({
          ...item,
          active: item.id === segment
        }))
      }))
    );
  }

  onNavItemClick(item: SideNavItem): void {
    if (item.route) {
      this.router.navigateByUrl(item.route);
    }
  }
}
