/**
 * Firstbrain Elite Dashboard (v3.3)
 * High-End Neural Interface with surgical precision.
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// --- Pro Styling (ANSI 256) ---
const C = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    cyan: "\x1b[38;5;51m",
    blue: "\x1b[38;5;33m",
    purple: "\x1b[38;5;99m",
    gray: "\x1b[38;5;242m",
    white: "\x1b[38;5;255m",
    green: "\x1b[38;5;84m",
    bgSelect: "\x1b[48;5;238m\x1b[38;5;255m"
};

const UI = {
    tl: "┏", tr: "┓", bl: "┗", br: "┛", h: "━", v: "┃",
    sepL: "┠", sepR: "┨", cross: "╋",
    ptr: " » "
};

let selectedIndex = 0;
let stats = { notes: 0, projects: 0, lastScan: 'N/A' };

const menu = [
    { id: 'claude',  label: "CORE: NEURAL STREAM", desc: "Launch Claude in Firstbrain Elite Mode" },
    { id: 'scan',    label: "DATA: SYNC VAULT",    desc: "Update neural indexes & embeddings" },
    { id: 'daily',   label: "TASK: GEN DAILY",     desc: "Initialize today's workspace" },
    { id: 'process', label: "EXEC: INBOX OPS",     desc: "Process pending neural prompts" },
    { id: 'exit',    label: "EXIT: DISCONNECT",    desc: "Safe terminal shutdown" }
];

function loadData() {
    try {
        const idxPath = path.join(process.cwd(), '.claude/indexes/vault-index.json');
        if (fs.existsSync(idxPath)) {
            const data = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
            stats.notes = data.noteCount || 0;
            stats.lastScan = new Date(fs.statSync(idxPath).mtime).toLocaleTimeString();
        }
    } catch (e) {}
}

function render() {
    loadData();
    const cols = process.stdout.columns || 80;
    const rows = process.stdout.rows || 24;
    const boxWidth = 76;
    const padX = Math.floor((cols - boxWidth) / 2);
    const padY = Math.floor((rows - 16) / 2);

    process.stdout.write('\x1b[H\x1b[J'); // Clear & Home
    process.stdout.write('\x1b[?25l');   // Hide cursor
    process.stdout.write("\n".repeat(padY));

    const draw = (text, color = C.reset, center = false) => {
        const plain = text.replace(/\x1b\[.*?m/g, '');
        let line = " ".repeat(padX) + color + text + C.reset;
        if (center) {
            const innerPad = Math.floor((boxWidth - plain.length) / 2);
            line = " ".repeat(padX + innerPad) + color + text + C.reset;
        }
        process.stdout.write(line + "\n");
    };

    // Header
    draw("◢◤ FIRSTBRAIN ELITE ◢◤", C.bright + C.cyan, true);
    draw("NEURAL KNOWLEDGE INTERFACE", C.dim + C.gray, true);
    process.stdout.write("\n");

    // Top Frame
    draw(UI.tl + UI.h.repeat(boxWidth - 2) + UI.tr, C.blue);
    
    // Status
    const statText = ` VAULT: ${stats.notes} Notes  │  PROJECTS: ${stats.projects}  │  LAST SYNC: ${stats.lastScan} `;
    const statSpace = " ".repeat(Math.floor((boxWidth - 2 - statText.length) / 2));
    draw(UI.v + statSpace + statText + statSpace + (statText.length % 2 === 0 ? "" : " ") + UI.v, C.blue);
    
    draw(UI.sepL + UI.h.repeat(boxWidth - 2) + UI.sepR, C.blue);
    draw(UI.v + " ".repeat(boxWidth - 2) + UI.v, C.blue);

    // Menu
    menu.forEach((item, i) => {
        const isSel = i === selectedIndex;
        const pointer = isSel ? UI.ptr : "   ";
        const label = item.label.padEnd(20);
        const desc = item.desc.padEnd(45);
        const content = ` ${pointer}${label}  ${C.gray}${desc} ${C.reset}`;
        
        const line = isSel ? C.bgSelect + content + C.reset : content;
        const finalLine = UI.v + " " + line + " ".repeat(boxWidth - 4 - content.replace(/\x1b\[.*?m/g, '').length) + UI.v;
        draw(finalLine, C.blue);
    });

    draw(UI.v + " ".repeat(boxWidth - 2) + UI.v, C.blue);
    draw(UI.sepL + UI.h.repeat(boxWidth - 2) + UI.sepR, C.blue);
    
    // Footer
    const help = " NAV: ↑↓ ARROWS  │  CONFIRM: ENTER  │  EXIT: CTRL+C ";
    const helpSpace = " ".repeat(Math.floor((boxWidth - 2 - help.length) / 2));
    draw(UI.v + helpSpace + C.dim + help + C.res + helpSpace + (help.length % 2 === 0 ? "" : " ") + UI.v, C.blue);
    draw(UI.bl + UI.h.repeat(boxWidth - 2) + UI.br, C.blue);
}

function handleAction() {
    const item = menu[selectedIndex];
    process.stdout.write('\x1b[?25h'); // Show cursor
    
    if (item.id === 'exit') process.exit(0);

    if (item.id === 'claude') {
        process.stdin.setRawMode(false);
        console.log(`\n${C.green}Connecting to Neural Stream...${C.reset}\n`);
        // Use path to avoid shell: true
        const cmd = process.platform === 'win32' ? 'claude.cmd' : 'claude';
        const child = spawn(cmd, ['--verbose'], { stdio: 'inherit' });
        child.on('exit', () => {
            process.stdin.setRawMode(true);
            render();
        });
        return;
    }

    if (item.id === 'scan') {
        process.stdin.setRawMode(false);
        spawn('node', ['index.js', 'scan'], { stdio: 'inherit' }).on('exit', () => {
            process.stdin.setRawMode(true);
            render();
        });
        return;
    }

    // Default return to menu for others
    setTimeout(() => render(), 1000);
}

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.stdout.write('\x1b[?25h');
        process.exit();
    } else if (key.name === 'up') {
        selectedIndex = (selectedIndex - 1 + menu.length) % menu.length;
        render();
    } else if (key.name === 'down') {
        selectedIndex = (selectedIndex + 1) % menu.length;
        render();
    } else if (key.name === 'return') {
        handleAction();
    }
});

process.stdout.on('resize', () => render());

render();
