const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

const file = path.resolve(__dirname, '../src/app/(auth)/login/page.jsx');
const src = fs.readFileSync(file, 'utf8');

try {
  parser.parse(src, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'classProperties',
      'objectRestSpread',
      'dynamicImport',
    ],
  });
  console.log('Parsed successfully (no syntax errors found by @babel/parser).');
} catch (err) {
  console.error('Parse error:');
  console.error(err.message);
  if (err.loc) {
    console.error(`Line: ${err.loc.line}, Column: ${err.loc.column}`);
  }
  process.exitCode = 1;
}
