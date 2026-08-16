import { describe, it, expect, beforeEach } from 'vitest';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNavComponent } from './side-nav.component';
import { TalosNavGroupComponent } from './nav-group.component';
import { TalosNavItemComponent } from './nav-item.component';
import { TalosNavThemeToggleComponent } from './theme-toggle.component';
import { LayoutService } from '../layout/layout.service';

@Component({
  template: `
    <span class="my-custom-logo-component">Custom Logo Component</span>
  `
})
class TestCustomLogoComponent { }

@Component({
  template: `
    <div class="my-custom-body-component">Custom Body Component</div>
  `
})
class TestCustomBodyComponent { }

@Component({
  template: `
    <div class="my-custom-footer-component">Custom Footer Component</div>
  `
})
class TestCustomFooterComponent { }

@Component({
  imports: [
    SideNavComponent,
    TalosNavGroupComponent,
    TalosNavItemComponent,
    TalosNavThemeToggleComponent
  ],
  template: `
    <talos-side-nav [navGroups]="[]">
      <div side-nav-logo class="projected-logo-element">Custom Projected Logo</div>

      <div side-nav-body class="custom-template-body">
        <talos-nav-group title="CUSTOM GROUP">
          <talos-nav-item label="Custom Item 1" [active]="true" />
          <talos-nav-item label="Custom Item 2" [badge]="'New'" />
        </talos-nav-group>
      </div>

      <div side-nav-footer class="custom-template-footer">
        <talos-nav-theme-toggle [isDarkMode]="false" (themeToggle)="onCustomToggle()" />
        <span class="custom-footer-text">Custom Footer</span>
      </div>
    </talos-side-nav>

    <ng-template #tmpl>
      <span class="template-logo-element">Template Logo</span>
    </ng-template>

    <ng-template #bodyTmpl>
      <div class="template-body-element">Template Body Content</div>
    </ng-template>

    <ng-template #footerTmpl>
      <div class="template-footer-element">Template Footer Content</div>
    </ng-template>
  `
})
class TestHostComponent {
  @ViewChild('tmpl') tmpl!: TemplateRef<unknown>;
  @ViewChild('bodyTmpl') bodyTmpl!: TemplateRef<unknown>;
  @ViewChild('footerTmpl') footerTmpl!: TemplateRef<unknown>;
  logoComponentClass = TestCustomLogoComponent;
  bodyComponentClass = TestCustomBodyComponent;
  footerComponentClass = TestCustomFooterComponent;
  customToggleClicked = false;

