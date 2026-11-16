/* Textile Labs: the same nav, footer, painted page title and label sheet on every page. Page file names live in one place. */
(function(){
const PAGES={home:'index.html',models:'models.html',try:'try.html',timeline:'timeline.html',research:'research.html',about:'about.html',usecases:'use-cases.html'};
window.TLPAGES=PAGES;
const here=document.body.dataset.page;
const chev='<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 5l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
// the mark: a small woven square, one red thread through it
const MARK='<img class="mark" src="mark.png" alt="" width="34" height="34">';
const nav=document.querySelector('[data-nav]');
const link=(k,t)=>'<li><a href="'+(k==='news'?PAGES.home+'#news':PAGES[k])+'"'+(here===k?' aria-current="page"':'')+'>'+t+'</a></li>';
if(nav) nav.outerHTML='<a class="skip" href="#main">Skip to content</a><nav class="nav'+(nav.dataset.extra?' '+nav.dataset.extra:'')+'" aria-label="Main"><div class="navL"><a class="brand" href="'+PAGES.home+'" aria-label="Textile Labs, home">'+MARK+'<span>Textile Labs</span></a><ul class="navSub">'+link('research','Research')+link('about','About')+'</ul></div><ul>'+
  [['models','Models'],['usecases','Use cases'],['try','Try a model'],['timeline','Timeline'],['news','News']].map(([k,t])=>link(k,t)).join('')+'</ul></nav>';
const ft=document.querySelector('[data-footer]');
if(ft){ const L=window.TLDATA?TLDATA.LINES:[];
  ft.outerHTML='<footer class="site"><div class="f-brand">'+MARK+'Textile Labs</div><div class="f-rows">'+
  '<details><summary>Models '+chev+'</summary><div class="inner"><a href="'+PAGES.usecases+'">Use cases</a>'+L.map(l=>'<a href="'+PAGES.models+'#'+l.id+'">'+l.name+'</a>').join('')+'</div></details>'+
  '<details><summary>Try a model '+chev+'</summary><div class="inner">'+(window.TLDATA?TLDATA.all().filter(m=>m.demo).map(m=>'<a href="'+PAGES.try+'?model='+m.slug+'">'+m.name+'</a>').join(''):'')+'</div></details>'+
  '<details><summary>Timeline '+chev+'</summary><div class="inner"><a href="'+PAGES.timeline+'">Every model in order</a><a href="'+PAGES.home+'#news">News</a></div></details>'+
  '<details><summary>The lab '+chev+'</summary><div class="inner"><a href="'+PAGES.research+'">Research</a><a href="'+PAGES.research+'#next">Upcoming releases</a><a href="'+PAGES.about+'">About Textile Labs</a><a href="'+PAGES.about+'#goals">Our goals</a></div></details>'+
  '<details><summary>Licences and data '+chev+'</summary><div class="inner"><a href="https://opensource.org/license/mit" target="_blank" rel="noopener">The MIT licence ↗</a><a href="https://huggingface.co/textilelabs" target="_blank" rel="noopener">Model cards and data ↗</a></div></details>'+
  '</div><div class="f-side"><h4>What we make</h4><p>Small, honest language models, trained from scratch, that you can run yourself.</p><a href="https://huggingface.co/textilelabs" target="_blank" rel="noopener">Hugging Face ↗</a></div>'+
  '<div class="f-legal"><span>© 2026 Textile Labs</span><span>Models released under the MIT licence</span></div></footer>'; }

// painted page titles: <h1 data-title data-style="twill">Models</h1>
document.querySelectorAll('[data-title]').forEach(h=>{
  const text=h.textContent.trim(), st=h.dataset.style||'spark';
  const cv=document.createElement('canvas'); cv.className='titleCanvas'; cv.setAttribute('aria-hidden','true'); h.classList.add('painted'); h.after(cv);
  const draw=()=>{ const g=document.createElement('canvas').getContext('2d'); g.font='900 100px Fraunces'; const w=g.measureText(text).width, a=g.measureText(text).actualBoundingBoxAscent;
    const H=Math.min(140,Math.max(78,innerWidth*0.085)); cv.style.width=Math.min(innerWidth*0.9, w*(H/a)*0.92)+'px';
    const p=TL.paintWord(cv,{text,font:'Fraunces',weight:900,fill:0.99,style:st,interactive:true}); p.start(); };
  document.fonts.load('900 100px Fraunces').then(draw);
});

// the label sheet
if(document.body.hasAttribute('data-sheet')){
  document.body.insertAdjacentHTML('beforeend','<div class="backdrop" id="backdrop"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle"><div class="sheetSide"><div class="sheetBand"><span>Textile Labs</span><b id="sheetNum"></b></div><div class="sheetLogo" id="sheetLogo"><img alt="" id="sheetLogoImg"></div><canvas id="sheetCloth"></canvas></div><div class="specs" id="sheetBody"></div><button class="close" aria-label="Close" data-close>×</button></div>');
  const sheet=document.getElementById('sheet'), back=document.getElementById('backdrop'), body=document.getElementById('sheetBody'); let last=null;
  window.openSheet=function(m){
    if(!sheet.classList.contains('on')) last=document.activeElement;
    body.innerHTML=TLDATA.specsHTML(m); body.querySelector('h3').id='sheetTitle';
    document.getElementById('sheetNum').textContent=(m.name.match(/[\d.]+[A-Z]?/)||[m.lineName[0]])[0];
    sheet.style.setProperty('--lc',TLDATA.LINE_COL[m.line]); const lg=document.getElementById('sheetLogo'); lg.hidden=!m.logo; if(m.logo){ const im=document.getElementById('sheetLogoImg'); im.src=m.logo; im.alt='The '+m.name+' logo'; } sheet.classList.toggle('hasLogo',!!m.logo); sheet.classList.add('on'); back.classList.add('on'); body.scrollTop=0;
    requestAnimationFrame(()=>{ const mix=Object.assign({},TLDATA.MIX[m.line]); const cv=document.getElementById('sheetCloth');
      TL.paintSwatch(cv,{mix,cell:Math.max(14,Math.round(23-m.layers/4)),seed:m.name.length*7,ground:mix.ground||'#F1DFCB',w:cv.clientWidth||240,h:cv.clientHeight||420}); });
    sheet.querySelector('.close').focus(); };
  window.closeSheet=function(){ sheet.classList.remove('on'); back.classList.remove('on'); last&&last.focus({preventScroll:true}); window.onSheetClose&&window.onSheetClose(); };
  back.onclick=closeSheet; sheet.querySelector('[data-close]').onclick=closeSheet;
  addEventListener('keydown',e=>{ if(e.key==='Escape'&&sheet.classList.contains('on')) closeSheet(); });
  body.addEventListener('click',async e=>{
    const tab=e.target.closest('[role=tab]'); if(tab){ body.querySelectorAll('[role=tab]').forEach(t=>t.setAttribute('aria-selected',String(t===tab))); body.querySelectorAll('.runCmd').forEach(c=>c.hidden=c.dataset.k!==tab.dataset.k); return; }
    const cp=e.target.closest('[data-copy]'); if(cp){ const t=cp.dataset.copy; try{ await navigator.clipboard.writeText(t); }catch(_){ const ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } cp.textContent='Copied'; setTimeout(()=>cp.textContent='Copy',1400); return; }
    const go=e.target.closest('[data-goto]'); if(go){ openSheet(TLDATA.bySlug(go.dataset.goto)); }
  });
}
})();
