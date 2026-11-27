/* Loom Connoisseurs launch announcement (2026-11-27; replaces the 4.5 popup).
   Split card: left = the launch film (plays with sound when the visitor presses play), right = the announcement.
   Shows once per visitor; the "New · Loom Connoisseurs" tag by the hero buttons brings it back.
   Esc, the close button, Later or a click outside closes it. Every claim matches the Hugging Face cards. */
(function () {
  var KEY = 'tl-launch-connoisseurs-seen';
  var FILM = 'https://huggingface.co/textilelabs/Loom-Connoisseur-Maker/resolve/main/loom-connoisseurs-film.mp4';
  var MAKER = 'https://huggingface.co/textilelabs/Loom-Connoisseur-Maker';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    '.lc-back{position:fixed;inset:0;background:rgba(20,27,47,.55);opacity:0;pointer-events:none;transition:opacity .35s;z-index:50}',
    '.lc-back.on{opacity:1;pointer-events:auto}',
    '.lc{position:fixed;z-index:51;left:50%;top:50%;width:min(1040px,94vw);max-height:94vh;overflow:auto;display:grid;grid-template-columns:1.25fr 1fr;',
    'background:var(--card);border-radius:4px;box-shadow:0 40px 80px -30px rgba(0,0,0,.55);transform:translate(-50%,-48%) scale(.97);opacity:0;visibility:hidden;',
    'transition:opacity .3s,transform .45s cubic-bezier(.2,.7,.2,1),visibility 0s .45s}',
    '.lc.on{opacity:1;transform:translate(-50%,-50%);visibility:visible;transition:opacity .3s,transform .45s cubic-bezier(.2,.7,.2,1)}',
    '.lc-art{background:#F2DDC9;display:flex;align-items:center;justify-content:center;overflow:hidden}',
    '.lc-art video{width:100%;height:auto;display:block;aspect-ratio:16/9;background:#F2DDC9}',
    '.lc-text{padding:32px 34px 28px;display:flex;flex-direction:column;justify-content:center}',
    '.lc-kicker{font:600 14px var(--sans);color:var(--thread);margin:0 0 8px}',
    '.lc-text h2{font:400 clamp(30px,3.2vw,40px)/1.08 var(--serif);margin:0 0 14px}',
    '.lc-text p{margin:0 0 12px;max-width:44ch;line-height:1.55}',
    '.lc-text ul{margin:0 0 14px;padding-left:18px;line-height:1.5}',
    '.lc-text p.lc-small{font-size:14px;opacity:.75;margin-bottom:20px}',
    '.lc-actions{display:flex;gap:22px;flex-wrap:wrap;font-weight:600;align-items:baseline}',
    '.lc-actions a{padding-bottom:3px;border-bottom:2px solid var(--thread)}',
    '.lc-actions a.quiet{border-color:rgba(29,40,71,.35)}',
    '.lc-later{background:none;border:0;font:500 15px var(--sans);color:var(--ink);opacity:.6;cursor:pointer;padding:0;margin-left:auto}',
    '.lc-later:hover{opacity:1}',
    '.lc-close{position:absolute;top:8px;right:12px;background:none;border:0;font:400 28px/1 var(--sans);cursor:pointer;opacity:.65;color:var(--ink)}',
    '.lc-close:hover{opacity:1}',
    '.lc-tag{display:inline-flex;align-items:center;gap:8px;font:600 13px var(--sans);color:var(--ink);background:var(--card);border:1.5px solid rgba(29,40,71,.25);',
    'border-radius:3px;padding:6px 11px 6px 8px;cursor:pointer;box-shadow:0 6px 14px -10px rgba(0,0,0,.5);transition:transform .25s,border-color .25s}',
    '.lc-tag:hover,.lc-tag:focus-visible{transform:translateY(-2px) rotate(-1deg);border-color:var(--thread)}',
    '.lc-tag i{width:14px;height:14px;display:inline-block;border-radius:2px;background:',
    'repeating-linear-gradient(135deg,#1D2847 0 2px,#B4683D 2px 4px,#B5372C 4px 5px)}',
    '.lc-tag b{color:var(--thread);font-weight:600}',
    'html.lc-lock,html.lc-lock body{overflow:hidden!important;overscroll-behavior:none}',
    '@media (max-width:820px){.lc{grid-template-columns:1fr}.lc-text{padding:22px 22px 20px}}',
    '@media (prefers-reduced-motion: reduce){.lc,.lc-back,.lc-tag{transition:none}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var back = document.createElement('div'); back.className = 'lc-back';
  var box = document.createElement('div'); box.className = 'lc'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'lc-title');
  box.innerHTML =
    '<div class="lc-art"><video controls playsinline preload="none" poster="connoisseurs-poster.jpg" aria-label="The Loom Connoisseurs launch film, 52 seconds, with music">' +
      '<source src="' + FILM + '" type="video/mp4"></video></div>' +
    '<div class="lc-text">' +
      '<p class="lc-kicker">New</p>' +
      '<h2 id="lc-title">Meet the Loom Connoisseurs</h2>' +
      '<p>Small experts made from notes, not training. Each one is Loom Crucible 4.5 plus a single notes file: it answers from its notes, shows where the answer came from, and says when something isn\'t there.</p>' +
      '<ul><li>Six ready to download: astronomy, biology, chemistry, physics, computing and WWII history.</li>' +
      '<li>The Connoisseur Maker, to make your own from your documents or Wikipedia topics in minutes.</li></ul>' +
      '<p class="lc-small">Free. Runs on your laptop\'s CPU, offline, with nothing sent anywhere.</p>' +
      '<div class="lc-actions"><a href="models.html#connoisseurs">See the Connoisseurs</a><a class="quiet" href="' + MAKER + '" target="_blank" rel="noopener">Get the Maker</a>' +
      '<button class="lc-later" type="button">Later</button></div>' +
    '</div>' +
    '<button class="lc-close" type="button" aria-label="Close">&times;</button>';
  document.body.appendChild(back); document.body.appendChild(box);
  var video = box.querySelector('video');

  function lock(on) {
    document.documentElement.classList.toggle('lc-lock', on);
    if (on) { lock.y = scrollY; } else if (typeof lock.y === 'number') { scrollTo(0, lock.y); }
  }
  function stopScroll(e) { if (!box.contains(e.target) || e.target === box) e.preventDefault(); }
  addEventListener('wheel', function (e) { if (box.classList.contains('on')) stopScroll(e); }, { passive: false });
  addEventListener('touchmove', function (e) { if (box.classList.contains('on')) stopScroll(e); }, { passive: false });

  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement; lock(true); back.classList.add('on'); box.classList.add('on');
    setTimeout(function () { box.querySelector('.lc-close').focus(); }, 50);
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function close() {
    try { video.pause(); } catch (e) {}
    back.classList.remove('on'); box.classList.remove('on'); lock(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  back.addEventListener('click', close);
  box.querySelector('.lc-close').addEventListener('click', close);
  box.querySelector('.lc-later').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('on')) close(); });

  // the reopen tag takes the place of "Try one in your browser" beside the hero buttons (home page only)
  var cta = document.querySelector('.hero .cta');
  if (cta) {
    var tag = document.createElement('button'); tag.type = 'button'; tag.className = 'lc-tag primary';
    tag.innerHTML = '<i aria-hidden="true"></i><span><b>New</b> &middot; Loom Connoisseurs</span>';
    tag.setAttribute('aria-label', 'New: Loom Connoisseurs. Open the announcement');
    tag.addEventListener('click', open);
    var old = cta.querySelector('a.primary');
    if (old) cta.replaceChild(tag, old); else cta.appendChild(tag);
  }

  // once per visitor: wait for the hero painting to settle, then a short pause
  var seen = false; try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
  if (!seen) {
    var hero = document.getElementById('hero'), tries = 0;
    (function wait() {
      if ((hero && hero.classList.contains('ready')) || tries > 40) { setTimeout(open, 900); return; }
      tries++; setTimeout(wait, 250);
    })();
  }
  window.TL_LAUNCH = { open: open, close: close, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
})();
