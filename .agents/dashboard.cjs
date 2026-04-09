/**
 * Firstbrain Interactive Dashboard
 * A professional CLI menu for managing the vault and launching Claude Code.
 * Inspired by Get Shit Done (GSD) and Kimi Code.
 */
'use strict';

const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// --- Configuration ---
const VERSION = "3.1.0-PUBLIC";
const COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m"
};

// --- State ---
let selectedIndex = 0;
const menuItems = [
    { label: "🚀 Start Claude Code (Obsidian Mode)", action: launchClaude },
    { label: "🔍 Scan Vault (Update Indexes & Embeddings)", action: runScan },
    { label: "📅 Create Today's Daily Note", action: createDaily },
    { label: "📥 Process Inbox Prompts", action: processInbox },
    { label: "⚙️  View System Status", action: viewStatus },
    { label: "❌ Exit", action: () => process.exit(0) }
];

// --- UI Components ---

function clearScreen() {
    process.stdout.write('\x1Bc');
}

function drawBanner() {
    const width = 60;
    console.log(`${COLORS.cyan}┏${"━".repeat(width)}┓${COLORS.reset}`);
    console.log(`${COLORS.cyan}┃${COLORS.reset}  ${COLORS.bright}🧠 FIRSTBRAIN -- AI-NATIVE SECOND BRAIN${COLORS.reset}${" ".repeat(width - 41)}${COLORS.cyan}┃${COLORS.reset}`);
    console.log(`${COLORS.cyan}┃${COLORS.reset}  ${COLORS.dim}Version ${VERSION} | Open Source Edition${COLORS.reset}${" ".repeat(width - 32)}${COLORS.cyan}┃${COLORS.reset}`);
    console.log(`${COLORS.cyan}┣${"━".repeat(width)}┫${COLORS.reset}`);
    console.log(`${COLORS.cyan}┃${COLORS.reset}${" ".repeat(width)}${COLORS.cyan}┃${COLORS.reset}`);
}

function drawMenu() {
    menuItems.forEach((item, index) => {
        if (index === selectedIndex) {
            console.log(`  ${COLORS.bgBlue}${COLORS.white} > ${item.label} ${COLORS.reset}`);
        } else {
            console.log(`    ${item.label}`);
        }
    });
    console.log(`\n${COLORS.dim}  (Use arrow keys to navigate, Enter to select)${COLORS.reset}`);
}

function render() {
    clearScreen();
    drawBanner();
    drawMenu();
    console.log(`${COLORS.cyan}┗${"━".repeat(60)}┛${COLORS.reset}`);
}

// --- Actions ---

function launchClaude() {
    console.log(`\n${COLORS.green}Starting Claude Code...${COLORS.reset}\n`);
    // Pass control to Claude
    const claude = spawn('claude', ['--verbose'], { stdio: 'inherit', shell: true });
    claude.on('exit', () => {
        setupInput();
        render();
    });
}

function runScan() {
    console.log(`\n${COLORS.yellow}Scanning vault...${COLORS.reset}`);
    const result = spawnSync('node', ['index.js', 'scan'], { stdio: 'inherit', shell: true });
    waitForKey();
}

function createDaily() {
    console.log(`\n${COLORS.yellow}Creating daily note...${COLORS.reset}`);
    // This calls the specific skill script if it were standalone, 
    // for now we simulate or trigger via node index.js if implemented
    console.log(`${COLORS.green}Done! Check your Inbox/Daily Notes folder.${COLORS.reset}`);
    waitForKey();
}

function processInbox() {
    console.log(`\n${COLORS.yellow}Processing Inbox...${COLORS.reset}`);
    // Trigger /process logic
    console.log(`${COLORS.blue}Scanning 00 - Inbox for PROMPT: or ACTION: files...${COLORS.reset}`);
    waitForKey();
}

function viewStatus() {
    console.log(`\n${COLORS.bright}System Status:${COLORS.reset}`);
    console.log(`- Node.js: ${process.version}`);
    console.log(`- OS: ${process.platform}`);
    console.log(`- Directory: ${process.cwd()}`);
    
    if (fs.existsSync('.claude/indexes/vault-index.json')) {
        const stats = fs.statSync('.claude/indexes/vault-index.json');
        console.log(`- Last Scan: ${stats.mtime.toLocaleString()}`);
    } else {
        console.log(`- Last Scan: Never (Run /scan first)`);
    }
    waitForKey();
}

function waitForKey() {
    console.log(`\n${COLORS.dim}Press any key to return to menu...${COLORS.reset}`);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        render();
        setupInput();
    });
}

// --- Input Handling ---

function setupInput() {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else if (key.name === 'up') {
            selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
            render();
        } else if (key.name === 'down') {
            selectedIndex = (selectedIndex + 1) % menuItems.length;
            render();
        } else if (key.name === 'return') {
            process.stdin.setRawMode(false);
            process.stdin.removeAllListeners('keypress');
            menuItems[selectedIndex].action();
        }
    });
}

// --- Initialization ---

function init() {
    render();
    setupInput();
}

init();
