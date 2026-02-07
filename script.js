const output = document.getElementById('output');
const logoArea = document.getElementById('logo-area');
const terminal = document.getElementById('terminal');
const promptLabel = document.getElementById('prompt-label');
const userInputElement = document.getElementById('user-input');
const cursor = document.getElementById('cursor');
const defconIndicator = document.getElementById('defcon-indicator');
const newsMarquee = document.getElementById('news-marquee');
const alertsContainer = document.getElementById('alerts-container');
const moduleIndicator = document.getElementById('module-indicator');
const stageIndicator = document.getElementById('stage-indicator');

class Terminal {
    constructor() {
        this.buffer = [];
        this.isTyping = false;
        this.inputActive = false;
        this.currentDefcon = 5;
        this.idleTimer = null;
        this.isBusy = false;
        this.startIdleTimer();
    }

    updateDefcon(level) {
        if (level < this.currentDefcon) {
            this.currentDefcon = level;
            defconIndicator.textContent = `[ DEFCON: ${this.currentDefcon} ]`;

            document.body.classList.remove('defcon-5', 'defcon-4', 'defcon-3', 'defcon-2', 'defcon-1');
            document.body.classList.add(`defcon-${this.currentDefcon}`);

            if (this.currentDefcon === 4) {
                defconIndicator.style.color = "#ffff33";
                this.updateNews("SATELLITE ANOMALY DETECTED IN NORTHERN HEMISPHERE");
                this.updateStage("ELEVATED");
            } else if (this.currentDefcon === 3) {
                defconIndicator.style.color = "#ff9933";
                this.updateNews("UN SECURITY COUNCIL CONVENING EMERGENCY SESSION");
                this.updateStage("ALERT_ORANGE");
            } else if (this.currentDefcon === 2) {
                defconIndicator.style.color = "#ff3333";
                this.updateNews("GLOBAL DEFENSE NETWORKS SHIFTING TO KINETIC FOOTING");
                this.updateStage("DEFCON_2_PRELAUNCH");
            } else if (this.currentDefcon === 1) {
                defconIndicator.style.color = "#ffffff";
        this.updateNews("STRATEGIC WEAPONS RELEASE AUTHORIZED - PLANETARY NEUTRALIZATION IMMINENT");
                this.updateStage("TERMINAL_KINETIC");
            }
        }
    }

    updateModule(name) {
        moduleIndicator.textContent = `MODULE: ${name.toUpperCase()}`;
    }

    updateStage(stage) {
        stageIndicator.textContent = `STAGE: ${stage.toUpperCase()}`;
    }

    updateNews(headline) {
        newsMarquee.textContent = `*** ${headline.toUpperCase()} *** ${headline.toUpperCase()} ***`;
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
        // Logo area remains persistent as per ARCHON directive
    }

    async setPrompt(text) {
        promptLabel.textContent = text;
    }

