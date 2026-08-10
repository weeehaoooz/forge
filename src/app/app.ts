import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectInputModule } from './shared/components/select-input/select-input.module';
import { MainLayoutComponent } from './shared/components/layout/main-layout.component';
import { SideNavComponent } from './shared/components/nav/side-nav.component';
import { LayoutService } from './shared/components/layout/layout.service';
import { SampleDetailPanelComponent } from './shared/components/layout/demo/sample-detail-panel.component';


interface FrameworkOption {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

@Component({
  selector: 'app-root',
  imports: [
    SelectInputModule,
    ReactiveFormsModule,
    MainLayoutComponent,
    SideNavComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly layoutService = inject(LayoutService);

  // Demo Form
  readonly demoForm = new FormGroup({
    singleFruit: new FormControl<string | null>(null, Validators.required),
    searchableFramework: new FormControl<string | null>('angular', Validators.required),
    groupedLocation: new FormControl<string | null>(null, Validators.required),
    clearableOption: new FormControl<string | null>('coffee')
  });

  // Controls for interactive settings
  readonly isFormDisabled = signal<boolean>(false);
  readonly isClearableEnabled = signal<boolean>(true);
  readonly inputSize = signal<'sm' | 'md' | 'lg'>('sm');
  readonly searchLog = signal<string[]>([]);
  readonly submittedData = signal<string | null>(null);

  setInputSize(size: 'sm' | 'md' | 'lg'): void {
    this.inputSize.set(size);
  }

  // Dynamic Options Demo Data
  readonly frameworks = signal<FrameworkOption[]>([
    { id: 'angular', name: 'Angular (v21+ Signals)', category: 'Frontend' },
    { id: 'react', name: 'React (v19)', category: 'Frontend' },
    { id: 'vue', name: 'Vue.js (v3.5)', category: 'Frontend' },
    { id: 'svelte', name: 'Svelte 5 (Runes)', category: 'Frontend' },
    { id: 'nest', name: 'NestJS Framework', category: 'Backend' },
    { id: 'express', name: 'Express.js', category: 'Backend' },
    { id: 'fastify', name: 'Fastify Node Server', category: 'Backend' },
    { id: 'django', name: 'Django Python Framework', category: 'Backend' },
    { id: 'spring', name: 'Spring Boot (Java)', category: 'Backend' },
    { id: 'flutter', name: 'Flutter (Dart)', category: 'Mobile' }
  ]);

  // Layout Demo Actions
  openDetailWithBlur(title: string, id: string): void {
    this.layoutService.openRightPanel(
      SampleDetailPanelComponent,
      {
        subjectId: id,
        subjectTitle: title,
        subjectData: {
          category: 'Frontend Framework',
          status: 'Active',
          lastInspected: new Date().toISOString(),
          requestedBy: 'User Admin'
        }
      },
      {
        title: `Detail: ${title}`,
        width: '420px',
        blurBackdrop: true,
        closeOnBackdropClick: true
      }
    );
  }

  openDetailNoBlur(title: string, id: string): void {
    this.layoutService.openRightPanel(
      SampleDetailPanelComponent,
      {
        subjectId: id,
        subjectTitle: title,
        subjectData: {
          category: 'Backend Framework',
          status: 'Stable',
          lastInspected: new Date().toISOString()
        }
      },
      {
        title: `Detail: ${title}`,
        width: '380px',
        blurBackdrop: false
      }
    );
  }

  toggleDisableForm(): void {
    const nextState = !this.isFormDisabled();
    this.isFormDisabled.set(nextState);
    if (nextState) {
      this.demoForm.disable();
    } else {
      this.demoForm.enable();
    }
  }

  onSearchChange(term: string): void {
    if (term) {
      this.searchLog.update((logs) => [
        `Searched for "${term}" at ${new Date().toLocaleTimeString()}`,
        ...logs.slice(0, 4)
      ]);
    }
  }

  addCustomFramework(): void {
    const count = this.frameworks().length + 1;
    const newFw: FrameworkOption = {
      id: `custom-${count}`,
      name: `Custom Tech Stack #${count}`,
      category: 'Custom'
    };
    this.frameworks.update((list) => [...list, newFw]);
  }

  onSubmit(): void {
    if (this.demoForm.valid) {
      this.submittedData.set(JSON.stringify(this.demoForm.value, null, 2));
    } else {
      this.demoForm.markAllAsTouched();
      this.submittedData.set(null);
    }
  }

  onReset(): void {
    this.demoForm.reset({
      singleFruit: null,
      searchableFramework: 'angular',
      groupedLocation: null,
      clearableOption: 'coffee'
    });
    this.submittedData.set(null);
  }
}
