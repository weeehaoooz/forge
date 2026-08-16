import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { MainLayoutComponent, SideNavComponent, LayoutService } from '@talos/components';
import type { SideNavGroup, SideNavItem } from '@talos/components';
import {
  LucideHexagon,
  LucideMousePointerClick,
  LucideTextCursorInput,
  LucideChevronDown,
  LucideSearch,
  LucideCalendarDays,
  LucideSquareCheck,
  LucideCircleDot,
  LucideToggleRight,
  LucideLayout,
  LucideBell,
  LucideFlame,
  LucideSliders,
  LucideSlidersHorizontal,
  LucideSun,
  LucideMoon
} from '@lucide/angular';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MainLayoutComponent,
    SideNavComponent,
    LucideHexagon,
    LucideSun,
    LucideMoon
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);

  protected readonly isDarkMode = signal<boolean>(false);

  protected readonly navGroups = signal<SideNavGroup[]>([
    {
      title: 'BUTTONS',
      items: [
        { id: 'buttons', label: 'Buttons', icon: LucideMousePointerClick, route: '/buttons' },
        { id: 'checkboxes', label: 'Checkboxes', icon: LucideSquareCheck, route: '/checkboxes' },
        { id: 'radio', label: 'Radio Buttons', icon: LucideCircleDot, route: '/radio' },
        { id: 'slide-toggle', label: 'Slide Toggle', icon: LucideToggleRight, route: '/slide-toggle' }
      ]
    },
    {
      title: 'FIELDS',
      items: [
        { id: 'inputs', label: 'Inputs', icon: LucideTextCursorInput, route: '/inputs' },
        { id: 'select', label: 'Select', icon: LucideChevronDown, route: '/select' },
        { id: 'autocomplete', label: 'Autocomplete', icon: LucideSearch, route: '/autocomplete' },
        { id: 'date-pickers', label: 'Date Pickers', icon: LucideCalendarDays, route: '/date-pickers' },
        { id: 'range-input', label: 'Range Input', icon: LucideSlidersHorizontal, route: '/range-input' },
      ]
    },
    {
      title: 'DATA VISUALIZATION',
      items: [
        { id: 'heatmap', label: 'Heatmap / Busy Times', icon: LucideFlame, route: '/heatmap' },
        { id: 'category-bar', label: 'Category Bar', icon: LucideSliders, route: '/category-bar' }
      ]
    },
    {
      title: 'NOTIFICATIONS',
      items: [
        { id: 'snackbar', label: 'Snackbar / Toast', icon: LucideBell, route: '/snackbar' }
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
    // Check initial system preference or attribute
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
      this.isDarkMode.set(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }

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

  toggleTheme(): void {
    this.isDarkMode.update(dark => !dark);
    const isDark = this.isDarkMode();
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
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
