'use strict';

const fs = require('fs');
const path = require('path');

let pass = 0;
let fail = 0;
const failures = [];

function check(name, condition) {
  if (condition) {
    pass++;
  } else {
    fail++;
    failures.push(name);
  }
}

// Use process.cwd() to resolve the vault root since __dirname is inside .planning/
const VAULT_ROOT = process.cwd();

// ============================================================
// 1. Module Loading Tests
// ============================================================
let createUtils, dailyUtils, connectUtils, healthUtils;
try {
  createUtils = require(path.join(VAULT_ROOT, '.agents/skills/create/create-utils.cjs'));
  check('create-utils.cjs loads', true);
} catch (e) { check('create-utils.cjs loads: ' + e.message, false); }

try {
  dailyUtils = require(path.join(VAULT_ROOT, '.agents/skills/daily/daily-utils.cjs'));
  check('daily-utils.cjs loads', true);
} catch (e) { check('daily-utils.cjs loads: ' + e.message, false); }

try {
  connectUtils = require(path.join(VAULT_ROOT, '.agents/skills/connect/connect-utils.cjs'));
  check('connect-utils.cjs loads', true);
} catch (e) { check('connect-utils.cjs loads: ' + e.message, false); }

try {
  healthUtils = require(path.join(VAULT_ROOT, '.agents/skills/health/health-utils.cjs'));
  check('health-utils.cjs loads', true);
} catch (e) { check('health-utils.cjs loads: ' + e.message, false); }

// ============================================================
// 2. Create-Utils Tests
// ============================================================
if (createUtils) {
  const types = ['project','area','resource','tool','zettel','person','decision','meeting','code-snippet','daily','weekly','monthly'];
  let allMapped = true;
  for (const t of types) {
    const info = createUtils.getTemplateInfo(t);
    if (!info || !info.template || !info.folder) { allMapped = false; failures.push('getTemplateInfo missing: ' + t); fail++; }
  }
  if (allMapped) check('getTemplateInfo covers all 12 types', true);

  check('buildFileName(tool, Docker) -> Tool -- Docker.md',
    createUtils.buildFileName('tool', 'Docker', '2026-03-07') === 'Tool -- Docker.md');
  check('buildFileName(daily) -> 2026-03-07.md',
    createUtils.buildFileName('daily', '', '2026-03-07') === '2026-03-07.md');
  check('buildFileName(meeting, Standup) -> Meeting -- Standup 2026-03-07.md',
    createUtils.buildFileName('meeting', 'Standup', '2026-03-07') === 'Meeting -- Standup 2026-03-07.md');
  check('buildFileName(code-snippet, React Hook) -> Snippet -- React Hook.md',
    createUtils.buildFileName('code-snippet', 'React Hook', '2026-03-07') === 'Snippet -- React Hook.md');

  const jan1 = createUtils.getDateVars('2026-01-01');
  check('getDateVars year boundary: yesterday=2025-12-31', jan1.yesterday === '2025-12-31');

  const mar1 = createUtils.getDateVars('2026-03-01');
  check('getDateVars month boundary: yesterday=2026-02-28', mar1.yesterday === '2026-02-28');

  const mar7 = createUtils.getDateVars('2026-03-07');
  check('getDateVars normal: tomorrow=2026-03-08', mar7.tomorrow === '2026-03-08');

  const tpl = '{{date}} {{title}} {{time}} {{yesterday}} {{tomorrow}}';
  const vars = { date: '2026-03-07', title: 'Test', time: '14:30', yesterday: '2026-03-06', tomorrow: '2026-03-08' };
  const subbed = createUtils.substituteVariables(tpl, vars);
  check('substituteVariables replaces all standard patterns', !subbed.includes('{{') && !subbed.includes('}}'));

  const mmmm = createUtils.substituteVariables('{{date:MMMM YYYY}}', { date: '2026-03-07' });
  check('substituteVariables MMMM YYYY -> March 2026', mmmm === 'March 2026');

  const ww = createUtils.substituteVariables('{{date:ww}}', { date: '2026-03-07' });
  const weekNum = parseInt(ww);
  check('substituteVariables ww -> valid ISO week', weekNum >= 1 && weekNum <= 53);
}

