const output = document.getElementById('output');
const promptLabel = document.getElementById('prompt-label');
const userInputElement = document.getElementById('user-input');
const cursor = document.getElementById('cursor');

class Terminal {
    constructor() {
        this.buffer = [];
        this.isTyping = false;
        this.inputActive = false;
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async type(text, speed = 30) {
        this.isTyping = true;
        cursor.classList.remove('blink');
        for (let i = 0; i < text.length; i++) {
            output.textContent += text[i];
            window.scrollTo(0, document.body.scrollHeight);
            await this.wait(speed);
        }
        output.textContent += '\n';
        cursor.classList.add('blink');
        this.isTyping = false;
    }

    print(text) {
        output.textContent += text + '\n';
        window.scrollTo(0, document.body.scrollHeight);
    }

    replaceLastLines(n, text) {
        let lines = output.textContent.split('\n');
        // Handle the trailing newline if it exists
        if (lines[lines.length - 1] === "") lines.pop();

        lines.splice(-n);
        output.textContent = lines.join('\n') + '\n' + text + '\n';
        window.scrollTo(0, document.body.scrollHeight);
    }

    clear() {
        output.textContent = '';
    }

    async setPrompt(text) {
        promptLabel.textContent = text;
    }

    async input() {
        this.inputActive = true;
        userInputElement.textContent = '';
        cursor.classList.add('blink');
        return new Promise(resolve => {
            const onKeyDown = (e) => {
                if (!this.inputActive) return;

                if (e.key === 'Enter') {
                    const value = userInputElement.textContent;
                    this.print(`${promptLabel.textContent}${value}`);
                    userInputElement.textContent = '';
                    this.inputActive = false;
                    window.removeEventListener('keydown', onKeyDown);
                    resolve(value.trim());
                } else if (e.key === 'Backspace') {
                    userInputElement.textContent = userInputElement.textContent.slice(0, -1);
                    e.preventDefault();
                } else if (e.key.length === 1) {
                    userInputElement.textContent += e.key;
                }
                window.scrollTo(0, document.body.scrollHeight);
            };
            window.addEventListener('keydown', onKeyDown);
        });
    }

    parseArgs(argsArray) {
        const args = { _: [] };
        for (let i = 0; i < argsArray.length; i++) {
            const arg = argsArray[i];
            if (arg.startsWith('--')) {
                const key = arg.slice(2);
                const next = argsArray[i + 1];
                if (next && !next.startsWith('--')) {
                    args[key] = next;
                    i++;
                } else {
                    args[key] = true;
                }
            } else {
                args._.push(arg);
            }
        }
        return args;
    }

    async runCommand(cmd, args = []) {
        await this.type(`${promptLabel.textContent}${cmd} ${args.join(' ')}`, 50);
    }

    setKinetic(enabled) {
        if (enabled) {
            document.body.classList.add('kinetic');
            output.classList.add('glitch');
        } else {
            document.body.classList.remove('kinetic');
            output.classList.remove('glitch');
        }
    }

    async progressBar(label, duration = 2000, width = 20) {
        let start = Date.now();
        while (Date.now() - start < duration) {
            let progress = (Date.now() - start) / duration;
            let filled = Math.floor(progress * width);
            let bar = '█'.repeat(filled) + '░'.repeat(width - filled);
            let percent = Math.floor(progress * 100);

            let lines = output.textContent.split('\n');
            if (lines[lines.length - 1].includes('[')) {
                lines.pop();
            }
            output.textContent = lines.join('\n') + `\n${label}: [${bar}] ${percent}%`;
            await this.wait(50);
        }
        let lines = output.textContent.split('\n');
        lines.pop();
        output.textContent = lines.join('\n') + `\n${label}: [${'█'.repeat(width)}] 100% DONE\n`;
    }

    async hexStream(duration = 3000, decrypt = false, target = "UNKNOWN") {
        let start = Date.now();
        const intel = [
            `DECRYPTING UPLINK [${target}]... SUCCESS`,
            "ACCESSING KERNEL MEMORY... GRANTED",
            "BYPASSING RSA-4096... DONE",
            "EXTRACTING INTEL... PHASE_1 COMPLETE",
            "STOLEN_CREDENTIALS: [ REDACTED ]",
            "STATUS: BREACH SUSTAINED"
        ];
        let intelIdx = 0;

        while (Date.now() - start < duration) {
            let line = '';
            if (decrypt && Math.random() > 0.8 && intelIdx < intel.length) {
                line = `[ INTEL ] >>> ${intel[intelIdx++]}`;
            } else {
                for (let i = 0; i < 4; i++) {
                    line += Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase() + ' ';
                    line += Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0').toUpperCase() + ' ';
                }
            }
            this.print(line);
            await this.wait(50);

            let lines = output.textContent.split('\n');
            if (lines.length > 25) {
                output.textContent = lines.slice(lines.length - 25).join('\n');
            }
        }
    }

    async bitStream(duration = 2000) {
        let start = Date.now();
        while (Date.now() - start < duration) {
            let line = '';
            for (let i = 0; i < 64; i++) {
                line += Math.random() > 0.5 ? '1' : '0';
            }
            this.print(line);
            await this.wait(30);
            let lines = output.textContent.split('\n');
            if (lines.length > 25) {
                output.textContent = lines.slice(lines.length - 25).join('\n');
            }
        }
    }

    async drawMap(sector, target = null, silent = false) {
        let lines = [];
        lines.push(`[ RENDERING TACTICAL GRID: ${sector.toUpperCase()} ]`);
        const width = 40;
        const height = 10;

        for (let y = 0; y < height; y++) {
            let line = "  ";
            for (let x = 0; x < width; x++) {
                if (target && x === target.x && y === target.y) {
                    line += "[#]";
                    x += 2;
                } else if (Math.random() > 0.98) {
                    line += "+";
                } else if (Math.random() > 0.95) {
                    line += ".";
                } else {
                    line += " ";
                }
            }
            lines.push(line);
        }
        lines.push(`[ RADAR_SCAN_COMPLETE: ${sector.toUpperCase()} ]`);

        const outputText = lines.join('\n');
        if (!silent) {
            for (const line of lines) {
                this.print(line);
                await this.wait(20);
            }
        }
        return outputText;
    }

    async simulateTargetSelection(country, sector) {
        this.print("\nINITIALIZING TARGET ACQUISITION...");
        await this.wait(500);

        let lastMapText = await this.drawMap(sector);

        for (let i = 0; i < 10; i++) {
            const randomTarget = { x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 10) };
            const mapText = await this.drawMap(sector, randomTarget, true);
            this.replaceLastLines(12, mapText);
            await this.wait(150);
        }

        const finalTarget = { x: 20, y: 5 }; // Fixed target for final
        const finalMap = await this.drawMap(sector, finalTarget, true);
        this.replaceLastLines(12, finalMap);
        this.print(`[ LOCK ACQUIRED: ${sector.toUpperCase()} ]`);
    }
}

