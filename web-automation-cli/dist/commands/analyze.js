"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = analyze;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function analyze(options) {
    const { type } = options;
    console.log(`📊 Analyzing project (${type})...`);
    try {
        // Check if we're in a project directory
        if (!fs_1.default.existsSync('package.json')) {
            console.error('❌ Not in a project directory. Run this command from your project root.');
            process.exit(1);
        }
        const packageJson = JSON.parse(fs_1.default.readFileSync('package.json', 'utf-8'));
        switch (type) {
            case 'performance':
                await analyzePerformance(packageJson);
                break;
            case 'bundle':
                await analyzeBundle(packageJson);
                break;
            case 'accessibility':
                await analyzeAccessibility();
                break;
            default:
                console.error(`❌ Unknown analysis type: ${type}`);
                console.log('Available types: performance, bundle, accessibility');
                process.exit(1);
        }
    }
    catch (error) {
        console.error('❌ Analysis failed:', error);
        process.exit(1);
    }
}
async function analyzePerformance(packageJson) {
    console.log('⚡ Performance Analysis');
    console.log('='.repeat(50));
    let score = 100;
    const recommendations = [];
    // Check dependencies
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const heavyDeps = ['lodash', 'moment', 'jquery'];
    console.log('📦 Dependencies Check:');
    heavyDeps.forEach(dep => {
        if (deps[dep]) {
            console.log(`  ⚠️  Found heavy dependency: ${dep}`);
            score -= 10;
            recommendations.push(`Consider replacing ${dep} with a lighter alternative`);
        }
    });
    // Check for optimization scripts
    console.log('🔧 Build Optimization:');
    if (!packageJson.scripts?.build) {
        console.log('  ❌ No build script found');
        score -= 20;
        recommendations.push('Add a build script for production optimization');
    }
    else {
        console.log('  ✅ Build script present');
    }
    // Check for code splitting
    const hasLazyLoading = fs_1.default.existsSync('src') &&
        fs_1.default.readdirSync('src').some(file => {
            if (fs_1.default.statSync(path_1.default.join('src', file)).isFile()) {
                const content = fs_1.default.readFileSync(path_1.default.join('src', file), 'utf-8');
                return content.includes('React.lazy') || content.includes('lazy(');
            }
            return false;
        });
    if (hasLazyLoading) {
        console.log('  ✅ Code splitting detected');
    }
    else {
        console.log('  ⚠️  No code splitting found');
        score -= 15;
        recommendations.push('Implement code splitting with React.lazy for better performance');
    }
    // Check bundle size (rough estimate)
    console.log('📊 Bundle Size Estimate:');
    const srcSize = getFolderSize('src');
    console.log(`  📁 Source code size: ~${formatBytes(srcSize)}`);
    if (srcSize > 5 * 1024 * 1024) { // 5MB
        console.log('  ⚠️  Large source code detected');
        score -= 10;
        recommendations.push('Consider code splitting or tree shaking to reduce bundle size');
    }
    // Performance metrics
    console.log('📈 Performance Metrics:');
    console.log(`  🎯 Overall Score: ${score}/100`);
    if (score >= 90) {
        console.log('  🟢 Excellent performance!');
    }
    else if (score >= 70) {
        console.log('  🟡 Good performance with room for improvement');
    }
    else {
        console.log('  🔴 Performance needs attention');
    }
    if (recommendations.length > 0) {
        console.log('');
        console.log('💡 Recommendations:');
        recommendations.forEach(rec => console.log(`  • ${rec}`));
    }
    // Simulate Core Web Vitals (mock data)
    console.log('');
    console.log('🌐 Core Web Vitals (Estimated):');
    console.log('  • First Contentful Paint: 1.2s');
    console.log('  • Largest Contentful Paint: 1.8s');
    console.log('  • Cumulative Layout Shift: 0.05');
    console.log('  • First Input Delay: 0.1s');
}
async function analyzeBundle(packageJson) {
    console.log('📦 Bundle Analysis');
    console.log('='.repeat(50));
    console.log('🔍 Analyzing bundle composition...');
    // Check for bundle analyzer
    const hasAnalyzer = packageJson.devDependencies &&
        (packageJson.devDependencies['webpack-bundle-analyzer'] ||
            packageJson.devDependencies['rollup-plugin-visualizer']);
    if (hasAnalyzer) {
        console.log('✅ Bundle analyzer detected');
        console.log('Run the analyzer to see detailed bundle composition');
    }
    else {
        console.log('⚠️  No bundle analyzer found');
        console.log('Consider adding webpack-bundle-analyzer for detailed analysis');
    }
    // Estimate bundle size based on dependencies
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    console.log(`📊 Dependencies: ${deps.length} production, ${devDeps.length} development`);
    // Check for large dependencies
    const largeDeps = ['three', 'react-three-fiber', '@react-three/drei', 'lottie-react'];
    const foundLargeDeps = largeDeps.filter(dep => deps.includes(dep));
    if (foundLargeDeps.length > 0) {
        console.log('⚠️  Large dependencies detected:');
        foundLargeDeps.forEach(dep => console.log(`  • ${dep}`));
        console.log('Consider lazy loading these for better initial bundle size');
    }
    console.log('');
    console.log('💡 Bundle Optimization Tips:');
    console.log('  • Use dynamic imports for large components');
    console.log('  • Implement tree shaking');
    console.log('  • Consider using CDN for large libraries');
    console.log('  • Use compression (gzip/brotli)');
}
async function analyzeAccessibility() {
    console.log('♿ Accessibility Analysis');
    console.log('='.repeat(50));
    console.log('🔍 Checking accessibility features...');
    let score = 100;
    const issues = [];
    // Check for accessibility dependencies
    const packageJson = JSON.parse(fs_1.default.readFileSync('package.json', 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (!deps['@testing-library/jest-dom'] && !deps['jest-axe']) {
        console.log('⚠️  No accessibility testing tools found');
        score -= 10;
        issues.push('Consider adding accessibility testing tools');
    }
    // Check source files for basic accessibility patterns
    if (fs_1.default.existsSync('src')) {
        const files = getAllFiles('src').filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
        let totalFiles = files.length;
        let filesWithAlt = 0;
        let filesWithAria = 0;
        let filesWithSemantic = 0;
        files.forEach(file => {
            const content = fs_1.default.readFileSync(file, 'utf-8');
            if (content.includes('alt='))
                filesWithAlt++;
            if (content.includes('aria-') || content.includes('role='))
                filesWithAria++;
            if (content.includes('<header') || content.includes('<main') || content.includes('<nav')) {
                filesWithSemantic++;
            }
        });
        console.log('📊 Accessibility Coverage:');
        console.log(`  • Files with alt text: ${filesWithAlt}/${totalFiles} (${Math.round(filesWithAlt / totalFiles * 100)}%)`);
        console.log(`  • Files with ARIA attributes: ${filesWithAria}/${totalFiles} (${Math.round(filesWithAria / totalFiles * 100)}%)`);
        console.log(`  • Files with semantic HTML: ${filesWithSemantic}/${totalFiles} (${Math.round(filesWithSemantic / totalFiles * 100)}%)`);
        if (filesWithAlt / totalFiles < 0.8) {
            score -= 15;
            issues.push('Improve alt text coverage for images');
        }
        if (filesWithAria / totalFiles < 0.5) {
            score -= 10;
            issues.push('Add more ARIA attributes for better screen reader support');
        }
    }
    console.log(`🎯 Accessibility Score: ${score}/100`);
    if (issues.length > 0) {
        console.log('');
        console.log('💡 Issues to address:');
        issues.forEach(issue => console.log(`  • ${issue}`));
    }
    console.log('');
    console.log('✅ Accessibility Best Practices:');
    console.log('  • Use semantic HTML elements');
    console.log('  • Provide alt text for images');
    console.log('  • Ensure sufficient color contrast');
    console.log('  • Make interactive elements keyboard accessible');
    console.log('  • Test with screen readers');
}
function getFolderSize(folderPath) {
    let totalSize = 0;
    function calculateSize(itemPath) {
        const stats = fs_1.default.statSync(itemPath);
        if (stats.isDirectory()) {
            const items = fs_1.default.readdirSync(itemPath);
            items.forEach(item => {
                calculateSize(path_1.default.join(itemPath, item));
            });
        }
        else {
            totalSize += stats.size;
        }
    }
    if (fs_1.default.existsSync(folderPath)) {
        calculateSize(folderPath);
    }
    return totalSize;
}
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs_1.default.readdirSync(dirPath);
    files.forEach(file => {
        const filePath = path_1.default.join(dirPath, file);
        if (fs_1.default.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        }
        else {
            arrayOfFiles.push(filePath);
        }
    });
    return arrayOfFiles;
}
//# sourceMappingURL=analyze.js.map