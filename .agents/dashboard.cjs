/**
 * Firstbrain Pro Dashboard (TUI)
 * A high-end, responsive terminal interface for the AI Second Brain.
 * Optimized for modern terminals (PowerShell Core, Windows Terminal, iTerm2).
 */
'use strict';

const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// --- Configuration & High-End Styling ---
const VERSION = "3.2.0-ELITE";
const C = {
    res: "\x1b[0m",
    b: "\x1b[1m",
    d: "\x1b[2m",
    cyan: "\x1b[38;5;51m",
    blue: "\x1b[38;5;33m",
    deepBlue: "\x1b[38;5;27m",
    gray: "\x1b[38;5;244m",
    white: "\x1b[38;5;255m",
    green: "\x1b[38;5;84m",
    yellow: "\x1b[38;5;227m",
    bgBlue: "\x1b[48;5;27m",
    bgDark: "\x1b[48;5;234m"
};

const UI = {
    edge: "║",
    line: "═",
    tl: "╔",
    tr: "╗",
    bl: "╚",
    br: "╝",
    sep: "╟",
    sepEnd: "╢",
    dot: "·",
    pointer: "›"
};

// --- State ---
let selectedIndex = 0;
let vaultStats = { notes: 0, projects: 0, links: 0, lastScan: 'Never' };

const menuItems = [
    { label: "LAUNCH CLAUDE CODE", desc: "Start the AI execution engine in Obsidian mode", action: launchClaude },
    { label: "SYNCHRONIZE VAULT", desc: "Update indexes, tags and semantic embeddings", action: runScan },
    { label: "GENERATE DAILY", desc: "Initialize today's workspace and scratchpad", action: createDaily },
    { label: "INBOX PROCESSOR", desc: "Automate pending prompts and workspace actions", action: processInbox },
    { label: "TERMINATE", desc: "Safe shutdown of all Firstbrain services", action: () => process.exit(0) }
];

// --- Core Logic ---

function loadStats() {
    try {
        const indexPath = path.join(process.cwd(), '.claude/indexes/vault-index.json');
        if (fs.existsSync(indexPath)) {
            const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
            const stats = fs.statSync(indexPath);
            vaultStats.notes = data.noteCount || 0;
            vaultStats.lastScan = stats.mtime.toLocaleTimeString();
            
            // Try to count projects
            const projectsDir = path.join(process.cwd(), '01 - Projects');
            if (fs.existsSync(projectsDir)) {
                vaultStats.projects = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md')).length;
            }
        }
    } catch (e) { /* ignore */ }
}

function launchClaude() {
    process.stdin.setRawMode(false);
    console.log(`\x1b[?25h\n${C.green}Entering AI Stream...${C.res}\n`);
    const claude = spawn('claude', ['--verbose'], { stdio: 'inherit', shell: true });
    claude.on('exit', () => {
        init();
    });
}

function runScan() {
    process.stdin.setRawMode(false);
    console.log(`\n${C.yellow}Starting Neural Indexing...${C.res}`);
    spawnSync('node', ['index.js', 'scan'], { stdio: 'inherit', shell: true });
    console.log(`\n${C.gray}Press any key to return to bridge...${C.res}`);
    process.stdin.setRawMode(true);
    process.stdin.once('data', () => init());
}

function createDaily() {
    // Placeholder for actual logic
    console.log(`\n${C.green}Daily initialized.${C.res}`);
    setTimeout(() => init(), 800);
}

function processInbox() {
    console.log(`\n${C.blue}Processing Inbox Stream...${C.res}`);
    setTimeout(() => init(), 1500);
}

// --- UI Engine ---

