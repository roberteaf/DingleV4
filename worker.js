const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DingleV5</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
:root{--deep:#020b18;--abyss:#030f20;--ocean:#0a2540;--mid:#0d3b6e;--surface:#1a5c9a;--foam:#3a9bd5;--shimmer:#7dd3fc;--glow:#a8edff;--white:#e8f4ff;--coral:#ff6b6b;--glass:rgba(10,37,64,0.6);--glass2:rgba(26,92,154,0.15);}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;background:var(--deep);font-family:'Josefin Sans',sans-serif;color:var(--white);overflow:hidden;}
#bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 0%,#0d3b6e 0%,#020b18 70%);overflow:hidden;}
.wave{position:absolute;width:300%;height:300%;background:radial-gradient(ellipse,rgba(58,155,213,0.07) 0%,transparent 60%);animation:drift 18s ease-in-out infinite alternate;}
.wave:nth-child(2){animation-duration:24s;animation-delay:-8s;opacity:.5;top:20%;}
.wave:nth-child(3){animation-duration:30s;animation-delay:-15s;opacity:.3;top:40%;}
@keyframes drift{0%{transform:translate(-30%,-10%) rotate(0deg)}100%{transform:translate(10%,10%) rotate(8deg)}}
.bubble{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 35%,rgba(168,237,255,0.4),rgba(58,155,213,0.05));border:1px solid rgba(168,237,255,0.15);animation:rise linear infinite;}
@keyframes rise{0%{transform:translateY(100vh) scale(0);opacity:0}10%{opacity:.8}90%{opacity:.3}100%{transform:translateY(-10vh) scale(1.5);opacity:0}}
#app{position:relative;z-index:1;width:100%;height:100%;display:flex;flex-direction:column;}
#header{padding:14px 24px 0;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
#logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-style:italic;background:linear-gradient(135deg,var(--glow),var(--shimmer),var(--foam));-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 12px rgba(125,211,252,0.5));}
#status{height:18px;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:4px;}
.sdot{width:5px;height:5px;border-radius:50%;background:var(--foam);box-shadow:0 0 8px var(--foam);margin-right:7px;animation:pulse 2s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
#stxt{font-size:.6rem;letter-spacing:2px;color:rgba(125,211,252,0.4);}
#content{flex:1;overflow:hidden;position:relative;}
.tab-panel{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;padding:0 20px 20px;overflow-y:auto;}
.tab-panel.active{display:flex;}
.tab-panel::-webkit-scrollbar{width:4px;}
.tab-panel::-webkit-scrollbar-thumb{background:var(--mid);border-radius:2px;}
#search-hero{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;width:100%;max-width:720px;margin:0 auto;gap:10px;}
#search-tagline{font-family:'Playfair Display',serif;font-style:italic;font-size:1.1rem;color:var(--shimmer);opacity:.7;margin-bottom:16px;letter-spacing:1px;}
.sbar-label{font-size:.68rem;letter-spacing:2px;text-transform:uppercase;color:rgba(125,211,252,0.45);align-self:flex-start;width:100%;margin-bottom:4px;margin-top:8px;}
.sbar{width:100%;background:var(--glass);border:1px solid rgba(125,211,252,0.22);border-radius:60px;backdrop-filter:blur(18px);display:flex;align-items:center;padding:6px 6px 6px 24px;box-shadow:0 8px 40px rgba(0,0,0,0.4);transition:border-color .3s;}
.sbar:focus-within{border-color:rgba(125,211,252,0.55);}
.sbar input{flex:1;background:none;border:none;outline:none;color:var(--white);font-family:'Josefin Sans',sans-serif;font-size:.95rem;}
.sbar input::placeholder{color:rgba(168,237,255,0.35);}
.sbtn{background:linear-gradient(135deg,var(--surface),var(--foam));border:none;border-radius:50px;padding:10px 22px;color:white;font-family:'Josefin Sans',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:transform .2s;white-space:nowrap;}
.sbtn:hover{transform:scale(1.04);}
.sbtn.alt{background:linear-gradient(135deg,var(--mid),var(--surface));}
#search-embed-wrap{display:none;position:fixed;inset:0;z-index:200;flex-direction:column;background:var(--abyss);}
#search-embed-wrap.open{display:flex;}
#embed-bar{background:var(--ocean);padding:10px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(125,211,252,0.15);flex-shrink:0;}
#embed-bar input{flex:1;background:var(--glass);border:1px solid rgba(125,211,252,0.2);border-radius:30px;padding:8px 18px;color:var(--white);font-family:'Josefin Sans',sans-serif;font-size:.88rem;outline:none;}
#embed-go{background:rgba(58,155,213,0.3);border:1px solid rgba(125,211,252,0.3);color:var(--shimmer);padding:8px 16px;border-radius:20px;cursor:pointer;font-family:'Josefin Sans',sans-serif;font-size:.72rem;letter-spacing:1px;white-space:nowrap;}
#embed-close{background:rgba(255,107,107,0.2);border:1px solid rgba(255,107,107,0.4);color:var(--coral);padding:8px 16px;border-radius:20px;cursor:pointer;font-family:'Josefin Sans',sans-serif;font-size:.72rem;letter-spacing:1px;white-space:nowrap;}
#search-iframe{flex:1;border:none;width:100%;}
#games-header{width:100%;max-width:1100px;margin:22px auto 14px;flex-shrink:0;}
#games-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-style:italic;color:var(--shimmer);text-align:center;margin-bottom:12px;letter-spacing:1px;}
.gsbar{display:flex;align-items:center;background:var(--glass);border:1px solid rgba(125,211,252,0.18);border-radius:50px;backdrop-filter:blur(18px);padding:6px 6px 6px 20px;}
.gsbar input{flex:1;background:none;border:none;outline:none;color:var(--white);font-family:'Josefin Sans',sans-serif;font-size:.9rem;}
.gsbar input::placeholder{color:rgba(168,237,255,0.3);}
#games-filter{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:12px 0;width:100%;max-width:1100px;}
.genre-pill{background:var(--glass2);border:1px solid rgba(125,211,252,0.1);color:rgba(168,237,255,0.55);padding:5px 13px;border-radius:20px;cursor:pointer;font-size:.66rem;letter-spacing:1.5px;text-transform:uppercase;transition:all .2s;}
.genre-pill.active,.genre-pill:hover{background:rgba(58,155,213,0.22);border-color:var(--foam);color:var(--glow);}
#games-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:13px;width:100%;max-width:1100px;padding-bottom:20px;}
.game-card{background:var(--glass);border:1px solid rgba(125,211,252,0.1);border-radius:13px;overflow:hidden;cursor:pointer;transition:all .25s;position:relative;backdrop-filter:blur(18px);}
.game-card:hover{border-color:rgba(125,211,252,0.35);transform:translateY(-4px) scale(1.02);box-shadow:0 14px 38px rgba(0,0,0,0.4);}
.game-thumb{width:100%;height:115px;display:flex;align-items:center;justify-content:center;font-size:3rem;position:relative;overflow:hidden;}
.game-thumb-bg{position:absolute;inset:0;opacity:.15;}
.game-thumb-emoji{position:relative;z-index:1;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5));}
.game-info{padding:9px 12px 11px;}
.game-info h4{font-size:.8rem;font-weight:600;color:var(--glow);margin-bottom:2px;}
.game-genre-tag{font-size:.6rem;letter-spacing:1.5px;text-transform:uppercase;color:rgba(125,211,252,0.45);}
.game-play-btn{position:absolute;top:7px;right:7px;background:rgba(58,155,213,0.28);border:1px solid rgba(125,211,252,0.28);color:var(--shimmer);padding:3px 8px;border-radius:9px;font-size:.6rem;font-weight:700;letter-spacing:1px;opacity:0;transition:opacity .2s;font-family:'Josefin Sans',sans-serif;}
.game-card:hover .game-play-btn{opacity:1;}
#game-overlay{display:none;position:fixed;inset:0;z-index:400;background:var(--abyss);flex-direction:column;}
#game-overlay.open{display:flex;}
#game-topbar{background:var(--ocean);padding:10px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(125,211,252,0.15);flex-shrink:0;}
#game-title{font-size:.9rem;font-weight:600;color:var(--glow);}
#game-close{margin-left:auto;background:rgba(255,107,107,0.15);border:1px solid rgba(255,107,107,0.3);color:var(--coral);padding:7px 16px;border-radius:16px;cursor:pointer;font-family:'Josefin Sans',sans-serif;font-size:.72rem;letter-spacing:1px;}
#game-iframe{flex:1;border:none;width:100%;}
#bottom-nav{flex-shrink:0;padding:10px 20px 14px;display:flex;justify-content:center;gap:10px;}
.nav-tab{display:flex;flex-direction:column;align-items:center;gap:4px;background:var(--glass2);border:1px solid rgba(125,211,252,0.1);border-radius:20px;padding:10px 36px;cursor:pointer;transition:all .3s;backdrop-filter:blur(18px);}
.nav-tab.active,.nav-tab:hover{background:rgba(26,92,154,0.4);border-color:rgba(125,211,252,0.35);}
.nav-tab.active{border-color:var(--foam);box-shadow:0 0 20px rgba(58,155,213,0.2);}
.nav-icon{font-size:1.2rem;}
.nav-label{font-size:.62rem;letter-spacing:2px;text-transform:uppercase;color:var(--shimmer);}
.empty-state{text-align:center;padding:60px 20px;color:rgba(168,237,255,0.25);font-size:.82rem;letter-spacing:2px;text-transform:uppercase;line-height:2;grid-column:1/-1;}
.empty-state .big{font-size:3rem;display:block;margin-bottom:16px;opacity:.3;}
</style>
</head>
<body>
<div id="bg"><div class="wave"></div><div class="wave"></div><div class="wave"></div></div>
<div id="app">
  <div id="header"><div id="logo">DingleV5</div></div>
  <div id="status"><div class="sdot"></div><span id="stxt">PRIVATE • SECURE • UNBLOCKED</span></div>
  <div id="content">
    <div class="tab-panel active" id="tab-search">
      <div id="search-hero">
        <div id="search-tagline">search & browse privately</div>
        <div class="sbar-label">🔍 Google Search</div>
        <div class="sbar">
          <input type="text" id="search-input" placeholder="search anything…" autocomplete="off" onkeydown="if(event.key==='Enter')doSearch()">
          <button class="sbtn" onclick="doSearch()">Search</button>
        </div>
        <div class="sbar-label">🌐 Proxy — open any blocked site</div>
        <div class="sbar">
          <input type="text" id="proxy-input" placeholder="youtube.com, roblox.com…" autocomplete="off" onkeydown="if(event.key==='Enter')doProxy()">
          <button class="sbtn alt" onclick="doProxy()">Go</button>
        </div>
      </div>
    </div>
    <div class="tab-panel" id="tab-games">
      <div id="games-header">
        <div id="games-title">🎮 100+ Games</div>
        <div class="gsbar"><input type="text" id="games-search-input" placeholder="Search games…" autocomplete="off" oninput="filterGames()"></div>
      </div>
      <div id="games-filter"></div>
      <div id="games-grid"></div>
    </div>
  </div>
  <div id="bottom-nav">
    <div class="nav-tab active" id="nav-search" onclick="switchTab('search')"><span class="nav-icon">🔍</span><span class="nav-label">Search</span></div>
    <div class="nav-tab" id="nav-games" onclick="switchTab('games')"><span class="nav-icon">🎮</span><span class="nav-label">Games</span></div>
  </div>
