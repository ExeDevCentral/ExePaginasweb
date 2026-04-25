"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = deploy;
exports.quickDeploy = quickDeploy;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
async function deploy(platform, options) {
    const { domain, prod } = options;
    console.log(`🌐 Deploying to ${platform}${prod ? ' (production)' : ''}`);
    try {
        // Check if we're in a project directory
        if (!fs_1.default.existsSync('package.json')) {
            console.error('❌ Not in a project directory. Run this command from your project root.');
            process.exit(1);
        }
        switch (platform.toLowerCase()) {
            case 'vercel':
                await deployToVercel(domain, prod);
                break;
            case 'netlify':
                await deployToNetlify(domain, prod);
                break;
            case 'github-pages':
                await deployToGitHubPages();
                break;
            default:
                console.error(`❌ Unsupported platform: ${platform}`);
                console.log('Supported platforms: vercel, netlify, github-pages');
                process.exit(1);
        }
    }
    catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    }
}
async function deployToVercel(domain, prod) {
    console.log('🚀 Deploying to Vercel...');
    try {
        // Check if Vercel CLI is installed
        (0, child_process_1.execSync)('vercel --version', { stdio: 'ignore' });
    }
    catch {
        console.log('📦 Installing Vercel CLI...');
        (0, child_process_1.execSync)('npm install -g vercel', { stdio: 'inherit' });
    }
    // Deploy to Vercel
    const deployCommand = prod ? 'vercel --prod' : 'vercel';
    (0, child_process_1.execSync)(deployCommand, { stdio: 'inherit' });
    if (domain) {
        console.log(`🔗 Adding custom domain: ${domain}`);
        (0, child_process_1.execSync)(`vercel domains add ${domain}`, { stdio: 'inherit' });
    }
    console.log('✅ Successfully deployed to Vercel!');
    if (domain) {
        console.log(`🌐 Your site is live at: https://${domain}`);
    }
}
async function deployToNetlify(domain, prod) {
    console.log('🚀 Deploying to Netlify...');
    try {
        // Check if Netlify CLI is installed
        (0, child_process_1.execSync)('netlify --version', { stdio: 'ignore' });
    }
    catch {
        console.log('📦 Installing Netlify CLI...');
        (0, child_process_1.execSync)('npm install -g netlify-cli', { stdio: 'inherit' });
    }
    // Build the project if build script exists
    if (fs_1.default.existsSync('package.json')) {
        const packageJson = JSON.parse(fs_1.default.readFileSync('package.json', 'utf-8'));
        if (packageJson.scripts?.build) {
            console.log('🔨 Building project...');
            (0, child_process_1.execSync)('npm run build', { stdio: 'inherit' });
        }
    }
    // Deploy to Netlify
    const deployCommand = prod ? 'netlify deploy --prod' : 'netlify deploy';
    (0, child_process_1.execSync)(deployCommand, { stdio: 'inherit' });
    if (domain && prod) {
        console.log(`🔗 Setting up custom domain: ${domain}`);
        (0, child_process_1.execSync)(`netlify domains:set ${domain}`, { stdio: 'inherit' });
    }
    console.log('✅ Successfully deployed to Netlify!');
    if (domain && prod) {
        console.log(`🌐 Your site is live at: https://${domain}`);
    }
}
async function deployToGitHubPages() {
    console.log('🚀 Deploying to GitHub Pages...');
    // Check if git is initialized
    try {
        (0, child_process_1.execSync)('git status', { stdio: 'ignore' });
    }
    catch {
        console.error('❌ Git repository not found. Please initialize git first.');
        process.exit(1);
    }
    // Install gh-pages if not already installed
    try {
        (0, child_process_1.execSync)('npx gh-pages --version', { stdio: 'ignore' });
    }
    catch {
        console.log('📦 Installing gh-pages...');
        (0, child_process_1.execSync)('npm install --save-dev gh-pages', { stdio: 'inherit' });
    }
    // Build the project
    console.log('🔨 Building project...');
    (0, child_process_1.execSync)('npm run build', { stdio: 'inherit' });
    // Deploy to GitHub Pages
    console.log('📤 Deploying to GitHub Pages...');
    (0, child_process_1.execSync)('npx gh-pages -d dist', { stdio: 'inherit' });
    console.log('✅ Successfully deployed to GitHub Pages!');
    console.log('🌐 Your site will be available at: https://[username].github.io/[repository-name]');
}
async function quickDeploy(platform = 'vercel') {
    console.log(`⚡ Quick deploy to ${platform}`);
    const options = {
        prod: true
    };
    await deploy(platform, options);
}
//# sourceMappingURL=deploy.js.map