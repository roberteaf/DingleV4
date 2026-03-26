import asyncio
import logging
import os
import random
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from playwright.async_api import async_playwright

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROFILE_DIR = Path("blooket_profile")
PROFILE_DIR.mkdir(exist_ok=True)

async def join_bots(game_code, base_name, bot_count):
    joined = 0
    nicknames = [base_name] + [f"{base_name}{i}" for i in range(1, bot_count)]

    async with async_playwright() as p:
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
                await page.goto("https://play.blooket.com")
                await page.wait_for_selector("input[placeholder*='Game Code']", timeout=60000)
                await page.fill("input[placeholder*='Game Code']", game_code)
                await page.click("button:has-text('Next')")
                await page.wait_for_selector("input[placeholder*='Nickname']", timeout=10000)
                await page.fill("input[placeholder*='Nickname']", nick)
                await page.click("button:has-text('Join')")
                await asyncio.sleep(3)
                error = await page.query_selector("text=Game code invalid")
                if error:
                    logger.error(f"Invalid code for {nick}")
                else:
                    joined += 1
                    logger.info(f"✅ {nick} joined")
            except Exception as e:
                logger.error(f"Error for {nick}: {e}")
            finally:
                await page.close()
                await asyncio.sleep(random.uniform(0.8, 2.5))
        await browser.close()
    return joined

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'running', 'message': 'Blooket Bot Backend is active'})

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'ok'})

@app.route('/join', methods=['POST'])
def join():
    data = request.json
    game_code = data.get('game_code')
    base_name = data.get('base_name')
    bot_count = data.get('bot_count', 1)

    if not game_code or not base_name:
        return jsonify({'error': 'Missing game_code or base_name'}), 400

    try:
        bot_count = int(bot_count)
        if bot_count < 1 or bot_count > 10:
            return jsonify({'error': 'Bot count must be between 1 and 10'}), 400
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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
