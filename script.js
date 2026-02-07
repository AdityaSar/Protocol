const output = document.getElementById('output');
const logoArea = document.getElementById('logo-area');
const terminal = document.getElementById('terminal');
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

    scrollToBottom() {
        terminal.scrollTop = terminal.scrollHeight;
    }

    async type(text, speed = 40, target = output) {
        this.isTyping = true;
        cursor.classList.remove('blink');
        for (let i = 0; i < text.length; i++) {
            target.textContent += text[i];
            this.scrollToBottom();
            await this.wait(speed);
        }
        if (target === output) output.textContent += '\n';
        this.scrollToBottom();
        cursor.classList.add('blink');
        this.isTyping = false;
    }

    print(text) {
        output.textContent += text + '\n';
        this.scrollToBottom();
    }

    replaceLastLines(n, text) {
        let lines = output.textContent.split('\n');
        // Handle the trailing newline if it exists
        if (lines[lines.length - 1] === "") lines.pop();

        lines.splice(-n);
        output.textContent = lines.join('\n') + '\n' + text + '\n';
        this.scrollToBottom();
    }

    clear() {
        output.textContent = '';
        logoArea.textContent = '';
    }

    async setPrompt(text) {
        promptLabel.textContent = text;
    }

    async input() {
        this.inputActive = true;
        userInputElement.textContent = '';
        cursor.classList.add('blink');
        this.scrollToBottom();
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
                this.scrollToBottom();
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
    await term.progressBar("MEM_CHECK", 800, 30);
    term.print("[ OK ] Memory allocation success: 64512MB");
    await term.progressBar("KERNEL_MODULES", 800, 30);
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
    [ STATUS: NOMINAL ] [ DEFCON: 5 ]
    `;
    await term.type(logo, 10, logoArea);
    await term.wait(2000);

    while (true) {
        await term.setPrompt("root@scorpion:~/ $ ");
        term.print("\n[ MAIN OPERATIONAL MENU ]");
        term.print("1. [ CYBER-WARFARE ] - Remote Access & Data Breach");
        term.print("2. [ TACTICAL MAP ] - Render Sector Grid");
        term.print("3. [ STRATEGIC SITREP ] - Global Tension Report");
        term.print("4. [ KINETIC WARFARE ] - Weapons Authorization & Launch");
        term.print("5. [ SYSTEM OVERRIDE ] - Bypass Safety Protocols");
        term.print("6. [ REBOOT ] - Restart System");

        term.print("\nSELECT MODULE [1-6]:");
        const choice = await term.input();
        await term.wait(300);

        if (choice === "1") {
            await handleCyberWarfare();
        } else if (choice === "2") {
            term.print("ENTER SECTOR COORDINATES:");
            const sector = await term.input();
            await term.drawMap(sector || "GLOBAL");
        } else if (choice === "3") {
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
        } else if (choice === "4") {
            await handleAuthLaunch({});
        } else if (choice === "5") {
            term.print("BYPASS REQUIRES CONFIRMATION. TYPE 'OVERRIDE' TO PROCEED:");
            const confirm = await term.input();
            if (confirm.toUpperCase() === "OVERRIDE") {
                term.setKinetic(true);
                term.print("\n+------------------------------------------+");
                term.print("|   !!! SAFETY PROTOCOLS BYPASSED !!!      |");
                term.print("+------------------------------------------+");
                term.print("[ STATE: KINETIC/LETHAL ]");
            } else {
                term.print("OVERRIDE ABORTED.");
            }
        } else if (choice === "6") {
            term.clear();
            term.setKinetic(false);
            await run();
            return;
        } else {
            // Check for legacy command support
            const parts = choice.split(/\s+/);
            const cmd = parts[0];
            const args = term.parseArgs(parts.slice(1));

            if (cmd === "net_trace") {
                const origin = args.origin || "127.0.0.1";
                term.print(`[ INITIATING REVERSE TRACE: ${origin} ]`);
                for (let i = 1; i <= 4; i++) {
                    term.print(`HOP ${i}: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.0.${i} - ${Math.floor(Math.random()*100)}ms`);
                    await term.wait(300);
                }
            } else {
                term.print("INVALID SELECTION.");
            }
        }
    }
}

async function handleCyberWarfare() {
    term.print("\n[ CYBER-WARFARE MODULE ]");
    term.print("SELECT TARGET AGENCY:");
    term.print("A. PENTAGON");
    term.print("B. NASA");
    term.print("C. INTERPOL");
    const targetChoice = await term.input();
    let target = "UNKNOWN";
    if (targetChoice.toUpperCase() === 'A') target = "PENTAGON";
    else if (targetChoice.toUpperCase() === 'B') target = "NASA";
    else if (targetChoice.toUpperCase() === 'C') target = "INTERPOL";
    else target = targetChoice;

    term.print(`\nSELECT EXPLOIT METHOD FOR [${target}]:`);
    term.print("1. RSA-4096 BUFFER OVERFLOW");
    term.print("2. SQL INJECTION (PROXY-CHAINED)");
    term.print("3. ZERO-DAY KERNEL EXPLOIT");
    const methodChoice = await term.input();
    let method = "MANUAL_INTRUSION";
    if (methodChoice === '1') method = "RSA_OVERFLOW";
    else if (methodChoice === '2') method = "SQL_INJECTION";
    else if (methodChoice === '3') method = "ZERO_DAY";

    term.print(`\n[ INITIATING BREACH: ${target} VIA ${method} ]`);
    await term.wait(800);
    await term.bitStream(3000);
    await term.progressBar("INJECTING PAYLOAD", 2500, 30);
    await term.hexStream(3000, true, target);
    term.print(`[ SUCCESS ] DATA ACQUIRED FROM ${target}`);
}

async function handleAuthLaunch(args) {
    let type = args.type || "NUCLEAR_ICBM";
    let coord = args.coord;

    if (!coord) {
        term.print("\n[ KINETIC WEAPONS MODULE ]");
        term.print("SELECT WEAPON SYSTEM:");
        term.print("1. NUCLEAR ICBM (MIRV-EQUIPPED)");
        term.print("2. ION CANNON (ORBITAL)");
        term.print("3. DEEP-SPACE LASER");
        const typeChoice = await term.input();
        if (typeChoice === "2") type = "ION_CANNON";
        else if (typeChoice === "3") type = "DS_LASER";

        term.print("\n[ INTERACTIVE TARGET ACQUISITION INITIATED ]");
        term.print("SELECT TARGET COUNTRY:");
        term.print("1. USA       | 2. RUSSIA    | 3. CHINA");
        term.print("4. N.KOREA   | 5. IRAN      | 6. UK");
        term.print("7. FRANCE    | 8. INDIA     | 9. ISRAEL");
        const countryChoice = await term.input();
        let country = "UNKNOWN";
        if (countryChoice === "1") country = "USA";
        else if (countryChoice === "2") country = "RUSSIA";
        else if (countryChoice === "3") country = "CHINA";
        else if (countryChoice === "4") country = "N.KOREA";
        else if (countryChoice === "5") country = "IRAN";
        else if (countryChoice === "6") country = "UK";
        else if (countryChoice === "7") country = "FRANCE";
        else if (countryChoice === "8") country = "INDIA";
        else if (countryChoice === "9") country = "ISRAEL";
        else country = countryChoice;

        term.print(`\nSELECT SECTOR IN ${country.toUpperCase()}:`);
        if (country.toLowerCase() === 'usa') term.print("1. DC | 2. NY | 3. NORAD");
        else if (country.toLowerCase() === 'russia') term.print("1. MSW | 2. STP | 3. SEV");
        else if (country.toLowerCase() === 'china') term.print("1. BJG | 2. SHG | 3. HKG");
        else if (country.toLowerCase() === 'n.korea') term.print("1. PYG | 2. WON | 3. HAM");
        else if (country.toLowerCase() === 'iran') term.print("1. THR | 2. ISF | 3. SHZ");
        else if (country.toLowerCase() === 'uk') term.print("1. LON | 2. MAN | 3. GLA");
        else if (country.toLowerCase() === 'france') term.print("1. PAR | 2. MRS | 3. LYN");
        else if (country.toLowerCase() === 'india') term.print("1. DEL | 2. MUM | 3. BLR");
        else if (country.toLowerCase() === 'israel') term.print("1. TLV | 2. JRS | 3. HFA");
        else term.print("OPTIONS: [ ALPHA, BRAVO, CHARLIE ]");

        const sectorChoice = await term.input();
        let sector = sectorChoice;
        if (country.toLowerCase() === 'usa') {
            if (sectorChoice === "1") sector = "DC";
            else if (sectorChoice === "2") sector = "NY";
            else if (sectorChoice === "3") sector = "NORAD";
        } else if (country.toLowerCase() === 'russia') {
            if (sectorChoice === "1") sector = "MSW";
            else if (sectorChoice === "2") sector = "STP";
            else if (sectorChoice === "3") sector = "SEV";
        } else if (country.toLowerCase() === 'china') {
            if (sectorChoice === "1") sector = "BJG";
            else if (sectorChoice === "2") sector = "SHG";
            else if (sectorChoice === "3") sector = "HKG";
        } else if (country.toLowerCase() === 'n.korea') {
            if (sectorChoice === "1") sector = "PYG";
            else if (sectorChoice === "2") sector = "WON";
            else if (sectorChoice === "3") sector = "HAM";
        } else if (country.toLowerCase() === 'iran') {
            if (sectorChoice === "1") sector = "THR";
            else if (sectorChoice === "2") sector = "ISF";
            else if (sectorChoice === "3") sector = "SHZ";
        } else if (country.toLowerCase() === 'uk') {
            if (sectorChoice === "1") sector = "LON";
            else if (sectorChoice === "2") sector = "MAN";
            else if (sectorChoice === "3") sector = "GLA";
        } else if (country.toLowerCase() === 'france') {
            if (sectorChoice === "1") sector = "PAR";
            else if (sectorChoice === "2") sector = "MRS";
            else if (sectorChoice === "3") sector = "LYN";
        } else if (country.toLowerCase() === 'india') {
            if (sectorChoice === "1") sector = "DEL";
            else if (sectorChoice === "2") sector = "MUM";
            else if (sectorChoice === "3") sector = "BLR";
        } else if (country.toLowerCase() === 'israel') {
            if (sectorChoice === "1") sector = "TLV";
            else if (sectorChoice === "2") sector = "JRS";
            else if (sectorChoice === "3") sector = "HFA";
        }

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
        term.print("\n" + "!".repeat(50));
        term.print("!!! KINETIC WEAPONS AUTHORIZED !!!");
        term.print("!".repeat(50));
        term.print(`[ TYPE: ${type.toUpperCase()} ] [ COORD: ${coord} ]\n`);
        await term.wait(2000);

        await term.progressBar(`CALIBRATING ${type.toUpperCase()}`, 4000, 40);

        // Flight Path Trajectory Animation
        term.print("\n[ CALCULATING BALLISTIC TRAJECTORY ]");
        await term.wait(1500);

        const gridHeight = 10;
        const gridWidth = 40;
        for (let i = 0; i < gridHeight; i++) {
            let line = "";
            for (let j = 0; j < gridWidth; j++) {
                if (j === Math.floor(i * (gridWidth/gridHeight))) line += "X";
                else line += ".";
            }
            term.print(line);
            await term.wait(250);
        }

        if (type.toUpperCase() === 'ION_CANNON' || type.toUpperCase() === 'DS_LASER') {
            term.print(`\n[ ORBITAL COORDINATES: ${coord},042 ]`);
            term.print(`[ ATMOSPHERIC IGNITION PROBABILITY: ${(Math.random() * 0.1 + 0.89).toFixed(4)} ]`);
        } else {
            term.print(`\n[ ICBM BALLISTIC PATH: SUB-ORBITAL ARC ] [ APOAPSIS: 1200KM ]`);
        }

        term.print("\n[ FINAL CODES VERIFIED ] [ STANDBY FOR LAUNCH ]");
        await term.wait(1000);

        for (let i = 5; i > 0; i--) {
            term.print(`T-MINUS ${i}...`);
            await term.wait(1000);
        }

        term.print("\n[ IGNITION ]");
        term.setKinetic(true); // Ensure kinetic mode is active for final flash
        await term.wait(500);

        // Simulation of screen flash / explosion
        for (let i = 0; i < 5; i++) {
            term.clear();
            term.print("\n".repeat(10) + " ".repeat(20) + "██████████████████████████████");
            term.print(" ".repeat(20) + "██████████████████████████████");
            term.print(" ".repeat(20) + "██████████████████████████████");
            await term.wait(50);
            term.clear();
            await term.wait(50);
        }

        term.clear();
        term.print("\n\n\n");
        term.print("          [ MISSION ACCOMPLISHED ]");
        term.print("          [ TARGET NEUTRALIZED ]");
        term.print("\n          [ WORLD DEFENSE SYSTEM: ACTIVE ]");
        await term.wait(4000);

        term.setKinetic(false);
        term.clear();
        term.print("[ STANDBY ]");
    } else {
        term.print("LAUNCH ABORTED. RETURNING TO NOMINAL.");
        term.setKinetic(false);
    }
}

run();
