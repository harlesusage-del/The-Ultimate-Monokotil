/* ============================================================
   BLOCKSTATE: MONOPOLI NUSANTARA - game.js
   All logic: data, engine, UI
   ============================================================ */

'use strict';

// ============================================================
// DATA: BOARD TILES (40 tiles, index 0-39)
// ============================================================
const TILES = [
  // BOTTOM ROW right to left (indices 0-10)
  { idx:0,  name:'START',         type:'start',     pos:'bottom-right-corner' },
  { idx:1,  name:'Parung',        type:'property',  color:'brown',    price:60000,   rent:[5000,25000,75000,150000,300000] },
  { idx:2,  name:'Dana Umum',     type:'community',  pos:'bottom' },
  { idx:3,  name:'Ciputat',       type:'property',  color:'brown',    price:60000,   rent:[5000,25000,75000,150000,300000] },
  { idx:4,  name:'Pajak\n50rb',   type:'tax',       amount:50000 },
  { idx:5,  name:'Stasiun\nBogor',type:'station',   price:200000 },
  { idx:6,  name:'Depok',         type:'property',  color:'lightblue',price:100000,  rent:[8000,40000,100000,300000,450000] },
  { idx:7,  name:'Kesempatan',    type:'chance' },
  { idx:8,  name:'Bekasi',        type:'property',  color:'lightblue',price:100000,  rent:[8000,40000,100000,300000,450000] },
  { idx:9,  name:'Tangerang',     type:'property',  color:'lightblue',price:120000,  rent:[10000,50000,150000,350000,500000] },
  { idx:10, name:'Penjara\n/ Kunjungan',type:'jail-visit', pos:'bottom-left-corner' },

  // LEFT COLUMN bottom to top (indices 11-20)
  { idx:11, name:'Bogor',         type:'property',  color:'pink',     price:140000,  rent:[12000,60000,180000,500000,700000] },
  { idx:12, name:'PLN',           type:'utility',   name2:'Listrik',  price:150000 },
  { idx:13, name:'Bandung',       type:'property',  color:'pink',     price:140000,  rent:[12000,60000,180000,500000,700000] },
  { idx:14, name:'Cimahi',        type:'property',  color:'pink',     price:160000,  rent:[14000,70000,200000,550000,750000] },
  { idx:15, name:'Stasiun\nGambir',type:'station',  price:200000 },
  { idx:16, name:'Puncak',        type:'property',  color:'orange',   price:180000,  rent:[18000,90000,250000,700000,875000] },
  { idx:17, name:'Dana Umum',     type:'community' },
  { idx:18, name:'Sentul',        type:'property',  color:'orange',   price:180000,  rent:[18000,90000,250000,700000,875000] },
  { idx:19, name:'BSD',           type:'property',  color:'orange',   price:200000,  rent:[20000,100000,300000,750000,950000] },
  { idx:20, name:'Parkir\nGratis',type:'parking',   pos:'top-left-corner' },

  // TOP ROW left to right (indices 21-30)
  { idx:21, name:'Kelapa\nGading',type:'property',  color:'red',      price:220000,  rent:[25000,110000,330000,800000,975000] },
  { idx:22, name:'Kesempatan',    type:'chance' },
  { idx:23, name:'Kemang',        type:'property',  color:'red',      price:220000,  rent:[25000,110000,330000,800000,975000] },
  { idx:24, name:'Cibubur',       type:'property',  color:'red',      price:240000,  rent:[28000,120000,360000,850000,1025000] },
  { idx:25, name:'Stasiun\nManggarai',type:'station',price:200000 },
  { idx:26, name:'PIK',           type:'property',  color:'yellow',   price:260000,  rent:[35000,130000,390000,900000,1100000] },
  { idx:27, name:'Bintaro',       type:'property',  color:'yellow',   price:260000,  rent:[35000,130000,390000,900000,1100000] },
  { idx:28, name:'PAM',           type:'utility',   name2:'Air',      price:150000 },
  { idx:29, name:'Alam\nSutera',  type:'property',  color:'yellow',   price:280000,  rent:[38000,150000,450000,1000000,1200000] },
  { idx:30, name:'Ke\nPenjara!',  type:'go-to-jail',pos:'top-right-corner' },

  // RIGHT COLUMN top to bottom (indices 31-39)
  { idx:31, name:'Senayan',       type:'property',  color:'green',    price:300000,  rent:[50000,150000,450000,1050000,1275000] },
  { idx:32, name:'Dana Umum',     type:'community' },
  { idx:33, name:'SCBD',          type:'property',  color:'green',    price:300000,  rent:[50000,150000,450000,1050000,1275000] },
  { idx:34, name:'Menteng',       type:'property',  color:'green',    price:320000,  rent:[55000,160000,480000,1100000,1300000] },
  { idx:35, name:'Pajak\nMewah',  type:'tax',       amount:150000 },
  { idx:36, name:'Stasiun\nGondangdia',type:'station',price:200000 },
  { idx:37, name:'Thamrin',       type:'property',  color:'darkblue', price:350000,  rent:[70000,175000,500000,1100000,1300000] },
  { idx:38, name:'Kesempatan',    type:'chance' },
  { idx:39, name:'BIP\nJakarta',  type:'property',  color:'darkblue', price:400000,  rent:[100000,200000,600000,1400000,1500000] },
];

const COLOR_GROUPS = {
  brown:    { tiles:[1,3],         houses:3, hotel:true, name:'Coklat' },
  lightblue:{ tiles:[6,8,9],       houses:3, hotel:true, name:'Biru Muda' },
  pink:     { tiles:[11,13,14],    houses:3, hotel:true, name:'Pink' },
  orange:   { tiles:[16,18,19],    houses:3, hotel:true, name:'Oranye' },
  red:      { tiles:[21,23,24],    houses:3, hotel:true, name:'Merah' },
  yellow:   { tiles:[26,27,29],    houses:3, hotel:true, name:'Kuning' },
  green:    { tiles:[31,33,34],    houses:3, hotel:true, name:'Hijau' },
  darkblue: { tiles:[37,39],       houses:3, hotel:true, name:'Biru Tua' },
};

const STATIONS = [5, 15, 25, 36];
const UTILITIES = [12, 28];

const COLOR_CSS = {
  brown:'#8B4513', lightblue:'#87CEEB', pink:'#FF69B4',
  orange:'#FFA500', red:'#DC143C', yellow:'#FFD700',
  green:'#228B22', darkblue:'#00008B'
};

// Default player configs (can be overridden via player setup screen)
const PLAYER_DEFAULTS = [
  { id:0, name:'Pemain 1', token:'Jokowi',  color:'#E74C3C' },
  { id:1, name:'Pemain 2', token:'Prabowo', color:'#2980B9' },
  { id:2, name:'Pemain 3', token:'Gibran',  color:'#27AE60' },
  { id:3, name:'Pemain 4', token:'Ganjar',  color:'#8E44AD' },
];

const PLAYER_COLORS = ['#E74C3C','#2980B9','#27AE60','#8E44AD'];

const ALL_TOKENS = ['Jokowi','Prabowo','Gibran','Ganjar','Anies','Bahlil'];

// This will be populated via the player setup screen before game starts
let PLAYERS_INIT = PLAYER_DEFAULTS.slice();

// ============================================================
// CARDS
// ============================================================
const CHANCE_CARDS = [
  { type:'positive', title:'Warisan Keluarga',    desc:'Anda menerima warisan.',             action:'money', amount:200000 },
  { type:'positive', title:'Investasi Berhasil',  desc:'Portofolio Anda meledak.',           action:'money', amount:150000 },
  { type:'positive', title:'Bonus Akhir Tahun',   desc:'THR cair lebih awal!',               action:'money', amount:100000 },
  { type:'positive', title:'Proyek Selesai',      desc:'Client puas, dapat bonus.',          action:'money', amount:120000 },
  { type:'positive', title:'Dividen Saham',       desc:'Saham lo naik kenceng!',             action:'money', amount:80000 },
  { type:'positive', title:'Keluar Penjara',      desc:'Kartu bebas dari penjara.',          action:'jail-free' },
  { type:'positive', title:'Keluar Penjara',      desc:'Kartu bebas dari penjara.',          action:'jail-free' },
  { type:'neutral',  title:'Maju ke START',       desc:'Langsung ke START, ambil 200rb.',    action:'goto', target:0 },
  { type:'neutral',  title:'Maju ke Stasiun',     desc:'Maju ke stasiun terdekat.',          action:'nearest-station' },
  { type:'neutral',  title:'Maju ke Thamrin',     desc:'Maju ke Thamrin.',                   action:'goto', target:37 },
  { type:'neutral',  title:'Mundur 3 Langkah',    desc:'Mundur 3 petak dari posisi ini.',    action:'move', steps:-3 },
  { type:'negative', title:'Audit Pajak!',        desc:'Bayar 10% dari total aset.',         action:'audit' },
  { type:'negative', title:'Renovasi Paksa',      desc:'Bayar 40rb per rumah, 115rb per hotel.', action:'repair', houseRate:40000, hotelRate:115000 },
  { type:'negative', title:'Masuk Penjara',       desc:'Langsung masuk penjara!',            action:'go-to-jail' },
];

