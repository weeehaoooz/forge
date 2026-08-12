import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectInputModule, ForgeButtonDirective } from '@forge/components';

interface FrameworkOption {
  id: string;
  name: string;
  category: string;
}

@Component({
  selector: 'app-select-page',
  imports: [ReactiveFormsModule, SelectInputModule, ForgeButtonDirective],
  templateUrl: './select-page.html',
  styleUrl: './select-page.scss'
})
export class SelectPage {
  readonly selectForm = new FormGroup({
    singleFruit: new FormControl<string | null>(null, Validators.required),
    searchableFramework: new FormControl<string | null>('angular', Validators.required)
  });

  protected readonly inputSize = signal<'sm' | 'md' | 'lg'>('sm');
  protected readonly searchLog = signal<string[]>([]);

  readonly frameworks = signal<FrameworkOption[]>([
    { id: 'angular', name: 'Angular (v22+ Signals)', category: 'Frontend' },
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

  setInputSize(size: 'sm' | 'md' | 'lg'): void {
    this.inputSize.set(size);
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
}