</div>
<div id="search-embed-wrap">
  <div id="embed-bar">
    <input type="text" id="embed-input" placeholder="Enter URL or search…" autocomplete="off" onkeydown="if(event.key==='Enter')updateEmbed()">
    <button id="embed-go" onclick="updateEmbed()">Go</button>
    <button id="embed-close" onclick="closeEmbed()">✕ Close</button>
  </div>
  <iframe id="search-iframe" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"></iframe>
</div>
<div id="game-overlay">
  <div id="game-topbar">
    <span>🎮</span><span id="game-title">Game</span>
    <button id="game-close" onclick="closeGame()">✕ Exit</button>
  </div>
  <iframe id="game-iframe" allowfullscreen allow="autoplay; fullscreen; gamepad"></iframe>
</div>
<script>
(function(){const bg=document.getElementById('bg');for(let i=0;i<18;i++){const b=document.createElement('div');b.className='bubble';const s=Math.random()*28+6;b.style.cssText='width:'+s+'px;height:'+s+'px;left:'+Math.random()*100+'%;animation-duration:'+(Math.random()*14+8)+'s;animation-delay:-'+(Math.random()*14)+'s;';bg.appendChild(b);}})();

function switchTab(tab){
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(n=>n.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  document.getElementById('nav-'+tab).classList.add('active');
  if(tab==='games'&&!gamesLoaded)loadGames();
}

function doSearch(){
  const q=document.getElementById('search-input').value.trim();
  if(!q)return;
  window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank');
}

function doProxy(){
  let q=document.getElementById('proxy-input').value.trim();
  if(!q)return;
  if(!q.startsWith('http'))q='https://'+q;
  document.getElementById('embed-input').value=q;
  document.getElementById('search-iframe').src='/proxy?url='+encodeURIComponent(q);
  document.getElementById('search-embed-wrap').classList.add('open');
}

function updateEmbed(){
  let q=document.getElementById('embed-input').value.trim();
  if(!q)return;
  if(!q.startsWith('http'))q=q.includes('.')&&!q.includes(' ')?'https://'+q:'https://www.google.com/search?q='+encodeURIComponent(q);
  document.getElementById('search-iframe').src='/proxy?url='+encodeURIComponent(q);
  document.getElementById('embed-input').value=q;
}

function closeEmbed(){
  document.getElementById('search-embed-wrap').classList.remove('open');
  document.getElementById('search-iframe').src='about:blank';
}

const GAMES=[
  {n:'Bullet Force',g:'action',e:'🔫',c:'#1c3a5e',url:'https://www.onlinegames.io/games/2021/unity2/bullet-force/index.html'},
  {n:'Combat Reloaded',g:'action',e:'💥',c:'#0d2a45',url:'https://www.onlinegames.io/games/2022/unity/combat-reloaded-2/index.html'},
  {n:'Stickman Fighter',g:'action',e:'🥊',c:'#1a3a60',url:'https://www.onlinegames.io/games/2022/construct/stickman-fighter-epic-battle/index.html'},
  {n:'Masked Forces',g:'action',e:'🪖',c:'#0f2e52',url:'https://www.onlinegames.io/games/2021/unity2/masked-forces/index.html'},
  {n:'Pixel Warfare',g:'action',e:'🎯',c:'#0a2540',url:'https://www.onlinegames.io/games/2021/unity2/pixel-warfare/index.html'},
  {n:'Mad GunZ',g:'action',e:'💣',c:'#102848',url:'https://www.onlinegames.io/games/2021/unity2/mad-gunz/index.html'},
  {n:'Forward Assault',g:'action',e:'🔱',c:'#0d2c4a',url:'https://www.onlinegames.io/games/2022/unity/forward-assault-remix/index.html'},
  {n:'Shell Shockers',g:'action',e:'🥚',c:'#143054',url:'https://shellshock.io/'},
  {n:'1v1.LOL',g:'action',e:'🏗️',c:'#0a2540',url:'https://1v1.lol/'},
  {n:'Kirka.io',g:'action',e:'🎮',c:'#102a48',url:'https://kirka.io/'},
  {n:'Smash Karts',g:'io',e:'🛺',c:'#0a2840',url:'https://smashkarts.io/'},
  {n:'Ev.io',g:'io',e:'🔵',c:'#143058',url:'https://ev.io/'},
  {n:'Zombs Royale',g:'io',e:'🧟',c:'#0a2038',url:'https://zombsroyale.io/'},
  {n:'Territorial.io',g:'io',e:'🗺️',c:'#0a2238',url:'https://territorial.io/'},
  {n:'Brutal.io',g:'io',e:'⭕',c:'#0f3050',url:'https://brutal.io/'},
  {n:'Snowball.io',g:'io',e:'❄️',c:'#122c4a',url:'https://snowball.io/'},
  {n:'Flyordie.io',g:'io',e:'🦋',c:'#0f3050',url:'https://flyordie.io/'},
  {n:'Stabfish.io',g:'io',e:'🐡',c:'#122848',url:'https://stabfish.io/'},
  {n:'Lordz.io',g:'io',e:'👑',c:'#0a2038',url:'https://www.lordz.io/'},
  {n:'Foes.io',g:'io',e:'🏹',c:'#0d3060',url:'https://foes.io/'},
  {n:'Warbot.io',g:'io',e:'🤖',c:'#102a48',url:'https://warbot.io/'},
  {n:'2048',g:'puzzle',e:'🔢',c:'#0d3358',url:'https://play2048.co/'},
  {n:'Wordle Unlimited',g:'puzzle',e:'🟩',c:'#0f2e52',url:'https://wordleunlimited.org/'},
  {n:'Cut the Rope',g:'puzzle',e:'🍬',c:'#1a3858',url:'https://www.onlinegames.io/games/2023/html5/cut-the-rope/index.html'},
  {n:'Block Puzzle',g:'puzzle',e:'🧩',c:'#0d2e50',url:'https://www.onlinegames.io/games/2022/html5/block-puzzle-jewel/index.html'},
  {n:'Bubble Shooter',g:'puzzle',e:'🫧',c:'#0a2a50',url:'https://www.onlinegames.io/games/2021/html5/bubble-shooter/index.html'},
  {n:'Unblock It',g:'puzzle',e:'📦',c:'#0a2a4a',url:'https://www.onlinegames.io/games/2021/html5/unblock-it/index.html'},
  {n:'Mahjong',g:'puzzle',e:'🀄',c:'#0f2d4c',url:'https://www.onlinegames.io/games/2021/html5/mahjong-classic/index.html'},
  {n:'Color Fill',g:'puzzle',e:'🎨',c:'#122c4a',url:'https://www.onlinegames.io/games/2022/html5/color-fill-3d/index.html'},
  {n:'Sugar Sugar',g:'puzzle',e:'🍭',c:'#142a48',url:'https://www.onlinegames.io/games/2021/html5/sugar-sugar/index.html'},
  {n:'Madalin Cars',g:'racing',e:'🏎️',c:'#1a3a60',url:'https://www.onlinegames.io/games/2021/unity2/madalin-cars-multiplayer/index.html'},
  {n:'Drift Boss',g:'racing',e:'💨',c:'#102e55',url:'https://www.onlinegames.io/games/2021/html5/drift-boss/index.html'},
  {n:'Moto X3M',g:'racing',e:'🏍️',c:'#0f2d52',url:'https://www.onlinegames.io/games/2021/html5/moto-x3m/index.html'},
  {n:'Moto X3M Winter',g:'racing',e:'❄️',c:'#0a2840',url:'https://www.onlinegames.io/games/2021/html5/moto-x3m-winter/index.html'},
  {n:'Derby Crash',g:'racing',e:'💥',c:'#122850',url:'https://www.onlinegames.io/games/2022/unity/derby-crash-4/index.html'},
  {n:'Road Rush',g:'racing',e:'🚗',c:'#0d3260',url:'https://www.onlinegames.io/games/2021/html5/road-rush-cars/index.html'},
  {n:'Driving Mad',g:'racing',e:'🚙',c:'#143060',url:'https://www.onlinegames.io/games/2022/html5/driving-mad/index.html'},
  {n:'Traffic Rider',g:'racing',e:'🛵',c:'#102c50',url:'https://www.onlinegames.io/games/2021/unity2/traffic-rider/index.html'},
  {n:'Fireboy & Watergirl',g:'adventure',e:'🔥',c:'#0d3050',url:'https://www.onlinegames.io/games/2021/html5/fireboy-and-watergirl-1/index.html'},
  {n:'Stickman Hook',g:'adventure',e:'🕷️',c:'#0a2545',url:'https://www.onlinegames.io/games/2021/html5/stickman-hook/index.html'},
  {n:'Vex 6',g:'adventure',e:'🏃',c:'#122d50',url:'https://www.onlinegames.io/games/2022/html5/vex-6/index.html'},
  {n:'Vex 5',g:'adventure',e:'🧗',c:'#0d2c50',url:'https://www.onlinegames.io/games/2021/html5/vex-5/index.html'},
  {n:'Tomb of the Mask',g:'adventure',e:'💀',c:'#0d2840',url:'https://www.onlinegames.io/games/2022/html5/tomb-of-the-mask/index.html'},
  {n:'Bob the Robber',g:'adventure',e:'🦹',c:'#0f3055',url:'https://www.onlinegames.io/games/2021/html5/bob-the-robber/index.html'},
  {n:'Red Ball 4',g:'adventure',e:'🔴',c:'#0a2842',url:'https://www.onlinegames.io/games/2021/html5/red-ball-4/index.html'},
  {n:'Cat Ninja',g:'adventure',e:'🐱',c:'#0a2845',url:'https://www.onlinegames.io/games/2022/html5/cat-ninja/index.html'},
  {n:'Crossy Road',g:'adventure',e:'🐔',c:'#102a48',url:'https://www.onlinegames.io/games/2021/html5/crossy-road/index.html'},
  {n:'Run 3',g:'adventure',e:'🚀',c:'#0d3b6e',url:'https://www.onlinegames.io/games/2021/html5/run-3/index.html'},
  {n:'Slope',g:'adventure',e:'🏂',c:'#1a4080',url:'https://www.onlinegames.io/games/2021/html5/slope/index.html'},
  {n:'Adam & Eve',g:'adventure',e:'🍎',c:'#143060',url:'https://www.onlinegames.io/games/2021/html5/adam-and-eve/index.html'},
  {n:'Basketball Stars',g:'sports',e:'🏀',c:'#1a3858',url:'https://www.onlinegames.io/games/2021/html5/basketball-stars/index.html'},
  {n:'Head Soccer',g:'sports',e:'⚽',c:'#0d2e52',url:'https://www.onlinegames.io/games/2021/html5/head-soccer/index.html'},
  {n:'Retro Bowl',g:'sports',e:'🏈',c:'#0d2e50',url:'https://retrobowl.me/'},
  {n:'Archery World',g:'sports',e:'🏹',c:'#0f2e55',url:'https://www.onlinegames.io/games/2021/html5/archery-world-tour/index.html'},
  {n:'Soccer Random',g:'sports',e:'🥅',c:'#122c4a',url:'https://www.onlinegames.io/games/2022/html5/soccer-random/index.html'},
  {n:'Ping Pong',g:'sports',e:'🏓',c:'#0d2a48',url:'https://www.onlinegames.io/games/2021/html5/ping-pong/index.html'},
  {n:'Bowman 2',g:'sports',e:'🏹',c:'#0d2c50',url:'https://www.onlinegames.io/games/2021/html5/bowman-2/index.html'},
  {n:'Golf Battle',g:'sports',e:'⛳',c:'#102d50',url:'https://www.onlinegames.io/games/2022/html5/golf-battle/index.html'},
  {n:'Strike Force Heroes',g:'shooter',e:'🪖',c:'#0a2840',url:'https://www.onlinegames.io/games/2021/html5/strike-force-heroes/index.html'},
  {n:'Gunblood',g:'shooter',e:'🤠',c:'#0f2d50',url:'https://www.onlinegames.io/games/2021/html5/gunblood/index.html'},
  {n:'Pixel Gun Apocalypse',g:'shooter',e:'🔫',c:'#0d2c4a',url:'https://www.onlinegames.io/games/2022/unity/pixel-gun-apocalypse-7/index.html'},
  {n:'Happy Wheels',g:'casual',e:'🚲',c:'#0a2840',url:'https://www.onlinegames.io/games/2021/html5/happy-wheels/index.html'},
  {n:'Bad Ice Cream',g:'casual',e:'🍦',c:'#102c50',url:'https://www.onlinegames.io/games/2021/html5/bad-ice-cream/index.html'},
  {n:'Cookie Clicker',g:'casual',e:'🍪',c:'#143058',url:'https://orteil.dashnet.org/cookieclicker/'},
  {n:'Duck Life',g:'casual',e:'🦆',c:'#0f3055',url:'https://www.onlinegames.io/games/2021/html5/duck-life/index.html'},
  {n:'Monkey Mart',g:'casual',e:'🐒',c:'#102a48',url:'https://www.onlinegames.io/games/2022/html5/monkey-mart/index.html'},
  {n:'Pac-Man',g:'casual',e:'🟡',c:'#102840',url:'https://www.onlinegames.io/games/2021/html5/pacman/index.html'},
  {n:'Dino Game',g:'casual',e:'🦖',c:'#0f2a48',url:'https://chromedino.com/'},
  {n:'Flappy Bird',g:'casual',e:'🐦',c:'#0d3260',url:'https://flappybird.io/'},
  {n:'Minecraft Classic',g:'casual',e:'⛏️',c:'#0d2a48',url:'https://classic.minecraft.net/'},
  {n:'Gartic Phone',g:'casual',e:'📞',c:'#0d2d50',url:'https://garticphone.com/'},
  {n:'Kingdom Rush',g:'strategy',e:'🏰',c:'#0d3058',url:'https://www.onlinegames.io/games/2021/html5/kingdom-rush/index.html'},
  {n:'Stick War Legacy',g:'strategy',e:'⚔️',c:'#0f2c4c',url:'https://www.onlinegames.io/games/2021/html5/stick-war-legacy/index.html'},
  {n:'Age of War 2',g:'strategy',e:'🏛️',c:'#143060',url:'https://www.onlinegames.io/games/2021/html5/age-of-war-2/index.html'},
  {n:'Civilization Wars',g:'strategy',e:'🏹',c:'#0a2848',url:'https://www.onlinegames.io/games/2021/html5/civilization-wars/index.html'},
  {n:'Mini Metro',g:'strategy',e:'🚇',c:'#102d52',url:'https://www.onlinegames.io/games/2022/html5/mini-metro-online/index.html'},
  {n:'Bloons TD 5',g:'strategy',e:'🎈',c:'#1a3860',url:'https://www.onlinegames.io/games/2021/html5/bloons-tower-defense-5/index.html'},
  {n:'Clicker Heroes',g:'clicker',e:'🗡️',c:'#0a2840',url:'https://www.onlinegames.io/games/2021/html5/clicker-heroes/index.html'},
  {n:'Planet Clicker',g:'clicker',e:'🌍',c:'#0d3050',url:'https://www.onlinegames.io/games/2021/html5/planet-clicker/index.html'},
  {n:'Idle Miner',g:'clicker',e:'⛏️',c:'#122c48',url:'https://www.onlinegames.io/games/2021/html5/idle-miner-tycoon/index.html'},
  {n:'Uno Online',g:'card',e:'🎴',c:'#0a2845',url:'https://www.onlinegames.io/games/2021/html5/uno-online/index.html'},
  {n:'Solitaire',g:'card',e:'🃏',c:'#0d2d50',url:'https://www.onlinegames.io/games/2021/html5/solitaire/index.html'},
  {n:'Spider Solitaire',g:'card',e:'🕷️',c:'#0f2e55',url:'https://www.onlinegames.io/games/2021/html5/spider-solitaire/index.html'},
  {n:'Freecell',g:'card',e:'♠️',c:'#102c4a',url:'https://www.onlinegames.io/games/2021/html5/freecell/index.html'},
];

let gamesLoaded=false,allGames=[...GAMES],gamesFilter='all';

function loadGames(){
  gamesLoaded=true;
  const genres=['all',...new Set(allGames.map(g=>g.g))];
  const labels={all:'All',action:'Action',io:'IO',puzzle:'Puzzle',racing:'Racing',adventure:'Adventure',sports:'Sports',shooter:'Shooter',casual:'Casual',strategy:'Strategy',clicker:'Clicker',card:'Card'};
  document.getElementById('games-filter').innerHTML=genres.map(g=>'<div class="genre-pill '+(g==='all'?'active':'')+'" data-genre="'+g+'" onclick="filterByGenre(\''+g+'\')">'+( labels[g]||g)+'</div>').join('');
  renderGames(allGames);
}

function filterByGenre(g){
  gamesFilter=g;
  document.querySelectorAll('.genre-pill').forEach(p=>p.classList.toggle('active',p.dataset.genre===g));
  const filtered=g==='all'?allGames:allGames.filter(gm=>gm.g===g);
  const q=document.getElementById('games-search-input').value.trim().toLowerCase();
  renderGames(q?filtered.filter(gm=>gm.n.toLowerCase().includes(q)):filtered);
}

function filterGames(){
  const q=document.getElementById('games-search-input').value.trim().toLowerCase();
  const by=gamesFilter==='all'?allGames:allGames.filter(gm=>gm.g===gamesFilter);
  renderGames(q?by.filter(gm=>gm.n.toLowerCase().includes(q)):by);
}

function renderGames(list){
  if(!list.length){document.getElementById('games-grid').innerHTML='<div class="empty-state"><span class="big">🎮</span>No games found</div>';return;}
  document.getElementById('games-grid').innerHTML=list.map(g=>'<div class="game-card" onclick="openGame(\''+encodeURIComponent(g.url)+'\',\''+encodeURIComponent(g.n)+'\')"><div class="game-thumb"><div class="game-thumb-bg" style="background:'+g.c+'"></div><div class="game-thumb-emoji">'+g.e+'</div></div><div class="game-info"><h4>'+g.n+'</h4><div class="game-genre-tag">'+g.g+'</div></div><div class="game-play-btn">PLAY</div></div>').join('');
}

function openGame(urlEnc,nameEnc){
  document.getElementById('game-title').textContent=decodeURIComponent(nameEnc);
  document.getElementById('game-iframe').src=decodeURIComponent(urlEnc);
  document.getElementById('game-overlay').classList.add('open');
}

function closeGame(){
  document.getElementById('game-overlay').classList.remove('open');
  document.getElementById('game-iframe').src='about:blank';
}

const msgs=['PRIVATE • SECURE • UNBLOCKED','100+ GAMES READY','PROXY ACTIVE','ZERO TRACKING'];
let si=0;
setInterval(()=>{si=(si+1)%msgs.length;const el=document.getElementById('stxt');el.style.opacity=0;setTimeout(()=>{el.textContent=msgs[si];el.style.opacity='';},300);},5000);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeEmbed();closeGame();}});
</script>
</body>
</html>`;

// ══════════════════════════════════════════════
// AD BLOCK LIST
// ══════════════════════════════════════════════
const AD_DOMAINS = [
  'doubleclick.net','googlesyndication.com','googleadservices.com',
  'adnxs.com','adsrvr.org','advertising.com','adroll.com',
  'outbrain.com','taboola.com','revcontent.com','mgid.com',
  'popcash.net','popads.net','adsterra.com','propellerads.com',
  'trafficjunky.net','juicyads.com','exoclick.com','plugrush.com',
  'hilltopads.net','cpmstar.com','clickadu.com','adcash.com',
  'tsyndicate.com','contentabc.com','zlinkd.com',
  'adf.ly','linkbucks.com','ouo.io','shorte.st',
];

function isAdDomain(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return AD_DOMAINS.some(d => host === d || host.endsWith('.' + d));
  } catch { return false; }
}

// ══════════════════════════════════════════════
// URL REWRITING HELPERS
// ══════════════════════════════════════════════
function rewriteCSS(css, base, origin) {
  return css.replace(/url\(['"]?(https?:\/\/[^'"\)]+)['"]?\)/gi,
    (m, u) => `url(/proxy?url=${encodeURIComponent(u)})`
  ).replace(/url\(['"]?(\/\/[^'"\)]+)['"]?\)/gi,
    (m, u) => `url(/proxy?url=${encodeURIComponent('https:' + u)})`
  ).replace(/url\(['"]?(\/[^'"\)]+)['"]?\)/gi,
    (m, u) => `url(/proxy?url=${encodeURIComponent(new URL(u, base).href)})`
  );
}

function rewriteHTML(html, base, origin) {
  // Strip anti-embedding headers in HTML meta tags
  html = html.replace(/<meta[^>]+http-equiv=["']?x-frame-options["']?[^>]*>/gi, '');
  html = html.replace(/<meta[^>]+content-security-policy[^>]*>/gi, '');

  // Rewrite absolute URLs in href/src/action
  html = html.replace(/(href|src|action|data-src)=(["'])(https?:\/\/[^"'>\s]+)(["'])/gi,
    (m, attr, q1, url, q2) => {
      if (isAdDomain(url)) return `${attr}=${q1}about:blank${q2}`;
      return `${attr}=${q1}/proxy?url=${encodeURIComponent(url)}${q2}`;
    }
  );

  // Rewrite protocol-relative URLs
  html = html.replace(/(href|src|action)=(["'])(\/\/[^"'>\s]+)(["'])/gi,
    (m, attr, q1, url, q2) => `${attr}=${q1}/proxy?url=${encodeURIComponent('https:' + url)}${q2}`
  );

  // Rewrite root-relative URLs
  html = html.replace(/(href|src|action)=(["'])(\/[^"'>\s][^"']*)(["'])/gi,
    (m, attr, q1, url, q2) => {
      try {
        const abs = new URL(url, base).href;
        return `${attr}=${q1}/proxy?url=${encodeURIComponent(abs)}${q2}`;
      } catch { return m; }
    }
  );

  // Strip target="_blank" and target="_top" to keep navigation in iframe
  html = html.replace(/target=["'](_blank|_top|_parent)["']/gi, 'target="_self"');

  // Rewrite inline style url()
  html = html.replace(/style=["']([^"']*url\([^)]+\)[^"']*)["']/gi, (m, style) => {
    try {
      const rewritten = rewriteCSS(style, base, origin);
      return `style="${rewritten}"`;
    } catch { return m; }
  });

  // Inject navigation interceptor + ad blocker script
  const inject = `
