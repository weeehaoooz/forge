import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import {
  TalosChipsComponent,
  TalosChipComponent,
  TalosButtonDirective,
  TalosButtonGroupComponent,
  TalosButtonGroupItemDirective,
  TalosSlideToggleComponent,
  ChipColor,
  ChipSize,
  ChipVariant
} from '@talos/components';
import {
  LucideEye,
  LucideCode,
  LucideCopy,
  LucideCheck,
  LucidePlus,
  LucideRotateCcw,
  LucideBan,
  LucideSparkles,
  LucideUserCheck,
  LucidePackage
} from '@lucide/angular';

interface PackageItem {
  id: string;
  name: string;
  version: string;
  downloads: string;
}

interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface TechFramework {
  id: string;
  name: string;
  category: string;
  icon: string;
}

@Component({
  selector: 'app-chips-page',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TalosChipsComponent,
    TalosChipComponent,
    TalosButtonDirective,
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosSlideToggleComponent,
    LucideEye,
    LucideCode,
    LucideCopy,
    LucideCheck,
    LucidePlus,
    LucideRotateCcw,
    LucideBan,
    LucideSparkles,
    LucideUserCheck,
    LucidePackage
  ],
  templateUrl: './chips-page.html',
  styleUrl: './chips-page.scss'
})
export class ChipsPage {
  // Tab control: 'preview' | 'code'
  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly copied = signal<boolean>(false);

  // Available colors
  protected readonly allColors: ChipColor[] = [
    'primary',
    'indigo',
    'purple',
    'success',
    'warning',
    'error',
    'neutral',
    'cyan'
  ];

  // Configurator Playground State
  protected readonly selectedSize = signal<ChipSize>('sm');
  protected readonly selectedVariant = signal<ChipVariant>('subtle');
  protected readonly selectedColor = signal<ChipColor>('primary');
  protected readonly floatingLabel = signal<boolean>(false);
  protected readonly allowCustom = signal<boolean>(false);
  protected readonly clearable = signal<boolean>(true);
  protected readonly disabled = signal<boolean>(false);
  protected readonly maxChips = signal<number | null>(null);
  protected readonly customPlaceholder = signal<string>('Select or type frameworks...');
  protected readonly customLabel = signal<string>('Technologies');

  // Playground Selected Values
  protected readonly playgroundValues = signal<string[]>(['angular', 'typescript']);

  // 1. Tech Stack Catalog
  protected readonly techOptions = signal<TechFramework[]>([
    { id: 'angular', name: 'Angular', category: 'Frontend', icon: '🅰️' },
    { id: 'react', name: 'React', category: 'Frontend', icon: '⚛️' },
    { id: 'vue', name: 'Vue.js', category: 'Frontend', icon: '🟢' },
    { id: 'svelte', name: 'Svelte', category: 'Frontend', icon: '🟠' },
    { id: 'nextjs', name: 'Next.js', category: 'Fullstack', icon: '▲' },
    { id: 'nestjs', name: 'NestJS', category: 'Backend', icon: '🐱' },
    { id: 'tailwind', name: 'Tailwind CSS', category: 'Styling', icon: '🌊' },
    { id: 'typescript', name: 'TypeScript', category: 'Language', icon: '🔷' },
    { id: 'graphql', name: 'GraphQL', category: 'API', icon: '🕸️' },
    { id: 'docker', name: 'Docker', category: 'DevOps', icon: '🐳' }
  ]);

  // 2. Async NPM Package Search Dataset & State
  protected readonly allPackages: PackageItem[] = [
    { id: 'rxjs', name: 'rxjs', version: 'v7.8.1', downloads: '45M/wk' },
    { id: 'zod', name: 'zod', version: 'v3.23.8', downloads: '38M/wk' },
    { id: 'date-fns', name: 'date-fns', version: 'v4.1.0', downloads: '28M/wk' },
    { id: 'lucide-angular', name: '@lucide/angular', version: 'v1.31.0', downloads: '1.2M/wk' },
    { id: 'lodash-es', name: 'lodash-es', version: 'v4.17.21', downloads: '32M/wk' },
    { id: 'tanstack-query', name: '@tanstack/angular-query-experimental', version: 'v5.59.0', downloads: '650k/wk' },
    { id: 'vitest', name: 'vitest', version: 'v4.1.10', downloads: '14M/wk' },
    { id: 'prisma', name: 'prisma', version: 'v6.2.0', downloads: '8.5M/wk' }
  ];

