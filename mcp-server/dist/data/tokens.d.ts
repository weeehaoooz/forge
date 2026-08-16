export interface DesignTokenGroup {
    name: string;
    description: string;
    tokens: {
        name: string;
        cssVar?: string;
        scssVar?: string;
        value?: string;
        description: string;
    }[];
}
export declare const TALOS_DESIGN_TOKENS: {
    summary: string;
    importGuide: string;
    colorSystem: DesignTokenGroup;
    typography: DesignTokenGroup;
    formControls: DesignTokenGroup;
    buttons: DesignTokenGroup;
    darkMode: {
        strategy: string;
        variables: Record<string, {
            light: string;
            dark: string;
        }>;
    };
};
