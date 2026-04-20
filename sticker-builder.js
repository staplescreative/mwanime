(function() {

var canvas = document.getElementById('sticker-canvas');
var ctx    = canvas.getContext('2d');

/* ── STATE ──────────────────────────────────────── */
var S = {
  handle:   '@YOURHANDLE',
  sub:      '',
  platform: 'instagram',
  template: 'racing',
  bgCol:    '#102f4c',
  txtCol:   '#E4007A',
  accCol:   '#FFBC00',
  fontSize: 110,
  showTag:  true,
  font:     'Russo One',
};

var FONTS = [
  { id:'Russo One',      label:'Russo One'      },
  { id:'Racing Sans One',label:'Racing Sans One' },
  { id:'Bebas Neue',     label:'Bebas Neue'      },
  { id:'Black Ops One',  label:'Black Ops One'   },
  { id:'Orbitron',       label:'Orbitron'        },
  { id:'Chakra Petch',   label:'Chakra Petch'    },
];

/* ── TEMPLATES ──────────────────────────────────── */
var TEMPLATES = [
  { id:'racing',   label:'Racing Livery' },
  { id:'plate',    label:'JDM Plate'     },
  { id:'callsign', label:'Callsign'      },
  { id:'itasha',   label:'Itasha Strip'  },
];

/* ── COLOUR PALETTES ────────────────────────────── */
var PALETTES = {
  bg:  ['#102f4c','#0c1826','#1a0040','#1a1a2e','#fff','#e8eaea','#ff3366','#0a2a1a'],
  txt: ['#E4007A','#FFBC00','#fff','#0c1826','#00d4ff','#ff6b35','#a8ff3e','#ff3366'],
  acc: ['#FFBC00','#E4007A','#00d4ff','#fff','#a8ff3e','#ff6b35','#0c1826','#8aaa8a'],
};

/* ── PLATFORM ICONS (SVG paths drawn on canvas) ── */
var PLAT_LABELS = {
  instagram: 'IG',
  tiktok:    'TT',
  youtube:   'YT',
  custom:    '',
};

/* ── DRAW ────────────────────────────────────────── */
function draw() {
  var W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  switch(S.template) {
    case 'racing':   drawRacing(W, H);   break;
    case 'plate':    drawPlate(W, H);    break;
    case 'callsign': drawCallsign(W, H); break;
    case 'itasha':   drawItasha(W, H);   break;
  }
}

/* ── TEMPLATE: RACING LIVERY ─────────────────────── */
function drawRacing(W, H) {
  var bg  = S.bgCol;
  var txt = S.txtCol;
  var acc = S.accCol;

  // Background
  roundRect(ctx, 0, 0, W, H, 20, bg);

  // Diagonal speed stripe
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(W * .38, 0);
  ctx.lineTo(W * .58, 0);
  ctx.lineTo(W * .45, H);
  ctx.lineTo(W * .25, H);
  ctx.closePath();
  ctx.fillStyle = hexAlpha(acc, .18);
  ctx.fill();
  ctx.restore();

  // Second diagonal
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(W * .32, 0);
  ctx.lineTo(W * .37, 0);
  ctx.lineTo(W * .24, H);
  ctx.lineTo(W * .19, H);
  ctx.closePath();
  ctx.fillStyle = hexAlpha(acc, .25);
  ctx.fill();
  ctx.restore();

  // Accent top bar
  ctx.fillStyle = acc;
  ctx.fillRect(0, 0, W, 8);

  // Accent bottom bar
  ctx.fillStyle = acc;
  ctx.fillRect(0, H-8, W, 8);

  // Left panel
  ctx.fillStyle = hexAlpha('#000', .25);
  roundRect(ctx, 0, 0, W*.22, H, [20,0,0,20], null, true);

  // Platform icon area
  drawPlatformBadge(ctx, W*.035, H*.18, H*.64, S.platform, acc, bg);

  // Handle text — main
  ctx.save();
  var fs = Math.min(S.fontSize, H * .52);
  ctx.font = 'italic 700 ' + fs + 'px "' + S.font + '", sans-serif';
  ctx.fillStyle = txt;
  ctx.textBaseline = 'middle';
  // Outline / shadow
  ctx.shadowColor = hexAlpha('#000', .4);
  ctx.shadowBlur  = 12;
  ctx.shadowOffsetY = 4;
  ctx.fillText(formatHandle(S.handle, S.platform), W*.25, H*.44);
  ctx.shadowColor = 'transparent';
  // Stroke outline
  ctx.strokeStyle = hexAlpha('#000', .3);
  ctx.lineWidth = 3;
  ctx.strokeText(formatHandle(S.handle, S.platform), W*.25, H*.44);
  ctx.restore();

  // Sub text
  if (S.sub) {
    ctx.save();
    ctx.font = '600 ' + Math.round(fs*.28) + 'px "Source Code Pro", monospace';
    ctx.fillStyle = hexAlpha(acc, .9);
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '3px';
    ctx.fillText(S.sub.toUpperCase(), W*.25, H*.76);
    ctx.restore();
  }

  // Japanese text accent — 猛暑ワークス
  ctx.save();
  ctx.font = 'italic 700 ' + Math.round(H*.28) + 'px "Chakra Petch", sans-serif';
  ctx.fillStyle = hexAlpha(txt, .12);
  ctx.textBaseline = 'middle';
  ctx.fillText('猛暑', W*.25, H*.5);
  ctx.restore();

  // Mōsho tag
  if (S.showTag) drawMoshoTag(ctx, W, H, acc);
}

/* ── TEMPLATE: JDM PLATE ─────────────────────────── */
function drawPlate(W, H) {
  var bg  = S.bgCol;
  var txt = S.txtCol;
  var acc = S.accCol;

  // Background — slightly inset look
  roundRect(ctx, 0, 0, W, H, 12, '#e8eaea');
  roundRect(ctx, 8, 8, W-16, H-16, 8, bg);

  // Corner accents
  var cs = 28;
  ctx.fillStyle = acc;
  ctx.fillRect(8, 8, cs, 4);
  ctx.fillRect(8, 8, 4, cs);
  ctx.fillRect(W-8-cs, 8, cs, 4);
  ctx.fillRect(W-12, 8, 4, cs);
  ctx.fillRect(8, H-12, cs, 4);
  ctx.fillRect(8, H-8-cs, 4, cs);
  ctx.fillRect(W-8-cs, H-12, cs, 4);
  ctx.fillRect(W-12, H-8-cs, 4, cs);

  // Platform badge small
  ctx.save();
  ctx.font = '700 ' + Math.round(H*.22) + 'px "Source Code Pro", monospace';
  ctx.fillStyle = hexAlpha(acc, .5);
  ctx.textBaseline = 'top';
  ctx.fillText(PLAT_LABELS[S.platform], 28, H*.12);
  ctx.restore();

  // Horizontal rule
  ctx.fillStyle = hexAlpha(acc, .4);
  ctx.fillRect(28, H*.38, W-56, 1);
  ctx.fillRect(28, H*.62, W-56, 1);

  // Handle
  ctx.save();
  var fs = Math.min(S.fontSize * .9, H*.48);
  ctx.font = '700 ' + fs + 'px "' + S.font + '", sans-serif';
  ctx.fillStyle = txt;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.shadowColor = hexAlpha(txt, .25);
  ctx.shadowBlur = 20;
  ctx.fillText(formatHandle(S.handle, S.platform), W/2, H*.5);
  ctx.restore();

  // Sub
  if (S.sub) {
    ctx.save();
    ctx.font = '600 ' + Math.round(H*.14) + 'px "Source Code Pro", monospace';
    ctx.fillStyle = hexAlpha(acc, .85);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(S.sub.toUpperCase(), W/2, H*.79);
    ctx.restore();
  }

  // Mōsho tag
  if (S.showTag) drawMoshoTag(ctx, W, H, acc);
}

/* ── TEMPLATE: CALLSIGN ──────────────────────────── */
function drawCallsign(W, H) {
  var bg  = S.bgCol;
  var txt = S.txtCol;
  var acc = S.accCol;

  // Base
  roundRect(ctx, 0, 0, W, H, 6, bg);

  // Stencil-style border grid
  for (var i = 0; i < W; i += 12) {
    ctx.fillStyle = hexAlpha(acc, .07);
    ctx.fillRect(i, 0, 6, 4);
    ctx.fillRect(i, H-4, 6, 4);
  }
  for (var j = 0; j < H; j += 10) {
    ctx.fillStyle = hexAlpha(acc, .07);
    ctx.fillRect(0, j, 4, 5);
    ctx.fillRect(W-4, j, 4, 5);
  }

  // Classification bar
  ctx.fillStyle = acc;
  ctx.fillRect(0, 0, W, 18);
  ctx.save();
  ctx.font = '700 11px "Source Code Pro", monospace';
  ctx.fillStyle = bg;
  ctx.textBaseline = 'middle';
  ctx.fillText('MOSHO WORKS // CALLSIGN UNIT', 12, 9);
  ctx.restore();

  // Platform stencil
  ctx.save();
  ctx.font = '700 ' + Math.round(H*.55) + 'px "Source Code Pro", monospace';
  ctx.fillStyle = hexAlpha(acc, .06);
  ctx.textBaseline = 'middle';
  ctx.fillText(PLAT_LABELS[S.platform], W*.62, H*.58);
  ctx.restore();

  // Handle
  ctx.save();
  var fs = Math.min(S.fontSize * .85, H*.46);
  ctx.font = '700 ' + fs + 'px "' + S.font + '", sans-serif';
  ctx.fillStyle = txt;
  ctx.textBaseline = 'middle';
  ctx.fillText(formatHandle(S.handle, S.platform), W*.04, H*.57);
  ctx.restore();

  // Sub
  if (S.sub) {
    ctx.save();
    ctx.font = '600 ' + Math.round(H*.13) + 'px "Source Code Pro", monospace';
    ctx.fillStyle = hexAlpha(acc, .9);
    ctx.textBaseline = 'middle';
    ctx.fillText(S.sub.toUpperCase(), W*.04, H*.82);
    ctx.restore();
  }

  // Bottom classification
  ctx.fillStyle = acc;
  ctx.fillRect(0, H-18, W, 18);
  ctx.save();
  ctx.font = '700 11px "Source Code Pro", monospace';
  ctx.fillStyle = bg;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';
  ctx.fillText('CUSTOM VINYL // WEATHERPROOF', W-12, H-9);
  ctx.restore();

  if (S.showTag) drawMoshoTag(ctx, W, H, bg);
}

/* ── TEMPLATE: ITASHA STRIP ──────────────────────── */
function drawItasha(W, H) {
  var bg  = S.bgCol;
  var txt = S.txtCol;
  var acc = S.accCol;

  // Pastel-tinted background
  roundRect(ctx, 0, 0, W, H, 16, bg);

  // Soft radial glow
  var grd = ctx.createRadialGradient(W*.7, H*.5, 0, W*.7, H*.5, H*1.2);
  grd.addColorStop(0, hexAlpha(txt, .15));
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // Speed lines
  ctx.save();
  for (var k = 0; k < 16; k++) {
    var y0 = H * (k / 16);
    ctx.beginPath();
    ctx.moveTo(W*.15, y0);
    ctx.lineTo(W*.65, y0 + H/32);
    ctx.strokeStyle = hexAlpha(acc, .08 + (k%3)*.03);
    ctx.lineWidth = 1 + (k%2);
    ctx.stroke();
  }
  ctx.restore();

  // Character placeholder zone (right side)
  ctx.save();
  ctx.beginPath();
  roundRectPath(ctx, W*.58, 0, W*.42, H, [0,16,16,0]);
  ctx.fillStyle = hexAlpha(txt, .08);
  ctx.fill();
  ctx.restore();

  // Placeholder character silhouette
  drawCharPlaceholder(ctx, W*.72, H*.5, H*.7, acc);

  // Heart pixels
  drawPixelHearts(ctx, W*.25, H*.14, acc);

  // Platform badge
  ctx.save();
  ctx.font = '700 ' + Math.round(H*.18) + 'px "Source Code Pro", monospace';
  ctx.fillStyle = hexAlpha(acc, .6);
  ctx.textBaseline = 'top';
  ctx.fillText(PLAT_LABELS[S.platform], W*.04, H*.1);
  ctx.restore();

  // Handle — italic, large
  ctx.save();
  var fs = Math.min(S.fontSize * .88, H*.5);
  ctx.font = 'italic 700 ' + fs + 'px "' + S.font + '", sans-serif';
  ctx.fillStyle = txt;
  ctx.textBaseline = 'middle';
  ctx.shadowColor = hexAlpha('#000', .3);
  ctx.shadowBlur = 8;
  ctx.fillText(formatHandle(S.handle, S.platform), W*.04, H*.54);
  ctx.restore();

  // Sub
  if (S.sub) {
    ctx.save();
    ctx.font = '600 ' + Math.round(H*.15) + 'px "Source Code Pro",monospace';
    ctx.fillStyle = hexAlpha(acc, .9);
    ctx.textBaseline = 'middle';
    ctx.fillText(S.sub.toUpperCase(), W*.04, H*.78);
    ctx.restore();
  }

  if (S.showTag) drawMoshoTag(ctx, W, H, acc);
}

/* ── HELPERS ─────────────────────────────────────── */
function roundRect(ctx, x, y, w, h, r, fill, clip) {
  if (typeof r === 'number') r = [r,r,r,r];
  ctx.beginPath();
  roundRectPath(ctx, x, y, w, h, r);
  if (clip) { ctx.clip(); return; }
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}
function roundRectPath(ctx, x, y, w, h, r) {
  if (typeof r === 'number') r = [r,r,r,r];
  ctx.moveTo(x + r[0], y);
  ctx.lineTo(x + w - r[1], y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r[1]);
  ctx.lineTo(x+w, y+h-r[2]);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r[2], y+h);
  ctx.lineTo(x+r[3], y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r[3]);
  ctx.lineTo(x, y+r[0]);
  ctx.quadraticCurveTo(x, y, x+r[0], y);
  ctx.closePath();
}
function hexAlpha(hex, a) {
  var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return 'rgba('+r+','+g+','+b+','+a+')';
}
function formatHandle(h, plat) {
  h = h.trim();
  if (!h) return '@YOURHANDLE';
  if (!h.startsWith('@') && plat !== 'custom') h = '@' + h;
  return h.toUpperCase();
}
function drawMoshoTag(ctx, W, H, col) {
  ctx.save();
  ctx.font = 'italic 700 ' + Math.round(H*.18) + 'px "Chakra Petch",sans-serif';
  ctx.fillStyle = hexAlpha(col, .55);
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'right';
  ctx.fillText('Mōsho', W-18, H-12);
  ctx.textAlign = 'left';
  ctx.restore();
}
function drawPlatformBadge(ctx, x, y, size, plat, col, bg) {
  var s = size * .42;
  roundRect(ctx, x + (size-s)/2, y + (size-s)/2, s, s, 8, col);
  ctx.save();
  ctx.font = '700 ' + Math.round(s*.45) + 'px "Source Code Pro",monospace';
  ctx.fillStyle = bg;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(PLAT_LABELS[plat]||'@', x + size/2, y + size/2);
  ctx.textAlign = 'left';
  ctx.restore();
}
function drawCharPlaceholder(ctx, cx, cy, h, col) {
  // Simple anime silhouette suggestion
  ctx.save();
  ctx.fillStyle = hexAlpha(col, .12);
  // Head
  ctx.beginPath();
  ctx.arc(cx, cy - h*.28, h*.14, 0, Math.PI*2);
  ctx.fill();
  // Hair
  ctx.beginPath();
  ctx.ellipse(cx, cy - h*.34, h*.18, h*.08, -0.3, 0, Math.PI*2);
  ctx.fill();
  // Body
  ctx.beginPath();
  ctx.moveTo(cx - h*.1, cy - h*.12);
  ctx.lineTo(cx + h*.1, cy - h*.12);
  ctx.lineTo(cx + h*.14, cy + h*.18);
  ctx.lineTo(cx - h*.14, cy + h*.18);
  ctx.closePath();
  ctx.fill();
  // Arm raised
  ctx.beginPath();
  ctx.moveTo(cx + h*.1, cy - h*.08);
  ctx.lineTo(cx + h*.24, cy - h*.28);
  ctx.lineWidth = h*.06;
  ctx.strokeStyle = hexAlpha(col, .12);
  ctx.stroke();
  ctx.restore();
  // Placeholder label
  ctx.save();
  ctx.font = '600 11px "Source Code Pro",monospace';
  ctx.fillStyle = hexAlpha(col, .3);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('YOUR ART HERE', cx, cy + h*.28);
  ctx.textAlign = 'left';
  ctx.restore();
}
function drawPixelHearts(ctx, x, y, col) {
  var sz = 10;
  var pattern = [
    [0,1,0,1,0], [1,1,1,1,1], [1,1,1,1,1],
    [0,1,1,1,0], [0,0,1,0,0]
  ];
  [0,1,2].forEach(function(i) {
    var ox = x + i * (sz*5 + 6);
    pattern.forEach(function(row, ry) {
      row.forEach(function(cell, rx) {
        if (!cell) return;
        ctx.fillStyle = col;
        ctx.fillRect(ox + rx*sz, y + ry*sz, sz-1, sz-1);
      });
    });
  });
}

/* ── BUILD SWATCHES ──────────────────────────────── */
function buildSwatches(containerId, palette, stateKey, pickerId, hexId) {
  var el = document.getElementById(containerId);
  palette.forEach(function(col) {
    var s = document.createElement('div');
    s.className = 'swatch' + (S[stateKey]===col?' active':'');
    s.style.background = col;
    s.style.border = col==='#fff'||col==='#e8eaea' ? '2px solid rgba(12,24,38,.15)' : '2px solid transparent';
    s.addEventListener('click', function() {
      S[stateKey] = col;
      document.getElementById(pickerId).value = col;
      document.getElementById(hexId).value = col;
      el.querySelectorAll('.swatch').forEach(function(x){x.classList.remove('active');});
      s.classList.add('active');
      draw();
    });
    el.appendChild(s);
  });
}

/* ── BUILD TEMPLATE BUTTONS ──────────────────────── */
function buildTemplates() {
  var grid = document.getElementById('tpl-select');
  var strip = document.getElementById('tpl-strip');
  TEMPLATES.forEach(function(t) {
    // Grid button
    var b = document.createElement('button');
    b.className = 'style-opt' + (S.template===t.id?' active':'');
    b.textContent = t.label;
    b.addEventListener('click', function() {
      S.template = t.id;
      grid.querySelectorAll('.style-opt').forEach(function(x){x.classList.remove('active');});
      b.classList.add('active');
      strip.querySelectorAll('.tpl-thumb').forEach(function(x){x.classList.remove('active');});
      document.querySelector('.tpl-thumb[data-tpl="'+t.id+'"]').classList.add('active');
      draw();
    });
    grid.appendChild(b);

    // Thumbnail
    var thumb = document.createElement('div');
    thumb.className = 'tpl-thumb' + (S.template===t.id?' active':'');
    thumb.setAttribute('data-tpl', t.id);
    var tc = document.createElement('canvas');
    tc.width = 160; tc.height = 53;
    thumb.appendChild(tc);
    thumb.addEventListener('click', function() {
      S.template = t.id;
      strip.querySelectorAll('.tpl-thumb').forEach(function(x){x.classList.remove('active');});
      thumb.classList.add('active');
      grid.querySelectorAll('.style-opt').forEach(function(x){x.classList.remove('active');});
      b.classList.add('active');
      draw();
    });
    strip.appendChild(thumb);
  });
  drawThumbs();
}

function drawThumbs() {
  var savedW = canvas.width, savedH = canvas.height;
  var savedTemplate = S.template;
  TEMPLATES.forEach(function(t) {
    var thumb = document.querySelector('.tpl-thumb[data-tpl="'+t.id+'"]');
    var tc = thumb.querySelector('canvas');
    canvas = tc;
    ctx = tc.getContext('2d');
    canvas.width = 160; canvas.height = 53;
    S.template = t.id;
    draw();
  });
  canvas = document.getElementById('sticker-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = savedW; canvas.height = savedH;
  S.template = savedTemplate;
  draw();
}

/* ── WIRE INPUTS ─────────────────────────────────── */
function wireColour(pickerId, hexId, stateKey, swatchId) {
  var picker = document.getElementById(pickerId);
  var hex    = document.getElementById(hexId);
  function update(val) {
    S[stateKey] = val;
    picker.value = val;
    hex.value = val;
    // Update active swatch
    var swatches = document.querySelectorAll('#'+swatchId+' .swatch');
    swatches.forEach(function(s){
      s.classList.toggle('active', s.style.background === val || rgbToHex(s.style.background)===val.toLowerCase());
    });
    draw();
  }
  picker.addEventListener('input', function() { update(this.value); });
  hex.addEventListener('change', function() {
    var v = this.value;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) update(v);
  });
}
function rgbToHex(rgb) {
  var m = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgb;
  return '#' + [1,2,3].map(function(i){return parseInt(m[i]).toString(16).padStart(2,'0');}).join('');
}

/* ── BUILD FONT SELECTOR ─────────────────────────── */
function buildFonts() {
  var el = document.getElementById('font-select');
  if (!el) return;
  FONTS.forEach(function(f) {
    var b = document.createElement('button');
    b.className = 'style-opt' + (S.font === f.id ? ' active' : '');
    b.style.fontFamily = '"' + f.id + '", sans-serif';
    b.textContent = f.label;
    b.addEventListener('click', function() {
      S.font = f.id;
      el.querySelectorAll('.style-opt').forEach(function(x){x.classList.remove('active');});
      b.classList.add('active');
      draw(); drawThumbs();
    });
    el.appendChild(b);
  });
}

/* ── INIT ────────────────────────────────────────── */
buildSwatches('sw-bg',  PALETTES.bg,  'bgCol',  'cp-bg',  'ch-bg');
buildSwatches('sw-txt', PALETTES.txt, 'txtCol', 'cp-txt', 'ch-txt');
buildSwatches('sw-acc', PALETTES.acc, 'accCol', 'cp-acc', 'ch-acc');
buildTemplates();
buildFonts();

wireColour('cp-bg',  'ch-bg',  'bgCol',  'sw-bg');
wireColour('cp-txt', 'ch-txt', 'txtCol', 'sw-txt');
wireColour('cp-acc', 'ch-acc', 'accCol', 'sw-acc');

// Handle input
document.getElementById('inp-handle').addEventListener('input', function() {
  S.handle = this.value || '@YOURHANDLE';
  draw(); drawThumbs();
});
document.getElementById('inp-sub').addEventListener('input', function() {
  S.sub = this.value;
  draw();
});

// Platform
document.querySelectorAll('.plat-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    S.platform = this.getAttribute('data-plat');
    document.querySelectorAll('.plat-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    draw();
  });
});

