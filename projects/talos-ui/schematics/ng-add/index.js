"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const dependencies_1 = require("@schematics/angular/utility/dependencies");
const TALOS_PEER_DEPENDENCIES = [
    { name: '@angular/cdk', version: '^22.1.1', type: dependencies_1.NodeDependencyType.Default },
    { name: '@lucide/angular', version: '^1.31.0', type: dependencies_1.NodeDependencyType.Default },
    { name: 'date-fns', version: '^4.1.0', type: dependencies_1.NodeDependencyType.Default },
    { name: 'rxjs', version: '~7.8.0', type: dependencies_1.NodeDependencyType.Default }
];
function addDependencies(options) {
    return (tree, context) => {
        if (options.skipPackageJson) {
            return tree;
        }
        let hasAddedDependency = false;
        for (const dep of TALOS_PEER_DEPENDENCIES) {
            const existing = (0, dependencies_1.getPackageJsonDependency)(tree, dep.name);
            if (!existing) {
                (0, dependencies_1.addPackageJsonDependency)(tree, {
                    type: dep.type,
                    name: dep.name,
                    version: dep.version,
                    overwrite: false
                });
                hasAddedDependency = true;
                context.logger.info(`  ✔ Added dependency: ${dep.name} (${dep.version})`);
            }
        }
        if (hasAddedDependency) {
            context.addTask(new tasks_1.NodePackageInstallTask());
            context.logger.info('  📦 Scheduling package manager installation...');
        }
        return tree;
    };
}
function addStyles(options) {
    return (tree, context) => {
        if (options.addStyles === false) {
            return tree;
        }
        const scssPath = 'src/styles.scss';
        const cssPath = 'src/styles.css';
        const scssImport = "@use '@daedal-dev/talos-ui/styles/index';\n";
        const cssImport = "@import '@daedal-dev/talos-ui/styles/index.scss';\n";
        if (tree.exists(scssPath)) {
            const content = tree.readText(scssPath);
            if (!content.includes('@daedal-dev/talos-ui/styles') && !content.includes('@talos/components/styles')) {
                tree.overwrite(scssPath, `${scssImport}${content}`);
                context.logger.info(`  ✔ Added Talos SCSS import to ${scssPath}`);
            }
        }
        else if (tree.exists(cssPath)) {
            const content = tree.readText(cssPath);
            if (!content.includes('@daedal-dev/talos-ui/styles') && !content.includes('@talos/components/styles')) {
                tree.overwrite(cssPath, `${cssImport}${content}`);
                context.logger.info(`  ✔ Added Talos styles import to ${cssPath}`);
            }
        }
        return tree;
    };
}
function applyTheme(options) {
    return (tree, context) => {
        if (options.theme !== 'dark') {
            return tree;
        }
        const indexPath = 'src/index.html';
        if (tree.exists(indexPath)) {
            let content = tree.readText(indexPath);
            if (!content.includes('data-theme=')) {
                content = content.replace('<html', '<html data-theme="dark"');
                tree.overwrite(indexPath, content);
                context.logger.info(`  ✔ Enabled dark theme (data-theme="dark") in ${indexPath}`);
            }
        }
        return tree;
    };
}
function logSummary() {
    return (tree, context) => {
        context.logger.info('');
        context.logger.info('✨ @daedal-dev/talos-ui has been successfully configured!');
        context.logger.info('   You can now import any component from @daedal-dev/talos-ui (e.g. TalosButtonDirective).');
        context.logger.info('   For documentation & AI tooling, run: npm run mcp:build');
        context.logger.info('');
        return tree;
    };
}
function default_1(options) {
    return (0, schematics_1.chain)([
        addDependencies(options),
        addStyles(options),
        applyTheme(options),
        logSummary()
    ]);
}
