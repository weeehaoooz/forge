import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {
  TalosAutocompleteComponent,
  TalosAutocompleteModule,
  TalosButtonDirective,
  TalosButtonGroupModule,
  AutocompleteSize
} from '@talos/components';

interface TechItem {
  id: string;
  name: string;
  category: string;
  description: string;
  stars: string;
}

interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  initials: string;
}

@Component({
  selector: 'app-autocomplete-page',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TalosAutocompleteModule,
    TalosButtonDirective,
    TalosButtonGroupModule
  ],
  templateUrl: './autocomplete-page.html',
  styleUrl: './autocomplete-page.scss'
})
export class AutocompletePage {
  // Sizing State
  protected readonly inputSize = signal<AutocompleteSize>('sm');
  protected readonly floatingLabels = signal<boolean>(false);

  // Form Controls
  readonly demoForm = new FormGroup({
    asyncTech: new FormControl<string | null>(null, Validators.required),
    localCountry: new FormControl<string | null>('SG'),
    customUser: new FormControl<string | null>(null)
  });

  // Local Dataset for standard autocomplete
  readonly countries = signal([
    'Australia',
    'Brazil',
    'Canada',
    'Denmark',
    'Egypt',
    'France',
    'Germany',
    'India',
    'Japan',
    'Mexico',
    'Netherlands',
    'Singapore',
    'South Korea',
    'Spain',
    'Sweden',
    'Switzerland',
    'United Kingdom',
    'United States'
  ]);

  // Async / Remote Search Simulator
  readonly isSearching = signal<boolean>(false);
  readonly asyncQuery = signal<string>('');
  readonly asyncResults = signal<TechItem[]>([]);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  // Master repository for async search simulator
  private readonly allTechItems: TechItem[] = [
    { id: 'ng', name: 'Angular', category: 'Frontend', description: 'Enterprise web framework by Google with Signals', stars: '96k' },
    { id: 'react', name: 'React', category: 'Frontend', description: 'Component-based UI library by Meta', stars: '228k' },
    { id: 'vue', name: 'Vue.js', category: 'Frontend', description: 'Progressive reactive JavaScript framework', stars: '208k' },
    { id: 'svelte', name: 'Svelte', category: 'Frontend', description: 'Cybernetically enhanced compiler framework', stars: '78k' },
    { id: 'nest', name: 'NestJS', category: 'Backend', description: 'Scalable TypeScript server-side framework', stars: '66k' },
    { id: 'fastify', name: 'Fastify', category: 'Backend', description: 'Extremely fast and low overhead web framework', stars: '32k' },
    { id: 'rust', name: 'Rust Lang', category: 'System', description: 'Empowering everyone to build reliable and efficient software', stars: '97k' },
    { id: 'go', name: 'Go (Golang)', category: 'System', description: 'Build simple, secure, scalable systems', stars: '124k' },
    { id: 'tailwind', name: 'Tailwind CSS', category: 'Styling', description: 'Utility-first CSS framework for rapid UI dev', stars: '82k' },
    { id: 'vite', name: 'Vite', category: 'Build', description: 'Next generation frontend tooling with native ESM', stars: '69k' }
  ];

  // Custom User Profile Template items
  readonly users = signal<UserProfile[]>([
    { id: 'u1', name: 'Sarah Chen', role: 'Staff Frontend Engineer', avatarBg: '#3b82f6', initials: 'SC' },
    { id: 'u2', name: 'Alex Rivera', role: 'Principal Architect', avatarBg: '#10b981', initials: 'AR' },
    { id: 'u3', name: 'Jordan Taylor', role: 'Lead Product Designer', avatarBg: '#8b5cf6', initials: 'JT' },
    { id: 'u4', name: 'Michael Novak', role: 'DevOps Lead', avatarBg: '#f59e0b', initials: 'MN' },
    { id: 'u5', name: 'Elena Rostova', role: 'Design Systems Engineer', avatarBg: '#ec4899', initials: 'ER' }
  ]);

  // Event Logs
  readonly eventLogs = signal<string[]>([]);

  constructor() {
    // Initial async populate
    this.asyncResults.set(this.allTechItems.slice(0, 4));
  }

  setInputSize(size: AutocompleteSize): void {
    this.inputSize.set(size);
  }

  // Simulated Async API Search handler
  onAsyncSearch(query: string): void {
    this.asyncQuery.set(query);
    this.logEvent(`Search query changed: "${query}"`);

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!query) {
      this.isSearching.set(false);
      this.asyncResults.set(this.allTechItems.slice(0, 4));
      return;
    }

    // Set searching spinner signal to TRUE
    this.isSearching.set(true);

    // Simulate network delay (e.g. 500ms debounce/API request)
    this.searchTimeout = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const results = this.allTechItems.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery)
      );

      this.asyncResults.set(results);
      this.isSearching.set(false);
      this.logEvent(`Async search resolved: ${results.length} item(s) found`);
    }, 500);
  }

  onSelection(selected: unknown): void {
    const formatted = typeof selected === 'object' && selected !== null ? JSON.stringify(selected) : String(selected);
    this.logEvent(`Selected: ${formatted}`);
  }

  private logEvent(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLogs.update((logs) => [`[${timestamp}] ${message}`, ...logs.slice(0, 7)]);
  }

  toggleSearchingManual(): void {
    this.isSearching.update((val) => !val);
    this.logEvent(`Manual "searching" spinner toggled: ${this.isSearching()}`);
  }
}
