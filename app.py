"""
Blooket Bot Backend
-------------------
A Flask API that uses Playwright to join bots and modify game economy.
Deployed on Railway.
"""

import asyncio
import logging
import os
import random
import shutil
import time
from pathlib import Path
from datetime import datetime

from flask import Flask, request, jsonify, render_template_string
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

# ---------- Configuration ----------
PROFILE_DIR = Path("blooket_profile")
PROFILE_DIR.mkdir(exist_ok=True)

MAX_BOTS = 10
DELAY_MIN = 800          # milliseconds
DELAY_MAX = 2500
TIMEOUT_CODE = 60000     # wait for code input (60s)
TIMEOUT_NICK = 10000     # wait for nickname input (10s)
TIMEOUT_AFTER_CLICK = 500  # ms after filling before clicking

# ---------- Logging ----------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# ---------- Flask App ----------
app = Flask(__name__)

# ---------- CORS Handling ----------
def add_cors_headers(response):
    """Add CORS headers to every response."""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

app.after_request(add_cors_headers)

# ---------- Helper: Wait for Element with Multiple Selectors ----------
async def wait_for_element(page, selectors, timeout):
    """Try multiple selectors and return the first visible element."""
    start = time.time()
    while (time.time() - start) * 1000 < timeout:
        for sel in selectors:
            try:
                elem = await page.query_selector(sel)
                if elem and await elem.is_visible():
                    return elem
            except:
                pass
        await asyncio.sleep(0.2)
    return None

# ---------- Helper: Find Button by Text ----------
async def find_button_by_text(page, texts):
    """Find a visible button whose text contains any of the given strings."""
    buttons = await page.query_selector_all('button, a, div[role="button"], [class*="button"], input[type="submit"]')
    for btn in buttons:
        if not await btn.is_visible():
            continue
        txt = (await btn.text_content()).strip().lower()
        for t in texts:
            if t.lower() in txt:
                return btn
    return None

# ---------- Core Bot Joining ----------
async def join_bots(game_code: str, base_name: str, bot_count: int) -> int:
    """
    Join multiple bots into a Blooket game.
    Returns the number of successfully joined bots.
    """
    joined = 0
    nicknames = [base_name] + [f"{base_name}{i}" for i in range(1, bot_count)]

    async with async_playwright() as p:
        # Launch persistent context (saves cookies, profile)
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            headless=True,
            viewport={"width": 1280, "height": 720},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        )

        for idx, nick in enumerate(nicknames):
            page = await browser.new_page()
            try:
                logger.info(f"Joining {nick}")
                # ----- Step 1: Enter code and click Next -----
                await page.goto("https://play.blooket.com")
                code_selectors = [
                    'input[placeholder*="Game Code"]',
                    'input[placeholder*="Game ID"]',
                    'input[type="text"]'
                ]
                code_input = await wait_for_element(page, code_selectors, TIMEOUT_CODE)
                if not code_input:
                    logger.error(f"Code input not found for {nick}")
                    continue

                await code_input.fill(game_code)
                await code_input.dispatch_event('input')
                await code_input.dispatch_event('change')
                logger.debug(f"Code entered for {nick}")
                await asyncio.sleep(TIMEOUT_AFTER_CLICK / 1000)

                next_btn = await find_button_by_text(page, ["next", "join", "play", "→"])
                if not next_btn:
                    logger.error(f"Next button not found for {nick}")
                    continue
                await next_btn.click()
                logger.debug(f"Clicked Next for {nick}")

                # ----- Step 2: Wait for nickname page -----
                nick_selectors = [
                    'input[placeholder*="Nickname"]',
                    'input[name="nickname"]'
                ]
                nick_input = await wait_for_element(page, nick_selectors, TIMEOUT_NICK)
                if not nick_input:
                    logger.error(f"Nickname input not found for {nick}")
                    continue

                await nick_input.fill(nick)
                await nick_input.dispatch_event('input')
                await nick_input.dispatch_event('change')
                logger.debug(f"Nickname entered for {nick}")
                await asyncio.sleep(TIMEOUT_AFTER_CLICK / 1000)

                join_btn = await find_button_by_text(page, ["join", "start", "play", "→"])
                if not join_btn:
                    logger.error(f"Join button not found for {nick}")
                    continue
                await join_btn.click()
                logger.debug(f"Clicked Join for {nick}")

                # ----- Check for error -----
                await asyncio.sleep(3)
                error_elem = await page.query_selector("text=Game code invalid")
                if error_elem:
                    logger.error(f"Invalid game code for {nick}")
                else:
                    joined += 1
                    logger.info(f"✅ {nick} joined successfully")
            except Exception as e:
                logger.exception(f"Error joining {nick}: {e}")
            finally:
                await page.close()
                # Random delay between bots
                await asyncio.sleep(random.uniform(DELAY_MIN / 1000, DELAY_MAX / 1000))

        await browser.close()
    return joined

# ---------- Economy Commands ----------
async def detect_game_mode(page):
    """Try to detect the current game mode (Gold Quest, Fishing Frenzy, etc.)."""
    url = page.url
    if "goldquest" in url:
        return "goldquest"
    if "fishing" in url:
        return "fishingfrenzy"
    # Could also inspect window.game object if available
    game = await page.evaluate("() => window.game")
    if game and game.get('mode'):
        return game['mode'].lower()
    return "unknown"

