import { NgModule } from '@angular/core';
import { SideNavComponent } from './side-nav.component';
import { TalosNavGroupComponent } from './nav-group.component';
import { TalosNavItemComponent } from './nav-item.component';
import { TalosNavThemeToggleComponent } from './theme-toggle.component';

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