const COMMUNITY_CARDS = [
  { type:'positive', title:'Dana Komunitas',      desc:'Komunitas memberikan bantuan.',      action:'money', amount:100000 },
  { type:'positive', title:'Pajak Dikembalikan',  desc:'Lebih bayar pajak dikembalikan.',    action:'money', amount:75000 },
  { type:'positive', title:'Hadiah Ulang Tahun',  desc:'Semua pemain kasih 20rb.',           action:'collect-from-all', amount:20000 },
  { type:'positive', title:'Menang Kontes',       desc:'Anda menang lomba!',                 action:'money', amount:90000 },
  { type:'positive', title:'Keluar Penjara',      desc:'Kartu bebas dari penjara.',          action:'jail-free' },
  { type:'neutral',  title:'Maju ke START',       desc:'Langsung ke START, ambil 200rb.',    action:'goto', target:0 },
  { type:'neutral',  title:'Maju ke BIP Jakarta', desc:'Maju ke BIP Jakarta.',               action:'goto', target:39 },
  { type:'negative', title:'Biaya Dokter',        desc:'Bayar biaya kesehatan.',             action:'pay', amount:80000 },
  { type:'negative', title:'Biaya Sekolah Anak',  desc:'Bayar biaya pendidikan.',            action:'pay', amount:60000 },
  { type:'negative', title:'Tilang Macet',        desc:'Kena tilang di jalan tol.',          action:'pay', amount:30000 },
  { type:'negative', title:'Masuk Penjara',       desc:'Langsung masuk penjara!',            action:'go-to-jail' },
  { type:'negative', title:'Perbaikan Properti',  desc:'Bayar 25rb per rumah, 100rb per hotel.', action:'repair', houseRate:25000, hotelRate:100000 },
];

// ============================================================
// GAME STATE
// ============================================================
let G = {};

function initGame(mode) {
  const saved = loadGame(mode);
  if (saved) {
    G = saved;
    // Restore PLAYERS_INIT from saved players
    PLAYERS_INIT = G.players.map(p => ({ id: p.id, name: p.name, token: p.token, color: p.color }));
    return;
  }

  G = {
    mode: mode,
    round: 1,
    currentPlayer: 0,
    phase: 'roll', // roll | action | end
    diceRolled: false,
    doublesCount: 0,
    lastDice: [0, 0],
    players: PLAYERS_INIT.map((p, i) => ({
      ...p,
      id: i,
      money: 1000000,
      position: 0,
      properties: [],
      inJail: false,
      jailTurns: 0,
      jailFreeCards: 0,
      loan: 0,
      loanRound: 0,
      bankrupt: false,
    })),
    properties: TILES.map(t => ({
      idx: t.idx,
      owner: null,
      level: 0,     // 0=no build, 1-3=houses, 4=hotel
      mortgaged: false,
    })),
    chanceCards: shuffle([...Array(CHANCE_CARDS.length).keys()]),
    communityCards: shuffle([...Array(COMMUNITY_CARDS.length).keys()]),
    log: [],
    bankFunds: 50000000,
    loanIntervalRounds: 5,
  };
}

// ============================================================
// BOARD GRID LAYOUT
// ============================================================
// Board is 11x11 grid. Tiles occupy the border (40 tiles + 4 corners already included).
// We map tile index to grid row/col.
// Tile 0 = bottom-right corner (row 10, col 10)
// Going counter-clockwise visually (which is clockwise on board):
// Bottom row: 0 (col10) → 1(col9) → ... → 9(col1) → 10(col0)
// Left col: 11(row9) → ... → 19(row1) → 20(row0)
// Top row: 21(col1) → ... → 29(col9) → 30(col10)
// Right col: 31(row9) → ... → 39(row1)

function getTileGridPos(idx) {
  if (idx <= 10) {
    // Bottom row, right to left
    return { row: 10, col: 10 - idx };
  } else if (idx <= 20) {
    // Left column, bottom to top
    return { row: 10 - (idx - 10), col: 0 };
  } else if (idx <= 30) {
    // Top row, left to right
    return { row: 0, col: idx - 20 };
  } else {
    // Right column, top to bottom
    return { row: idx - 30, col: 10 };
  }
}

// ============================================================
// BUILD BOARD
// ============================================================
function buildBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  // Create 11x11 grid cells
  const grid = [];
  for (let r = 0; r < 11; r++) {
    grid[r] = [];
    for (let c = 0; c < 11; c++) {
      const cell = document.createElement('div');
      cell.style.gridRow = (r + 1);
      cell.style.gridColumn = (c + 1);
      // Will fill content below
      grid[r][c] = cell;
      board.appendChild(cell);
    }
  }

  // Center cell (rows 1-9, cols 1-9) = spanning area
  // We create an overlay div
  const center = document.createElement('div');
  center.id = 'boardCenter';
  center.innerHTML = `
    <div class="center-icon">🏛️</div>
    <div class="center-title">MONOPOLI<br>NUSANTARA</div>
    <div class="center-sub">PENYEBAB SOLOPHOBIA</div>
  `;
  board.appendChild(center);

  // Fill tile cells
  TILES.forEach(tile => {
    const { row, col } = getTileGridPos(tile.idx);
    const cell = grid[row][col];
    cell.id = `cell-${tile.idx}`;
    cell.dataset.idx = tile.idx;
    cell.onclick = () => onCellClick(tile.idx);
    cell.classList.add('cell');

    // Corner
    if (['start','jail-visit','parking','go-to-jail'].includes(tile.type)) {
      cell.classList.add('corner');
    }

    let html = '';

    if (tile.type === 'property') {
      cell.classList.add('property');
      html = `<div class="cell-color-bar color-${tile.color}"></div>
              <div class="cell-buildings" id="bld-${tile.idx}"></div>
              <div class="cell-name">${tile.name}</div>
              <div class="cell-price">${fmt(tile.price)}</div>
              <div class="cell-owners" id="own-${tile.idx}"></div>`;
    } else if (tile.type === 'station') {
      cell.classList.add('station');
      html = `<div class="cell-icon">🚆</div>
              <div class="cell-name">${tile.name}</div>
              <div class="cell-price">${fmt(tile.price)}</div>
              <div class="cell-owners" id="own-${tile.idx}"></div>`;
    } else if (tile.type === 'utility') {
      cell.classList.add('utility');
      const icon = tile.idx === 12 ? '⚡' : '💧';
      html = `<div class="cell-icon">${icon}</div>
              <div class="cell-name">${tile.name}</div>
              <div class="cell-price">${fmt(tile.price)}</div>
              <div class="cell-owners" id="own-${tile.idx}"></div>`;
    } else if (tile.type === 'chance') {
      cell.classList.add('chance');
      html = `<div class="cell-icon">❓</div><div class="cell-name">Kesempatan</div>`;
    } else if (tile.type === 'community') {
      cell.classList.add('community');
      html = `<div class="cell-icon">💌</div><div class="cell-name">Dana Umum</div>`;
    } else if (tile.type === 'tax') {
      cell.classList.add('tax');
      html = `<div class="cell-icon">💸</div><div class="cell-name">${tile.name}</div>`;
    } else if (tile.type === 'start') {
      html = `<div class="cell-icon">🏁</div><div class="cell-name">START</div><div class="cell-price">Ambil 200rb</div>`;
    } else if (tile.type === 'jail-visit') {
      html = `<div class="cell-icon">👀</div><div class="cell-name">Kunjungan / Penjara</div>`;
    } else if (tile.type === 'parking') {
      html = `<div class="cell-icon">🅿️</div><div class="cell-name">Parkir Gratis</div>`;
    } else if (tile.type === 'go-to-jail') {
      html = `<div class="cell-icon">🚓</div><div class="cell-name">KE PENJARA!</div>`;
    }

    cell.innerHTML = html;
  });

  // Empty inner cells (1-9, 1-9) make transparent/hidden for center overlay
  for (let r = 1; r <= 9; r++) {
    for (let c = 1; c <= 9; c++) {
      grid[r][c].style.border = 'none';
      grid[r][c].style.background = 'transparent';
      grid[r][c].style.pointerEvents = 'none';
    }
  }

  // Scale board to fill the boardWrapper after building
  scaleBoardToFit();
}

const BASE_CELL = 46; // px — must match --base-cell in CSS

function scaleBoardToFit() {
  const wrapper = document.getElementById('boardWrapper');
  const scaler  = document.getElementById('boardScaler');
  if (!wrapper || !scaler) return;

  const boardPx = BASE_CELL * 11 + 6; // total board size incl border (3px each side)
  const availW  = wrapper.clientWidth  - 8;  // 4px padding each side
  const availH  = wrapper.clientHeight - 8;
  const scale   = Math.min(availW / boardPx, availH / boardPx, 1.4); // cap at 1.4× to avoid blurry

  scaler.style.transform = `scale(${scale})`;
  // Re-render tokens after scale (positions unchanged, scale handles visual size)
  if (typeof G !== 'undefined' && G.players) renderTokens();
}

