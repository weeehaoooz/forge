export interface ComponentInput {
    name: string;
    type: string;
    default?: string;
    description: string;
    required?: boolean;
}
export interface ComponentOutput {
    name: string;
    type: string;
    description: string;
}
export interface ComponentMetadata {
    id: string;
    name: string;
    category: 'Button' | 'Form' | 'Layout' | 'Navigation' | 'Feedback' | 'Visualization';
    kind: 'component' | 'directive' | 'service' | 'module';
    selector?: string;
    exportName: string;
    secondaryEntrypoint: string;
    rootExport: string;
    description: string;
    inputs?: ComponentInput[];
    outputs?: ComponentOutput[];
    formsIntegration?: 'ControlValueAccessor' | 'Direct input binding' | 'Signal form compatible' | 'N/A';
    tags: string[];
    docs: string;
}
export declare const TALOS_COMPONENTS: ComponentMetadata[];
