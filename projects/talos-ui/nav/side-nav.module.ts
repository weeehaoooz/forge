import { NgModule } from '@angular/core';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TalosNavGroupComponent } from './nav-group/nav-group.component';
import { TalosNavItemComponent } from './nav-item/nav-item.component';
import { TalosNavThemeToggleComponent } from './theme-toggle/theme-toggle.component';

@NgModule({
  imports: [
    SideNavComponent,
    TalosNavGroupComponent,
    TalosNavItemComponent,
    TalosNavThemeToggleComponent
  ],
  exports: [
    SideNavComponent,
    TalosNavGroupComponent,
    TalosNavItemComponent,
    TalosNavThemeToggleComponent
  ]
})
export class TalosSideNavModule {}

/** Alias for TalosSideNavModule */
export const TalosNavModule = TalosSideNavModule;
export type TalosNavModule = TalosSideNavModule;