// ============================================================
// TOKENS ON BOARD
// ============================================================
function renderTokens() {
  document.querySelectorAll('.board-token').forEach(el => el.remove());

  const board = document.getElementById('board');
  if (!board) return;

  // Token offsets within each cell (using BASE_CELL coordinates — scaling handles visual size)
  const offsets = [
    { dx: 1,  dy: 1  },
    { dx: 24, dy: 1  },
    { dx: 1,  dy: 24 },
    { dx: 24, dy: 24 },
  ];

  G.players.forEach((p, arrayIdx) => {
    if (p.bankrupt) return;
    const { row, col } = getTileGridPos(p.position);
    const token = document.createElement('div');
    token.className = 'board-token';
    token.id = `token-${p.id}`;
    token.textContent = p.token.slice(0, 3);
    token.style.cssText = `
      color: ${p.color};
      background: rgba(0,0,0,0.65);
      border-radius: 3px;
      padding: 1px 2px;
      font-size: 8px;
      font-weight: 900;
      font-family: 'Playfair Display', serif;
      line-height: 1.2;
      letter-spacing: 0.2px;
      left: ${col * BASE_CELL + offsets[arrayIdx % 4].dx}px;
      top:  ${row  * BASE_CELL + offsets[arrayIdx % 4].dy}px;
      position: absolute;
    `;
    board.appendChild(token);
  });
}

function animateMoveToken(playerId, fromPos, toPos, callback) {
  const token = document.getElementById(`token-${playerId}`);
  if (!token) { callback && callback(); return; }

  const offsets = [{ dx:1,dy:1 },{ dx:24,dy:1 },{ dx:1,dy:24 },{ dx:24,dy:24 }];
  const arrayIdx = G.players.findIndex(p => p.id === playerId);
  const off = offsets[arrayIdx % 4];

  const { row, col } = getTileGridPos(toPos);
  token.style.left = (col * BASE_CELL + off.dx) + 'px';
  token.style.top  = (row  * BASE_CELL + off.dy) + 'px';
  token.style.animation = 'tokenBounce 0.4s ease';

  highlightCell(toPos);

  setTimeout(() => {
    token.style.animation = '';
    callback && callback();
  }, 450);
}

function highlightCell(idx) {
  document.querySelectorAll('.cell.current-highlight').forEach(c => c.classList.remove('current-highlight'));
  const cell = document.getElementById(`cell-${idx}`);
  if (cell) {
    cell.classList.add('current-highlight');
    setTimeout(() => cell.classList.remove('current-highlight'), 2500);
  }
}

// ============================================================
// OWNERSHIP DOTS
// ============================================================
function renderOwnership() {
  // Update buildings display
  G.properties.forEach(prop => {
    const tile = TILES[prop.idx];
    if (!['property','station','utility'].includes(tile.type)) return;

    const ownEl = document.getElementById(`own-${prop.idx}`);
    if (ownEl) {
      ownEl.innerHTML = '';
      if (prop.owner !== null) {
        const owner = G.players[prop.owner];
        const dot = document.createElement('div');
        dot.className = 'owner-dot';
        dot.style.background = owner.color;
        dot.title = owner.name;
        ownEl.appendChild(dot);
      }
    }

    const bldEl = document.getElementById(`bld-${prop.idx}`);
    if (bldEl && tile.type === 'property') {
      if (prop.mortgaged) { bldEl.textContent = '❌'; }
      else if (prop.level === 4) { bldEl.textContent = '🏢'; }
      else if (prop.level > 0) { bldEl.textContent = '🏠'.repeat(prop.level); }
      else { bldEl.textContent = ''; }
    }
  });
}

// ============================================================
// PLAYER STRIP & INFO
// ============================================================
function renderPlayerStrip() {
  const strip = document.getElementById('playerStrip');
  strip.innerHTML = '';
  G.players.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'player-chip' + (p.id === G.currentPlayer ? ' active' : '') + (p.bankrupt ? ' bankrupt' : '');
    chip.onclick = () => showPlayerInfo(p.id);
    // Show colored token label + name + money
    chip.innerHTML = `
      <div class="player-token" style="color:${p.color}">${p.token}</div>
      <div class="player-chip-info">
        <div class="chip-name">${p.name}</div>
        <div class="chip-money">${fmt(p.money)}</div>
      </div>
    `;
    strip.appendChild(chip);
  });
}

function renderCurrentPlayerBar() {
  const p = G.players[G.currentPlayer];
  const inJailText = p.inJail ? `<span style="color:#E74C3C"> 🔒 Di Penjara (giliran ${p.jailTurns}/3)</span>` : '';
  const loanText = p.loan > 0 ? `<span style="color:#E67E22"> | Hutang: ${fmt(p.loan)}</span>` : '';

  document.getElementById('cpInfo').innerHTML = `
    <div class="cp-name" style="color:${p.color}">${p.token}</div>
    <div class="cp-sub">${p.name}</div>
    <div class="cp-money">💰 ${fmt(p.money)}${loanText}${inJailText}</div>
    <div class="cp-pos">📍 ${TILES[p.position].name}</div>
  `;
  document.getElementById('cpActions').innerHTML = `
    <button class="btn-xs gold" onclick="showPropertyPopup(${p.id})">🏘️</button>
    <button class="btn-xs blue" onclick="showBuildPopup()">🏗️</button>
    <button class="btn-xs" onclick="showMortgagePopup()" style="background:#795548">🏦</button>
  `;
}

function renderActionPanel() {
  const p = G.players[G.currentPlayer];
  const d1 = G.lastDice[0] || '🎲';
  const d2 = G.lastDice[1] || '🎲';
  document.getElementById('die1').textContent = dieFace(d1);
  document.getElementById('die2').textContent = dieFace(d2);
  document.getElementById('diceTotal').textContent = (G.lastDice[0] && G.lastDice[1]) ? `Total: ${G.lastDice[0]+G.lastDice[1]}` : '';

  const btns = document.getElementById('actionButtons');
  btns.innerHTML = '';

  if (G.phase === 'roll') {
    const rollBtn = document.createElement('button');
    rollBtn.className = 'action-roll';
    rollBtn.textContent = '🎲 LEMPAR DADU';
    rollBtn.onclick = doRoll;
    rollBtn.disabled = false;
    btns.appendChild(rollBtn);

    if (p.inJail) {
      if (p.jailFreeCards > 0) {
        const jailFreeBtn = document.createElement('button');
        jailFreeBtn.className = 'action-end';
        jailFreeBtn.textContent = '🃏 Kartu Bebas';
        jailFreeBtn.onclick = useJailFreeCard;
        btns.appendChild(jailFreeBtn);
      }
      const payJailBtn = document.createElement('button');
      payJailBtn.className = 'action-end';
      payJailBtn.textContent = '💰 Bayar 100rb';
      payJailBtn.onclick = payJailFine;
      btns.appendChild(payJailBtn);
    }
  } else if (G.phase === 'action') {
    const endBtn = document.createElement('button');
    endBtn.className = 'action-end';
    endBtn.textContent = '⏭ AKHIRI GILIRAN';
    endBtn.onclick = endTurn;
    btns.appendChild(endBtn);
  }
}

function dieFace(n) {
  const faces = ['🎲','⚀','⚁','⚂','⚃','⚄','⚅'];
  return faces[n] || '🎲';
}

function renderRoundInfo() {
  document.getElementById('modeLabel').textContent = G.mode === 'quick' ? '⚡ 30 RONDE' : '♾️ CLASSIC';
  document.getElementById('roundCounter').textContent = G.mode === 'quick' ? `Ronde ${G.round}/30` : `Ronde ${G.round}`;
}

function renderAll() {
  renderPlayerStrip();
  renderCurrentPlayerBar();
  renderActionPanel();
  renderOwnership();
  renderTokens();
  renderRoundInfo();
}

// ============================================================
// DICE & MOVEMENT
// ============================================================
function doRoll() {
  const p = G.players[G.currentPlayer];
  const d1 = rand(1, 6);
  const d2 = rand(1, 6);
  G.lastDice = [d1, d2];
  const total = d1 + d2;
  const isDouble = d1 === d2;

  // Animate dice
  const die1El = document.getElementById('die1');
  const die2El = document.getElementById('die2');
  die1El.classList.add('rolling');
  die2El.classList.add('rolling');
  setTimeout(() => {
    die1El.classList.remove('rolling');
    die2El.classList.remove('rolling');
    die1El.textContent = dieFace(d1);
    die2El.textContent = dieFace(d2);
    document.getElementById('diceTotal').textContent = `Total: ${total}${isDouble ? ' (DOUBLE! 🎰)' : ''}`;
  }, 400);

  setTimeout(() => {
    if (p.inJail) {
      handleJailRoll(p, d1, d2, isDouble);
    } else {
      if (isDouble) {
        G.doublesCount++;
        addLog(`🎲 ${p.name} lempar ${d1}+${d2}=${total} — DOUBLE! (${G.doublesCount}x)`);
        if (G.doublesCount >= 3) {
          addLog(`🚓 ${p.name} lempar double 3x! Masuk penjara!`);
          sendToJail(p);
          G.diceRolled = true;
          G.phase = 'action';
          renderAll();
          return;
        }
      } else {
        addLog(`🎲 ${p.name} lempar ${d1}+${d2}=${total}`);
        G.doublesCount = 0;
      }

      const fromPos = p.position;
      movePlayer(p, total, () => {
        G.diceRolled = true;
        if (!isDouble) {
          G.phase = 'action';
        } else {
          G.phase = 'roll'; // can roll again
        }
        renderAll();
        resolveTile(p);
      });
    }
  }, 500);
}

