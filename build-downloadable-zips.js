import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const PUBLIC_DOWNLOADS_DIR = path.join(ROOT_DIR, 'public', 'downloads');

// Ensure downloads directory exists
if (!fs.existsSync(PUBLIC_DOWNLOADS_DIR)) {
  fs.mkdirSync(PUBLIC_DOWNLOADS_DIR, { recursive: true });
}

function addDirectoryToZip(zip, dirPath, rootDir, ignoredDirs = []) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    if (ignoredDirs.includes(item)) continue;
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

    if (stat.isDirectory()) {
      addDirectoryToZip(zip, fullPath, rootDir, ignoredDirs);
    } else {
      // Don't zip zip files inside public/downloads
      if (fullPath.includes(path.join('public', 'downloads'))) continue;
      // Skip enormous lock/cache files if needed, but keep package.json, src, etc.
      if (item === 'bun.lock' || item.endsWith('.log')) continue;
      const content = fs.readFileSync(fullPath);
      zip.file(relPath, content);
    }
  }
}

async function createZips() {
  console.log('⚡ 1. Building Vite production bundle for GitHub hosting...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('📦 2. Creating Full Source Code ZIP (for GitHub repository)...');
  const sourceZip = new JSZip();
  const ignored = ['node_modules', '.git', 'dist', '.aistudio', '.cache', '.temp'];
  addDirectoryToZip(sourceZip, ROOT_DIR, ROOT_DIR, ignored);

  const sourceBuffer = await sourceZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  const sourceZipPath = path.join(PUBLIC_DOWNLOADS_DIR, 'televideo-pro-source.zip');
  fs.writeFileSync(sourceZipPath, sourceBuffer);
  console.log(`✅ Source ZIP created: ${(sourceBuffer.length / (1024 * 1024)).toFixed(2)} MB -> ${sourceZipPath}`);

  console.log('🚀 3. Creating Pre-built Dist ZIP (direct GitHub Pages / Hosting drop)...');
  const distDir = path.join(ROOT_DIR, 'dist');
  if (fs.existsSync(distDir)) {
    const distZip = new JSZip();
    addDirectoryToZip(distZip, distDir, distDir, []);
    const distBuffer = await distZip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    const distZipPath = path.join(PUBLIC_DOWNLOADS_DIR, 'televideo-pro-gh-pages-dist.zip');
    fs.writeFileSync(distZipPath, distBuffer);
    console.log(`✅ Dist ZIP created: ${(distBuffer.length / (1024 * 1024)).toFixed(2)} MB -> ${distZipPath}`);
  }

  console.log('🎉 All download archives created successfully in public/downloads/!');
}

createZips().catch((err) => {
  console.error('Error generating zips:', err);
  process.exit(1);
});