// Size slider
document.getElementById('sl-size').addEventListener('input', function() {
  S.fontSize = parseInt(this.value);
  document.getElementById('sl-size-val').textContent = this.value + 'px';
  draw();
});

// Tag toggle
document.getElementById('tag-on').addEventListener('click', function() {
  S.showTag = true;
  this.classList.add('active');
  document.getElementById('tag-off').classList.remove('active');
  draw();
});
document.getElementById('tag-off').addEventListener('click', function() {
  S.showTag = false;
  this.classList.add('active');
  document.getElementById('tag-on').classList.remove('active');
  draw();
});

// Download
function doDownload() {
  var link = document.createElement('a');
  link.download = 'mosho-sticker-' + (S.handle||'custom').replace('@','') + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
document.getElementById('btn-download').addEventListener('click', doDownload);

// Order — submits to BC cart with design note
function doOrder() {
  var note = 'Instagram sticker order'
    + ' | Handle: ' + S.handle
    + ' | Template: ' + S.template
    + ' | Font: ' + S.font
    + ' | BG: ' + S.bgCol
    + ' | Text: ' + S.txtCol
    + ' | Accent: ' + S.accCol
    + ' | Size: ' + S.fontSize + 'px'
    + ' | Tag: ' + (S.showTag ? 'yes' : 'no');
  var form = document.createElement('form');
  form.method = 'post';
  form.action = 'https://mosho.works/cart/add';
  var fields = {
    'cart[add][id]': '480573867',
    'cart[add][quantity]': '1',
    'cart[add][note]': note
  };
  Object.keys(fields).forEach(function(k) {
    var i = document.createElement('input');
    i.type = 'hidden'; i.name = k; i.value = fields[k];
    form.appendChild(i);
  });
  document.body.appendChild(form);
  form.submit();
}
document.getElementById('btn-order').addEventListener('click', doOrder);
document.getElementById('btn-order-2').addEventListener('click', doOrder);

// Initial draw
draw();

})();