function handleJailRoll(p, d1, d2, isDouble) {
  if (isDouble) {
    addLog(`🎉 ${p.name} keluar penjara dengan double!`);
    p.inJail = false;
    p.jailTurns = 0;
    const total = d1 + d2;
    movePlayer(p, total, () => {
      G.phase = 'action';
      G.doublesCount = 0; // After jail, don't count double for extra turn
      renderAll();
      resolveTile(p);
    });
  } else {
    p.jailTurns++;
    addLog(`🔒 ${p.name} tidak double. Di penjara giliran ${p.jailTurns}/3.`);
    if (p.jailTurns >= 3) {
      addLog(`💸 ${p.name} terpaksa bayar denda 100rb untuk keluar penjara.`);
      pay(p, 100000, 'bank');
      p.inJail = false;
      p.jailTurns = 0;
      const total = d1 + d2;
      movePlayer(p, total, () => {
        G.phase = 'action';
        renderAll();
        resolveTile(p);
      });
    } else {
      G.phase = 'action';
      renderAll();
    }
  }
}

function useJailFreeCard() {
  const p = G.players[G.currentPlayer];
  if (p.jailFreeCards <= 0) return;
  p.jailFreeCards--;
  p.inJail = false;
  p.jailTurns = 0;
  addLog(`🃏 ${p.name} pakai Kartu Keluar Penjara Gratis!`);
  renderAll();
}

function payJailFine() {
  const p = G.players[G.currentPlayer];
  if (p.money < 100000) {
    addLog(`❌ ${p.name} tidak punya cukup uang untuk bayar denda!`);
    return;
  }
  pay(p, 100000, 'bank');
  p.inJail = false;
  p.jailTurns = 0;
  addLog(`💸 ${p.name} bayar 100rb untuk keluar penjara.`);
  renderAll();
}

function movePlayer(p, steps, callback) {
  const fromPos = p.position;
  const toPos = (p.position + steps + 40) % 40;

  // Check if passed or landed on START (only when moving forward)
  if (steps > 0 && (fromPos + steps) >= 40) {
    addLog(`🏁 ${p.name} lewat START! +200.000`);
    p.money += 200000;
  }

  p.position = toPos;
  animateMoveToken(p.id, fromPos, toPos, callback);
}

function sendToJail(p) {
  p.position = 10; // jail-visit tile is jail
  p.inJail = true;
  p.jailTurns = 0;
  renderTokens();
  addLog(`🚓 ${p.name} masuk penjara!`);
}

// ============================================================
// TILE RESOLUTION
// ============================================================
function resolveTile(p) {
  const tile = TILES[p.position];
  const prop = G.properties[p.position];

  switch (tile.type) {
    case 'start': break;
    case 'jail-visit': addLog(`👀 ${p.name} berkunjung ke penjara.`); break;
    case 'parking': addLog(`🅿️ ${p.name} parkir gratis. Istirahat!`); break;
    case 'go-to-jail':
      sendToJail(p);
      break;
    case 'tax':
      addLog(`💸 ${p.name} bayar pajak ${fmt(tile.amount)}`);
      pay(p, tile.amount, 'bank');
      renderAll();
      break;
    case 'chance':
      drawCard('chance', p);
      break;
    case 'community':
      drawCard('community', p);
      break;
    case 'property':
    case 'station':
    case 'utility':
      resolvePurchasable(p, tile, prop);
      break;
  }
}

function resolvePurchasable(p, tile, prop) {
  if (prop.owner === null) {
    // Offer to buy
    showTilePopup(tile, prop, p, true);
  } else if (prop.owner === p.id) {
    addLog(`🏠 ${p.name} berdiri di properti sendiri.`);
  } else if (prop.mortgaged) {
    addLog(`📋 ${tile.name} sedang dihipotek. Tidak bayar sewa.`);
  } else {
    // Pay rent
    const owner = G.players[prop.owner];
    const rentAmt = calcRent(tile, prop);
    addLog(`💰 ${p.name} bayar sewa ${fmt(rentAmt)} ke ${owner.name}`);
    pay(p, rentAmt, owner);
    renderAll();
    checkBankruptcy(p);
  }
}

function calcRent(tile, prop) {
  if (tile.type === 'station') {
    const ownedStations = G.properties.filter(pp => pp.owner === prop.owner && STATIONS.includes(pp.idx)).length;
    return 25000 * Math.pow(2, ownedStations - 1);
  }
  if (tile.type === 'utility') {
    const ownedUtils = G.properties.filter(pp => pp.owner === prop.owner && UTILITIES.includes(pp.idx)).length;
    const diceTotal = G.lastDice[0] + G.lastDice[1];
    return diceTotal * (ownedUtils === 1 ? 4 : 10) * 1000;
  }
  // Property
  if (prop.level === 0) {
    // Base rent — if owner has full color group, double
    const group = COLOR_GROUPS[tile.color];
    const allOwned = group.tiles.every(idx => G.properties[idx].owner === prop.owner);
    return allOwned ? tile.rent[0] * 2 : tile.rent[0];
  }
  return tile.rent[prop.level]; // rent[1]=1house, [2]=2houses, [3]=3houses, [4]=hotel
}

// ============================================================
// CARD SYSTEM
// ============================================================
function drawCard(deck, p) {
  let cardArr, cards;
  if (deck === 'chance') {
    if (G.chanceCards.length === 0) G.chanceCards = shuffle([...Array(CHANCE_CARDS.length).keys()]);
    cardArr = G.chanceCards;
    cards = CHANCE_CARDS;
  } else {
    if (G.communityCards.length === 0) G.communityCards = shuffle([...Array(COMMUNITY_CARDS.length).keys()]);
    cardArr = G.communityCards;
    cards = COMMUNITY_CARDS;
  }

  const cardIdx = cardArr.pop();
  const card = cards[cardIdx];
  addLog(`🎴 ${p.name} ambil kartu: "${card.title}"`);

  showCardPopup(card, () => {
    applyCard(card, p, deck, cardIdx, cards);
    renderAll();
    checkBankruptcy(p);
    checkWinCondition();
  });
}

function applyCard(card, p, deck, cardIdx, cards) {
  switch (card.action) {
    case 'money':
      p.money += card.amount;
      addLog(`💚 ${p.name} dapat ${fmt(card.amount)}`);
      break;
    case 'pay':
      pay(p, card.amount, 'bank');
      addLog(`💔 ${p.name} bayar ${fmt(card.amount)}`);
      break;
    case 'jail-free':
      p.jailFreeCards++;
      addLog(`🃏 ${p.name} dapat Kartu Keluar Penjara!`);
      // Put card aside (keep index to return later) - simplified: just give card
      break;
    case 'go-to-jail':
      sendToJail(p);
      break;
    case 'goto':
      const fromPos = p.position;
      if (card.target < fromPos || card.target === 0) {
        addLog(`🏁 ${p.name} lewat START! +200.000`);
        p.money += 200000;
      }
      p.position = card.target;
      renderTokens();
      highlightCell(card.target);
      resolveTile(p);
      break;
    case 'nearest-station':
      const nearest = findNearest(p.position, STATIONS);
      if (nearest < p.position) { p.money += 200000; addLog(`🏁 Lewat START! +200rb`); }
      p.position = nearest;
      renderTokens();
      highlightCell(nearest);
      resolveTile(p);
      break;
    case 'move':
      movePlayer(p, card.steps, () => {
        renderTokens();
        resolveTile(p);
      });
      break;
    case 'audit':
      const assets = calcNetWorth(p);
      const taxAmt = Math.floor(assets * 0.1);
      addLog(`💸 Audit! ${p.name} bayar 10% aset = ${fmt(taxAmt)}`);
      pay(p, taxAmt, 'bank');
      break;
    case 'repair':
      let repairTotal = 0;
      G.properties.forEach(prop => {
        if (prop.owner === p.id) {
          if (prop.level < 4) repairTotal += prop.level * card.houseRate;
          else repairTotal += card.hotelRate;
        }
      });
      if (repairTotal > 0) {
        addLog(`🔧 ${p.name} bayar renovasi ${fmt(repairTotal)}`);
        pay(p, repairTotal, 'bank');
      } else {
        addLog(`🔧 ${p.name} tidak punya bangunan, tidak ada biaya.`);
      }
      break;
    case 'collect-from-all':
      G.players.forEach(op => {
        if (op.id !== p.id && !op.bankrupt) {
          const amt = Math.min(card.amount, op.money);
          op.money -= amt;
          p.money += amt;
        }
      });
      addLog(`🎂 ${p.name} dapat ${fmt(card.amount)} dari semua pemain!`);
      break;
  }
}

function findNearest(pos, targets) {
  let nearest = targets[0];
  let minDist = Infinity;
  targets.forEach(t => {
    const dist = (t - pos + 40) % 40;
    if (dist < minDist) { minDist = dist; nearest = t; }
  });
  return nearest;
}

// ============================================================
// BUY / BUILD / MORTGAGE
// ============================================================
function buyProperty(tileIdx) {
  const p = G.players[G.currentPlayer];
  const tile = TILES[tileIdx];
  const prop = G.properties[tileIdx];

  if (prop.owner !== null) return;
  if (p.money < tile.price) {
    addLog(`❌ ${p.name} tidak cukup uang untuk beli ${tile.name}`);
    closeTilePopup();
    return;
  }

  p.money -= tile.price;
  prop.owner = p.id;
  p.properties.push(tileIdx);
  addLog(`🏠 ${p.name} beli ${tile.name} seharga ${fmt(tile.price)}`);
  closeTilePopup();
  renderAll();
  saveGame();
}

