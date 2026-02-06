import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Load the local index.html
        path = os.path.abspath("index.html")
        await page.goto(f"file://{path}")

        # Wait for the prompt to appear
        await page.wait_for_selector("#prompt-label:has-text('root@scorpion:~/ $')", timeout=30000)
        print("Initial prompt detected.")

        async def send_cmd(cmd):
            await page.keyboard.type(cmd)
            await page.keyboard.press("Enter")
            await asyncio.sleep(0.5)

        # Test SITREP --global
        await send_cmd("SITREP --global")
        await page.wait_for_selector("#output:has-text('GLOBAL STRATEGIC')", timeout=10000)
        print("SITREP --global verified.")

        # Test net_trace
        await send_cmd("net_trace --origin 8.8.8.8")
        await page.wait_for_selector("#output:has-text('TRACE COMPLETE')", timeout=15000)
        print("net_trace verified.")

        # Test scp_fetch
        await send_cmd("scp_fetch --target NASA --method SQL_INJECTION")
        print("Sent scp_fetch, waiting for completion...")
        # Increase timeout for complex animations
        await page.wait_for_selector("#output:has-text('DATA ACQUIRED FROM NASA')", timeout=30000)
        print("scp_fetch verified.")

        # Test auth_launch (interactive)
        await send_cmd("auth_launch --type ION_CANNON")
        await page.wait_for_selector("#output:has-text('SELECT TARGET COUNTRY')", timeout=10000)
        await send_cmd("USA")
        await page.wait_for_selector("#output:has-text('SELECT SECTOR IN USA')", timeout=10000)
        await send_cmd("NORAD")

        await page.wait_for_selector("body.kinetic", timeout=20000)
        print("auth_launch trigger verified.")

        await send_cmd("BETA-CODE-01")
        await page.wait_for_selector("#output:has-text('CONFIRM')", timeout=10000)
        await send_cmd("CONFIRM")

        await page.wait_for_selector("#output:has-text('MISSION ACCOMPLISHED')", timeout=30000)
        print("Mission accomplished verified.")

        await page.screenshot(path="verification_final.png")
        print("Verification screenshot saved.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
