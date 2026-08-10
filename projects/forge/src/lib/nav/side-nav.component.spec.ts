import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNavComponent } from './side-nav.component';
import { LayoutService } from '../layout/layout.service';

@Component({
  template: `
    <span class="my-custom-logo-component">Custom Logo Component</span>
  `
})
class TestCustomLogoComponent { }

@Component({
  imports: [SideNavComponent],
  template: `
    <forge-side-nav>
      <div side-nav-logo class="projected-logo-element">Custom Projected Logo</div>
    </forge-side-nav>

    <ng-template #tmpl>
      <span class="template-logo-element">Template Logo</span>
    </ng-template>
  `
})
class TestHostComponent {
  @ViewChild('tmpl') tmpl!: TemplateRef<unknown>;
  logoComponentClass = TestCustomLogoComponent;
}

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  let layoutService: LayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavComponent, TestHostComponent],
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
    const compiled = fixture.nativeElement as HTMLElement;
    let firstNavLink = compiled.querySelector('.nav-link');
    expect(firstNavLink?.getAttribute('data-tooltip')).toBeNull();

    layoutService.setLeftNavCollapsed(true);
    fixture.detectChanges();

    firstNavLink = compiled.querySelector('.nav-link');
    expect(firstNavLink?.getAttribute('data-tooltip')).toBe('Dashboards');
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
});
