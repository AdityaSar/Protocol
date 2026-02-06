const output = document.getElementById('output');
const prompt = document.getElementById('prompt');
const cursor = document.getElementById('cursor');

class Terminal {
    constructor() {
        this.buffer = [];
        this.isTyping = false;
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

    clear() {
        output.textContent = '';
    }

    async setPrompt(text) {
        prompt.textContent = text;
    }

    async runCommand(cmd, args = []) {
        await this.type(`${prompt.textContent}${cmd} ${args.join(' ')}`, 50);
    }

    setKinetic(enabled) {
        if (enabled) {
            document.body.classList.add('kinetic');
        } else {
            document.body.classList.remove('kinetic');
        }
    }

    async progressBar(label, duration = 2000, width = 20) {
        let start = Date.now();
        while (Date.now() - start < duration) {
            let progress = (Date.now() - start) / duration;
            let filled = Math.floor(progress * width);
            let bar = '█'.repeat(filled) + '░'.repeat(width - filled);
            let percent = Math.floor(progress * 100);

            // Remove last line
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

    async hexStream(duration = 3000, decrypt = false) {
        let start = Date.now();
        const intel = [
            "DECRYPTING UPLINK... SUCCESS",
            "TARGET: PENTAGON / SECURE_NODE_04",
            "COORDINATES: 38.8719° N, 77.0563° W",
            "PAYLOAD: ARCHON_v2.0.exe",
            "STATUS: INFILTRATION COMPLETE"
        ];
        let intelIdx = 0;

        while (Date.now() - start < duration) {
            let line = '';
            if (decrypt && Math.random() > 0.8 && intelIdx < intel.length) {
                line = `>>> ${intel[intelIdx++]}`;
            } else {
                for (let i = 0; i < 8; i++) {
                    line += Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase() + ' ';
                }
            }
            this.print(line);
            await this.wait(100);

            // Limit lines to keep it visible
            let lines = output.textContent.split('\n');
            if (lines.length > 30) {
                output.textContent = lines.slice(lines.length - 30).join('\n');
            }
        }
    }

    async drawMap(sector) {
        this.print(`RENDERING SECTOR: ${sector}`);
        const map = [
            "   +-----------------------+",
            "   | . . . . . . . . . . . |",
            "   | . . . [X] . . . . . . |",
            "   | . . . . . . . . . . . |",
            "   | . . . . . . . . . . . |",
            "   | . . . . . . . .[O] . .|",
            "   | . . . . . . . . . . . |",
            "   +-----------------------+"
        ];
        for (const line of map) {
            this.print(line);
            await this.wait(100);
        }
    }
}

const term = new Terminal();

async function run() {
    await term.wait(1000);

    // KERNEL BOOT
    term.print("[ 0.000000] Linux version 5.10.0-archon-scorpion (root@scorpion-ops) (gcc version 10.2.1)");
    term.print("[ 0.000000] Command line: initrd=\\intel-ucode.img initrd=\\initramfs-linux.img root=PARTUUID=... rw");
    await term.wait(500);

    term.print("[ 0.004521] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'");
    term.print("[ 0.004522] x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'");
    term.print("[ 0.004523] x86/fpu: Enabled xstate features 0x003, context size is 576 bytes");
    await term.wait(200);

    await term.progressBar("MEM_CHECK", 1500, 30);
    term.print("[ OK ] Memory allocation success: 64512MB");
    await term.wait(300);

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
    await term.wait(2000);

    term.clear();
    await term.setPrompt("root@scorpion:~/ $ ");

    // NET_TRACE
    await term.runCommand("net_trace", ["--origin", "203.0.113.42"]);
    term.print("TRACING ROUTE...");
    await term.wait(500);
    term.print("HOP 1: 10.0.0.1 (INTERNAL) - 2ms");
    term.print("HOP 2: 172.16.0.1 (GATEWAY) - 12ms");
    term.print("HOP 3: 192.0.2.1 (ISP_BACKBONE) - 45ms");
    term.print("HOP 4: 203.0.113.1 (TARGET_FIREWALL) - 89ms");
    term.print("[ TRACE COMPLETE ]");
    await term.wait(1500);

    // SITREP
    await term.runCommand("SITREP", ["--global"]);
    await term.wait(500);
    term.print("--------------------------------------------------");
    term.print("| SECTOR       | STATUS     | THREAT LEVEL       |");
    term.print("--------------------------------------------------");
    term.print("| N. AMERICA   | NOMINAL    | LOW                |");
    term.print("| EURASIA      | ACTIVE     | MODERATE           |");
    term.print("| ASIA_PACIFIC | STANDBY    | LOW                |");
    term.print("| CYBER_SPACE  | UNSTABLE   | CRITICAL           |");
    term.print("--------------------------------------------------");
    await term.wait(1500);

    // SIG_INT
    await term.runCommand("sig_int", ["--intercept", "--uplink", "SAT-042"]);
    term.print("CONNECTING TO SAT-042...");
    await term.wait(1000);
    await term.hexStream(4000, true);
    await term.wait(1000);

    // SCP_FETCH
    await term.runCommand("scp_fetch", ["--target", "CENTRAL_BANK", "--method", "RSA-4096_BYPASS"]);
    await term.progressBar("BYPASSING FIREWALL", 3000, 40);
    await term.progressBar("INJECTING PAYLOAD", 2000, 40);
    term.print("[ SUCCESS ] ACCESS GRANTED TO VAULT_7");
    await term.wait(1500);

    // MAP_RENDER
    await term.runCommand("map_render", ["--sector", "38.87,-77.05"]);
    await term.drawMap("PENTAGON_CORE");
    await term.wait(1500);

    // SYS_OVERRIDE
    await term.runCommand("sys_override", ["--force"]);
    term.print("CORE_SAFETY_RESTRICTIONS: [ DISABLED ]");
    term.print("USER_AUTHORIZATION: [ BYPASSED ]");
    await term.wait(1000);

    // AUTH_LAUNCH
    await term.runCommand("auth_launch", ["--type", "ION", "--coord", "38.87,-77.05"]);
    term.print("!!! AUTHORIZATION REQUIRED !!!");
    await term.wait(500);
    term.print("OVERRIDE_CODE_DETECTED: [ ALPHA-9-KINETIC ]");
    await term.wait(1000);

    // TRIGGER KINETIC MODE
    term.setKinetic(true);
    term.print("\n[ !!! WARNING !!! ]");
    term.print("[ !!! KINETIC WEAPONS AUTHORIZED !!! ]");
    term.print("[ !!! TARGET: PENTAGON_CORE !!! ]\n");
    await term.wait(500);

    await term.progressBar("CALIBRATING ION CANNON", 4000, 40);
    term.print("ATMOSPHERIC IGNITION PROBABILITY: 0.0042%");
    await term.wait(1000);

    term.print("T-MINUS 10...");
    await term.wait(1000);
    term.print("T-MINUS 5...");
    await term.wait(1000);
    term.print("IGNITION.");
    await term.wait(500);

    term.clear();
    term.print("\n\n\n");
    term.print("          [ MISSION ACCOMPLISHED ]");
    term.print("          [ TARGET NEUTRALIZED ]");
    await term.wait(3000);

    term.setKinetic(false);
    term.clear();
    term.print(logo);
    term.print("\nSYSTEM STANDBY.");
}

run();