// ============================================================
// 3. Daily-Utils Tests
// ============================================================
if (dailyUtils) {
  const items = [
    { text: 'Buy milk', source: '2026-03-06', formatted: '- [ ] Buy milk (from [[2026-03-06]])' }
  ];
  const section = dailyUtils.formatRolloverSection(items);
  check('formatRolloverSection with items produces Rolled Over section',
    section.includes('## Rolled Over') && section.includes('Buy milk'));

  check('formatRolloverSection with empty array returns empty string',
    dailyUtils.formatRolloverSection([]) === '');

  const existing = '## Rolled Over\n\n- [ ] Old item (from [[2026-03-05]])\n\n## Connections';
  const newItems = [
    { text: 'New item', source: '2026-03-06', formatted: '- [ ] New item (from [[2026-03-06]])' }
  ];
  const merged = dailyUtils.mergeRolloverItems(existing, newItems);
  check('mergeRolloverItems adds new items to existing section',
    merged.includes('New item') && merged.includes('Old item'));

  const noRollover = '# Daily Note\n\nSome content\n\n## Connections';
  const merged2 = dailyUtils.mergeRolloverItems(noRollover, newItems);
  check('mergeRolloverItems creates section when none exists',
    merged2.includes('## Rolled Over') && merged2.includes('New item'));

  check('dailyUtils.getDateVars is re-exported function',
    typeof dailyUtils.getDateVars === 'function');
}

// ============================================================
// 4. Connect-Utils Tests
// ============================================================
if (connectUtils) {
  const suggestions = [
    { path: 'a.md', name: 'Note A', score: 3, evidence: ['shared tag: #test'], confidence: 'high' },
    { path: 'b.md', name: 'Note B', score: 1, evidence: ['shared tag: #dev'], confidence: 'low' },
  ];
  const formatted = connectUtils.formatConnectionSuggestions(suggestions);
  check('formatConnectionSuggestions produces numbered list with confidence',
    formatted.includes('1.') && formatted.includes('high confidence') && formatted.includes('low confidence'));

  const mockVaultIndex = {
    notes: {
      'a.md': { name: 'Note A', allTags: ['test', 'dev'], links: [], isTemplate: false },
      'b.md': { name: 'Note B', allTags: ['test'], links: [], isTemplate: false },
      'c.md': { name: 'Note C', allTags: ['other'], links: [], isTemplate: false },
      '05 - Templates/t.md': { name: 'Template', allTags: ['test'], links: [], isTemplate: true },
      '06 - Atlas/MOCs/m.md': { name: 'Test MOC', allTags: ['test'], links: [], isTemplate: false },
    }
  };
  const mockLinkMap = { links: [] };
  const mockTagIndex = { tags: { 'test': ['a.md', 'b.md', '05 - Templates/t.md', '06 - Atlas/MOCs/m.md'], 'dev': ['a.md'], 'other': ['c.md'] } };
  const connections = connectUtils.findConnections('a.md', mockVaultIndex, mockLinkMap, mockTagIndex);
  check('findConnections returns scored results', Array.isArray(connections) && connections.length > 0 && connections[0].score > 0);

  const connNames = connections.map(c => c.name);
  check('findConnections filters out templates and MOCs',
    !connNames.includes('Template') && !connNames.includes('Test MOC'));
}

// ============================================================
// 5. Health-Utils Tests
// ============================================================
if (healthUtils) {
  check('levenshtein(docker, docekr) <= 2', healthUtils.levenshtein('docker', 'docekr') <= 2);
  check('levenshtein(same, same) === 0', healthUtils.levenshtein('same', 'same') === 0);
  check('levenshtein("", abc) === 3', healthUtils.levenshtein('', 'abc') === 3);

  check('classifyFix single match dist<=1 -> auto',
    healthUtils.classifyFix([{ name: 'Docker', distance: 1 }]).action === 'auto');
  check('classifyFix two matches -> propose',
    healthUtils.classifyFix([{ name: 'A', distance: 1 }, { name: 'B', distance: 1 }]).action === 'propose');
  check('classifyFix empty -> manual',
    healthUtils.classifyFix([]).action === 'manual');

  const fixes = healthUtils.suggestFixes('Docekr', ['Docker', 'Docker Compose', 'Git']);
  check('suggestFixes(Docekr) includes Docker',
    fixes.map(f => f.name).includes('Docker'));
}

// ============================================================
// 6. SKILL.md Verification
// ============================================================
const vaultRoot = VAULT_ROOT;
const skillFiles = [
  '.agents/skills/create/SKILL.md',
  '.agents/skills/daily/SKILL.md',
  '.agents/skills/connect/SKILL.md',
  '.agents/skills/health/SKILL.md',
  '.agents/skills/scan/SKILL.md',
];

for (const sf of skillFiles) {
  check(sf + ' exists', fs.existsSync(path.join(vaultRoot, sf)));
}

for (const sf of skillFiles.slice(0, 4)) {
  const content = fs.readFileSync(path.join(vaultRoot, sf), 'utf8');
  check(sf + ' has name, trigger, description, version',
    content.includes('name:') && content.includes('trigger:') && content.includes('description:') && content.includes('version:'));
}