  onCustomToggle() {
    this.customToggleClicked = true;
  }
}

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  let layoutService: LayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SideNavComponent,
        TalosNavGroupComponent,
        TalosNavItemComponent,
        TalosNavThemeToggleComponent,
        TestHostComponent
      ],
      providers: [LayoutService]
    }).compileComponents();

    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService);
    fixture.detectChanges();
  });

  it('should create side nav component', () => {
    expect(component).toBeTruthy();
  });

  it('should render hamburger toggle button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toggleBtn = compiled.querySelector('.hamburger-toggle-btn');
    expect(toggleBtn).toBeTruthy();
  });

  it('should toggle left nav collapse state when hamburger toggle button is clicked', () => {
    const toggleBtn = fixture.nativeElement.querySelector('.hamburger-toggle-btn') as HTMLButtonElement;
    expect(layoutService.isLeftNavCollapsed()).toBe(false);

    toggleBtn.click();
    fixture.detectChanges();

    expect(layoutService.isLeftNavCollapsed()).toBe(true);
  });

  it('should render navigation groups and items', () => {
    fixture.componentRef.setInput('navGroups', [
      {
        title: 'MAIN',
        items: [{ id: 'dashboards', label: 'Dashboards' }]
      }
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navGroups = compiled.querySelectorAll('.nav-group');
    expect(navGroups.length).toBeGreaterThan(0);

    const navLinks = compiled.querySelectorAll('.nav-link');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('should update active item when selectItem is called', () => {
    const item = { id: 'customers', label: 'Customers' };
    component.selectItem(item);
    expect(component.activeItemId()).toBe('customers');
  });

  it('should attach data-tooltip attribute to nav links when collapsed', () => {
    fixture.componentRef.setInput('navGroups', [
      {
        title: 'MAIN',
        items: [{ id: 'dashboards', label: 'Dashboards' }]
      }
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    let firstNavLink = compiled.querySelector('.nav-groups-container .nav-link');
    expect(firstNavLink?.getAttribute('data-tooltip')).toBeNull();

    layoutService.setLeftNavCollapsed(true);
    fixture.detectChanges();

    firstNavLink = compiled.querySelector('.nav-groups-container .nav-link');
    expect(firstNavLink?.getAttribute('data-tooltip')).toBe('Dashboards');
  });

  it('should render theme toggle button and emit themeToggle event on click', () => {
    let emitted = false;
    component.themeToggle.subscribe(() => {
      emitted = true;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const themeBtn = compiled.querySelector('.theme-toggle-btn') as HTMLButtonElement;
    expect(themeBtn).toBeTruthy();

    const label = compiled.querySelector('.theme-toggle-label');
    expect(label?.textContent?.trim()).toBe('Dark Mode');

    themeBtn.click();
    expect(emitted).toBe(true);
  });

  it('should display Light Mode label when isDarkMode is true', () => {
    fixture.componentRef.setInput('isDarkMode', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('.theme-toggle-label');
    expect(label?.textContent?.trim()).toBe('Light Mode');
  });

  it('should support projected logo content via side-nav-logo slot', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const compiled = hostFixture.nativeElement as HTMLElement;
    const projectedLogo = compiled.querySelector('.projected-logo-element');
    expect(projectedLogo).toBeTruthy();
    expect(projectedLogo?.textContent).toBe('Custom Projected Logo');
  });

  it('should support logoComponent input to dynamically render a custom logo component', () => {
    fixture.componentRef.setInput('logoComponent', TestCustomLogoComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const customLogoComp = compiled.querySelector('.my-custom-logo-component');
    expect(customLogoComp).toBeTruthy();
    expect(customLogoComp?.textContent).toBe('Custom Logo Component');
  });

  it('should support logoTemplate input to render a custom logo template', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const sideNavFixture = TestBed.createComponent(SideNavComponent);
    sideNavFixture.componentRef.setInput('logoTemplate', hostFixture.componentInstance.tmpl);
    sideNavFixture.detectChanges();

    const compiled = sideNavFixture.nativeElement as HTMLElement;
    const tmplLogo = compiled.querySelector('.template-logo-element');
    expect(tmplLogo).toBeTruthy();
    expect(tmplLogo?.textContent).toBe('Template Logo');
  });

  it('should support bodyTemplate input to render custom body template', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const sideNavFixture = TestBed.createComponent(SideNavComponent);
    sideNavFixture.componentRef.setInput('bodyTemplate', hostFixture.componentInstance.bodyTmpl);
    sideNavFixture.detectChanges();

    const compiled = sideNavFixture.nativeElement as HTMLElement;
    const tmplBody = compiled.querySelector('.template-body-element');
    expect(tmplBody).toBeTruthy();
    expect(tmplBody?.textContent).toBe('Template Body Content');
  });

  it('should support bodyComponent input to dynamically render custom body component', () => {
    fixture.componentRef.setInput('bodyComponent', TestCustomBodyComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const customBodyComp = compiled.querySelector('.my-custom-body-component');
    expect(customBodyComp).toBeTruthy();
    expect(customBodyComp?.textContent).toBe('Custom Body Component');
  });

  it('should support footerTemplate input to render custom footer template', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const sideNavFixture = TestBed.createComponent(SideNavComponent);
    sideNavFixture.componentRef.setInput('footerTemplate', hostFixture.componentInstance.footerTmpl);
    sideNavFixture.detectChanges();

    const compiled = sideNavFixture.nativeElement as HTMLElement;
    const tmplFooter = compiled.querySelector('.template-footer-element');
    expect(tmplFooter).toBeTruthy();
    expect(tmplFooter?.textContent).toBe('Template Footer Content');
  });

  it('should support footerComponent input to dynamically render custom footer component', () => {
    fixture.componentRef.setInput('footerComponent', TestCustomFooterComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const customFooterComp = compiled.querySelector('.my-custom-footer-component');
    expect(customFooterComp).toBeTruthy();
    expect(customFooterComp?.textContent).toBe('Custom Footer Component');
  });

  it('should support custom template composition with TalosNavGroupComponent and TalosNavItemComponent in body', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const compiled = hostFixture.nativeElement as HTMLElement;
    const customGroup = compiled.querySelector('.custom-template-body talos-nav-group');
    expect(customGroup).toBeTruthy();

    const groupTitle = compiled.querySelector('.custom-template-body .nav-group-title');
    expect(groupTitle?.textContent?.trim()).toBe('CUSTOM GROUP');

    const navItems = compiled.querySelectorAll('.custom-template-body talos-nav-item');
    expect(navItems.length).toBe(2);

    const activeItem = compiled.querySelector('.custom-template-body .nav-link.active');
    expect(activeItem).toBeTruthy();
    expect(activeItem?.textContent).toContain('Custom Item 1');

    const badge = compiled.querySelector('.custom-template-body .nav-badge');
    expect(badge?.textContent?.trim()).toBe('New');
  });

  it('should support custom template composition in footer with TalosNavThemeToggleComponent', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const compiled = hostFixture.nativeElement as HTMLElement;
    const customFooter = compiled.querySelector('.custom-template-footer');
    expect(customFooter).toBeTruthy();

    const themeToggleBtn = customFooter?.querySelector('.theme-toggle-btn') as HTMLButtonElement;
    expect(themeToggleBtn).toBeTruthy();

    themeToggleBtn.click();
    expect(hostFixture.componentInstance.customToggleClicked).toBe(true);
  });

  it('should support collapsible navigation groups in TalosNavGroupComponent', () => {
    const navGroupFixture = TestBed.createComponent(TalosNavGroupComponent);
    navGroupFixture.componentRef.setInput('title', 'Collapsible Section');
    navGroupFixture.componentRef.setInput('collapsible', true);
    navGroupFixture.detectChanges();

    const compiled = navGroupFixture.nativeElement as HTMLElement;
    const headerBtn = compiled.querySelector('.nav-group-header-btn') as HTMLButtonElement;
    expect(headerBtn).toBeTruthy();
    expect(headerBtn.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.classList.contains('is-collapsible')).toBe(true);
    expect(compiled.classList.contains('is-collapsed')).toBe(false);

    // Toggle by clicking the header button
    headerBtn.click();
    navGroupFixture.detectChanges();

    expect(navGroupFixture.componentInstance.collapsed()).toBe(true);
    expect(headerBtn.getAttribute('aria-expanded')).toBe('false');
    expect(compiled.classList.contains('is-collapsed')).toBe(true);

    const chevron = compiled.querySelector('.nav-group-chevron');
    expect(chevron?.classList.contains('is-collapsed')).toBe(true);

    const content = compiled.querySelector('.nav-group-content');
    expect(content?.classList.contains('is-collapsed')).toBe(true);
  });

  it('should support declarative collapsible nav groups via navGroups input in SideNavComponent', () => {
    fixture.componentRef.setInput('navGroups', [
      {
        title: 'COLLAPSIBLE GROUP',
        collapsible: true,
        collapsed: true,
        items: [{ id: 'item1', label: 'Item 1' }]
      }
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const groupElement = compiled.querySelector('talos-nav-group');
    expect(groupElement?.classList.contains('is-collapsible')).toBe(true);
    expect(groupElement?.classList.contains('is-collapsed')).toBe(true);

    const headerBtn = compiled.querySelector('.nav-group-header-btn') as HTMLButtonElement;
    expect(headerBtn).toBeTruthy();
    expect(headerBtn.getAttribute('aria-expanded')).toBe('false');

    headerBtn.click();
    fixture.detectChanges();

    expect(groupElement?.classList.contains('is-collapsed')).toBe(false);
    expect(headerBtn.getAttribute('aria-expanded')).toBe('true');
  });
});