function buildHouse(tileIdx) {
  const p = G.players[G.currentPlayer];
  const tile = TILES[tileIdx];
  const prop = G.properties[tileIdx];

  if (prop.owner !== p.id) { addLog('Bukan properti kamu!'); return; }
  if (prop.mortgaged) { addLog('Properti sedang dihipotek!'); return; }
  if (prop.level >= 4) { addLog('Sudah hotel!'); return; }

  // Check full color group owned
  const group = COLOR_GROUPS[tile.color];
  const allOwned = group.tiles.every(idx => G.properties[idx].owner === p.id && !G.properties[idx].mortgaged);
  if (!allOwned) { addLog('❌ Harus punya semua properti warna ini untuk membangun!'); closeBuildPopup(); return; }

  // Check even building rule (cannot build 2 on one while others have 0)
  const levels = group.tiles.map(idx => G.properties[idx].level);
  const myLevel = prop.level;
  if (myLevel > Math.min(...levels)) {
    addLog('❌ Harus bangun merata di semua properti warna ini!');
    closeBuildPopup();
    return;
  }

  const cost = tile.price * (0.5 * (prop.level + 1));
  if (p.money < cost) { addLog(`❌ Tidak cukup uang. Butuh ${fmt(cost)}`); closeBuildPopup(); return; }

  p.money -= cost;
  prop.level++;

  const levelName = prop.level === 4 ? '🏢 Hotel' : `🏠 × ${prop.level}`;
  addLog(`🏗️ ${p.name} bangun ${levelName} di ${tile.name} (${fmt(cost)})`);

  renderAll();
  saveGame();
  showBuildPopup(); // refresh
}

function sellHouse(tileIdx) {
  const p = G.players[G.currentPlayer];
  const tile = TILES[tileIdx];
  const prop = G.properties[tileIdx];

  if (prop.owner !== p.id || prop.level === 0) return;

  // Check even selling rule
  const group = COLOR_GROUPS[tile.color];
  const levels = group.tiles.map(idx => G.properties[idx].level);
  if (prop.level < Math.max(...levels)) {
    addLog('❌ Harus jual merata. Jual dari yang lebih dulu!');
    return;
  }

  const refund = Math.floor(tile.price * 0.25 * prop.level);
  p.money += refund;
  prop.level--;

  addLog(`💵 ${p.name} jual bangunan di ${tile.name}, dapat ${fmt(refund)}`);
  renderAll();
  saveGame();
  showBuildPopup();
}

function mortgageProperty(tileIdx) {
  const p = G.players[G.currentPlayer];
  const tile = TILES[tileIdx];
  const prop = G.properties[tileIdx];

  if (prop.owner !== p.id || prop.mortgaged) return;
  if (prop.level > 0) { addLog('❌ Jual bangunan dulu sebelum hipotek!'); closeMortgagePopup(); return; }

  const val = Math.floor(tile.price * 0.5);
  p.money += val;
  prop.mortgaged = true;
  addLog(`🏦 ${p.name} hipotek ${tile.name}. Dapat ${fmt(val)}`);
  renderAll();
  saveGame();
  showMortgagePopup();
}

function redeemMortgage(tileIdx) {
  const p = G.players[G.currentPlayer];
  const tile = TILES[tileIdx];
  const prop = G.properties[tileIdx];

  if (prop.owner !== p.id || !prop.mortgaged) return;

  const cost = Math.floor(tile.price * 0.55); // 50% + 10% interest
  if (p.money < cost) { addLog(`❌ Butuh ${fmt(cost)} untuk tebus hipotek.`); closeMortgagePopup(); return; }

  p.money -= cost;
  prop.mortgaged = false;
  addLog(`✅ ${p.name} tebus hipotek ${tile.name}. Bayar ${fmt(cost)}`);
  renderAll();
  saveGame();
  showMortgagePopup();
}

// ============================================================
// LOAN SYSTEM
// ============================================================
function takeLoan(amount) {
  const p = G.players[G.currentPlayer];
  if (p.loan >= 500000) { addLog('❌ Sudah mencapai batas pinjaman!'); return; }
  const maxLoan = 500000 - p.loan;
  const actualAmount = Math.min(amount, maxLoan);
  p.money += actualAmount;
  p.loan += actualAmount;
  p.loanRound = G.round;
  addLog(`💳 ${p.name} pinjam ${fmt(actualAmount)} dari bank. Total hutang: ${fmt(p.loan)}`);
  renderAll();
  saveGame();
  closeLoanPopup();
}

function repayLoan(amount) {
  const p = G.players[G.currentPlayer];
  if (p.loan === 0) { addLog('Tidak ada hutang.'); return; }
  const pay_amount = Math.min(amount, p.loan, p.money);
  p.money -= pay_amount;
  p.loan -= pay_amount;
  addLog(`💸 ${p.name} bayar hutang ${fmt(pay_amount)}. Sisa hutang: ${fmt(p.loan)}`);
  renderAll();
  saveGame();
  closeLoanPopup();
}

function checkLoanInterest() {
  G.players.forEach(p => {
    if (p.loan > 0 && !p.bankrupt) {
      const roundsElapsed = G.round - p.loanRound;
      if (roundsElapsed > 0 && roundsElapsed % G.loanIntervalRounds === 0) {
        const interest = Math.floor(p.loan * 0.15);
        p.loan += interest;
        addLog(`📈 Bunga pinjaman ${p.name}: +${fmt(interest)}. Total hutang: ${fmt(p.loan)}`);
      }
    }
  });
}

// ============================================================
// PAYMENT SYSTEM
// ============================================================
function pay(player, amount, recipient) {
  if (player.bankrupt) return;

  // If can't pay, try to mortgage/sell assets first
  while (player.money < amount) {
    if (!emergencyFunds(player, amount - player.money)) break;
  }

  const actualPay = Math.min(player.money, amount);
  player.money -= actualPay;

  if (recipient === 'bank') {
    // Money goes to bank
  } else if (recipient && typeof recipient === 'object') {
    recipient.money += actualPay;
    if (actualPay < amount) {
      // Bankrupt - give everything remaining to creditor
      recipient.money += player.money;
      player.money = 0;
    }
  }

  if (player.money <= 0 && player.properties.length === 0 && player.loan >= 0) {
    // Check for real bankruptcy
    checkBankruptcy(player);
  }
}

function emergencyFunds(player, needed) {
  // Try to mortgage a property
  for (let idx of player.properties) {
    const prop = G.properties[idx];
    const tile = TILES[idx];
    if (!prop.mortgaged && prop.level === 0) {
      const val = Math.floor(tile.price * 0.5);
      player.money += val;
      prop.mortgaged = true;
      addLog(`⚠️ ${player.name} hipotek darurat: ${tile.name} (+${fmt(val)})`);
      return true;
    }
    // Sell building first
    if (prop.level > 0) {
      const refund = Math.floor(tile.price * 0.25 * prop.level);
      player.money += refund;
      prop.level--;
      addLog(`⚠️ ${player.name} jual bangunan darurat di ${tile.name} (+${fmt(refund)})`);
      return true;
    }
  }
  return false;
}

function checkBankruptcy(player) {
  if (player.bankrupt) return;
  if (player.money > 0) return;
  if (player.properties.length > 0) return; // Still has assets

  // Check if they can cover with loan possibilities
  // If broke and no assets -> bankrupt
  if (player.money <= 0 && player.properties.length === 0) {
    declareBankruptcy(player);
  }
}

function declareBankruptcy(player) {
  player.bankrupt = true;
  player.money = 0;
  // Return properties to bank
  player.properties.forEach(idx => {
    const prop = G.properties[idx];
    prop.owner = null;
    prop.level = 0;
    prop.mortgaged = false;
  });
  player.properties = [];
  addLog(`💀 ${player.name} BANGKRUT! Semua properti dikembalikan ke bank.`);
  renderAll();
  checkWinCondition();
}

// ============================================================
// END TURN / NEXT PLAYER
// ============================================================
function endTurn() {
  G.phase = 'roll';
  G.diceRolled = false;

  // Interest check
  checkLoanInterest();

  const numPlayers = G.players.length;
  let next = (G.currentPlayer + 1) % numPlayers;
  let tries = 0;
  while (G.players[next].bankrupt && tries < numPlayers) {
    next = (next + 1) % numPlayers;
    tries++;
  }

  // Check if we completed a full round (wrapped around past player 0)
  // A round completes when the next active player's index is <= current, meaning we wrapped
  const activePlayers = G.players.filter(p => !p.bankrupt);
  const currentIdx = activePlayers.findIndex(p => p.id === G.players[G.currentPlayer].id);
  const nextIdx = activePlayers.findIndex(p => p.id === G.players[next].id);

  if (activePlayers.length > 0 && (nextIdx <= currentIdx || nextIdx === 0)) {
    G.round++;
    addLog(`━━━ RONDE ${G.round} DIMULAI ━━━`);
    if (G.mode === 'quick' && G.round > 30) {
      endGameByTimer();
      return;
    }
  }

  G.currentPlayer = next;
  G.doublesCount = 0;

  addLog(`▶ Giliran ${G.players[next].name}`);
  renderAll();
  saveGame();
  checkWinCondition();
}

