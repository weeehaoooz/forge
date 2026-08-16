export interface ComponentExample {
  id: string;
  componentId: string;
  title: string;
  description: string;
  tsCode: string;
  htmlCode: string;
  scssCode?: string;
}

export const TALOS_EXAMPLES: ComponentExample[] = [
  {
    id: 'button-overview',
    componentId: 'button',
    title: 'Button Variants and Loading State',
    description: 'Demonstrates all button variants, sizes, and signal-based loading state.',
    tsCode: `import { Component, signal } from '@angular/core';
import { TalosButtonDirective } from '@talos/components';
import { LucideSparkles, LucidePlus, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-btn-demo',
  imports: [TalosButtonDirective, LucideSparkles, LucidePlus, LucideTrash2],
  templateUrl: './btn-demo.component.html'
})
export class BtnDemoComponent {
  protected readonly isLoading = signal<boolean>(false);

  triggerSave(): void {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 1500);
  }
}`,
    htmlCode: `<div class="flex flex-wrap items-center gap-3">
  <button talosButton variant="primary" size="md" [loading]="isLoading()" (click)="triggerSave()">
    <lucide-icon name="sparkles" />
    Save Changes
  </button>

  <button talosButton variant="secondary" size="md">
    Cancel
  </button>

  <button talosButton variant="outline" size="sm">
    <lucide-icon name="plus" />
    Add New
  </button>

  <button talosButton variant="danger" size="md" [pill]="true">
    <lucide-icon name="trash-2" />
    Delete
  </button>

  <button talosButton variant="ghost" [iconOnly]="true" aria-label="Favorite">
    <lucide-icon name="sparkles" />
  </button>
</div>`
  },
  {
    id: 'button-group-segmented',
    componentId: 'button-group',
    title: 'Segmented View Switcher',
    description: 'Two-way bound button group using signal model for switching UI views.',
    tsCode: `import { Component, signal } from '@angular/core';
import { TalosButtonGroupModule } from '@talos/components';
import { LucideList, LucideLayoutGrid, LucideLayers } from '@lucide/angular';

@Component({
  selector: 'app-view-switcher',
  imports: [TalosButtonGroupModule, LucideList, LucideLayoutGrid, LucideLayers],
  template: \`
    <talos-button-group [(value)]="selectedLayout" variant="secondary" size="sm">
      <button talosButtonGroupItem value="table" title="Table View">
        <lucide-icon name="list" />
        Table
      </button>
      <button talosButtonGroupItem value="grid" title="Grid Cards">
        <lucide-icon name="layout-grid" />
        Grid
      </button>
      <button talosButtonGroupItem value="board" title="Kanban Board">
        <lucide-icon name="layers" />
        Board
      </button>
    </talos-button-group>

    <div class="mt-4">Active View: {{ selectedLayout() }}</div>
  \`
})
export class ViewSwitcherComponent {
  protected readonly selectedLayout = signal<string>('grid');
}`
    ,
    htmlCode: ``
  },
  {
    id: 'form-reactive-validation',
    componentId: 'input',
    title: 'Reactive Form with Inputs and Error Handling',
    description: 'Comprehensive reactive form with TalosInputDirective, validation states, and helper text.',
    tsCode: `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TalosButtonDirective, TalosInputDirective } from '@talos/components';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, TalosInputDirective, TalosButtonDirective],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  readonly profileForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    bio: new FormControl('')
  });

  onSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Form data:', this.profileForm.value);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}`,
    htmlCode: `<form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-4 max-w-md">
  <div>
    <label class="block text-sm font-medium mb-1">Full Name</label>
    <input
      talosInput
      type="text"
      formControlName="fullName"
      placeholder="e.g. Jane Doe"
      [invalid]="profileForm.controls.fullName.invalid && profileForm.controls.fullName.touched"
    />
    @if (profileForm.controls.fullName.invalid && profileForm.controls.fullName.touched) {
      <p class="text-xs text-red-500 mt-1">Name is required (min 3 characters).</p>
    }
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Email Address</label>
    <input
      talosInput
      type="email"
      formControlName="email"
      placeholder="jane@example.com"
      [invalid]="profileForm.controls.email.invalid && profileForm.controls.email.touched"
    />
    @if (profileForm.controls.email.invalid && profileForm.controls.email.touched) {
      <p class="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
    }
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Bio</label>
    <textarea talosInput rows="3" formControlName="bio" placeholder="Tell us about yourself..."></textarea>
  </div>

  <button talosButton variant="primary" type="submit">Update Profile</button>
</form>`
  },
  {
    id: 'select-searchable',
    componentId: 'select-input',
    title: 'Searchable Select with Option Groups',
    description: 'TalosSelectInput with search filter input and reactive form binding.',
    tsCode: `import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectInputModule } from '@talos/components';

@Component({
  selector: 'app-select-demo',
  imports: [ReactiveFormsModule, SelectInputModule],
  template: \`
    <div class="w-72">
      <label class="block text-sm font-medium mb-1">Select Department</label>
      <talos-select-input
        [formControl]="deptControl"
        [searchable]="true"
        [clearable]="true"
        placeholder="Choose department..."
        size="md">
        <talos-option-group label="Engineering">
          <talos-option value="fe" label="Frontend">Frontend Development</talos-option>
          <talos-option value="be" label="Backend">Backend Services</talos-option>
          <talos-option value="devops" label="DevOps">DevOps & Cloud</talos-option>
        </talos-option-group>
        <talos-option-group label="Product">
          <talos-option value="design" label="UI/UX Design">UI/UX Design</talos-option>
          <talos-option value="pm" label="Product Management">Product Management</talos-option>
        </talos-option-group>
      </talos-select-input>
    </div>
  \`
})
export class SelectDemoComponent {
  readonly deptControl = new FormControl<string | null>(null, Validators.required);
}`,
    htmlCode: ``
  },
  {
    id: 'autocomplete-remote-search',
    componentId: 'autocomplete',
    title: 'Async Remote Search Autocomplete',
    description: 'Autocomplete component connected to dynamic search with loading indicator and item templates.',
    tsCode: `import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TalosAutocompleteModule } from '@talos/components';

interface Project {
  id: string;
  name: string;
  lead: string;
}

@Component({
  selector: 'app-project-search',
  imports: [ReactiveFormsModule, TalosAutocompleteModule],
  templateUrl: './project-search.component.html'
})
export class ProjectSearchComponent {
  readonly projectControl = new FormControl<string | null>(null);
  readonly isSearching = signal<boolean>(false);
  readonly searchResults = signal<Project[]>([]);

  private timeout: ReturnType<typeof setTimeout> | null = null;

  onSearch(query: string): void {
    if (this.timeout) clearTimeout(this.timeout);
    if (!query) {
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }

    this.isSearching.set(true);
    this.timeout = setTimeout(() => {
      // Mock API search
      this.searchResults.set([
        { id: '1', name: \`\${query} Core Engine\`, lead: 'Sarah C.' },
        { id: '2', name: \`\${query} Analytics UI\`, lead: 'David K.' }
      ]);
      this.isSearching.set(false);
    }, 400);
  }
}`,
    htmlCode: `<talos-autocomplete
  [formControl]="projectControl"
  placeholder="Search repository..."
  [searching]="isSearching()"
  (search)="onSearch($event)">
  @for (item of searchResults(); track item.id) {
    <talos-autocomplete-option [value]="item.id" [label]="item.name">
      <div class="flex items-center justify-between">
        <span class="font-medium">{{ item.name }}</span>
        <span class="text-xs text-slate-400">Lead: {{ item.lead }}</span>
      </div>
    </talos-autocomplete-option>
  }
</talos-autocomplete>`
  },
  {
    id: 'date-pickers-suite',
    componentId: 'date-range-picker',
    title: 'Date Range & Date Time Pickers',
    description: 'Date and date-time pickers integrated in a reactive form.',
    tsCode: `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  DatePickerComponent,
  DateRangePickerComponent,
  DateTimePickerComponent,
  DateTimeRangePickerComponent,
  DateRangeValue
} from '@talos/components';

@Component({
  selector: 'app-booking-form',
  imports: [
    ReactiveFormsModule,
    DatePickerComponent,
    DateRangePickerComponent,
    DateTimePickerComponent,
    DateTimeRangePickerComponent
  ],
  templateUrl: './booking-form.component.html'
})
export class BookingFormComponent {
  readonly bookingForm = new FormGroup({
    singleDate: new FormControl<string | null>('2026-08-16'),
    dateTime: new FormControl<string | null>('2026-08-16 14:00'),
    dateRange: new FormControl<DateRangeValue | null>({
      startDate: '2026-08-16',
      endDate: '2026-08-20'
    })
  });
}`,
    htmlCode: `<form [formGroup]="bookingForm" class="space-y-4">
  <div>
    <label class="block text-sm font-medium mb-1">Single Date</label>
    <talos-date-picker formControlName="singleDate" minDate="2026-01-01" size="sm"></talos-date-picker>
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Date Range</label>
    <talos-date-range-picker formControlName="dateRange" size="md"></talos-date-range-picker>
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Appointment Time</label>
    <talos-date-time-picker formControlName="dateTime" size="sm"></talos-date-time-picker>
  </div>
</form>`
  },
  {
    id: 'snackbar-trigger',
    componentId: 'snackbar',
    title: 'Global Toast Notifications',
    description: 'Triggering contextual feedback toasts with action callbacks using TalosSnackbarService.',
    tsCode: `import { Component, inject } from '@angular/core';
import { TalosButtonDirective, TalosSnackbarService } from '@talos/components';

@Component({
  selector: 'app-notifications-demo',
  imports: [TalosButtonDirective],
  template: \`
    <div class="flex gap-2">
      <button talosButton variant="success" (click)="showSuccess()">Success Toast</button>
      <button talosButton variant="danger" (click)="showError()">Error Toast</button>
      <button talosButton variant="secondary" (click)="showUndoable()">With Action</button>
    </div>
  \`
})
export class NotificationsDemoComponent {
  private readonly snackbar = inject(TalosSnackbarService);

  showSuccess(): void {
    this.snackbar.success('Record published successfully!', {
      title: 'Success',
      duration: 3000,
      position: 'bottom-right'
    });
  }

  showError(): void {
    this.snackbar.error('Could not connect to database.', {
      title: 'Connection Error'
    });
  }

  showUndoable(): void {
    this.snackbar.show('File moved to trash.', {
      variant: 'info',
      actionLabel: 'Undo',
      duration: 5000,
      onAction: () => console.log('Undo clicked')
    });
  }
}`
    ,
    htmlCode: ``
  },
  {
    id: 'chips-skills-selector',
    componentId: 'chips',
    title: 'Multi-Select Framework Chips',
    description: 'Dynamic chips input with autocomplete suggestions, custom tag creation, and reactive form integration.',
    tsCode: `import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TalosChipsComponent } from '@talos/components';

@Component({
  selector: 'app-skills-picker',
  imports: [TalosChipsComponent, ReactiveFormsModule],
  template: \`
    <div class="w-80">
      <talos-chips
        [formControl]="skillsControl"
        [options]="availableSkills"
        placeholder="Add framework..."
        [allowCustom]="true"
        size="sm"
        color="primary">
      </talos-chips>
    </div>
  \`
})
export class SkillsPickerComponent {
  readonly skillsControl = new FormControl<string[]>(['Angular', 'TypeScript']);
  readonly availableSkills = ['Angular', 'TypeScript', 'RxJS', 'Signals', 'Tailwind', 'Node.js', 'GraphQL'];
}`,
    htmlCode: ``
  },
  {
    id: 'layout-shell-example',
    componentId: 'layout',
    title: 'Main Layout with Side Panel Drawer',
    description: 'Application scaffolding with collapsible side nav and dynamic side panel drawer.',
    tsCode: `import { Component, inject } from '@angular/core';
import { MainLayoutComponent, LayoutService } from '@talos/components/layout';
import { TalosButtonDirective } from '@talos/components/button';

@Component({
  selector: 'app-shell',
  imports: [MainLayoutComponent, TalosButtonDirective],
  template: \`
    <talos-main-layout>
      <div class="p-6">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <button talosButton (click)="openDrawer()">Open Details Panel</button>
      </div>
    </talos-main-layout>
  \`
})
export class AppShellComponent {
  private readonly layoutService = inject(LayoutService);

  openDrawer(): void {
    this.layoutService.openRightPanel({
      title: 'Quick Details',
      width: '400px',
      mode: 'overlay'
    });
  }
}`,
    htmlCode: ``
  },
  {
    id: 'nav-sidebar-example',
    componentId: 'nav',
    title: 'Side Navigation with Groups and Theme Toggle',
    description: 'Collapsible sidebar navigation with nested items, badge counters, and dark mode toggle.',
    tsCode: `import { Component, signal } from '@angular/core';
import { SideNavComponent, SideNavGroup } from '@talos/components/nav';
import { LucideLayoutDashboard, LucideUsers, LucideSettings } from '@lucide/angular';

@Component({
  selector: 'app-sidebar-nav',
  imports: [SideNavComponent],
  template: \`
    <talos-side-nav
      [navGroups]="navGroups"
      [isDarkMode]="isDarkMode()"
      (themeToggle)="toggleDarkMode()"
    />
  \`
})
export class SidebarNavComponent {
  readonly isDarkMode = signal<boolean>(false);

  readonly navGroups: SideNavGroup[] = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboards', label: 'Dashboards', icon: LucideLayoutDashboard, active: true },
        { id: 'customers', label: 'Customers', icon: LucideUsers, badge: 12 }
      ]
    },
    {
      title: 'SYSTEM',
      collapsible: true,
      items: [
        { id: 'settings', label: 'Settings', icon: LucideSettings }
      ]
    }
  ];

  toggleDarkMode(): void {
    this.isDarkMode.update(d => !d);
  }
}`,
    htmlCode: ``
  },
  {
    id: 'card-composition',
    componentId: 'card',
    title: 'Modular Card with Header, Body & Footer',
    description: 'Composing an elevated card surface with structured header, avatar badge, actions, and aligned footer.',
    tsCode: `import { Component } from '@angular/core';
import {
  TalosCardComponent,
  TalosCardHeaderComponent,
  TalosCardBodyComponent,
  TalosCardFooterComponent,
  TalosCardAvatarDirective,
  TalosCardActionsDirective,
  TalosButtonDirective
} from '@talos/components';

@Component({
  selector: 'app-card-demo',
  imports: [
    TalosCardComponent,
    TalosCardHeaderComponent,
    TalosCardBodyComponent,
    TalosCardFooterComponent,
    TalosCardAvatarDirective,
    TalosCardActionsDirective,
    TalosButtonDirective
  ],
  template: \`
    <talos-card variant="elevated" [hoverable]="true">
      <talos-card-header title="Project Analytics" subtitle="Real-time telemetry" [bordered]="true">
        <div talosCardAvatar class="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
          PA
        </div>
        <div talosCardActions>
          <button type="button" talosButton variant="ghost" size="sm">Export</button>
        </div>
      </talos-card-header>

      <talos-card-body>
        <p class="text-sm text-slate-600">
          Monitor container workloads, cluster memory utilization, and network traffic across all availability zones.
        </p>
      </talos-card-body>

      <talos-card-footer [bordered]="true" align="between">
        <span class="text-xs text-slate-400">Refreshed 2m ago</span>
        <div class="flex gap-2">
          <button type="button" talosButton variant="outline" size="sm">Dismiss</button>
          <button type="button" talosButton variant="primary" size="sm">View Metrics</button>
        </div>
      </talos-card-footer>
    </talos-card>
  \`
})
export class CardDemoComponent {}`,
    htmlCode: ``
  },
  {
    id: 'dialog-overview',
    componentId: 'dialog',
    title: 'CDK Modal with Backdrop Blur and Form Sizing',
    description: 'Demonstrates opening modals using TalosDialogService with customizable backdrop blur and form sizing presets.',
    tsCode: `import { Component, inject } from '@angular/core';
import { TalosDialogService, TalosDialogModule, TalosDialogRef, TALOS_DIALOG_DATA } from '@talos/components/dialog';
import { TalosButtonDirective } from '@talos/components/button';

@Component({
  selector: 'app-user-dialog',
  imports: [TalosDialogModule, TalosButtonDirective],
  template: \`
    <talos-dialog-header title="Edit User" subtitle="Update user credentials and permissions." />
    <talos-dialog-content padding="md">
      <p>Configure account details and access roles.</p>
    </talos-dialog-content>
    <talos-dialog-footer align="end">
      <button talosButton variant="secondary" [talosDialogClose]="null">Cancel</button>
      <button talosButton variant="primary" [talosDialogClose]="{ saved: true }">Save Changes</button>
    </talos-dialog-footer>
  \`
})
export class UserDialogComponent {}

@Component({
  selector: 'app-dialog-demo',
  imports: [TalosButtonDirective],
  template: \`
    <button talosButton variant="primary" (click)="openDialog()">
      Open Modal (Frosted Glass Blur)
    </button>
  \`
})
export class DialogDemoComponent {
  private readonly dialog = inject(TalosDialogService);

  openDialog(): void {
    const ref = this.dialog.open(UserDialogComponent, {
      size: 'md',
      backdropBlur: 'md'
    });

    ref.closed.subscribe(result => {
      console.log('Result:', result);
    });
  }
}`,
    htmlCode: ``
  }
];
