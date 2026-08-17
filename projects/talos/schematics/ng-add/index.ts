import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
  getPackageJsonDependency
} from '@schematics/angular/utility/dependencies';
import { Schema } from './schema';

const TALOS_PEER_DEPENDENCIES = [
  { name: '@angular/cdk', version: '^22.1.1', type: NodeDependencyType.Default },
  { name: '@lucide/angular', version: '^1.31.0', type: NodeDependencyType.Default },
  { name: 'date-fns', version: '^4.1.0', type: NodeDependencyType.Default },
  { name: 'rxjs', version: '~7.8.0', type: NodeDependencyType.Default }
];

function addDependencies(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.skipPackageJson) {
      return tree;
    }

    let hasAddedDependency = false;

    for (const dep of TALOS_PEER_DEPENDENCIES) {
      const existing = getPackageJsonDependency(tree, dep.name);
      if (!existing) {
        addPackageJsonDependency(tree, {
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
      context.addTask(new NodePackageInstallTask());
      context.logger.info('  📦 Scheduling package manager installation...');
    }

    return tree;
  };
}

function addStyles(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
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
    } else if (tree.exists(cssPath)) {
      const content = tree.readText(cssPath);
      if (!content.includes('@daedal-dev/talos-ui/styles') && !content.includes('@talos/components/styles')) {
        tree.overwrite(cssPath, `${cssImport}${content}`);
        context.logger.info(`  ✔ Added Talos styles import to ${cssPath}`);
      }
    }

    return tree;
  };
}

function applyTheme(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
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

function logSummary(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('');
    context.logger.info('✨ @daedal-dev/talos-ui has been successfully configured!');
    context.logger.info('   You can now import any component from @daedal-dev/talos-ui (e.g. TalosButtonDirective).');
    context.logger.info('   For documentation & AI tooling, run: npm run mcp:build');
    context.logger.info('');
    return tree;
  };
}

export default function (options: Schema): Rule {
  return chain([
    addDependencies(options),
    addStyles(options),
    applyTheme(options),
    logSummary()
  ]);
}
