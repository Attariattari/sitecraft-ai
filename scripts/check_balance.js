const fs = require('fs');
const path = 'e:/sitecraft-ai/src/app/(auth)/login/page.jsx';
const s = fs.readFileSync(path, 'utf8');
let braces = 0, parens = 0, sq = 0, dq = 0;
for (let i = 0; i < s.length; i++) {
  const c = s[i];
  if (c === '{') braces++;
  if (c === '}') braces--;
  if (c === '(') parens++;
  if (c === ')') parens--;
  if (c === "'") sq++;
  if (c === '"') dq++;
}
console.log('braces:', braces, 'parens:', parens, "singleQuotes:", sq, "doubleQuotes:", dq);
console.log('last200chars:\n', s.slice(-200));