async def crash_economy(page):
    """Set all players' currency to 0 in supported game modes."""
    mode = await detect_game_mode(page)
    if mode == "goldquest":
        result = await page.evaluate("""() => {
            const game = window.game;
            if (game && game.players) {
                for (let id in game.players) {
                    if (game.players[id].gold !== undefined) game.players[id].gold = 0;
                }
                return true;
            }
            return false;
        }""")
        return {"success": result, "mode": mode}
    elif mode == "fishingfrenzy":
        result = await page.evaluate("""() => {
            const game = window.game;
            if (game && game.players) {
                for (let id in game.players) {
                    if (game.players[id].fish !== undefined) game.players[id].fish = 0;
                    if (game.players[id].weight !== undefined) game.players[id].weight = 0;
                }
                return true;
            }
            return false;
        }""")
        return {"success": result, "mode": mode}
    else:
        return {"success": False, "mode": mode, "error": "Unsupported game mode"}

async def boost_economy(page, amount=1e12):
    """Give all players a huge amount of currency."""
    mode = await detect_game_mode(page)
    if mode == "goldquest":
        result = await page.evaluate(f"""() => {{
            const game = window.game;
            if (game && game.players) {{
                for (let id in game.players) {{
                    if (game.players[id].gold !== undefined) game.players[id].gold += {amount};
                }}
                return true;
            }}
            return false;
        }}""")
        return {"success": result, "mode": mode, "amount": amount}
    elif mode == "fishingfrenzy":
        result = await page.evaluate(f"""() => {{
            const game = window.game;
            if (game && game.players) {{
                for (let id in game.players) {{
                    if (game.players[id].fish !== undefined) game.players[id].fish += {amount};
                    if (game.players[id].weight !== undefined) game.players[id].weight += {amount};
                }}
                return true;
            }}
            return false;
        }}""")
        return {"success": result, "mode": mode, "amount": amount}
    else:
        return {"success": False, "mode": mode, "error": "Unsupported game mode"}

# ---------- API Endpoints ----------
@app.route('/', methods=['GET'])
def index():
    """Simple status page."""
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head><title>Blooket Bot Backend</title></head>
    <body>
        <h1>🤖 Blooket Bot Backend</h1>
        <p>Status: <strong>Running</strong></p>
        <p>Profile: {{ profile_exists }}</p>
        <p>Endpoints:</p>
        <ul>
            <li><a href="/ping">GET /ping</a> – health check</li>
            <li>POST /join – join bots</li>
            <li>POST /economy/crash – crash economy</li>
            <li>POST /economy/boost – boost economy</li>
            <li>GET /status – show profile info</li>
            <li>POST /reset-profile – delete profile (restart needed)</li>
        </ul>
    </body>
    </html>
    """, profile_exists="Yes" if PROFILE_DIR.exists() and any(PROFILE_DIR.iterdir()) else "No")

@app.route('/ping', methods=['GET', 'OPTIONS'])
def ping():
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify({'status': 'ok', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/join', methods=['POST', 'OPTIONS'])
def join():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    game_code = data.get('game_code')
    base_name = data.get('base_name')
    bot_count = data.get('bot_count', 1)

    if not game_code or not base_name:
        return jsonify({'error': 'Missing game_code or base_name'}), 400

    try:
        bot_count = int(bot_count)
        if bot_count < 1 or bot_count > MAX_BOTS:
            return jsonify({'error': f'Bot count must be between 1 and {MAX_BOTS}'}), 400
    except:
        return jsonify({'error': 'Invalid bot count'}), 400

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        joined = loop.run_until_complete(join_bots(game_code, base_name, bot_count))
        return jsonify({'joined': joined, 'total': bot_count})
    except Exception as e:
        logger.exception(e)
        return jsonify({'error': str(e)}), 500
    finally:
        loop.close()

@app.route('/economy/crash', methods=['POST', 'OPTIONS'])
def crash():
    if request.method == 'OPTIONS':
        return '', 200

    # Need to be on a game page. This endpoint is meant to be called while the browser is on a game page.
    # We'll launch a new page with the current game URL? But we don't have that from the API.
    # For simplicity, we'll use the persistent profile and go to the last visited game page.
    # This is tricky; a better approach would be to have the user pass the game URL or use cookies.
    # Here we'll attempt to use the profile to visit a known game (but that's not robust).
    # For now, we'll return an error and explain.
    return jsonify({'error': 'This endpoint requires the game URL to be passed. For now, use the /join endpoint to join bots.'}), 501

@app.route('/economy/boost', methods=['POST', 'OPTIONS'])
def boost():
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify({'error': 'This endpoint is not yet implemented. Use the /join endpoint instead.'}), 501

@app.route('/status', methods=['GET'])
def status():
    """Return information about the persistent profile."""
    profile_exists = PROFILE_DIR.exists() and any(PROFILE_DIR.iterdir())
    return jsonify({
        'profile_exists': profile_exists,
        'profile_dir': str(PROFILE_DIR),
        'max_bots': MAX_BOTS,
        'delay_range_ms': [DELAY_MIN, DELAY_MAX]
    })

@app.route('/reset-profile', methods=['POST', 'OPTIONS'])
def reset_profile():
    """Delete the persistent profile folder. The next request will create a fresh one."""
    if request.method == 'OPTIONS':
        return '', 200
    if PROFILE_DIR.exists():
        shutil.rmtree(PROFILE_DIR)
        PROFILE_DIR.mkdir()
        return jsonify({'status': 'Profile deleted. Next request will create a new one.'})
    else:
        return jsonify({'status': 'Profile already empty.'})

# ---------- Run ----------
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
