#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_project_1 = require("./commands/create-project");
const add_component_1 = require("./commands/add-component");
const deploy_1 = require("./commands/deploy");
const setup_1 = require("./commands/setup");
const analyze_1 = require("./commands/analyze");
const help_1 = require("./commands/help");
const program = new commander_1.Command();
program
    .name('web-automation')
    .description('AI-powered web development automation CLI')
    .version('1.0.0');
program
    .command('create-project')
    .description('Create a new web project with AI assistance')
    .option('-t, --template <template>', 'Project template (saas, portfolio, e-commerce)', 'modern-saas')
    .option('-n, --name <name>', 'Project name')
    .option('--stack <stack>', 'Tech stack (react, vue, next)', 'react')
    .action(create_project_1.createProject);
program
    .command('add-component')
    .description('Add a new component to your project')
    .argument('<name>', 'Component name')
    .option('-t, --type <type>', 'Component type (functional, class)', 'functional')
    .option('--with-styles', 'Include styled component')
    .option('--with-tests', 'Include test file')
    .action(add_component_1.addComponent);
program
    .command('deploy')
    .description('Deploy your project to various platforms')
    .argument('<platform>', 'Deployment platform (vercel, netlify, github-pages)')
    .option('-d, --domain <domain>', 'Custom domain')
    .option('--prod', 'Production deployment')
    .action(deploy_1.deploy);
program
    .command('setup')
    .description('Setup project dependencies and configuration')
    .option('--deps', 'Install dependencies')
    .option('--config', 'Setup configuration files')
    .option('--all', 'Setup everything')
    .action(setup_1.setup);
program
    .command('analyze')
    .description('Analyze project performance and provide recommendations')
    .option('-t, --type <type>', 'Analysis type (performance, bundle, accessibility)', 'performance')
    .action(analyze_1.analyze);
program
    .command('help')
    .description('Show help and available commands')
    .action(help_1.help);
// Handle unknown commands
program.on('command:*', (unknownCommand) => {
    console.error(`Unknown command: ${unknownCommand[0]}`);
    console.log('Run "web-automation --help" to see available commands');
    process.exit(1);
});
program.parse();
//# sourceMappingURL=index.js.map