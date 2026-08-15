import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ForgeHeatmapComponent } from './heatmap.component';
import { HeatmapDataPoint, HeatmapMetric } from './heatmap.types';

describe('ForgeHeatmapComponent', () => {
  let component: ForgeHeatmapComponent;
  let fixture: ComponentFixture<ForgeHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgeHeatmapComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgeHeatmapComponent);
    component = fixture.componentInstance;
  });

  it('should create the heatmap component', () => {
    expect(component).toBeTruthy();
  });

  it('should render default title', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.forge-heatmap-title')?.textContent?.trim()).toBe('Busiest times');
  });

  it('should normalize flat data points correctly into hours x days matrix', async () => {
    const testData: HeatmapDataPoint[] = [
      { day: 'Thu', hour: 13, value: 8 },
      { day: 'Fri', hour: 13, value: 7 },
      { day: 'Tue', hour: 10, value: 3 }
    ];

    fixture.componentRef.setInput('data', testData);
    fixture.componentRef.setInput('hoursRange', [9, 17]);
    fixture.detectChanges();
    await fixture.whenStable();

    const gridRows = component.gridRows();
    expect(gridRows.length).toBe(9); // 9 AM to 5 PM = 9 hours

    // Row for 1 PM (hour 13)
    const row13 = gridRows.find((r) => r.key === 13);
    expect(row13).toBeTruthy();

    const thuCell = row13?.cells.find((c) => c.colKey === 'Thu');
    expect(thuCell?.value).toBe(8);
    expect(thuCell?.intensity).toBe(1); // 8 is max

    const friCell = row13?.cells.find((c) => c.colKey === 'Fri');
    expect(friCell?.value).toBe(7);

    const monCell = row13?.cells.find((c) => c.colKey === 'Mon');
    expect(monCell?.value).toBe(0);
  });

  it('should support Day-by-Day interval mode with date range', async () => {
    const testData: HeatmapDataPoint[] = [
      { date: '2026-08-10', value: 15 },
      { date: '2026-08-13', value: 42 }
    ];

    fixture.componentRef.setInput('data', testData);
    fixture.componentRef.setInput('interval', 'day');
    fixture.componentRef.setInput('dateRange', {
      startDate: '2026-08-01',
      endDate: '2026-08-31'
    });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.interval()).toBe('day');
    const gridRows = component.gridRows();
    expect(gridRows.length).toBeGreaterThan(0);

    const aug13Cell = gridRows.flatMap((r) => r.cells).find((c) => c.id === '2026-08-13');
    expect(aug13Cell?.value).toBe(42);
  });

  it('should switch datasets when metric selection changes', async () => {
    const metrics: HeatmapMetric[] = [
      {
        id: 'metric1',
        label: 'Metric 1',
        data: [{ day: 'Wed', hour: 11, value: 5 }]
      },
      {
        id: 'metric2',
        label: 'Metric 2',
        data: [{ day: 'Wed', hour: 11, value: 12 }]
      }
    ];

    fixture.componentRef.setInput('metrics', metrics);
    fixture.componentRef.setInput('selectedMetricId', 'metric1');
    fixture.detectChanges();
    await fixture.whenStable();

    let row11 = component.gridRows().find((r) => r.key === 11);
    let wedCell = row11?.cells.find((c) => c.colKey === 'Wed');
    expect(wedCell?.value).toBe(5);

    // Switch to metric2
    component.selectMetric(metrics[1]);
    fixture.detectChanges();
    await fixture.whenStable();

    row11 = component.gridRows().find((r) => r.key === 11);
    wedCell = row11?.cells.find((c) => c.colKey === 'Wed');
    expect(wedCell?.value).toBe(12);
  });

  it('should emit refresh output when refresh button is clicked', async () => {
    let refreshFired = false;
    component.refresh.subscribe(() => {
      refreshFired = true;
    });

    fixture.detectChanges();
    await fixture.whenStable();

    component.onRefreshClick();
    expect(refreshFired).toBe(true);
  });
});
