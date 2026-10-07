import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) results = results.concat(walk(full));
    else if (full.endsWith('.jsx')) results.push(full);
  });
  return results;
}

const files = walk('./src');
const issues = [];

files.forEach(filePath => {
  const code = fs.readFileSync(filePath, 'utf8');
  
  // Extract all imported identifiers
  const importedIdentifiers = new Set();
  const importMatches = code.matchAll(/import\s+(?:([\w$]+)\s*,?\s*)?(?:\{([^}]+)\})?(?:\s*\* as ([\w$]+))?\s+from/g);
  for (const m of importMatches) {
    if (m[1]) importedIdentifiers.add(m[1].trim());
    if (m[2]) {
      m[2].split(',').forEach(item => {
        const parts = item.trim().split(/\s+as\s+/);
        const name = parts[parts.length - 1].trim();
        if (name) importedIdentifiers.add(name);
      });
    }
    if (m[3]) importedIdentifiers.add(m[3].trim());
  }

  // Extract all declared identifiers (functions, classes, const, let, var)
  const declaredMatches = code.matchAll(/\b(?:const|let|var|function|class)\s+([A-Z][a-zA-Z0-9_]*)\b/g);
  for (const m of declaredMatches) {
    importedIdentifiers.add(m[1]);
  }

  // Common React/browser globals that are safe
  const allowed = new Set([
    'React', 'Fragment', 'Suspense', 'StrictMode',
    'Intl', 'Math', 'JSON', 'Date', 'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp', 'Map', 'Set', 'Promise', 'Error', 'Console'
  ]);

  // Find all JSX elements <Name or <Name.Property
  const jsxTagMatches = code.matchAll(/<([A-Z][a-zA-Z0-9_]*)/g);
  for (const m of jsxTagMatches) {
    const tag = m[1];
    if (!importedIdentifiers.has(tag) && !allowed.has(tag)) {
      issues.push({ file: filePath, tag });
    }
  }

  // Find all icon props e.g. leftIcon={<Icon or rightIcon={<Icon or icon={<Icon
  const iconPropMatches = code.matchAll(/(?:icon|leftIcon|rightIcon)=\{\s*<([A-Z][a-zA-Z0-9_]*)/g);
  for (const m of iconPropMatches) {
    const tag = m[1];
    if (!importedIdentifiers.has(tag) && !allowed.has(tag)) {
      issues.push({ file: filePath, tag, context: 'prop' });
    }
  }
});

if (issues.length === 0) {
  console.log('✓ All JSX tags and icons are properly imported across all .jsx files!');
} else {
  console.log('ISSUES FOUND:');
  issues.forEach(i => console.log(`  ${i.file}: Missing "${i.tag}"`));
}
