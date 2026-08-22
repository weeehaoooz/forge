export interface Schema {
    /** Name of the project to configure. */
    project?: string;
    /** Automatically configure Talos global styles and design tokens. */
    addStyles?: boolean;
    /** Color theme mode. */
    theme?: 'light' | 'dark' | 'system';
    /** Skip adding peer dependencies to package.json. */
    skipPackageJson?: boolean;
}