<script>
(function(){
  var PROXY = '/proxy?url=';
  var AD_DOMAINS = ${JSON.stringify(AD_DOMAINS)};

  function isAd(u){
    try{var h=new URL(u).hostname.toLowerCase();return AD_DOMAINS.some(function(d){return h===d||h.endsWith('.'+d);});}catch(e){return false;}
  }

  // Block window.open popups
  window.open = function(u){ if(u&&!isAd(u))window.location.href=PROXY+encodeURIComponent(u.startsWith('http')?u:'https://'+u); return null; };

  // Intercept all link clicks
  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if(a && a.href && a.href.startsWith('http') && !a.href.includes('/proxy?url=')){
      if(isAd(a.href)){e.preventDefault();return;}
      e.preventDefault();
      window.location.href = PROXY + encodeURIComponent(a.href);
    }
  }, true);

  // Intercept form submissions
  document.addEventListener('submit', function(e){
    var f = e.target;
    if(f && f.action && f.action.startsWith('http') && !f.action.includes('/proxy?url=')){
      e.preventDefault();
      var data = new FormData(f);
      var params = new URLSearchParams(data).toString();
      var sep = f.action.includes('?') ? '&' : '?';
      window.location.href = PROXY + encodeURIComponent(f.action + (f.method.toLowerCase()==='get'?sep+params:''));
    }
  }, true);

  // Block ad iframes from loading
  var origCreate = document.createElement.bind(document);
  document.createElement = function(tag){
    var el = origCreate(tag);
    if(tag && tag.toLowerCase()==='iframe'){
      Object.defineProperty(el,'src',{
        set:function(v){
          if(v&&!isAd(v)){
            Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype,'src').set.call(this,v);
          }
        },
        get:function(){
          return Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype,'src').get.call(this);
        }
      });
    }
    return el;
  };
})();
<\/script>`;

  // Inject before </head> or at start of body
  if (html.includes('</head>')) {
    html = html.replace('</head>', inject + '</head>');
  } else if (html.includes('<body')) {
    html = html.replace(/<body[^>]*>/, m => m + inject);
  } else {
    html = inject + html;
  }

  return html;
}

// ══════════════════════════════════════════════
// MAIN WORKER
// ══════════════════════════════════════════════
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── Serve main HTML ──
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(HTML, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Frame-Options': 'SAMEORIGIN',
        }
      });
    }

    // ── Proxy handler ──
    if (url.pathname === '/proxy') {
      const target = url.searchParams.get('url');
      if (!target) return new Response('No URL provided', { status: 400 });

      let targetUrl;
      try { targetUrl = new URL(decodeURIComponent(target)); }
      catch { return new Response('Invalid URL', { status: 400 }); }

      if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        return new Response('Protocol not allowed', { status: 403 });
      }

      // Block ads at proxy level
      if (isAdDomain(targetUrl.href)) {
        return new Response('', { status: 204 });
      }

      try {
        // Build clean request headers
        const reqHeaders = new Headers();
        reqHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        reqHeaders.set('Accept', request.headers.get('Accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
        reqHeaders.set('Accept-Language', 'en-US,en;q=0.9');
        reqHeaders.set('Accept-Encoding', 'gzip, deflate, br');
        reqHeaders.set('Referer', targetUrl.origin + '/');
        reqHeaders.set('Origin', targetUrl.origin);

        // Forward cookies if any
        const cookie = request.headers.get('cookie');
        if (cookie) reqHeaders.set('cookie', cookie);

        const fetchOptions = {
          method: request.method,
          headers: reqHeaders,
          redirect: 'follow',
        };

        if (!['GET', 'HEAD'].includes(request.method)) {
          fetchOptions.body = request.body;
        }

        const response = await fetch(targetUrl.toString(), fetchOptions);

        // Build response headers — strip blocking headers
        const resHeaders = new Headers();
        for (const [key, val] of response.headers.entries()) {
          const k = key.toLowerCase();
          if ([
            'x-frame-options',
            'content-security-policy',
            'content-security-policy-report-only',
            'cross-origin-embedder-policy',
            'cross-origin-opener-policy',
            'cross-origin-resource-policy',
            'x-content-type-options',
          ].includes(k)) continue;
          resHeaders.set(key, val);
        }

        resHeaders.set('Access-Control-Allow-Origin', '*');
        resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        resHeaders.set('Access-Control-Allow-Headers', '*');

        // Forward set-cookie
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) resHeaders.set('set-cookie', setCookie);

        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        const base = targetUrl.href;
        const origin = url.origin;

        // ── Rewrite HTML ──
        if (contentType.includes('text/html')) {
          let body = await response.text();
          body = rewriteHTML(body, base, origin);
          resHeaders.set('Content-Type', 'text/html; charset=utf-8');
          resHeaders.delete('content-encoding');
          return new Response(body, { status: response.status, headers: resHeaders });
        }

        // ── Rewrite CSS ──
        if (contentType.includes('text/css')) {
          let body = await response.text();
          body = rewriteCSS(body, base, origin);
          resHeaders.set('Content-Type', 'text/css; charset=utf-8');
          resHeaders.delete('content-encoding');
          return new Response(body, { status: response.status, headers: resHeaders });
        }

        // ── Rewrite JS — replace absolute URLs in fetch/XHR calls ──
        if (contentType.includes('javascript') || contentType.includes('ecmascript')) {
          let body = await response.text();
          // Rewrite fetch() calls
          body = body.replace(/fetch\(["'](https?:\/\/[^"']+)["']/g,
            (m, u) => `fetch("/proxy?url=${encodeURIComponent(u)}"`
          );
          // Rewrite XMLHttpRequest.open calls
          body = body.replace(/(\.open\(["'][A-Z]+["'],\s*["'])(https?:\/\/[^"']+)(["'])/g,
            (m, pre, u, post) => `${pre}/proxy?url=${encodeURIComponent(u)}${post}`
          );
          resHeaders.delete('content-encoding');
          return new Response(body, { status: response.status, headers: resHeaders });
        }

        // ── Pass through everything else (images, fonts, etc.) ──
        return new Response(response.body, { status: response.status, headers: resHeaders });

      } catch (err) {
        return new Response(`
          <html><body style="background:#010d1a;color:#a5f3fc;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;">
            <div style="font-size:3rem">🌊</div>
            <div style="font-size:1.2rem;font-weight:bold;">DingleV5 Proxy</div>
            <div style="color:rgba(165,243,252,0.6);font-size:.9rem;">Could not load: ${targetUrl.hostname}</div>
            <div style="color:rgba(165,243,252,0.4);font-size:.8rem;">${err.message}</div>
          </body></html>
        `, { status: 502, headers: { 'Content-Type': 'text/html' } });
      }
    }

    // ── OPTIONS preflight ──
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};