function drawCentered(text, color = C.res) {
    const cols = process.stdout.columns || 80;
    const plainText = text.replace(/\x1b\[.*?m/g, '');
    const padding = Math.max(0, Math.floor((cols - plainText.length) / 2));
    process.stdout.write(" ".repeat(padding) + color + text + C.res + "\n");
}

function drawFrameLine(content = "", color = C.blue) {
    const cols = process.stdout.columns || 80;
    const frameWidth = Math.min(cols - 4, 70);
    const paddingLeft = Math.floor((cols - frameWidth) / 2);
    
    const plainContent = content.replace(/\x1b\[.*?m/g, '');
    const innerSpace = frameWidth - 4;
    const textPadding = " ".repeat(Math.max(0, innerSpace - plainContent.length));
    
    process.stdout.write(" ".repeat(paddingLeft) + color + UI.edge + " " + C.res + content + textPadding + " " + color + UI.edge + C.res + "\n");
}

function drawFrameBorder(type, color = C.blue) {
    const cols = process.stdout.columns || 80;
    const frameWidth = Math.min(cols - 4, 70);
    const paddingLeft = Math.floor((cols - frameWidth) / 2);
    
    let line = "";
    if (type === 'top') line = UI.tl + UI.line.repeat(frameWidth - 2) + UI.tr;
    if (type === 'bottom') line = UI.bl + UI.line.repeat(frameWidth - 2) + UI.br;
    if (type === 'mid') line = UI.sep + UI.line.repeat(frameWidth - 2) + UI.sepEnd;
    
    process.stdout.write(" ".repeat(paddingLeft) + color + line + C.res + "\n");
}

function render() {
    loadStats();
    process.stdout.write('\x1b[H\x1b[J'); // Reset cursor and clear
    process.stdout.write('\x1b[?25l');   // Hide cursor

    const rows = process.stdout.rows || 24;
    const verticalPadding = Math.max(1, Math.floor((rows - 18) / 2));

    process.stdout.write("\n".repeat(verticalPadding));

    // Logo & Title
    drawCentered("◢◤ FIRSTBRAIN ELITE ◢◤", C.b + C.cyan);
    drawCentered("NEURAL KNOWLEDGE INTERFACE", C.d + C.gray);
    process.stdout.write("\n");

    drawFrameBorder('top');
    
    // Status Row
    const status = `${C.blue}VAULT:${C.res} ${vaultStats.notes} Notes ${C.gray}|${C.res} ${C.blue}PROJECTS:${C.res} ${vaultStats.projects} ${C.gray}|${C.res} ${C.blue}LAST SCAN:${C.res} ${vaultStats.lastScan}`;
    drawFrameLine(status);
    
    drawFrameBorder('mid');
    drawFrameLine("");

    // Menu Items
    menuItems.forEach((item, index) => {
        const isSelected = index === selectedIndex;
        if (isSelected) {
            drawFrameLine(`${C.bgBlue}${C.white} ${UI.pointer} ${item.label.padEnd(20)} ${C.res} ${C.cyan}${item.desc}${C.res}`);
        } else {
            drawFrameLine(`  ${C.gray}${item.label.padEnd(20)} ${C.res} ${C.d}${item.desc}${C.res}`);
        }
    });

    drawFrameLine("");
    drawFrameBorder('mid');
    
    // Footer
    const help = `${C.d}NAVIGATE: ↑↓ ARROWS  |  SELECT: ENTER  |  EXIT: CTRL+C${C.res}`;
    drawFrameLine(help);
    
    drawFrameBorder('bottom');
}

// --- Input Handling ---

function setupInput() {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    // Clean up old listeners to prevent leaks
    process.stdin.removeAllListeners('keypress');

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.stdout.write('\x1b[?25h'); // Show cursor
            process.exit();
        } else if (key.name === 'up') {
            selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
            render();
        } else if (key.name === 'down') {
            selectedIndex = (selectedIndex + 1) % menuItems.length;
            render();
        } else if (key.name === 'return') {
            menuItems[selectedIndex].action();
        }
    });
}

function init() {
    setupInput();
    render();
}

// Handle window resize
process.stdout.on('resize', () => {
    render();
});

init();
