/* Loom 4.5 launch announcement (built 2026-11-21 on the local branch launch-4.5; goes live only when the 4.5 family is released).
   Split card: left = the launch animation, right = the announcement. Shows once per visitor; the "New · Loom 4.5" tag by
   "Try one in your browser" brings it back. Esc, the close button or a click outside closes it. Reduced motion = the still frame.
   COPY BELOW IS A DRAFT: the numbers and claims get checked against the final scores before release. */
(function () {
  var KEY = 'tl-launch-4.5-seen';
  var HF = 'https://huggingface.co/textilelabs/Loom-Crucible-4.5';
  var SHOW_VIDEO = false;   // 2026-11-21: the showcase GIF still has placeholder answers the real model does not give - off until it is remade from real replies
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    '.l45-back{position:fixed;inset:0;background:rgba(20,27,47,.55);opacity:0;pointer-events:none;transition:opacity .35s;z-index:50}',
    '.l45-back.on{opacity:1;pointer-events:auto}',
    '.l45{position:fixed;z-index:51;left:50%;top:50%;width:min(900px,92vw);max-height:92vh;overflow:auto;display:grid;grid-template-columns:1.05fr 1fr;',
    'background:var(--card);border-radius:4px;box-shadow:0 40px 80px -30px rgba(0,0,0,.55);transform:translate(-50%,-48%) scale(.97);opacity:0;visibility:hidden;',
    'transition:opacity .3s,transform .45s cubic-bezier(.2,.7,.2,1),visibility 0s .45s}',
    '.l45.on{opacity:1;transform:translate(-50%,-50%);visibility:visible;transition:opacity .3s,transform .45s cubic-bezier(.2,.7,.2,1)}',
    '.l45-art{background:#F0C6A0;display:flex;align-items:center;justify-content:center;min-height:300px;overflow:hidden}',
    '.l45-art img{width:100%;height:auto;display:block}',
    '.l45-text{padding:34px 36px 30px;display:flex;flex-direction:column;justify-content:center}',
    '.l45-kicker{font:600 13px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--thread);margin:0 0 10px}',
    '.l45-text h2{font:400 clamp(30px,3.2vw,40px)/1.08 var(--serif);margin:0 0 14px}',
    '.l45-text p{margin:0 0 12px;max-width:42ch;line-height:1.55}',
    '.l45-text p.l45-soon{font:600 14px var(--sans);color:var(--copper);margin:-6px 0 14px}',
    '.l45-text p.l45-small{font-size:14px;opacity:.7;margin-bottom:22px}',
    '.l45-actions{display:flex;gap:24px;flex-wrap:wrap;font-weight:600;align-items:baseline}',
    '.l45-actions a{padding-bottom:3px;border-bottom:2px solid var(--thread)}',
    '.l45-actions a.quiet{border-color:rgba(29,40,71,.35)}',
    '.l45-later{background:none;border:0;font:500 15px var(--sans);color:var(--ink);opacity:.6;cursor:pointer;padding:0;margin-left:auto}',
    '.l45-later:hover{opacity:1}',
    '.l45-close{position:absolute;top:10px;right:14px;background:none;border:0;font:400 28px/1 var(--sans);cursor:pointer;opacity:.65;color:var(--ink)}',
    '.l45-close:hover{opacity:1}',
    /* the reopen tag: a small woven label by the hero buttons */
    '.l45-tag{display:inline-flex;align-items:center;gap:8px;font:600 13px var(--sans);color:var(--ink);background:var(--card);border:1.5px solid rgba(29,40,71,.25);',
    'border-radius:3px;padding:5px 10px 5px 8px;cursor:pointer;box-shadow:0 6px 14px -10px rgba(0,0,0,.5);transition:transform .25s,border-color .25s}',
    '.l45-tag:hover,.l45-tag:focus-visible{transform:translateY(-2px) rotate(-1deg);border-color:var(--thread)}',
    '.l45-tag i{width:14px;height:14px;display:inline-block;background:',
    'repeating-linear-gradient(90deg,var(--copper) 0 2px,transparent 2px 4px),repeating-linear-gradient(0deg,var(--ink) 0 2px,var(--sage) 2px 4px);border-radius:2px}',
    '.l45-tag b{color:var(--thread);font-weight:600}',
    '.l45-tag img{height:22px;width:auto;display:block;margin-left:-2px}',
    '.l45-tag span{display:inline-flex;align-items:center;gap:6px}',
    '.l45-watch{background:none;border:0;padding:0 0 3px;font:600 16px var(--sans);color:var(--ink);cursor:pointer;border-bottom:2px solid rgba(29,40,71,.35)}',
    '.l45-watch:hover{border-color:var(--thread)}',
    '.l45-watch::before{content:"\\25B6";font-size:11px;margin-right:7px;vertical-align:1px;color:var(--thread)}',
    '.l45-vid{position:fixed;inset:0;z-index:53;display:flex;align-items:center;justify-content:center;background:rgba(20,27,47,.82);opacity:0;visibility:hidden;transition:opacity .3s,visibility 0s .3s}',
    '.l45-vid.on{opacity:1;visibility:visible;transition:opacity .3s}',
    '.l45-vid figure{margin:0;position:relative;width:min(1100px,94vw);background:#F0C6A0;border-radius:4px;box-shadow:0 40px 80px -30px rgba(0,0,0,.7);overflow:hidden}',
    '.l45-vid img{width:100%;height:auto;display:block;aspect-ratio:16/9}',
    '.l45-vid .l45-close{color:#fff;opacity:.85;top:-44px;right:0;font-size:34px}',
    '.l45-vid .bar{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:flex-end;gap:10px;padding:10px 12px;background:linear-gradient(transparent,rgba(20,27,47,.35))}',
    '.l45-vid .bar button{font:600 13px var(--sans);background:var(--card);color:var(--ink);border:0;border-radius:3px;padding:6px 12px;cursor:pointer}',
    '.l45-vid-wrap{position:relative;width:min(1100px,94vw)}',
    'html.l45-lock,html.l45-lock body{overflow:hidden!important;overscroll-behavior:none}',
    '@media (max-width:760px){.l45{grid-template-columns:1fr}.l45-art{min-height:0;aspect-ratio:16/9}.l45-text{padding:24px 22px 22px}}',
    '@media (prefers-reduced-motion: reduce){.l45,.l45-back,.l45-tag{transition:none}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var back = document.createElement('div'); back.className = 'l45-back';
  var box = document.createElement('div'); box.className = 'l45'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'l45-title');
  box.innerHTML =
    '<div class="l45-art"><img alt="The Textile Labs woven logo threading itself together, then the words Loom 4.5" src="' + (reduce ? 'launch-4-5-still.png' : 'launch-4-5.gif') + '"></div>' +
    '<div class="l45-text">' +
      '<p class="l45-kicker">New</p>' +
      '<h2 id="l45-title">Meet the Loom 4.5 family</h2>' +
      '<p class="l45-soon">(Crucible 4.5 is out now. The rest of the series is coming soon.)</p>' +
      '<p>Seven small models from one training run, from 11 million to 130 million parameters. The first, Crucible 4.5, does sums with a calculator, remembers what you tell it, writes short emails, and quotes the sentence it read.</p>' +
      '<p class="l45-small">Trained from scratch on open data. Open weights, MIT licence, small enough to run in your browser.</p>' +
      '<div class="l45-actions"><a href="try.html?model=crucible-4-5">Try it in your browser</a><a class="quiet" href="' + HF + '" target="_blank" rel="noopener">Hugging Face</a>' +
      (SHOW_VIDEO ? '<button class="l45-watch" type="button">Watch the video</button>' : '') +
      '<button class="l45-later" type="button">Later</button></div>' +
    '</div>' +
    '<button class="l45-close" type="button" aria-label="Close">&times;</button>';
  document.body.appendChild(back); document.body.appendChild(box);

  // the video: the long showcase, loaded only when asked for, shown over the popup
  var vid = document.createElement('div'); vid.className = 'l45-vid'; vid.setAttribute('role', 'dialog'); vid.setAttribute('aria-modal', 'true'); vid.setAttribute('aria-label', 'Loom 4.5 video');
  vid.innerHTML = '<div class="l45-vid-wrap"><button class="l45-close" type="button" aria-label="Close the video">&times;</button>' +
    '<figure><img alt="A short animation of what the Loom 4.5 models do: read a passage and answer from it, pick a tool, follow rules, and the seven sizes" src="launch-4-5-video-poster.jpg">' +
    '<div class="bar"><button type="button" class="replay">Replay</button></div></figure></div>';
  document.body.appendChild(vid);
  var vimg = vid.querySelector('img');
  function playVideo() { vimg.src = reduce ? 'launch-4-5-video-poster.jpg' : 'launch-4-5-video.gif?' + Date.now(); }
  function openVideo() { playVideo(); vid.classList.add('on'); setTimeout(function () { vid.querySelector('.l45-close').focus(); }, 50); }
  function closeVideo() { vid.classList.remove('on'); vimg.src = 'launch-4-5-video-poster.jpg'; var w = box.querySelector('.l45-watch'); if (w) w.focus(); }
  vid.querySelector('.l45-close').addEventListener('click', closeVideo);
  vid.querySelector('.replay').addEventListener('click', playVideo);
  vid.addEventListener('click', function (e) { if (e.target === vid) closeVideo(); });
  if (SHOW_VIDEO) box.querySelector('.l45-watch').addEventListener('click', openVideo);

  // while the popup is open nothing behind it scrolls (wheel, touch, keys)
  function lock(on) {
    document.documentElement.classList.toggle('l45-lock', on);
    if (on) { lock.y = scrollY; } else if (typeof lock.y === 'number') { scrollTo(0, lock.y); }
  }
  function stopScroll(e) { if (!box.contains(e.target) || e.target === box) e.preventDefault(); }
  addEventListener('wheel', function (e) { if (box.classList.contains('on')) stopScroll(e); }, { passive: false });
  addEventListener('touchmove', function (e) { if (box.classList.contains('on')) stopScroll(e); }, { passive: false });

  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement; lock(true); back.classList.add('on'); box.classList.add('on');
    var img = box.querySelector('img'); if (!reduce) { img.src = 'launch-4-5.gif?' + Date.now(); }   // restart the animation each time
    setTimeout(function () { box.querySelector('.l45-close').focus(); }, 50);
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function close() {
    if (vid.classList.contains('on')) closeVideo();
    back.classList.remove('on'); box.classList.remove('on'); lock(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  back.addEventListener('click', close);
  box.querySelector('.l45-close').addEventListener('click', close);
  box.querySelector('.l45-later').addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (vid.classList.contains('on')) closeVideo(); else if (box.classList.contains('on')) close();
  });

  // the reopen tag, placed with the hero buttons (home page only)
  var cta = document.querySelector('.hero .cta');
  if (cta) {
    var tag = document.createElement('button'); tag.type = 'button'; tag.className = 'l45-tag primary';   // .primary: the hero's red thread runs to it
    tag.innerHTML = '<i aria-hidden="true"></i><span><b>New</b> · Loom <img src="mark-45.png" alt="4.5"></span>';
    tag.setAttribute('aria-label', 'New: Loom 4.5. Open the announcement');
    tag.addEventListener('click', open);
    var old = cta.querySelector('a.primary');                                 // takes the place of "Try one in your browser"
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
  window.TL_LAUNCH45 = { open: open, close: close, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
})();