// ============================================================
// WIN CONDITION
// ============================================================
function checkWinCondition() {
  const alive = G.players.filter(p => !p.bankrupt);
  if (G.mode === 'classic') {
    if (alive.length === 1) {
      showWinScreen(alive[0], 'classic');
    } else if (alive.length === 0) {
      showWinScreen(null, 'classic');
    }
  }
  // In quick mode, the 30-round check in endTurn handles end game
}

function endGameByTimer() {
  // Sort by net worth
  const sorted = G.players
    .filter(p => !p.bankrupt)
    .map(p => ({ player: p, nw: calcNetWorth(p) }))
    .sort((a, b) => b.nw - a.nw);

  if (sorted.length === 0) return;
  showWinScreen(sorted[0].player, 'timer', sorted);
}

function calcNetWorth(p) {
  let nw = p.money - p.loan;
  p.properties.forEach(idx => {
    const prop = G.properties[idx];
    const tile = TILES[idx];
    if (!prop.mortgaged) {
      nw += tile.price + prop.level * tile.price * 0.5;
    } else {
      nw += tile.price * 0.5;
    }
  });
  return Math.max(0, nw);
}

// ============================================================
// TRADE SYSTEM
// ============================================================
let tradeState = { fromPlayer: null, toPlayer: null, fromProp: null, cash: 0 };

function showTradePopup() {
  const p = G.players[G.currentPlayer];
  const others = G.players.filter(op => op.id !== p.id && !op.bankrupt);

  if (others.length === 0) { addLog('Tidak ada pemain lain untuk berdagang.'); closeMenu(); return; }

  tradeState = { fromPlayer: p.id, toPlayer: others[0].id, fromProp: null, toProp: null, cash: 0 };

  const el = document.getElementById('tradeContent');
  const fromProps = p.properties.map(idx => {
    const t = TILES[idx];
    return `<option value="${idx}">${t.name} (${fmt(t.price)})</option>`;
  });

  const toPlayerOpts = others.map(op => `<option value="${op.id}">${op.token} ${op.name}</option>`).join('');

  el.innerHTML = `
    <div class="trade-section">
      <h4>Kepada Siapa?</h4>
      <select class="trade-select" id="tradeToPlayer" onchange="updateTradeToProps()">
        ${toPlayerOpts}
      </select>
    </div>
    <div class="trade-section">
      <h4>Properti yang Kamu Tawarkan (opsional)</h4>
      <select class="trade-select" id="tradeFromProp">
        <option value="">-- Tidak ada --</option>
        ${fromProps.join('')}
      </select>
    </div>
    <div class="trade-section">
      <h4>Properti yang Kamu Minta (opsional)</h4>
      <select class="trade-select" id="tradeToProp" onchange="">
      </select>
    </div>
    <div class="trade-section">
      <h4>Uang Tambahan (kamu bayar, positif = kamu bayar)</h4>
      <input type="number" class="trade-amount-input" id="tradeCash" value="0" step="10000" placeholder="0"/>
    </div>
  `;

  document.getElementById('tradeActions').innerHTML = `
    <button class="btn-primary" onclick="executeTrade()">✅ LAKUKAN PERDAGANGAN</button>
  `;

  updateTradeToProps();

  document.getElementById('tradePopup').classList.remove('hidden');
  closeMenu();
}

function updateTradeToProps() {
  const toPlayerId = parseInt(document.getElementById('tradeToPlayer').value);
  const toPlayer = G.players[toPlayerId];
  const sel = document.getElementById('tradeToProp');
  sel.innerHTML = '<option value="">-- Tidak ada --</option>' +
    toPlayer.properties.map(idx => {
      const t = TILES[idx];
      return `<option value="${idx}">${t.name} (${fmt(t.price)})</option>`;
    }).join('');
}

function executeTrade() {
  const p = G.players[G.currentPlayer];
  const toPlayerId = parseInt(document.getElementById('tradeToPlayer').value);
  const toPlayer = G.players[toPlayerId];
  const fromPropVal = document.getElementById('tradeFromProp').value;
  const toPropVal = document.getElementById('tradeToProp').value;
  const cash = parseInt(document.getElementById('tradeCash').value) || 0;

  if (cash > 0 && p.money < cash) { addLog('❌ Tidak cukup uang untuk trade!'); return; }

  // Execute exchange
  if (cash !== 0) {
    if (cash > 0) {
      p.money -= cash;
      toPlayer.money += cash;
    } else {
      toPlayer.money -= Math.abs(cash);
      p.money += Math.abs(cash);
    }
  }

  if (fromPropVal) {
    const fromIdx = parseInt(fromPropVal);
    G.properties[fromIdx].owner = toPlayerId;
    p.properties = p.properties.filter(i => i !== fromIdx);
    toPlayer.properties.push(fromIdx);
    addLog(`🔄 ${p.name} serahkan ${TILES[fromIdx].name} ke ${toPlayer.name}`);
  }

  if (toPropVal) {
    const toIdx = parseInt(toPropVal);
    G.properties[toIdx].owner = p.id;
    toPlayer.properties = toPlayer.properties.filter(i => i !== toIdx);
    p.properties.push(toIdx);
    addLog(`🔄 ${toPlayer.name} serahkan ${TILES[toIdx].name} ke ${p.name}`);
  }

  if (cash > 0) addLog(`💵 ${p.name} bayar ${fmt(cash)} ke ${toPlayer.name}`);

  addLog(`✅ Trade selesai!`);
  closeTradePopup();
  renderAll();
  saveGame();
}

// ============================================================
// UI POPUPS
// ============================================================
function showTilePopup(tile, prop, p, canBuy) {
  const el = document.getElementById('popupContent');
  const colorBar = tile.color ? `<div class="color-stripe" style="background:${COLOR_CSS[tile.color]};height:10px;border-radius:4px;margin:8px 0;"></div>` : '';

  let rentTable = '';
  if (tile.type === 'property') {
    rentTable = `
      <div class="prop-info-row"><span>Sewa Dasar</span><span>${fmt(tile.rent[0])}</span></div>
      <div class="prop-info-row"><span>🏠 × 1</span><span>${fmt(tile.rent[1])}</span></div>
      <div class="prop-info-row"><span>🏠 × 2</span><span>${fmt(tile.rent[2])}</span></div>
      <div class="prop-info-row"><span>🏠 × 3</span><span>${fmt(tile.rent[3])}</span></div>
      <div class="prop-info-row"><span>🏢 Hotel</span><span>${fmt(tile.rent[4])}</span></div>
    `;
  } else if (tile.type === 'station') {
    rentTable = `
      <div class="prop-info-row"><span>1 Stasiun</span><span>25.000</span></div>
      <div class="prop-info-row"><span>2 Stasiun</span><span>50.000</span></div>
      <div class="prop-info-row"><span>3 Stasiun</span><span>100.000</span></div>
      <div class="prop-info-row"><span>4 Stasiun</span><span>200.000</span></div>
    `;
  } else if (tile.type === 'utility') {
    rentTable = `
      <div class="prop-info-row"><span>1 Utility</span><span>Dadu × 4.000</span></div>
      <div class="prop-info-row"><span>2 Utility</span><span>Dadu × 10.000</span></div>
    `;
  }

  el.innerHTML = `
    <div class="prop-detail">
      <h4>${tile.name}</h4>
      ${colorBar}
      <div class="prop-info-row"><span>Harga</span><span>${fmt(tile.price)}</span></div>
      ${rentTable}
    </div>
    <div class="prop-info-row"><span>💰 Uangmu</span><span>${fmt(p.money)}</span></div>
  `;

  const actEl = document.getElementById('popupActions');
  actEl.innerHTML = '';

  if (canBuy && prop.owner === null) {
    if (p.money >= tile.price) {
      const buyBtn = document.createElement('button');
      buyBtn.className = 'btn-primary';
      buyBtn.textContent = `💰 BELI — ${fmt(tile.price)}`;
      buyBtn.onclick = () => buyProperty(tile.idx);
      actEl.appendChild(buyBtn);
    } else {
      actEl.innerHTML = `<p style="color:var(--red);text-align:center;font-size:12px">Tidak cukup uang untuk beli.</p>`;
    }
  }

  document.getElementById('tilePopup').classList.remove('hidden');
}

function onCellClick(idx) {
  const tile = TILES[idx];
  const prop = G.properties[idx];

  if (['property','station','utility'].includes(tile.type)) {
    const p = G.players[G.currentPlayer];
    const canBuy = (prop.owner === null) && (G.phase === 'action') && (p.position === idx);
    showTilePopup(tile, prop, p, canBuy);
  }
}

function closeTilePopup() { document.getElementById('tilePopup').classList.add('hidden'); }

function showCardPopup(card, callback) {
  const el = document.getElementById('cardContent');
  const typeClass = card.type;
  const icon = card.type === 'positive' ? '💚' : card.type === 'negative' ? '💔' : '⚖️';
  const deckLabel = card.deck === 'chance' ? '❓ Kesempatan' : '💌 Dana Umum';

  let amountHtml = '';
  if (card.amount) amountHtml = `<div class="card-amount" style="color:${card.type==='positive'?'var(--green)':'var(--red)'}">
    ${card.type==='positive'?'+':'-'}${fmt(card.amount)}</div>`;

  el.innerHTML = `
    <div class="card-display ${typeClass}">
      <div class="card-title">${icon} ${card.title}</div>
      <div class="card-desc">${card.desc}</div>
      ${amountHtml}
    </div>
  `;

  document.getElementById('cardPopup').classList.remove('hidden');

  // Override OK button with callback
  const okBtn = document.querySelector('#cardPopup .btn-primary');
  okBtn.onclick = () => {
    document.getElementById('cardPopup').classList.add('hidden');
    callback && callback();
  };
}