  protected readonly isSearchingPackages = signal<boolean>(false);
  protected readonly asyncPackageResults = signal<PackageItem[]>(this.allPackages.slice(0, 4));
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  onPackageSearch(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    const q = query.trim().toLowerCase();
    this.isSearchingPackages.set(true);

    // Simulate a 350ms backend server response
    this.searchTimeout = setTimeout(() => {
      if (!q) {
        this.asyncPackageResults.set(this.allPackages.slice(0, 4));
      } else {
        const filtered = this.allPackages.filter(
          (pkg) => pkg.name.toLowerCase().includes(q) || pkg.id.toLowerCase().includes(q)
        );
        this.asyncPackageResults.set(filtered);
      }
      this.isSearchingPackages.set(false);
    }, 350);
  }

  // 3. Team Members
  protected readonly teamMembers = signal<UserProfile[]>([
    {
      id: 'usr-1',
      name: 'Sarah Jenkins',
      role: 'Staff Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-2',
      name: 'Alexander Wright',
      role: 'Frontend Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-3',
      name: 'Elena Rostova',
      role: 'Product Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-4',
      name: 'Marcus Chen',
      role: 'DevOps Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-5',
      name: 'Priya Patel',
      role: 'QA Specialist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    }
  ]);

  // Reactive Forms Integration
  readonly demoForm = new FormGroup({
    techStack: new FormControl<string[]>(['angular', 'typescript'], Validators.required),
    asyncPackages: new FormControl<string[]>(['rxjs', 'zod']),
    tags: new FormControl<string[]>(['design-system', 'v2.0', 'accessible']),
    assignees: new FormControl<string[]>(['usr-1', 'usr-2']),
    limitedTags: new FormControl<string[]>(['frontend', 'ui'])
  });

  // Display & Value Helpers
  displayTech = (item: TechFramework): string => `${item.icon} ${item.name}`;
  valueTech = (item: TechFramework): string => item.id;

  displayPackage = (item: PackageItem): string => `${item.name} (${item.version})`;
  valuePackage = (item: PackageItem): string => item.id;

  displayUser = (user: UserProfile): string => user.name;
  valueUser = (user: UserProfile): string => user.id;

  // Code Snippet Generator
  protected readonly codeSnippet = computed(() => {
    const size = this.selectedSize();
    const variant = this.selectedVariant();
    const color = this.selectedColor();
    const floating = this.floatingLabel();
    const allowCustom = this.allowCustom();
    const clearable = this.clearable();
    const disabled = this.disabled();
    const maxChips = this.maxChips();
    const placeholder = this.customPlaceholder();
    const label = this.customLabel();

    const parts: string[] = ['<talos-chips'];
    parts.push('[options]="frameworks"');
    parts.push('[displayWith]="displayFn"');
    parts.push('[valueWith]="valueFn"');

    if (label) parts.push(`label="${label}"`);
    if (floating) parts.push('[floating]="true"');
    if (placeholder && placeholder !== 'Type or select...') parts.push(`placeholder="${placeholder}"`);
    if (size !== 'sm') parts.push(`size="${size}"`);
    if (variant !== 'subtle') parts.push(`chipVariant="${variant}"`);
    if (color !== 'primary') parts.push(`chipColor="${color}"`);
    if (allowCustom) parts.push('[allowCustom]="true"');
    if (!clearable) parts.push('[clearable]="false"');
    if (disabled) parts.push('[disabled]="true"');
    if (maxChips !== null && maxChips > 0) parts.push(`[maxChips]="${maxChips}"`);
    parts.push('[(ngModel)]="selectedFrameworks"');
    parts.push('/>');

    return parts.join('\n  ');
  });

  protected copyCode(): void {
    navigator.clipboard.writeText(this.codeSnippet());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  // Reactive Forms Actions
  patchSample(): void {
    this.demoForm.patchValue({
      techStack: ['angular', 'nestjs', 'docker'],
      asyncPackages: ['tanstack-query', 'vitest', 'prisma'],
      tags: ['release-ready', 'enterprise', 'fast'],
      assignees: ['usr-3', 'usr-4'],
      limitedTags: ['frontend', 'ui']
    });
  }

  resetForm(): void {
    this.demoForm.reset({
      techStack: [],
      asyncPackages: [],
      tags: [],
      assignees: [],
      limitedTags: []
    });
  }

  toggleDisabled(): void {
    if (this.demoForm.disabled) {
      this.demoForm.enable();
    } else {
      this.demoForm.disable();
    }
  }
}
