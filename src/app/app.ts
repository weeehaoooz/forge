import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import {
  MainLayoutComponent,
  SideNavComponent,
  TalosNavGroupComponent,
  TalosNavItemComponent,
  TalosNavThemeToggleComponent,
  LayoutService
} from '@talos/components';
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
  LucideTag,
  LucideChevronsUpDown,
  LucidePanelLeftOpen,
  LucidePanelLeftClose
} from '@lucide/angular';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MainLayoutComponent,
    SideNavComponent,
    TalosNavGroupComponent,
    TalosNavItemComponent,
    TalosNavThemeToggleComponent,
    LucideHexagon,
    LucideChevronsUpDown,
    LucidePanelLeftOpen,
    LucidePanelLeftClose
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);

  protected readonly isDarkMode = signal<boolean>(false);
  protected readonly activeSegment = signal<string>('buttons');

  // Lucide Icon references for template usage
  protected readonly LucideMousePointerClick = LucideMousePointerClick;
  protected readonly LucideSquareCheck = LucideSquareCheck;
  protected readonly LucideCircleDot = LucideCircleDot;
  protected readonly LucideToggleRight = LucideToggleRight;
  protected readonly LucideTextCursorInput = LucideTextCursorInput;
  protected readonly LucideChevronDown = LucideChevronDown;
  protected readonly LucideSearch = LucideSearch;
  protected readonly LucideCalendarDays = LucideCalendarDays;
  protected readonly LucideSlidersHorizontal = LucideSlidersHorizontal;
  protected readonly LucideFlame = LucideFlame;
  protected readonly LucideSliders = LucideSliders;
  protected readonly LucideTag = LucideTag;
  protected readonly LucideBell = LucideBell;
  protected readonly LucideLayout = LucideLayout;

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
        if (segment) {
          this.activeSegment.set(segment);
        }
      });

    // Set initial active item from current URL
    const initialSegment = this.router.url.split('/')[1];
    if (initialSegment) {
      this.activeSegment.set(initialSegment);
    }
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

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }
}