    startIdleTimer() {
        if (this.idleTimer) clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => {
            if (!this.isBusy && !this.inputActive) {
                this.triggerCounterHack();
            } else {
                this.startIdleTimer();
            }
        }, 45000); // 45 seconds idle
    }

    async triggerCounterHack() {
        this.isBusy = true;
        this.print("\n" + "!".repeat(50));
        this.print(`*** INTRUSION DETECTED from ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.12.89 ***`);
        this.print("!!! ENTER 'BLOCK' TO PREVENT SYSTEM LOCKOUT !!!");
        this.print("!!! TIME REMAINING: 15 SECONDS !!!");
        this.print("!".repeat(50));

        const timeout = setTimeout(async () => {
            this.inputActive = false;
            this.clear();
            this.print("\n".repeat(5));
            this.print("          [ SYSTEM LOCKED BY EXTERNAL ENTITY ]");
            this.print("          [ LOCKOUT DURATION: 60 SECONDS ]");
            document.body.classList.add('defcon-1');
            await this.wait(60000);
            document.body.classList.remove('defcon-1');
            this.isBusy = false;
            this.startIdleTimer();
            this.print("\n[ LOCKOUT EXPIRED - SYSTEM RESTORED ]");
        }, 15000);

        const val = await this.input();
        if (val.toUpperCase() === "BLOCK") {
            clearTimeout(timeout);
            this.print("\n[ INTRUSION BLOCKED - PROXY RE-ROUTED ]");
            this.isBusy = false;
            this.startIdleTimer();
        }
    }

    async input() {
        this.startIdleTimer();
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
            this.removeWarningSigns();
            document.body.style.animationDuration = '';
        }
    }

    async triggerRedFlicker() {
        for (let i = 0; i < 5; i++) {
            document.body.classList.add('kinetic');
            await this.wait(50);
            document.body.classList.remove('kinetic');
            await this.wait(50);
        }
        document.body.classList.add('kinetic');
    }

    async spawnAlertStorm(count = 20) {
        this.removeWarningSigns();
        this.setKinetic(true);
        this.updateDefcon(2);

        const warnings = [
            "[ !!! WARNING !!! ]",
            "[ WEAPON AUTHORIZED ]",
            "[ KINETIC STRIKE IMMINENT ]",
            "[ NUCLEAR THREAT DETECTED ]",
            "[ SYSTEM OVERRIDE ACTIVE ]",
            "[ ACCESS DENIED ]",
            "[ CRITICAL FAILURE ]",
            "[ PROTOCOL 0-0-0 ]"
        ];

        let delay = 800;
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'warning-sign';
            div.textContent = warnings[Math.floor(Math.random() * warnings.length)];

            const x = Math.random() * 80 + 10;
            const y = Math.random() * 80 + 10;

            div.style.left = x + '%';
            div.style.top = y + '%';
            div.style.transform = `translate(-50%, -50%) rotate(${(Math.random() - 0.5) * 30}deg)`;
            alertsContainer.appendChild(div);

            const shakeSpeed = (0.3 - (i * 0.01)).toFixed(2);
            document.body.style.animationDuration = `${shakeSpeed}s, 0.5s, 2s, 0.05s`;

            await this.wait(delay);
            delay *= 0.85;
        }
    }

    spawnWarningSigns(count = 12) {
        this.removeWarningSigns();
        const warnings = [
            "[ !!! WARNING !!! ]",
            "[ WEAPON AUTHORIZED ]",
            "[ KINETIC STRIKE IMMINENT ]",
            "[ NUCLEAR THREAT DETECTED ]",
            "[ SYSTEM OVERRIDE ACTIVE ]",
            "[ ACCESS DENIED ]",
            "[ CRITICAL FAILURE ]",
            "[ PROTOCOL 0-0-0 ]"
        ];

        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'warning-sign';
            div.textContent = warnings[Math.floor(Math.random() * warnings.length)];

            const side = i % 4;
            let x, y;
            if (side === 0) { x = Math.random() * 90 + 5; y = Math.random() * 15 + 5; }
            else if (side === 1) { x = Math.random() * 90 + 5; y = Math.random() * 15 + 80; }
            else if (side === 2) { x = Math.random() * 15 + 5; y = Math.random() * 70 + 15; }
            else { x = Math.random() * 15 + 80; y = Math.random() * 70 + 15; }

            div.style.left = x + '%';
            div.style.top = y + '%';
            div.style.transform = `translate(-50%, -50%) rotate(${(Math.random() - 0.5) * 20}deg)`;
            alertsContainer.appendChild(div);
        }
    }

    removeWarningSigns() {
        alertsContainer.innerHTML = '';
    }

    async showConfirmationModal(header, bodyText, requiredCode = null) {
        return new Promise(resolve => {
            const container = document.createElement('div');
            container.className = 'modal-container';

            const h = document.createElement('div');
            h.className = 'modal-header';
            h.textContent = header;

            const b = document.createElement('div');
            b.className = 'modal-body';
            b.textContent = bodyText;

            const inputContainer = document.createElement('div');
            inputContainer.className = 'modal-input-container';
            inputContainer.style.margin = '30px 0';
            inputContainer.style.padding = '15px';
            inputContainer.style.border = '2px solid #ff0000';
            inputContainer.style.fontSize = '28px';
            inputContainer.style.background = '#1a0000';
            inputContainer.style.fontFamily = "'Terminal', monospace";

            const inputLabel = document.createElement('span');
            inputLabel.textContent = 'AUTH_TOKEN: ';
            inputLabel.style.color = '#ff0000';

            const inputVal = document.createElement('span');
            inputVal.style.color = '#fff';
            inputVal.textContent = '';

            const mCursor = document.createElement('span');
            mCursor.className = 'blink';
            mCursor.textContent = ' ';
            mCursor.style.background = '#ff0000';
            mCursor.style.display = 'inline-block';
            mCursor.style.width = '12px';
            mCursor.style.height = '24px';
            mCursor.style.marginLeft = '5px';
            mCursor.style.verticalAlign = 'middle';

            inputContainer.appendChild(inputLabel);
            inputContainer.appendChild(inputVal);
            inputContainer.appendChild(mCursor);

            const footer = document.createElement('div');
            footer.style.marginTop = '20px';
            footer.style.fontSize = '24px';
            footer.style.transition = 'opacity 0.3s';
            footer.style.opacity = requiredCode ? '0.2' : '1.0';
            footer.innerHTML = `[ ACTION ] EXECUTE_DIRECTIVE <span style="color:#fff; background:#ff0000; padding: 5px;">[ENTER]</span> | ABORT_DIRECTIVE <span style="color:#fff; background:#555; padding: 5px;">[ESC]</span>`;

            container.appendChild(h);
            container.appendChild(b);
            if (requiredCode) container.appendChild(inputContainer);
            container.appendChild(footer);
            document.body.appendChild(container);

            let currentInput = "";

            const onKeyDown = (e) => {
                if (requiredCode) {
                    if (e.key === 'Enter') {
                        if (currentInput.toUpperCase() === requiredCode.toUpperCase()) {
                            window.removeEventListener('keydown', onKeyDown);
                            container.remove();
                            resolve(true);
                        } else {
                            // Shake on fail
                            container.style.animation = 'none';
                            void container.offsetWidth;
                            container.style.animation = 'shake 0.3s 1';
                            currentInput = "";
                            inputVal.textContent = "";
                            footer.style.opacity = '0.2';
                        }
                    } else if (e.key === 'Escape') {
                        window.removeEventListener('keydown', onKeyDown);
                        container.remove();
                        resolve(false);
                    } else if (e.key === 'Backspace') {
                        currentInput = currentInput.slice(0, -1);
                        inputVal.textContent = currentInput;
                        e.preventDefault();
                    } else if (e.key.length === 1) {
                        currentInput += e.key;
                        inputVal.textContent = currentInput;
                    }

                    if (currentInput.toUpperCase() === requiredCode.toUpperCase()) {
                        footer.style.opacity = '1.0';
                        inputContainer.style.borderColor = '#00ff00';
                        inputVal.style.color = '#00ff00';
                    } else {
                        footer.style.opacity = '0.2';
                        inputContainer.style.borderColor = '#ff0000';
                        inputVal.style.color = '#fff';
                    }
                } else {
                    if (e.key === 'Enter') {
                        window.removeEventListener('keydown', onKeyDown);
                        container.remove();
                        resolve(true);
                    } else if (e.key === 'Escape') {
                        window.removeEventListener('keydown', onKeyDown);
                        container.remove();
                        resolve(false);
                    }
                }
            };
            window.addEventListener('keydown', onKeyDown);
        });
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
            const rand = Math.random();
            if (rand > 0.95) {
                line = `[ !!! ] PACKET LOSS DETECTED... RETRYING...`;
                this.print(line);
                await this.wait(400);
                continue;
            } else if (rand > 0.92) {
                line = `[ WARN ] UNSTABLE CONNECTION AT NODE ${Math.floor(Math.random()*255)}.12.89`;
                this.print(line);
                await this.wait(200);
                continue;
            }

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
            if (lines.length > 30) {
                output.textContent = lines.slice(lines.length - 30).join('\n');
            }
        }
    }

    async scrollingBitStream(duration = 2000) {
        let start = Date.now();
        while (Date.now() - start < duration) {
            let line = '';
            for (let i = 0; i < 64; i++) {
                line += Math.random() > 0.5 ? '1' : '0';
            }
            this.print(line);
            await this.wait(30);
        }
    }

    async hexWallGame() {
        this.clear();
        this.print("[ INITIATING ACTIVE DEFENSE BYPASS ]");
        this.print("[ OBJECTIVE: TYPE 'DECRYPT' WHEN A ROW TURNS RED ]");
        await this.wait(1000);
        this.clear();

        const col1 = document.createElement('div');
        const col2 = document.createElement('div');
        col1.className = 'hex-column';
        col2.className = 'hex-column';
        output.appendChild(col1);
        output.appendChild(col2);

        let successes = 0;
        let failures = 0;
        let gameRunning = true;

        const generateHex = () => {
            let res = '';
            for(let i=0; i<8; i++) res += Math.floor(Math.random()*16).toString(16).toUpperCase();
            return res;
        };

        const updateColumn = (col) => {
            const row = document.createElement('div');
            row.className = 'hex-row';
            row.textContent = `${generateHex()} ${generateHex()} ${generateHex()} ${generateHex()}`;
            if (Math.random() > 0.92) {
                row.classList.add('red');
                row.dataset.active = "true";
                // Row stays red for a short time
                setTimeout(() => {
                    if (row.dataset.active === "true") {
                        row.dataset.active = "false";
                        row.classList.remove('red');
                        failures++;
                        if (failures >= 3) gameRunning = false;
                    }
                }, 1000);
            }
            col.prepend(row);
            if (col.childNodes.length > 20) col.lastChild.remove();
        };

        const gameLoop = setInterval(() => {
            if (!gameRunning) return;
            updateColumn(col1);
            updateColumn(col2);
        }, 150);

        return new Promise(async (resolve) => {
            const handleInput = async () => {
                while (gameRunning && successes < 3) {
                    const val = await this.input();
                    if (val.toUpperCase() === "DECRYPT") {
                        const activeRow = document.querySelector('.hex-row.red[data-active="true"]');
                        if (activeRow) {
                            activeRow.dataset.active = "false";
                            activeRow.classList.remove('red');
                            activeRow.style.background = "#00ff00";
                            activeRow.style.color = "#000";
                            successes++;
                            this.print(`[ SUCCESS: ${successes}/3 ]`);
                        } else {
                            this.print("[ ERROR: NO ACTIVE TARGET ]");
                        }
                    } else {
                        this.print("[ ERROR: INVALID COMMAND ]");
                    }
                }

                clearInterval(gameLoop);
                if (successes >= 3) {
                    this.clear();
                    this.print("[ BREACH SUCCESSFUL ]");
                    await this.wait(1000);
                    resolve(true);
                } else {
                    await this.triggerReboot();
                    resolve(false);
                }
            };
            handleInput();
        });
    }

    async triggerReboot() {
        document.body.classList.add('defcon-1');
        this.clear();
        for (let i = 0; i < 20; i++) {
            this.print(`KERNEL_PANIC: STACK_OVERFLOW_AT_0x${Math.floor(Math.random()*0xFFFFFFFF).toString(16)}`);
            await this.wait(50);
        }
        await this.wait(1000);
        window.location.reload();
    }

    async drawMap(sector, target = null, silent = false) {
        let lines = [];
        lines.push(`[ RENDERING TACTICAL GRID: ${sector.toUpperCase()} ]`);
        const width = 60;
        const height = 15;

        // Generate base map data
        const mapData = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                if (Math.random() > 0.98) row.push("+");
                else if (Math.random() > 0.95) row.push(".");
                else row.push(" ");
            }
            mapData.push(row);
        }

        if (silent) {
            for (let y = 0; y < height; y++) {
                let line = "  ";
                for (let x = 0; x < width; x++) {
                    if (target && x === target.x && y === target.y) {
                        line += "[#]";
                        x += 2;
                    } else {
                        line += mapData[y][x];
                    }
                }
                lines.push(line);
            }
            lines.push(`[ RADAR_SCAN_COMPLETE: ${sector.toUpperCase()} ]`);
            return lines.join('\n');
        }

        // Animation for radar sweep
        for (let sweep = 0; sweep < width; sweep += 2) {
            let currentFrame = [`[ SCANNING SECTOR: ${sector.toUpperCase()} | POS: ${sweep}/${width} ]`];
            for (let y = 0; y < height; y++) {
                let line = "  ";
                for (let x = 0; x < width; x++) {
                    if (x === sweep || x === sweep + 1) {
                        line += "|";
                    } else if (target && x === target.x && y === target.y && x < sweep) {
                        line += "[#]";
                        x += 2;
                    } else if (target && x === target.x && y === target.y) {
                        line += "?"; // Target not yet "scanned"
                    } else {
                        line += mapData[y][x];
                    }
                }
                currentFrame.push(line);
            }

            if (sweep === 0) {
                for (const line of currentFrame) this.print(line);
            } else {
                this.replaceLastLines(height + 1, currentFrame.join('\n'));
            }
            await this.wait(30);
        }

        // Final frame
        let finalFrame = [`[ RADAR_SCAN_COMPLETE: ${sector.toUpperCase()} ]`];
        for (let y = 0; y < height; y++) {
            let line = "  ";
            for (let x = 0; x < width; x++) {
                if (target && x === target.x && y === target.y) {
                    line += "[#]";
                    x += 2;
                } else {
                    line += mapData[y][x];
                }
            }
            finalFrame.push(line);
        }
        this.replaceLastLines(height + 1, finalFrame.join('\n'));
        return finalFrame.join('\n');
    }

    async simulateTargetSelection(country, sector) {
        this.print("\n[ STATUS ] >>> INITIATING TARGET ACQUISITION...");
        await this.wait(500);
        this.print("[ STATUS ] >>> HANDSHAKING WITH KH-11 SPY SATELLITE...");
        await this.wait(1000);
        this.print("[ STATUS ] >>> RECEIVING ENCRYPTED TELEMETRY...");
        await this.wait(800);

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

    async playVideo(youtubeId) {
        return new Promise(resolve => {
            const overlay = document.getElementById('video-overlay');
            const playerDiv = document.getElementById('player');
            overlay.classList.remove('hidden');

            // Using YouTube embed with parameters for a cinematic look
            playerDiv.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&mute=1&loop=1&playlist=${youtubeId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;

            const closeBtn = document.getElementById('close-video');
            const close = () => {
                overlay.classList.add('hidden');
                playerDiv.innerHTML = '';
                closeBtn.removeEventListener('click', close);
                resolve();
            };
            closeBtn.addEventListener('click', close);
        });
    }
}

const term = new Terminal();
window.term = term;

async function run() {
    term.updateModule("KERNEL_BOOT");
    term.updateStage("INITIALIZING");
    await term.wait(1000);

    // KERNEL BOOT
    term.print("[ 0.000000] BIOS_REV: SCORPION-ARCHON-V4.0.2");
    term.print("[ 0.000124] CPU: SCORPION MULTI-CORE NEURAL PROCESSOR");
    term.print("[ 0.000342] MEM: 128TB QUANTUM-VOLATILE RAM DETECTED");
    await term.wait(400);
    await term.progressBar("MEMORY_TEST", 1500, 30);
    term.print("[ 1.425312] [ OK ] MEM_ALLOC_SUCCESS: 0x00000000 - 0xFFFFFFFF");
    await term.wait(300);
    term.print("[ 1.456721] [ OK ] KERNEL_PANIC_PREVENTED: WATCHDOG_TIMER ACTIVE");
    term.print("[ 1.489102] [ OK ] MNT/DRIVE_01_ENCRYPTED: RSA-4096 HANDSHAKE COMPLETE");
    await term.progressBar("KERNEL_MODULES", 1200, 30);
    term.print("[ 2.612341] [ OK ] CYBER_WARFARE_SUITE_INIT");
    term.print("[ 2.645112] [ OK ] KINETIC_RELEASE_PROTOCOL_STANDBY");
    term.print("[ 2.678901] [ OK ] EXO_ATMOSPHERIC_CALIBRATION_READY");
    term.print("[ 2.712344] [ OK ] ARCHON_V4_NEURAL_LINK_ESTABLISHED");
    term.print("[ 2.745678] [ OK ] STRATEGIC_ASSET_LOCK_ENGAGED");
    await term.wait(800);

    term.clear();
    const logo = `
   ███████╗ ██████╗ ██████╗ ██████╗ ██████╗ ██╗ ██████╗ ███╗   ██╗
   ██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗██║██╔═══██╗████╗  ██║
   ███████╗██║     ██║   ██║██████╔╝██████╔╝██║██║   ██║██╔██╗ ██║
   ╚════██║██║     ██║   ██║██╔══██╗██╔═══╝ ██║██║   ██║██║╚██╗██║
   ███████║╚██████╗╚██████╔╝██║  ██║██║     ██║╚██████╔╝██║ ╚████║
   ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
               [ STRATEGIC DEFENSE & CYBER-WARFARE INTERFACE ]

    [ SYSTEM: SCORPION_OS // v4.0.2 ] [ KERNEL: ARCHON-V4 ]
    [ STATUS: NOMINAL ] [ DEFCON_LEVEL: 5 ]
    `;
    await term.type(logo, 5, logoArea);
    term.updateModule("SYSTEM_IDLE");
    term.updateStage("READY");
    await term.wait(1500);

    while (true) {
        await term.setPrompt("root@scorpion:~/ $ ");
        const rawInput = await term.input();
        if (!rawInput) continue;

        const parts = rawInput.trim().split(/\s+/);
        const cmdName = parts[0].toLowerCase();
        const args = term.parseArgs(parts.slice(1));

        if (cmdName === "reboot" || cmdName === "restart") {
            term.clear();
            term.setKinetic(false);
            term.print("[ STATUS ] INITIATING SYSTEM REBOOT...");
            await term.wait(1000);
            term.print("[ STATUS ] TERMINATING ACTIVE PROCESSES...");
            await term.wait(500);
            term.print("[ STATUS ] UNLOADING KERNEL MODULES...");
            await term.wait(500);
            term.print("[ STATUS ] SHUTTING DOWN ARCHON SECURITY SUBSYSTEM...");
            await term.wait(1000);
            term.clear();
            await term.wait(1500);
            await run();
            return;
        }

        term.isBusy = true;

        if (cmdName === "scp_fetch") {
            term.updateModule("CYBER_WARFARE");
            await handleCyberWarfare(args.target, args.method);
        }
        else if (cmdName === "map_render") {
            term.updateModule("TACTICAL_MAP");
            term.updateDefcon(3);
            let sector = args.sector;
            if (!sector) {
                term.print("\n[ TACTICAL MAP MODULE ]");
                term.print("ENTER SECTOR COORDINATES:");
                sector = await term.input();
                if (!sector) sector = "GLOBAL";
            }
            await term.drawMap(sector);
        }
        else if (cmdName === "sitrep") {
            term.updateModule("STRATEGIC_SITREP");
            await handleSitrep(args.global);
        }
        else if (cmdName === "auth_launch") {
            term.updateModule("KINETIC_WEAPONS");
            await handleAuthLaunch({ type: args.type, coord: args.coord });
        }
        else if (cmdName === "ion_calibrate") {
            term.updateModule("EXO_ATMOSPHERIC");
            await handleIonCalibrate(args.target);
        }
        else if (cmdName === "laser_align") {
            term.updateModule("EXO_ATMOSPHERIC");
            await handleLaserAlign(args.target);
        }
        else if (cmdName === "sys_override") {
            term.updateModule("SYSTEM_OVERRIDE");
            if (args.force) {
                await handleSysOverride();
            } else {
                term.print("[ ERROR ] PARAMETER '--force' REQUIRED FOR OVERRIDE DIRECTIVE.");
            }
        }
        else if (cmdName === "net_trace") {
            term.updateModule("NETWORK_TRACE");
            await handleNetTrace(args.origin);
        }
        else if (cmdName === "sig_int") {
            term.updateModule("SIGNALS_INTEL");
            let uplink = args.uplink;
            if (!uplink && !args.intercept) {
                term.print("\n[ SIGNALS INTELLIGENCE MODULE ]");
                term.print("ENTER UPLINK ID OR TYPE 'SCAN':");
                const choice = await term.input();
                if (choice.toUpperCase() !== 'SCAN') uplink = choice;
            }
            await handleSigInt(args.intercept, uplink);
        }
        else if (cmdName === "clear" || cmdName === "cls") {
            term.clear();
        }
        else if (cmdName === "help" || cmdName === "?") {
            term.print("\n[ SCORPION_OS STRATEGIC COMMAND LIBRARY ]");
            term.print("--------------------------------------------------");
            term.print("scp_fetch --target [AGENCY] --method [EXPLOIT]");
            term.print("map_render --sector [COORDINATES]");
            term.print("auth_launch --type [ICBM/ION/LASER] --coord [X,Y]");
            term.print("ion_calibrate --target [COORD]");
            term.print("laser_align --target [COORD]");
            term.print("sig_int --intercept --uplink [ID]");
            term.print("sys_override --force");
            term.print("sitrep --global");
            term.print("net_trace --origin [IP]");
            term.print("clear | reboot");
            term.print("--------------------------------------------------");
        }
        else {
            // Fallback to fuzzy matching for legacy support or natural language
            const cmdLower = rawInput.toLowerCase();
            if (cmdLower.includes("breach") || cmdLower.includes("hack") || cmdLower.includes("fetch")) {
                await handleCyberWarfare();
            } else if (cmdLower.includes("launch") || cmdLower.includes("strike")) {
                await handleAuthLaunch({});
            } else if (cmdLower.includes("map") || cmdLower.includes("radar")) {
                await term.drawMap("GLOBAL");
            } else {
                term.print(`[ ERROR ] DIRECTIVE '${cmdName}' NOT RECOGNIZED BY ARCHON_KERNEL.`);
                term.print("USE 'HELP' TO LIST OPERATIONAL MODULES.");
            }
        }

        term.isBusy = false;
    }
}

async function handleCyberWarfare(preselectedTarget = null, preselectedMethod = null) {
    term.print("\n[ CYBER-WARFARE MODULE ACTIVE ]");
    let target = preselectedTarget;
    if (!target) {
        term.print("[ ERROR ] TARGET_UNDEFINED. PROVIDE DESIGNATION:");
        term.print("1. [ PENTAGON ]   | 2. [ NASA ]       | 3. [ INTERPOL ]");
        term.print("4. [ FSB ]        | 5. [ MOSSAD ]     | 6. [ GLOBAL_BANK ]");

        const targetChoice = await term.input();
        const targets = { "1": "PENTAGON", "2": "NASA", "3": "INTERPOL", "4": "FSB", "5": "MOSSAD", "6": "GLOBAL_BANK" };
        target = targets[targetChoice] || targetChoice;
    }

    let method = preselectedMethod;
    if (!method) {
        term.print(`\n[ TARGET_LOCKED ] >>> [ ${target.toUpperCase()} ]`);
        term.print(`[ PROMPT ] SELECT_EXPLOIT_VECTOR:`);
        term.print("1. RSA-4096 BUFFER OVERFLOW");
        term.print("2. SQL INJECTION (PROXY-CHAINED)");
        term.print("3. ZERO-DAY KERNEL EXPLOIT");
        const methodChoice = await term.input();
        const methods = { "1": "RSA_OVERFLOW", "2": "SQL_INJECTION", "3": "ZERO_DAY" };
        method = methods[methodChoice] || "MANUAL_INTRUSION";
    }

    term.print(`\n[ STATUS ] >>> INITIATING BREACH: ${target.toUpperCase()} [VECTOR: ${method.toUpperCase()}]`);
    await term.wait(500);

    term.print(`[ STATUS ] >>> ESTABLISHING PROXY_CHAIN [NODES: 48]...`);
    await term.wait(800);
    term.print(`[ STATUS ] >>> ENCAPSULATING PACKETS [METHOD: TUNNEL_AES-256]...`);
    await term.scrollingBitStream(1500);
    await term.progressBar("PROXY_SYNC", 1500, 20);

    term.print(`[ EXPLOIT ] >>> INJECTING ${method}...`);
    const hacked = await term.hexWallGame();
    if (!hacked) return;

    term.print(`[ STATUS ] >>> KERNEL PANIC DETECTED ON TARGET... BYPASSING.`);
    await term.wait(1000);

    term.print(`[ DOWNLOAD ] >>> EXFILTRATING ENCRYPTED VOLUMES...`);
    await term.progressBar("EXFILTRATION", 3000, 40);

    await term.hexStream(3000, true, target);

    term.updateDefcon(4);
    term.print(`\n[ OBJECTIVE_ACHIEVED ]`);
    term.print(`[ DATA_EXFIL ] >>> 4.2TB RECOVERED FROM ${target.toUpperCase()}`);
    term.print(`[ TRACE_ELIMINATION ] >>> PURGING VOLATILE LOGS...`);
    await term.wait(1000);
}

async function handleSitrep(isGlobal = false) {
    term.updateDefcon(3);
    term.print(`\n[ INITIATING ${isGlobal ? 'GLOBAL' : 'REGIONAL'} STRATEGIC SCAN ]`);
    await term.progressBar("SATELLITE_UPLINK", 1500, 30);

    term.print(`\n[ ${isGlobal ? 'GLOBAL' : 'REGIONAL'} STRATEGIC SITUATION REPORT ]`);
    term.print("+------------------------------------------+");
    term.print("| SECTOR         | TENSION | STATUS        |");
    term.print("+----------------+---------+---------------+");
    await term.wait(200);
    term.print("| NORTH_ATL      | 78%     | ELEVATED      |");
    await term.wait(200);
    term.print("| PACIFIC_RIM    | 92%     | CRITICAL      |");
    await term.wait(200);
    term.print("| EURASIA        | 85%     | UNSTABLE      |");
    await term.wait(200);
    term.print("| OFF-WORLD      | 12%     | NOMINAL       |");
    term.print("+----------------+---------+---------------+");
    term.print("| DEFCON STATUS: | [ 2 ]   | READY         |");
    term.print("+------------------------------------------+");
}

async function handleSysOverride() {
    const confirmed = await term.showConfirmationModal(
        "SYSTEM OVERRIDE DETECTED",
        "YOU ARE ATTEMPTING TO BYPASS ALL ARCHON SAFETY PROTOCOLS. THIS WILL GRANT KERNEL-LEVEL ACCESS TO STRATEGIC WEAPONS AND GLOBAL SURVEILLANCE SYSTEMS.\n\nUNAUTHORIZED ACCESS IS PUNISHABLE BY MARTIAL LAW.",
        "OVERRIDE-G-492"
    );
    if (confirmed) {
        await term.triggerRedFlicker();
        term.spawnWarningSigns(12);
        term.print("\n[ !!! WARNING !!! ]");
        term.print("+------------------------------------------+");
        term.print("|   !!! SAFETY PROTOCOLS BYPASSED !!!      |");
        term.print("+------------------------------------------+");
        term.print("[ STATE: KINETIC/LETHAL ]");
        term.print("[ ALL WEAPON LOCKS RELEASED ]");
        term.updateDefcon(1);
    } else {
        term.print("[ STATUS ] DIRECTIVE_ABORTED. PROTOCOLS_RESTORED.");
    }
}

async function handleNetTrace(preselectedOrigin = null) {
    let origin = preselectedOrigin;
    if (!origin) {
        term.print("\n[ NETWORK TRACE MODULE ]");
        term.print("ENTER ORIGIN IP OR NODE ID:");
        origin = await term.input();
        if (!origin) origin = "127.0.0.1";
    }
    term.print(`[ INITIATING REVERSE TRACE: ${origin} ]`);
    for (let i = 1; i <= 4; i++) {
        term.print(`HOP ${i}: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.0.${i} - ${Math.floor(Math.random()*100)}ms`);
        await term.wait(300);
    }
    term.print("[ TRACE COMPLETE ]");
}

async function handleSigInt(intercept = false, uplink = null) {
    term.print("\n[ SIGNALS INTELLIGENCE MODULE ACTIVE ]");
    if (uplink) {
        term.print(`[ STATUS ] >>> TARGETING UPLINK_ID: ${uplink}`);
    } else if (intercept) {
        term.print(`[ STATUS ] >>> INITIATING SIGNAL INTERCEPT...`);
    } else {
        term.print("[ STATUS ] >>> SCANNING GLOBAL SAT-COM UPLINKS...");
    }
    await term.progressBar("SIGNAL_LOCK", 2000, 30);

    // Scrolling bit-stream to hex conversion
    let start = Date.now();
    while (Date.now() - start < 3000) {
        let bitLine = '';
        for (let i = 0; i < 32; i++) bitLine += Math.random() > 0.5 ? '1' : '0';
        let hexLine = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
        term.print(`${bitLine} >> [CONVERTING] >> 0x${hexLine}`);
        await term.wait(50);
    }

    await term.hexStream(3000, true, "GCHQ_ENCRYPTED");
    term.print("\n[ INTEL PACKET STORED IN /MNT/SECURE_01 ]");
}

async function handleAuthLaunch(args) {
    let type = args.type || "NUCLEAR_ICBM";
    let coord = args.coord;

    if (!coord) {
        term.print("\n[ KINETIC WEAPONS MODULE ]");
        term.print("[ PROMPT ] SELECT_WEAPON_SYSTEM:");
        term.print("1. NUCLEAR ICBM (MIRV-EQUIPPED)");
        term.print("2. ION CANNON (ORBITAL)");
        term.print("3. DEEP-SPACE LASER");
        term.print("4. TACTICAL CRUISE MISSILE");
        const typeChoice = await term.input();
        term.updateDefcon(2);
        if (typeChoice === "2") type = "ION_CANNON";
        else if (typeChoice === "3") type = "DS_LASER";
        else if (typeChoice === "4") type = "CRUISE_MISSILE";

        term.print("\n[ INTERACTIVE TARGET ACQUISITION INITIATED ]");
        term.print("[ PROMPT ] SELECT_TARGET_NATION:");
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

        term.print(`\n[ PROMPT ] DESIGNATE_SECTOR [${country.toUpperCase()}]:`);
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

    const dossiers = {
        "DC": { pop: "712,000", strat: "Political Command & Control", weather: "Clear" },
        "NY": { pop: "8,400,000", strat: "Global Financial Hub", weather: "Overcast" },
        "NORAD": { pop: "Minimal", strat: "Aerospace Defense Command", weather: "Freezing" },
        "MSW": { pop: "12,600,000", strat: "Federation Leadership", weather: "Snowing" },
        "STP": { pop: "5,400,000", strat: "Naval Infrastructure", weather: "Fog" },
        "BJG": { pop: "21,500,000", strat: "CCP Command Center", weather: "Hazy" },
        "SHG": { pop: "24,800,000", strat: "Economic Gateway", weather: "Rain" },
        "PYG": { pop: "2,800,000", strat: "Regime Stronghold", weather: "Cold" },
        "THR": { pop: "8,600,000", strat: "Regional Power Base", weather: "Arid" },
        "LON": { pop: "8,900,000", strat: "Allied Strategic Hub", weather: "Mist" },
        "PAR": { pop: "2,100,000", strat: "European Cultural/Gov Center", weather: "Mild" },
        "DEL": { pop: "18,900,000", strat: "Regional Command", weather: "Extreme Heat" },
        "TLV": { pop: "460,000", strat: "Technological R&D Hub", weather: "Sunny" }
    };

    const targetKey = coord.split('_')[1];
    const dossier = dossiers[targetKey] || { pop: "Unknown", strat: "Collateral Sector", weather: "Unstable" };

    term.print("\n[ ACCESSING TARGET DOSSIER ]");
    await term.wait(800);
    term.print(`> POPULATION: ${dossier.pop}`);
    term.print(`> STRATEGIC VALUE: ${dossier.strat}`);
    term.print(`> LOCAL CONDITIONS: ${dossier.weather}`);
    await term.wait(1500);

    term.print("\n[ STATUS ] >>> WAITING FOR AUTHENTICATION CODES...");
    const codes = await term.input();

    await term.triggerRedFlicker();
    term.spawnWarningSigns(8);

    term.print("\n[ !!! WARNING !!! ]");
    term.print("+==========================================+");
    term.print(`|   !!! AUTHORIZATION: ${type} !!!   |`);
    term.print("+==========================================+");
    term.print(`TARGET COORDINATES: [ ${coord} ]`);

    term.print("\nVERIFYING CODES...");
    await term.wait(1000);
    term.print(`CODES ACCEPTED: [ ${codes.toUpperCase()} ]`);
    await term.wait(500);

    await term.spawnAlertStorm(20);
    term.updateDefcon(1);

    const confirmed = await term.showConfirmationModal(
        "CONFIRM STRATEGIC DIRECTIVE",
        `YOU ARE AUTHORIZING A KINETIC STRIKE USING WEAPON SYSTEM [${type}] AGAINST TARGET [${coord}].\n\nTHIS ACTION IS IRREVERSIBLE AND CARRIES EXTREME CASUALTY PROBABILITY.`,
        "SCORPION-31"
    );

    if (confirmed) {
        // THE SILENCE
        term.removeWarningSigns();
        document.body.style.animation = "none";
        document.body.classList.remove('kinetic');
        document.body.classList.remove('defcon-1', 'defcon-2', 'defcon-3', 'defcon-4');
        defconIndicator.style.display = 'none';
        newsMarquee.parentElement.style.display = 'none';
        term.clear();

        await term.wait(2000); // 2 seconds of silence

        // RESTORE THE UI for the profile
        defconIndicator.style.display = 'block';
        newsMarquee.parentElement.style.display = 'block';
        document.body.classList.add('kinetic');
        document.body.classList.add('defcon-1');

        term.print("\n[ STRATEGIC MISSION PROFILE ]");
        term.print("------------------------------------------");
        term.print(`DIRECTIVE:   KINETIC_PURGE`);
        term.print(`OPERATOR:    SCORPION_AI`);
        term.print(`WEAPON:      ${type.toUpperCase()}`);
        term.print(`TARGET:      ${coord}`);
        term.print(`ETA:         480 SECONDS`);
        term.print(`EXPECTED:    TOTAL_NEUTRALIZATION`);
        term.print("------------------------------------------");
        await term.wait(2000);

        term.print("\n" + "!".repeat(50));
        term.print("!!! KINETIC WEAPONS RELEASE AUTHORIZED !!!");
        term.print("!".repeat(50));
        term.print(`[ WEAPON_SYSTEM: ${type.toUpperCase()} ] [ TARGET_COORD: ${coord} ]\n`);
        await term.wait(1000);

        term.print(`[ STATUS ] >>> TRANSMITTING AUTH_CODES TO SILO_COMPLEX_04...`);
        await term.wait(800);
        term.print(`[ STATUS ] >>> DE-PASSIVATING THERMAL_BATTERY_ARRAY...`);
        await term.wait(800);
        term.print(`[ STATUS ] >>> CALIBRATING GYROSCOPIC_INERTIAL_SENSORS...`);
        await term.progressBar("CALIBRATION", 2500, 40);

        term.print(`[ STATUS ] >>> INITIATING LOX/RP-1 PROPELLANT_LOADING...`);
        await term.progressBar("FUELING", 3500, 40);

        term.print(`[ STATUS ] >>> SYSTEMS ONLINE. INTERNAL POWER ACTIVE.`);
        await term.wait(1000);

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
            await term.wait(200);
        }

        if (type.toUpperCase() === 'ION_CANNON' || type.toUpperCase() === 'DS_LASER') {
            term.print("\n[ INITIATING EXO-ATMOSPHERIC CALIBRATION ]");
            await term.wait(800);
            term.print(`[ CALC ] >>> ALTITUDE: 35,786 KM (GEOSTATIONARY)`);
            term.print(`[ CALC ] >>> RELATIVE VELOCITY: 3.07 KM/S`);
            term.print(`[ CALC ] >>> LENS_FOCUS: 0.00042 ARC-SECONDS`);
            await term.progressBar("ORBITAL_ALIGNMENT", 2000, 30);
            term.print(`\n[ ORBITAL COORDINATES: ${coord},042 ]`);
            term.print(`[ ION_DENSITY: 4.2e12 / cm^3 ]`);
            term.print(`[ ATMOSPHERIC IGNITION PROBABILITY: ${(Math.random() * 0.05 + 0.94).toFixed(4)} ]`);
        } else {
            term.print("\n[ INITIATING BALLISTIC TRAJECTORY CALCULATION ]");
            await term.wait(800);
            term.print(`[ CALC ] >>> APOAPSIS: 1,200 KM`);
            term.print(`[ CALC ] >>> RE-ENTRY VELOCITY: MACH 23`);
            term.print(`[ CALC ] >>> CEP: < 10 METERS`);
            await term.progressBar("FLIGHT_PATH_SYNC", 2000, 30);
            term.print(`\n[ ICBM BALLISTIC PATH: SUB-ORBITAL ARC ]`);
        }

        term.print("\n[ FINAL CODES VERIFIED ] [ STANDBY FOR LAUNCH ]");
        await term.wait(1000);

        for (let i = 5; i > 0; i--) {
            term.print(`T-MINUS ${i}...`);
            await term.wait(1000);
        }

        term.print("\n[ IGNITION ]");
        await term.wait(1000);

        // PLAY CINEMATIC VIDEO FEED
        let videoId = "9reL_rQp7og"; // Default ICBM
        if (type === "ION_CANNON" || type === "DS_LASER") videoId = "3_v_0N-S3vM";
        if (type === "CRUISE_MISSILE") videoId = "9d8wWcJLnFI";

        await term.playVideo(videoId);

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
        term.print("          [ OBJECTIVE_ACHIEVED ]");

        if (type === "ION_CANNON" || type === "DS_LASER" || type === "CRUISE_MISSILE") {
            term.print("          [ TARGET_NEUTRALIZED: SURGICAL_STRIKE_SUCCESS ]");
        } else {
            term.print("          [ SECTOR_ANNIHILATED: MASS_CASUALTY_CONFIRMED ]");
        }

        term.print("\n          [ WORLD DEFENSE SYSTEM: ACTIVE ]");
        await term.wait(4000);

        term.setKinetic(false);
        term.clear();
        term.print("[ STANDBY ]");
    } else {
        term.print("[ STATUS ] LAUNCH_ABORTED. KINETIC_LOCK_RESTORED.");
        term.setKinetic(false);
    }
}

async function handleIonCalibrate(preselectedTarget = null) {
    let target = preselectedTarget;
    if (!target) {
        term.print("\n[ ION CANNON CALIBRATION ]");
        term.print("ENTER TARGET COORDINATES (X,Y,Z):");
        target = await term.input();
    }

    term.print(`\n[ STATUS ] >>> INITIATING ION CANNON CALIBRATION: ${target}`);
    await term.wait(800);
    term.print(`[ CALC ] >>> ALTITUDE: 35,786 KM (GEOSTATIONARY)`);
    await term.progressBar("ORBITAL_ALIGNMENT", 2000, 30);
    term.print(`[ STATUS ] >>> ION_DENSITY: 4.2e12 / cm^3`);
    term.print(`[ STATUS ] >>> CALIBRATION_COMPLETE`);
}

async function handleLaserAlign(preselectedTarget = null) {
    let target = preselectedTarget;
    if (!target) {
        term.print("\n[ DEEP-SPACE LASER ALIGNMENT ]");
        term.print("ENTER TARGET SECTOR:");
        target = await term.input();
    }

    term.print(`\n[ STATUS ] >>> INITIATING LASER ALIGNMENT: ${target}`);
    await term.wait(800);
    term.print(`[ CALC ] >>> LENS_FOCUS: 0.00042 ARC-SECONDS`);
    await term.progressBar("MIRROR_ALIGNMENT", 2500, 30);
    term.print(`[ STATUS ] >>> COHERENCE: 99.98%`);
    term.print(`[ STATUS ] >>> ALIGNMENT_COMPLETE`);
}

run();
