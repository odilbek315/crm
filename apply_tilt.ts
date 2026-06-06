import * as fs from 'fs';
import * as path from 'path';

function applyTiltCard(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('import { TiltCard }')) {
    // Find the last import and insert TiltCard import
    const importMatch = content.match(/^import .*? from .*?;?$/gm);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      let relativePath = '../components/ui/TiltCard';
      if (filePath.includes('pages\\')) {
         relativePath = '../components/ui/TiltCard';
      }
      content = content.replace(lastImport, `${lastImport}\nimport { TiltCard } from '${relativePath}';`);
    }
  }

  // Very simplistic replacement: replace `<div className="glass-card...` with `<TiltCard className="glass-card...`
  // We have to be careful about closing tags.
  // Instead of full AST parsing, I'll use regex for self-contained blocks if possible, 
  // but wait, standard replacing of <div to <TiltCard and matching </div> is impossible with pure regex.

  // Let's use string manipulation to find `<div className="glass-card` and its matching `</div>`
  let startIndex = 0;
  while ((startIndex = content.indexOf('<div className="glass-card', startIndex)) !== -1) {
    let tagCount = 1;
    let i = startIndex + 4; // after `<div`
    let foundEnd = false;
    
    while (i < content.length) {
      if (content.substring(i, i + 4) === '<div') {
        tagCount++;
        i += 4;
      } else if (content.substring(i, i + 6) === '</div>') {
        tagCount--;
        if (tagCount === 0) {
          // Found the matching closing tag
          content = content.substring(0, i) + '</TiltCard>' + content.substring(i + 6);
          content = content.substring(0, startIndex) + '<TiltCard' + content.substring(startIndex + 4);
          foundEnd = true;
          break;
        }
        i += 6;
      } else {
        i++;
      }
    }
    if (foundEnd) {
      startIndex += 10; // advance past `<TiltCard`
    } else {
      startIndex += 20; // fallback
    }
  }

  // Also replace 'glass-card border' with 'p-6 flex flex-col' if we want to remove padding from inner, or keep it.
  // Actually, TiltCard applies 'glass-card' internally, so we don't need 'glass-card' on the wrapper if we pass it, but passing className="glass-card..." is fine since TiltCard merges them.
  
  fs.writeFileSync(filePath, content);
  console.log(`Applied TiltCard to ${filePath}`);
}

const filesToProcess = [
  'src/pages/DashboardPage.tsx',
  'src/pages/BusinessGraphPage.tsx',
  'src/pages/ExecutiveCopilotPage.tsx',
  'src/pages/OrgHealthPage.tsx'
];

for (const file of filesToProcess) {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    applyTiltCard(fullPath);
  }
}