const term = new Terminal();

async function run() {
    await term.wait(1000);

    // KERNEL BOOT
    term.print("[ 0.000000] Linux version 5.10.0-archon-scorpion (root@scorpion-ops) (gcc version 10.2.1)");
    await term.wait(500);
    await term.progressBar("MEM_CHECK", 1000, 30);
    term.print("[ OK ] Memory allocation success: 64512MB");
    await term.progressBar("KERNEL_MODULES", 1000, 30);
    term.print("[ OK ] Archon Security Modules loaded.");
    await term.wait(500);

    term.clear();
    const logo = `
    ███████╗ ██████╗ ██████╗ ██████╗ ██████╗ ██╗ ██████╗ ███╗   ██╗
    ██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗██║██╔═══██╗████╗  ██║
    ███████╗██║     ██║   ██║██████╔╝██████╔╝██║██║   ██║██╔██╗ ██║
    ╚════██║██║     ██║   ██║██╔══██╗██╔═══╝ ██║██║   ██║██║╚██╗██║
    ███████║╚██████╗╚██████╔╝██║  ██║██║     ██║╚██████╔╝██║ ╚████║
    ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝

    [ SYSTEM: SCORPION_OS // v4.0.2 ]
    [ STATUS: NOMINAL ]
    [ DEFCON: 5 ]
    `;
    term.print(logo);
    await term.wait(1000);

    term.clear();
    await term.setPrompt("root@scorpion:~/ $ ");

    // START INTERACTIVE SESSION
    term.print("SYSTEM READY. ENTER COMMAND TO CONTINUE.");

    while (true) {
        const fullInput = await term.input();
        const parts = fullInput.split(/\s+/);
        const command = parts[0];
        const args = term.parseArgs(parts.slice(1));

        if (command === "net_trace") {
            const origin = args.origin || "127.0.0.1";
            term.print(`[ INITIATING REVERSE TRACE: ${origin} ]`);
            await term.wait(500);
            for (let i = 1; i <= 4; i++) {
                term.print(`HOP ${i}: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.0.${i} - ${Math.floor(Math.random()*100)}ms`);
                await term.wait(300);
            }
            term.print("[ TRACE COMPLETE ]");
        } else if (command === "SITREP") {
            if (args.global) {
                term.print("\n[ GLOBAL STRATEGIC SITUATION REPORT ]");
                term.print("+------------------------------------------+");
                term.print("| SECTOR         | TENSION | STATUS        |");
                term.print("+----------------+---------+---------------+");
                term.print("| NORTH_ATL      | 78%     | ELEVATED      |");
                term.print("| PACIFIC_RIM    | 92%     | CRITICAL      |");
                term.print("| EURASIA        | 85%     | UNSTABLE      |");
                term.print("| OFF-WORLD      | 12%     | NOMINAL       |");
                term.print("+----------------+---------+---------------+");
                term.print("| DEFCON STATUS: | [ 2 ]   | READY         |");
                term.print("+------------------------------------------+");
            } else {
                term.print("USAGE: SITREP --global");
            }
        } else if (command === "sig_int") {
            if (args.intercept) {
                await term.hexStream(4000, true, args.uplink || "UNKNOWN");
            } else {
                term.print("USAGE: sig_int --intercept --uplink [ID]");
            }
        } else if (command === "scp_fetch") {
            if (args.target && args.method) {
                term.print(`[ INITIATING BREACH: ${args.target} VIA ${args.method} ]`);
                await term.bitStream(2000);
                await term.progressBar("INJECTING PAYLOAD", 1500, 30);
                await term.hexStream(2000, false);
                term.print(`[ SUCCESS ] DATA ACQUIRED FROM ${args.target}`);
            } else {
                term.print("USAGE: scp_fetch --target [Agency] --method [Exploit]");
            }
        } else if (command === "map_render") {
            const sector = args.sector || "GLOBAL";
            await term.drawMap(sector);
        } else if (command === "sys_override") {
            if (args.force) {
                term.setKinetic(true);
                term.print("\n+------------------------------------------+");
                term.print("|   !!! SAFETY PROTOCOLS BYPASSED !!!      |");
                term.print("+------------------------------------------+");
                term.print("[ STATE: KINETIC/LETHAL ]");
                term.print("[ MNT/DRIVE_01_ENCRYPTED ]");
            } else {
                term.print("BYPASS REQUIRES --force FLAG.");
            }
        } else if (command === "auth_launch") {
            await handleAuthLaunch(args);
        } else if (command === "help") {
            term.print("AVAILABLE: net_trace, SITREP, sig_int, scp_fetch, map_render, auth_launch, sys_override");
        } else if (fullInput === "") {
            // Do nothing
        } else {
            term.print(`COMMAND NOT RECOGNIZED: ${command}`);
        }
    }
}