function closeCardPopup() { document.getElementById('cardPopup').classList.add('hidden'); }

function showPropertyPopup(playerId) {
  const p = G.players[playerId];
  const el = document.getElementById('propertyList');

  if (p.properties.length === 0) {
    el.innerHTML = '<p style="text-align:center;color:#888;padding:16px">Tidak ada properti.</p>';
  } else {
    el.innerHTML = p.properties.map(idx => {
      const tile = TILES[idx];
      const prop = G.properties[idx];
      const colorDot = tile.color ? `<div class="prop-color-dot" style="background:${COLOR_CSS[tile.color]}"></div>` : '';
      const status = prop.mortgaged ? '❌ Dihipotek' : prop.level === 4 ? '🏢 Hotel' : prop.level > 0 ? `🏠×${prop.level}` : '✅ Kosong';

      return `<div class="prop-item">
        <div class="prop-item-left">
          ${colorDot}
          <div>
            <div class="prop-item-name">${tile.name}</div>
            <div class="prop-item-status">${status} | Sewa: ${fmt(calcRent(tile, prop))}</div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  document.getElementById('propertyPopup').classList.remove('hidden');
}

function showPropertyPopupForAll() {
  const el = document.getElementById('propertyList');
  const allOwned = TILES.filter(t => ['property','station','utility'].includes(t.type))
    .map(t => ({ tile: t, prop: G.properties[t.idx] }))
    .filter(x => x.prop.owner !== null);

  if (allOwned.length === 0) {
    el.innerHTML = '<p style="text-align:center;color:#888;padding:16px">Belum ada properti yang dibeli.</p>';
  } else {
    el.innerHTML = allOwned.map(({ tile, prop }) => {
      const owner = G.players[prop.owner];
      const colorDot = tile.color ? `<div class="prop-color-dot" style="background:${COLOR_CSS[tile.color]}"></div>` : '';
      const status = prop.mortgaged ? '❌' : prop.level === 4 ? '🏢' : prop.level > 0 ? `🏠×${prop.level}` : '—';
      return `<div class="prop-item">
        <div class="prop-item-left">
          ${colorDot}
          <div>
            <div class="prop-item-name">${tile.name}</div>
            <div class="prop-item-status">${owner.token} ${owner.name} | ${status}</div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  document.getElementById('propertyPopup').classList.remove('hidden');
  closeMenu();
}

function closePropertyPopup() { document.getElementById('propertyPopup').classList.add('hidden'); }
function closeTradePopup() { document.getElementById('tradePopup').classList.add('hidden'); }

function showMortgagePopup() {
  const p = G.players[G.currentPlayer];
  const el = document.getElementById('mortgageList');

  if (p.properties.length === 0) {
    el.innerHTML = '<p style="text-align:center;color:#888;padding:16px">Tidak ada properti.</p>';
  } else {
    el.innerHTML = p.properties.map(idx => {
      const tile = TILES[idx];
      const prop = G.properties[idx];
      const mortVal = Math.floor(tile.price * 0.5);
      const redeemVal = Math.floor(tile.price * 0.55);

      return `<div class="prop-item">
        <div class="prop-item-left">
          <div>
            <div class="prop-item-name">${tile.name}</div>
            <div class="prop-item-status">${prop.mortgaged ? '❌ Dihipotek' : '✅ Aktif'} | Hipotek: ${fmt(mortVal)}</div>
          </div>
        </div>
        <div class="prop-item-actions">
          ${!prop.mortgaged && prop.level === 0 ? `<button class="btn-xs" onclick="mortgageProperty(${idx})">Hipotek</button>` : ''}
          ${prop.mortgaged ? `<button class="btn-xs green" onclick="redeemMortgage(${idx})">Tebus ${fmt(redeemVal)}</button>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  document.getElementById('mortgagePopup').classList.remove('hidden');
  closeMenu();
}

function closeMortgagePopup() { document.getElementById('mortgagePopup').classList.add('hidden'); }

function showLoanPopup() {
  const p = G.players[G.currentPlayer];
  const maxBorrow = 500000 - p.loan;
  document.getElementById('loanInfo').innerHTML = `
    <div class="nw-row"><span>Hutang Saat Ini</span><span style="color:var(--red)">${fmt(p.loan)}</span></div>
    <div class="nw-row"><span>Maksimal Pinjam Lagi</span><span>${fmt(maxBorrow)}</span></div>
    <div class="nw-row"><span>Bunga per 5 Ronde</span><span>15%</span></div>
    <br>
    <input type="number" class="trade-amount-input" id="loanAmount" placeholder="Jumlah pinjaman" step="50000" min="0" max="${maxBorrow}" value="${Math.min(100000, maxBorrow)}"/>
  `;
  document.getElementById('loanActions').innerHTML = `
    <button class="btn-primary" onclick="takeLoan(parseInt(document.getElementById('loanAmount').value)||0)">💳 PINJAM</button>
    <button class="btn-danger" onclick="repayLoan(parseInt(document.getElementById('loanAmount').value)||0)">💸 BAYAR HUTANG</button>
  `;
  document.getElementById('loanPopup').classList.remove('hidden');
  closeMenu();
}

function closeLoanPopup() { document.getElementById('loanPopup').classList.add('hidden'); }

function showBuildPopup() {
  const p = G.players[G.currentPlayer];
  const el = document.getElementById('buildList');

  const buildableProps = p.properties.filter(idx => {
    const tile = TILES[idx];
    return tile.type === 'property';
  });

  if (buildableProps.length === 0) {
    el.innerHTML = '<p style="text-align:center;color:#888;padding:16px">Tidak ada properti yang bisa dibangun.</p>';
  } else {
    el.innerHTML = buildableProps.map(idx => {
      const tile = TILES[idx];
      const prop = G.properties[idx];
      const group = COLOR_GROUPS[tile.color];
      const allOwned = group.tiles.every(i => G.properties[i].owner === p.id);
      const buildCost = Math.floor(tile.price * 0.5 * (prop.level + 1));
      const sellRefund = prop.level > 0 ? Math.floor(tile.price * 0.25 * prop.level) : 0;
      const levelStr = prop.level === 0 ? 'Kosong' : prop.level === 4 ? '🏢 Hotel' : `🏠×${prop.level}`;

      return `<div class="prop-item">
        <div class="prop-item-left" style="flex-direction:column;align-items:flex-start">
          <div class="prop-item-name" style="display:flex;align-items:center;gap:6px">
            <div class="prop-color-dot" style="background:${COLOR_CSS[tile.color]}"></div>
            ${tile.name}
          </div>
          <div class="prop-item-status">${levelStr}${!allOwned ? ' | ⚠️ Kurang properti set' : prop.mortgaged ? ' | ❌ Dihipotek' : ''}</div>
        </div>
        <div class="prop-item-actions" style="display:flex;gap:3px;flex-wrap:wrap">
          ${allOwned && !prop.mortgaged && prop.level < 4 ? `<button class="btn-xs green" onclick="buildHouse(${idx})">+🏠 ${fmt(buildCost)}</button>` : ''}
          ${prop.level > 0 ? `<button class="btn-xs red" onclick="sellHouse(${idx})">-🏠 +${fmt(sellRefund)}</button>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  document.getElementById('buildPopup').classList.remove('hidden');
}

function closeBuildPopup() { document.getElementById('buildPopup').classList.add('hidden'); }

function showNetWorth() {
  const el = document.getElementById('networthContent');
  const medals = ['🥇','🥈','🥉','4️⃣'];
  const sorted = G.players
    .map(p => ({ p, nw: calcNetWorth(p) }))
    .sort((a, b) => b.nw - a.nw);

  el.innerHTML = sorted.map(({ p, nw }, i) => {
    const medal = medals[i] || `${i+1}.`;
    return `<div class="nw-row">
      <div class="nw-name">${medal} ${p.token} ${p.name}${p.bankrupt ? ' (💀)' : ''}</div>
      <div style="font-weight:700;color:var(--accent2)">${fmt(nw)}</div>
    </div>`;
  }).join('');

  document.getElementById('networthPopup').classList.remove('hidden');
  closeMenu();
}

function closeNetworth() { document.getElementById('networthPopup').classList.add('hidden'); }

function showMenu() { document.getElementById('menuPopup').classList.remove('hidden'); }
function closeMenu() { document.getElementById('menuPopup').classList.add('hidden'); }

function showPlayerInfo(playerId) {
  showPropertyPopup(playerId);
}

function showWinScreen(winner, mode, rankings) {
  clearSave();
  const el = document.getElementById('winContent');
  const medals = ['🥇','🥈','🥉','4️⃣'];

  if (mode === 'timer' && rankings) {
    el.innerHTML = `
      <div style="font-size:20px;margin:8px 0">${winner.token} <strong>${winner.name}</strong></div>
      <p style="color:#888;margin-bottom:12px">Net Worth Tertinggi dalam 30 Ronde!</p>
      <div style="text-align:left">
        ${rankings.map((r, i) => {
          const medal = medals[i] || `${i+1}.`;
          return `<div class="nw-row">${medal} ${r.player.token} ${r.player.name} — ${fmt(r.nw)}</div>`;
        }).join('')}
      </div>
    `;
  } else if (winner) {
    el.innerHTML = `
      <div style="font-size:48px;margin:8px 0">${winner.token}</div>
      <div style="font-size:22px;font-family:'Playfair Display',serif;color:var(--accent2)">${winner.name}</div>
      <p style="margin-top:8px;color:#888">Menjadi Penguasa Nusantara!</p>
    `;
  } else {
    el.innerHTML = `<p>Semua pemain bangkrut. Tidak ada pemenang!</p>`;
  }

  document.getElementById('winScreen').classList.remove('hidden');
}

function confirmNewGame() {
  if (confirm('Mulai game baru? Progress saat ini akan hilang.')) {
    clearSave();
    location.reload();
  }
}

// ============================================================
// LOG
// ============================================================
function addLog(msg) {
  G.log.push(msg);
  if (G.log.length > 50) G.log = G.log.slice(-50);

  const logContent = document.getElementById('logContent');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.textContent = msg;
  logContent.appendChild(entry);

  // Keep last 15 entries visible
  while (logContent.children.length > 15) {
    logContent.removeChild(logContent.firstChild);
  }
  logContent.scrollTop = logContent.scrollHeight;
}

// ============================================================
// SAVE / LOAD
// ============================================================
function saveGame() {
  try {
    localStorage.setItem('blockstate_save', JSON.stringify(G));
  } catch(e) {}
}

function loadGame(mode) {
  try {
    const raw = localStorage.getItem('blockstate_save');
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.mode === mode) return saved;
  } catch(e) {}
  return null;
}

function clearSave() {
  try { localStorage.removeItem('blockstate_save'); } catch(e) {}
}

// ============================================================
// UTILS
// ============================================================
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function fmt(n) {
  if (n === undefined || n === null) return '0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================================
// PLAYER SELECT SCREEN
// ============================================================
let _pendingMode = 'classic';
let _playerCount = 2;
let _selectedTokens = [];

function showPlayerSelect(mode) {
  _pendingMode = mode;
  _playerCount = 2;
  document.getElementById('modeSelect').classList.add('hidden');
  document.getElementById('playerSelect').classList.remove('hidden');
  renderPlayerSetup();
  setPlayerCount(2);
}

function setPlayerCount(n) {
  _playerCount = n;
  [2,3,4].forEach(i => {
    const btn = document.getElementById(`cnt${i}`);
    if (btn) btn.classList.toggle('active', i === n);
  });
  renderPlayerSetup();
}

function renderPlayerSetup() {
  const container = document.getElementById('playerSetupList');
  if (!container) return;

  _selectedTokens = [];

  // Each player gets their own character assigned (default = their index)
  for (let i = 0; i < _playerCount; i++) {
    _selectedTokens.push(ALL_TOKENS[i]);
  }

  let html = '<div class="player-setup-list">';
  for (let i = 0; i < _playerCount; i++) {
    const color = PLAYER_COLORS[i];
    const currentToken = _selectedTokens[i];

    const tokenOpts = ALL_TOKENS.map(t => {
      const isSel = t === currentToken;
      return `<button class="token-option${isSel ? ' selected' : ''}" style="${isSel ? `border-color:${color};background:#FFF3CC` : ''}" data-player="${i}" data-token="${t}" onclick="pickToken(${i},'${t}')">${t}</button>`;
    }).join('');

    html += `
      <div class="player-setup-row" id="prow-${i}">
        <div class="player-setup-num" style="background:${color}">${i+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:10px;color:var(--accent2);font-weight:700;margin-bottom:5px">Pilih Karakter:</div>
          <div class="player-token-picker" id="picker-${i}">${tokenOpts}</div>
          <input class="player-name-input" id="pname-${i}" type="text" value="Pemain ${i+1}" placeholder="Nama / Alias" maxlength="14" style="margin-top:6px"/>
        </div>
        <div class="player-color-swatch" style="background:${color}"></div>
      </div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

function pickToken(playerIdx, token) {
  _selectedTokens[playerIdx] = token;
  const picker = document.getElementById(`picker-${playerIdx}`);
  if (!picker) return;
  const color = PLAYER_COLORS[playerIdx];
  picker.querySelectorAll('.token-option').forEach(btn => {
    const isSel = btn.dataset.token === token;
    btn.classList.toggle('selected', isSel);
    btn.style.borderColor = isSel ? color : '';
    btn.style.background = isSel ? '#FFF3CC' : '';
  });
}

function confirmPlayerSetup() {
  // Build PLAYERS_INIT from inputs
  PLAYERS_INIT = [];
  for (let i = 0; i < _playerCount; i++) {
    const nameEl = document.getElementById(`pname-${i}`);
    const name = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : `Pemain ${i+1}`;
    PLAYERS_INIT.push({
      id: i,
      name: name,
      token: _selectedTokens[i] || ALL_TOKENS[i],
      color: PLAYER_COLORS[i],
    });
  }

  document.getElementById('playerSelect').classList.add('hidden');
  startGame(_pendingMode);
}

// ============================================================
// SCREEN NAVIGATION
// ============================================================
function showSplash() {
  document.getElementById('splash').classList.remove('hidden');
  document.getElementById('modeSelect').classList.add('hidden');
  document.getElementById('playerSelect').classList.add('hidden');
}

function showModeSelect() {
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('modeSelect').classList.remove('hidden');
  document.getElementById('playerSelect').classList.add('hidden');
}

function startGame(mode) {
  document.getElementById('modeSelect').classList.add('hidden');
  document.getElementById('playerSelect').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');

  initGame(mode);
  buildBoard();       // also calls scaleBoardToFit internally
  renderAll();

  // Place all tokens
  renderTokens();

  // Restore log if saved
  if (G.log && G.log.length > 0) {
    G.log.forEach(msg => {
      const logContent = document.getElementById('logContent');
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = msg;
      logContent.appendChild(entry);
    });
  } else {
    addLog(`🎮 Monopoli: Penyebab Solophobia dimulai!`);
    addLog(`🎲 Mode: ${mode === 'quick' ? '30 Ronde Cepat' : 'Classic'}`);
    addLog(`▶ Giliran pertama: ${G.players[0].name}`);
  }
}

// ============================================================
// ENTRY POINT
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  // Re-scale board on resize/orientation change
  window.addEventListener('resize', () => {
    if (document.getElementById('boardScaler')) scaleBoardToFit();
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => { if (document.getElementById('boardScaler')) scaleBoardToFit(); }, 200);
  });
  // Check for saved game
  try {
    const raw = localStorage.getItem('blockstate_save');
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && saved.players && saved.players.length >= 2) {
        const numP = saved.players.length;
        if (confirm(`Ada save game (Mode: ${saved.mode === 'quick' ? '30 Ronde' : 'Classic'}, ${numP} pemain, Ronde ${saved.round}). Lanjutkan?`)) {
          // Restore player count context so startGame works
          PLAYERS_INIT = saved.players.map(p => ({ id: p.id, name: p.name, token: p.token, color: p.color }));
          startGame(saved.mode);
          return;
        } else {
          clearSave();
        }
      }
    }
  } catch(e) { clearSave(); }

  // Show splash normally
  document.getElementById('splash').classList.remove('hidden');
});

// Expose functions to global scope for onclick handlers
window.scaleBoardToFit = scaleBoardToFit;
window.showModeSelect = showModeSelect;
window.showSplash = showSplash;
window.showPlayerSelect = showPlayerSelect;
window.setPlayerCount = setPlayerCount;
window.pickToken = pickToken;
window.confirmPlayerSetup = confirmPlayerSetup;
window.startGame = startGame;
window.doRoll = doRoll;
window.endTurn = endTurn;
window.buyProperty = buyProperty;
window.buildHouse = buildHouse;
window.sellHouse = sellHouse;
window.mortgageProperty = mortgageProperty;
window.redeemMortgage = redeemMortgage;
window.onCellClick = onCellClick;
window.closeTilePopup = closeTilePopup;
window.closeCardPopup = closeCardPopup;
window.showPropertyPopup = showPropertyPopup;
window.showPropertyPopupForAll = showPropertyPopupForAll;
window.closePropertyPopup = closePropertyPopup;
window.showTradePopup = showTradePopup;
window.closeTradePopup = closeTradePopup;
window.updateTradeToProps = updateTradeToProps;
window.executeTrade = executeTrade;
window.showMortgagePopup = showMortgagePopup;
window.closeMortgagePopup = closeMortgagePopup;
window.showLoanPopup = showLoanPopup;
window.closeLoanPopup = closeLoanPopup;
window.takeLoan = takeLoan;
window.repayLoan = repayLoan;
window.showBuildPopup = showBuildPopup;
window.closeBuildPopup = closeBuildPopup;
window.showNetWorth = showNetWorth;
window.closeNetworth = closeNetworth;
window.showMenu = showMenu;
window.closeMenu = closeMenu;
window.confirmNewGame = confirmNewGame;
window.useJailFreeCard = useJailFreeCard;
window.payJailFine = payJailFine;
window.showPlayerInfo = showPlayerInfo;
