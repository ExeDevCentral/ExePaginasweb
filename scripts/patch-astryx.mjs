import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packages = [
  ['@astryxdesign/theme-neutral', 'theme.css', './dist/theme.css'],
  ['@astryxdesign/core', 'astryx.css', './dist/astryx.css']
];

for (const [pkgName, fileKey, distPath] of packages) {
  try {
    const pkgPath = path.join(__dirname, '..', 'node_modules', pkgName, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const data = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (data.exports && data.exports['./' + fileKey]) {
        data.exports['./' + fileKey].style = distPath;
        fs.writeFileSync(pkgPath, JSON.stringify(data, null, 2) + '\n');
      }
    }
  } catch (err) {
    console.error(`[patch-astryx] Warning: could not patch ${pkgName}:`, err.message);
  }
}
