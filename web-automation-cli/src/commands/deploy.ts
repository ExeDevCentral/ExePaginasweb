import { execSync } from 'child_process'
import fs from 'fs'

interface DeployOptions {
  domain?: string
  prod?: boolean
}

export async function deploy(platform: string, options: DeployOptions) {
  const { domain, prod } = options

  console.log(`🌐 Deploying to ${platform}${prod ? ' (production)' : ''}`)

  try {
    // Check if we're in a project directory
    if (!fs.existsSync('package.json')) {
      console.error('❌ Not in a project directory. Run this command from your project root.')
      process.exit(1)
    }

    switch (platform.toLowerCase()) {
      case 'vercel':
        await deployToVercel(domain, prod)
        break
      case 'netlify':
        await deployToNetlify(domain, prod)
        break
      case 'github-pages':
        await deployToGitHubPages()
        break
      default:
        console.error(`❌ Unsupported platform: ${platform}`)
        console.log('Supported platforms: vercel, netlify, github-pages')
        process.exit(1)
    }
  } catch (error) {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  }
}

async function deployToVercel(domain?: string, prod?: boolean) {
  console.log('🚀 Deploying to Vercel...')

  try {
    // Check if Vercel CLI is installed
    execSync('vercel --version', { stdio: 'ignore' })
  } catch {
    console.log('📦 Installing Vercel CLI...')
    execSync('npm install -g vercel', { stdio: 'inherit' })
  }

  // Deploy to Vercel
  const deployCommand = prod ? 'vercel --prod' : 'vercel'
  execSync(deployCommand, { stdio: 'inherit' })

  if (domain) {
    console.log(`🔗 Adding custom domain: ${domain}`)
    execSync(`vercel domains add ${domain}`, { stdio: 'inherit' })
  }

  console.log('✅ Successfully deployed to Vercel!')
  if (domain) {
    console.log(`🌐 Your site is live at: https://${domain}`)
  }
}

async function deployToNetlify(domain?: string, prod?: boolean) {
  console.log('🚀 Deploying to Netlify...')

  try {
    // Check if Netlify CLI is installed
    execSync('netlify --version', { stdio: 'ignore' })
  } catch {
    console.log('📦 Installing Netlify CLI...')
    execSync('npm install -g netlify-cli', { stdio: 'inherit' })
  }

  // Build the project if build script exists
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    if (packageJson.scripts?.build) {
      console.log('🔨 Building project...')
      execSync('npm run build', { stdio: 'inherit' })
    }
  }

  // Deploy to Netlify
  const deployCommand = prod ? 'netlify deploy --prod' : 'netlify deploy'
  execSync(deployCommand, { stdio: 'inherit' })

  if (domain && prod) {
    console.log(`🔗 Setting up custom domain: ${domain}`)
    execSync(`netlify domains:set ${domain}`, { stdio: 'inherit' })
  }

  console.log('✅ Successfully deployed to Netlify!')
  if (domain && prod) {
    console.log(`🌐 Your site is live at: https://${domain}`)
  }
}

async function deployToGitHubPages() {
  console.log('🚀 Deploying to GitHub Pages...')

  // Check if git is initialized
  try {
    execSync('git status', { stdio: 'ignore' })
  } catch {
    console.error('❌ Git repository not found. Please initialize git first.')
    process.exit(1)
  }

  // Install gh-pages if not already installed
  try {
    execSync('npx gh-pages --version', { stdio: 'ignore' })
  } catch {
    console.log('📦 Installing gh-pages...')
    execSync('npm install --save-dev gh-pages', { stdio: 'inherit' })
  }

  // Build the project
  console.log('🔨 Building project...')
  execSync('npm run build', { stdio: 'inherit' })

  // Deploy to GitHub Pages
  console.log('📤 Deploying to GitHub Pages...')
  execSync('npx gh-pages -d dist', { stdio: 'inherit' })

  console.log('✅ Successfully deployed to GitHub Pages!')
  console.log('🌐 Your site will be available at: https://[username].github.io/[repository-name]')
}

export async function quickDeploy(platform: string = 'vercel') {
  console.log(`⚡ Quick deploy to ${platform}`)

  const options: DeployOptions = {
    prod: true
  }

  await deploy(platform, options)
}
