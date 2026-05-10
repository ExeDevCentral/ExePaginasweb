#!/usr/bin/env node

import { Command } from 'commander'
import { createProject } from './commands/create-project'
import { addComponent } from './commands/add-component'
import { deploy } from './commands/deploy'
import { setup } from './commands/setup'
import { analyze } from './commands/analyze'
import { help } from './commands/help'

const program = new Command()

program
  .name('web-automation')
  .description('AI-powered web development automation CLI')
  .version('1.0.0')

program
  .command('create-project')
  .description('Create a new web project with AI assistance')
  .option('-t, --template <template>', 'Project template (saas, portfolio, e-commerce)', 'modern-saas')
  .option('-n, --name <name>', 'Project name')
  .option('--stack <stack>', 'Tech stack (react, vue, next)', 'react')
  .action(createProject)

program
  .command('add-component')
  .description('Add a new component to your project')
  .argument('<name>', 'Component name')
  .option('-t, --type <type>', 'Component type (functional, class)', 'functional')
  .option('--with-styles', 'Include styled component')
  .option('--with-tests', 'Include test file')
  .action(addComponent)

program
  .command('deploy')
  .description('Deploy your project to various platforms')
  .argument('<platform>', 'Deployment platform (vercel, netlify, github-pages)')
  .option('-d, --domain <domain>', 'Custom domain')
  .option('--prod', 'Production deployment')
  .action(deploy)

program
  .command('setup')
  .description('Setup project dependencies and configuration')
  .option('--deps', 'Install dependencies')
  .option('--config', 'Setup configuration files')
  .option('--all', 'Setup everything')
  .action(setup)

program
  .command('analyze')
  .description('Analyze project performance and provide recommendations')
  .option('-t, --type <type>', 'Analysis type (performance, bundle, accessibility)', 'performance')
  .action(analyze)

program
  .command('help')
  .description('Show help and available commands')
  .action(help)

// Handle unknown commands
program.on('command:*', (unknownCommand) => {
  console.error(`Unknown command: ${unknownCommand[0]}`)
  console.log('Run "web-automation --help" to see available commands')
  process.exit(1)
})

program.parse()