const pairs = [
  ['create', 'create-utils.cjs'],
  ['daily', 'daily-utils.cjs'],
  ['connect', 'connect-utils.cjs'],
  ['health', 'health-utils.cjs'],
];
for (const [skill, utils] of pairs) {
  const content = fs.readFileSync(path.join(vaultRoot, '.agents/skills', skill, 'SKILL.md'), 'utf8');
  check('/' + skill + ' SKILL.md references ' + utils, content.includes(utils));
}

// ============================================================
// 7. Memory System Verification
// ============================================================
check('MEMORY.md exists', fs.existsSync(path.join(vaultRoot, 'MEMORY.md')));
const memContent = fs.readFileSync(path.join(vaultRoot, 'MEMORY.md'), 'utf8');
const memLines = memContent.split('\n').length;
check('MEMORY.md under 50 lines (' + memLines + ')', memLines <= 50);
check('MEMORY.md has frontmatter', memContent.startsWith('---'));

check('.claude/memory/projects.md exists', fs.existsSync(path.join(vaultRoot, '.claude/memory/projects.md')));
check('.claude/memory/projects.md has frontmatter',
  fs.readFileSync(path.join(vaultRoot, '.claude/memory/projects.md'), 'utf8').startsWith('---'));

check('.claude/memory/preferences.md exists', fs.existsSync(path.join(vaultRoot, '.claude/memory/preferences.md')));
check('.claude/memory/preferences.md has frontmatter',
  fs.readFileSync(path.join(vaultRoot, '.claude/memory/preferences.md'), 'utf8').startsWith('---'));

check('MEMORY.md links to projects.md', memContent.includes('projects.md'));
check('MEMORY.md links to preferences.md', memContent.includes('preferences.md'));

const claudeContent = fs.readFileSync(path.join(vaultRoot, 'CLAUDE.md'), 'utf8');
check('CLAUDE.md contains Layer 1', claudeContent.includes('Layer 1'));
check('CLAUDE.md contains Layer 2', claudeContent.includes('Layer 2'));
check('CLAUDE.md contains Layer 3', claudeContent.includes('Layer 3'));
check('CLAUDE.md contains Layer 4', claudeContent.includes('Layer 4'));
check('CLAUDE.md contains Phase 4 stub', claudeContent.includes('Phase 4 stub'));
check('CLAUDE.md contains Session startup', claudeContent.includes('Session startup'));
check('CLAUDE.md contains Memory writes', claudeContent.includes('Memory writes'));

// ============================================================
// 8. Integration Tests (using actual vault data)
// ============================================================
const { scan } = require(path.join(VAULT_ROOT, '.agents/skills/scan/scanner.cjs'));
const { loadJson } = require(path.join(VAULT_ROOT, '.agents/skills/scan/utils.cjs'));

try {
  const result = scan(vaultRoot);
  check('scan(.) runs successfully', result && typeof result.total === 'number');
} catch (e) {
  check('scan(.) runs: ' + e.message, false);
}

const indexDir = path.join(vaultRoot, '.claude', 'indexes');
const vi = loadJson(path.join(indexDir, 'vault-index.json'));
const lm = loadJson(path.join(indexDir, 'link-map.json'));
const ti = loadJson(path.join(indexDir, 'tag-index.json'));

check('vault-index.json loaded', vi && vi.notes);
check('link-map.json loaded', lm && lm.links);
check('tag-index.json loaded', ti && ti.tags);

if (vi && lm && ti) {
  // findConnections with real data
  const notePaths = Object.keys(vi.notes).filter(p => !vi.notes[p].isTemplate && !p.startsWith('06 -'));
  if (notePaths.length > 0) {
    const realConns = connectUtils.findConnections(notePaths[0], vi, lm, ti);
    check('findConnections with real vault data returns array', Array.isArray(realConns));
  }

  // analyzeHealth with real data
  const health = healthUtils.analyzeHealth(vi, lm);
  check('analyzeHealth returns orphans array', Array.isArray(health.orphans));
  check('analyzeHealth returns brokenLinks array', Array.isArray(health.brokenLinks));
  check('analyzeHealth orphanCount is non-negative', health.stats.orphanCount >= 0);
  check('analyzeHealth brokenLinkCount is non-negative', health.stats.brokenLinkCount >= 0);
}

// ============================================================
// Summary
// ============================================================
console.log('');
console.log('============================');
console.log(pass + '/' + (pass + fail) + ' checks passed');
if (fail > 0) {
  console.log('');
  console.log('Failed:');
  for (const f of failures) console.log('  FAIL: ' + f);
} else {
  console.log('All checks passed!');
}
console.log('============================');

process.exit(fail > 0 ? 1 : 0);
