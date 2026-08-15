import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ForgeCategoryBarComponent,
  ForgeButtonDirective,
  ForgeButtonGroupComponent,
  ForgeButtonGroupItemDirective,
  ForgeSlideToggleComponent,
  CategoryBarSegment,
  CategoryBarSegmentClickEvent,
  CategoryBarMarkerClickEvent,
  CategoryBarSize,
  CategoryBarShape,
  CategoryBarLabelPosition
} from '@forge/components';
import {
  LucideEye,
  LucideCode,
  LucideCopy,
  LucideCheck
} from '@lucide/angular';

@Component({
  selector: 'app-category-bar-page',
  imports: [
    CommonModule,
    FormsModule,
    ForgeCategoryBarComponent,
    ForgeButtonDirective,
    ForgeButtonGroupComponent,
    ForgeButtonGroupItemDirective,
    ForgeSlideToggleComponent,
    LucideEye,
    LucideCode,
    LucideCopy,
    LucideCheck
  ],
  templateUrl: './category-bar-page.html',
  styleUrl: './category-bar-page.scss'
})
export class CategoryBarPage {
  // Tab control: 'preview' | 'code'
  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly copied = signal<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // Exact Mockup Datasets
  // ─────────────────────────────────────────────────────────────

  // 1. Revenue Breakdown
  protected readonly revenueValues = [120, 80, 60, 40];
  protected readonly revenueColors = ['#2563eb', '#059669', '#7c3aed', '#f59e0b'];
  protected readonly revenueMarker = 220;

  // 2. Performance Metrics
  protected readonly performanceValues = [85, 65, 40, 25];
  protected readonly performanceColors = ['#06b6d4', '#e11d48', '#84cc16'];

  // 3. Budget Allocation
  protected readonly budgetCategories: CategoryBarSegment[] = [
    { value: 90, label: 'Engineering', color: '#7c3aed' },
    { value: 70, label: 'Marketing', color: '#2563eb' },
    { value: 45, label: 'Operations', color: '#059669' },
    { value: 35, label: 'Sales', color: '#f59e0b' },
    { value: 20, label: 'Support', color: '#ec4899' }
  ];
  protected readonly budgetMarker = 140;

  // ─────────────────────────────────────────────────────────────
  // Interactive Playground State
  // ─────────────────────────────────────────────────────────────
  protected readonly interactiveMarker = signal<number>(220);
  protected readonly interactiveSize = signal<CategoryBarSize>('md');
  protected readonly interactiveShape = signal<CategoryBarShape>('pill');
  protected readonly interactiveLabelPos = signal<CategoryBarLabelPosition>('top');
  protected readonly interactiveShowLegend = signal<boolean>(true);
  protected readonly interactiveShowTooltip = signal<boolean>(true);
  protected readonly lastEventLog = signal<string>('Interact with any bar segment or marker needle.');

  protected readonly playgroundSegments = signal<CategoryBarSegment[]>([
    { value: 120, label: 'Product Alpha', color: '#3b82f6' },
    { value: 80, label: 'Product Beta', color: '#10b981' },
    { value: 60, label: 'Product Gamma', color: '#8b5cf6' },
    { value: 40, label: 'Product Delta', color: '#f59e0b' }
  ]);

  readonly codeSnippet = `<!-- 1. Basic Category Bar with Scale Labels & Marker (Revenue Breakdown) -->
<forge-category-bar
  title="Revenue Breakdown"
  subtitle="Quarterly revenue distribution across products"
  [values]="[120, 80, 60, 40]"
  [colors]="['#2563eb', '#059669', '#7c3aed', '#f59e0b']"
  [markerValue]="220"
  size="md"
  shape="pill"
/>

<!-- 2. Performance Metrics (Custom Scale without marker) -->
<forge-category-bar
  title="Performance Metrics"
  subtitle="System performance distribution"
  [values]="[85, 65, 40, 25]"
  [colors]="['#06b6d4', '#e11d48', '#84cc16']"
  size="md"
  shape="pill"
/>

<!-- 3. Budget Allocation with Detailed Categories & Labels -->
<forge-category-bar
  title="Budget Allocation"
  subtitle="Department budget distribution with marker"
  [categories]="[
    { value: 90, label: 'Engineering', color: '#7c3aed' },
    { value: 70, label: 'Marketing', color: '#2563eb' },
    { value: 45, label: 'Operations', color: '#059669' },
    { value: 35, label: 'Sales', color: '#f59e0b' },
    { value: 20, label: 'Support', color: '#ec4899' }
  ]"
  [markerValue]="140"
  [showLegend]="true"
  (segmentClick)="onSegmentClick($event)"
  (markerClick)="onMarkerClick($event)"
/>`;

  onSegmentClick(event: CategoryBarSegmentClickEvent): void {
    this.lastEventLog.set(
      `Clicked Category "${event.segment.label}": Value=${event.segment.value}, Share=${event.segment.percentage.toFixed(1)}%`
    );
  }

  onMarkerClick(event: CategoryBarMarkerClickEvent): void {
    this.lastEventLog.set(
      `Clicked Marker: Value=${event.value}, Position=${event.percent.toFixed(1)}%`
    );
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.codeSnippet);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