async function handleAuthLaunch(args) {
    let type = args.type || "ICBM";
    let coord = args.coord;

    if (!coord) {
        term.print("\n[ INTERACTIVE TARGET ACQUISITION INITIATED ]");
        term.print("SELECT TARGET COUNTRY:");
        term.print("OPTIONS: [ USA, RUSSIA, CHINA ]");
        const country = await term.input();

        term.print(`\nSELECT SECTOR IN ${country.toUpperCase()}:`);
        if (country.toLowerCase() === 'usa') term.print("OPTIONS: [ DC, NY, NORAD ]");
        else if (country.toLowerCase() === 'russia') term.print("OPTIONS: [ MSW, STP, SEV ]");
        else if (country.toLowerCase() === 'china') term.print("OPTIONS: [ BJG, SHG, HKG ]");
        else term.print("OPTIONS: [ ALPHA, BRAVO, CHARLIE ]");

        const sector = await term.input();

        await term.simulateTargetSelection(country, sector);
        coord = `${country.toUpperCase()}_${sector.toUpperCase()}`;
    }

    term.setKinetic(true);
    term.print("\n+==========================================+");
    term.print(`|   !!! AUTHORIZATION: ${type} !!!   |`);
    term.print("+==========================================+");
    term.print(`TARGET COORDINATES: [ ${coord} ]`);

    term.print("\nENTER LAUNCH AUTHORIZATION CODES:");
    const codes = await term.input();

    term.print("\nVERIFYING CODES...");
    await term.wait(1000);
    term.print(`CODES ACCEPTED: [ ${codes.toUpperCase()} ]`);
    term.print("FINAL CONFIRMATION (TYPE 'CONFIRM' TO TRIGGER):");
    const confirm = await term.input();

    if (confirm.toLowerCase() === 'confirm') {
        term.print("\n[ !!! KINETIC WEAPONS AUTHORIZED !!! ]");
        term.print(`[ !!! TYPE: ${type.toUpperCase()} / COORD: ${coord} !!! ]\n`);
        await term.wait(500);

        await term.progressBar(`CALIBRATING ${type.toUpperCase()}`, 3000, 40);

        // Flight Path Trajectory Animation
        term.print("\n[ CALCULATING TRAJECTORY ]");
        await term.wait(800);

        if (type.toUpperCase() === 'ION' || type.toUpperCase() === 'LASER') {
            term.print(`[ ORBITAL COORDINATES: ${coord},042 ]`);
            term.print(`[ ATMOSPHERIC IGNITION PROBABILITY: ${(Math.random() * 0.1 + 0.89).toFixed(4)} ]`);
        } else {
            term.print(`[ ICBM BALLISTIC PATH: SUB-ORBITAL ARC ] [ APOAPSIS: 1200KM ]`);
        }

        const path = ["      *", "     /", "    /", "   /", "  /", " /", "/"];
        for (const line of path) {
            term.print(line);
            await term.wait(200);
        }

        term.print("\nT-MINUS 5..."); await term.wait(1000);
        term.print("T-MINUS 4..."); await term.wait(1000);
        term.print("T-MINUS 3..."); await term.wait(1000);
        term.print("T-MINUS 2..."); await term.wait(1000);
        term.print("T-MINUS 1..."); await term.wait(1000);
        term.print("IGNITION.");
        await term.wait(500);

        term.clear();
        term.print("\n\n\n");
        term.print("          [ MISSION ACCOMPLISHED ]");
        term.print("          [ TARGET NEUTRALIZED ]");
        await term.wait(3000);

        term.setKinetic(false);
        term.clear();
        term.print("[ STANDBY ]");
    } else {
        term.print("LAUNCH ABORTED. RETURNING TO NOMINAL.");
        term.setKinetic(false);
    }
}

run();
