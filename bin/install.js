#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const os = require('os');

const SKILL_NAME = 'legal-docs-skill';
const SOURCE_DIR = path.join(__dirname, '..');
const TARGET_DIR = path.join(os.homedir(), '.claude', 'skills', SKILL_NAME);
const SKILL_FILES = ['SKILL.md', 'references'];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

try {
  fs.mkdirSync(TARGET_DIR, { recursive: true });

  for (const file of SKILL_FILES) {
    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(TARGET_DIR, file);
    if (fs.existsSync(src)) {
      copyRecursive(src, dest);
    }
  }

  console.log(`\n✓ Installed ${SKILL_NAME} to ${TARGET_DIR}`);
  console.log('  Restart Claude Code and the skill will be available.\n');
} catch (err) {
  console.error(`\n✗ Failed to install skill: ${err.message}`);
  console.error(`  Try manually copying the skill folder to ~/.claude/skills/${SKILL_NAME}\n`);
  process.exit(1);
}
