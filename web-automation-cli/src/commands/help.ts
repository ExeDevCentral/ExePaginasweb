export function help() {
  console.log(`
🤖 Web Automation CLI - AI-Powered Development Tool
${'='.repeat(60)}

DESCRIPTION:
  An intelligent CLI tool that automates 95% of web development tasks
  using AI assistance, templates, and modern development practices.

COMMANDS:

  create-project [options]
    Create a new web project with AI assistance
    Options:
      -t, --template <template>  Project template (modern-saas, portfolio, e-commerce)
      -n, --name <name>          Project name
      --stack <stack>           Tech stack (react, vue, next)

    Examples:
      web-automation create-project --template modern-saas --name my-app
      web-automation create-project -t portfolio --stack next

  add-component <name> [options]
    Add a new component to your project
    Options:
      --type <type>             Component type (functional, class)
      --with-styles             Include styled component
      --with-tests              Include test file

    Examples:
      web-automation add-component Modal --with-styles --with-tests
      web-automation add-component Button --type functional

  deploy <platform> [options]
    Deploy your project to various platforms
    Platforms: vercel, netlify, github-pages
    Options:
      -d, --domain <domain>     Custom domain
      --prod                   Production deployment

    Examples:
      web-automation deploy vercel --prod
      web-automation deploy netlify --domain myapp.com

  setup [options]
    Setup project dependencies and configuration
    Options:
      --deps                   Install dependencies
      --config                 Setup configuration files
      --all                    Setup everything

    Examples:
      web-automation setup --all
      web-automation setup --deps

  analyze [options]
    Analyze project performance and provide recommendations
    Options:
      -t, --type <type>         Analysis type (performance, bundle, accessibility)

    Examples:
      web-automation analyze --type performance
      web-automation analyze -t bundle

WORKFLOW EXAMPLES:

  🚀 Quick Start (New Project):
    web-automation create-project --template modern-saas --name my-app
    cd my-app
    web-automation setup --all
    web-automation add-component Hero
    web-automation deploy vercel --prod

  🔧 Development Workflow:
    web-automation add-component Modal --with-styles --with-tests
    web-automation analyze --type performance
    web-automation deploy vercel

  📊 Maintenance:
    web-automation analyze --type accessibility
    web-automation setup --deps  # Update dependencies

FEATURES:
  • 🤖 AI-powered project generation
  • ⚡ Lightning-fast component creation
  • 🚀 One-click deployment
  • 📊 Performance analysis
  • ♿ Accessibility checking
  • 🎨 Modern UI templates

SUPPORT:
  For issues or questions, visit: https://github.com/your-org/web-automation-cli

${'='.repeat(60)}
`)
}
