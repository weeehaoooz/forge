import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNavComponent } from './side-nav.component';
import { LayoutService } from '../layout/layout.service';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  let layoutService: LayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavComponent],
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

  it('should display default brand name Shared Components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brandTitle = compiled.querySelector('.brand-title');
    expect(brandTitle?.textContent?.trim()).toBe('Shared Components');
  });

  it('should render brand logo badge and hamburger toggle button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('.brand-logo');
    const toggleBtn = compiled.querySelector('.hamburger-toggle-btn');
    expect(logo).toBeTruthy();
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
});
