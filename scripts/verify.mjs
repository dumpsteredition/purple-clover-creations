import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = ['index.html', 'styles.css', 'script.js'];
const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length) {
  console.error(`Missing files: ${missing.join(', ')}`);
  process.exit(1);
}

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');
const js = readFileSync('script.js', 'utf8');

const requiredIds = ['top', 'shelf', 'gallery', 'how', 'secret', 'maker', 'inquiry', 'faq'];
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
    console.error(`Missing required section id: ${id}`);
    process.exit(1);
  }
}

const requiredCopy = [
  'Purple Clover Creations',
  'Little friends',
  'Peek inside the yarn basket',
  'Tell us what little friend',
  'grown-up help',
];
for (const phrase of requiredCopy) {
  if (!html.includes(phrase)) {
    console.error(`Missing required phrase: ${phrase}`);
    process.exit(1);
  }
}

const interactionHooks = ['yarnBall', 'secretPanel', 'dreamForm'];
for (const hook of interactionHooks) {
  if (!html.includes(hook) && !js.includes(hook)) {
    console.error(`Missing interaction hook: ${hook}`);
    process.exit(1);
  }
}

if (!css.includes('.reveal{opacity:1')) {
  console.error('Reveal content must be visible by default for screenshot-safe rendering.');
  process.exit(1);
}

console.log('verify: ok');
