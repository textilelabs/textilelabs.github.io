/* Textile Labs: every Loom, by line. One source for the models page, the timeline and the try page.
   Sizes and dates: Hugging Face (textilelabs) and the lab registry, checked 2026-11-16. Crucible 4.5 released 2026-11-21; the rest of 4.5 coming soon. */
(function(){
const HF='https://huggingface.co/textilelabs/';
const C=['laptop','offline','mit'];
function M(o){ return Object.assign({status:'Released',care:C,specs:[]},o); }
const LINES=[
 {id:'crucible',name:'Crucible',about:'Our largest Looms, the parents the others are cut from.',models:[
   M({name:'Crucible Preview',size:'155M',params:154.98,layers:52,date:'2026-09-23',hf:'Loom-Crucible-Preview',what:'Our first big reader, grown from Tapestry 3.',specs:[['Parameters','154,980,864'],['Shape','52 layers × 512'],['Context','1,024 tokens'],['Honesty test','125 / 133']]}),
   M({name:'Crucible 4.5',size:'130M',params:130.06,layers:32,date:'2026-11-21',hf:'Loom-Crucible-4.5',demo:'loom-crucible-4.5-q4_k_m.gguf',demoMB:81,what:'The parent of the 4.5 family. Does sums with a calculator, remembers what you told it, writes short emails, and quotes the sentence it read.',specs:[['Parameters','130,056,704'],['Shape','32 layers × 512'],['Context','2,048 tokens'],['Everyday checks','12 / 12'],['Calculator','40 / 40'],['Honesty test','123 / 133']],care:['laptop','phone','tools','mit']})]},
 {id:'tapestry',name:'Tapestry',about:'Big readers, up to about a hundred million parameters.',models:[
   M({name:'Tapestry 2',size:'22.8M',params:22.83,layers:20,date:'2026-09-04',hf:'Loom-Tapestry-2',what:'Our first Loom trained with Muon.',specs:[['Parameters','22,827,840'],['Shape','20 layers × 320'],['Honesty test','107 / 133']],care:['laptop','phone','mit']}),
   M({name:'Tapestry 3',size:'69.2M',params:69.24,layers:40,date:'2026-09-21',hf:'Loom-Tapestry-3',what:'Grown from Weave 3; the best live searcher of its time.',specs:[['Parameters','69,237,120'],['Shape','40 layers × 384'],['Honesty test','123 / 133']]}),
   M({name:'Tapestry 4.5',size:'99.6M',params:99.64,layers:24,status:'Coming soon',what:'Nearly the whole parent: every 4.5 ability in a smaller file.',specs:[['Parameters','99,639,808'],['Shape','First 24 layers of Crucible 4.5'],['Context','2,048 tokens']],care:['laptop','tools','offline','mit']})]},
 {id:'weave',name:'Weave',about:'The middle of the range: careful, honest and quick.',models:[
   M({name:'Weave 2',size:'59.7M',params:59.65,layers:16,date:'2026-09-02',hf:'Loom-Weave-2',what:'The first Weave.',specs:[['Parameters','59.65 million']]}),
   M({name:'Weave 3',size:'31.5M',params:31.47,layers:16,date:'2026-09-20',hf:'Loom-Weave-3',what:'The first Loom to read live Wikipedia.',specs:[['Parameters','31,469,952'],['Shape','16 layers × 384'],['Honesty test','120 / 133']],care:['laptop','phone','mit']}),
   M({name:'Weave 4',size:'55.6M',params:55.56,layers:24,date:'2026-10-06',hf:'Loom-Weave-4',demo:'loom-weave-4-q4_k_m.gguf',demoMB:44,what:'Our best score on the honesty test, with a chat template that works in phone apps.',specs:[['Parameters','55,555,520'],['Shape','24 layers × 448'],['Context','8,192 tokens'],['Honesty test','127 / 133']],care:['laptop','phone','offline','mit']}),
   M({name:'Weave 4.5',size:'69.2M',params:69.22,layers:16,status:'Coming soon',what:'Reads, follows rules from examples, and writes grounded replies.',specs:[['Parameters','69,222,912'],['Shape','First 16 layers of Crucible 4.5'],['Context','2,048 tokens']],care:['laptop','tools','offline','mit']})]},
 {id:'spark',name:'Spark',about:'Small and fast, for laptops and phones.',models:[
   M({name:'Spark',size:'7.6M',params:7.56,layers:8,date:'2026-08-25',hf:'Loom-Spark',what:'Where Loom started.',specs:[['Parameters','7,558,080']],care:['laptop','phone','mit']}),
   M({name:'Spark 1.5',size:'12.3M',params:12.32,layers:8,date:'2026-08-25',hf:'Loom-Spark-1.5',what:'The second Spark.',specs:[['Parameters','12,318,720']],care:['laptop','phone','mit']}),
   M({name:'Spark 1.8',size:'18.9M',params:18.85,layers:12,date:'2026-08-27',hf:'Loom-Spark-1.8',what:'The last of the first Sparks.',specs:[['Parameters','18,850,496']],care:['laptop','phone','mit']}),
   M({name:'Spark 2',size:'19.9M',params:19.87,layers:12,date:'2026-09-03',hf:'Loom-Spark-2',what:'Twelve layers, trained in an hour.',specs:[['Parameters','19,867,008'],['Shape','12 layers × 384']],care:['laptop','phone','mit']}),
   M({demo:'loom-spark-3-f16.gguf',demoMB:24.6,name:'Spark 3',size:'12.2M',params:12.2,layers:20,date:'2026-09-11',hf:'Loom-Spark-3',what:'A tiny searcher that knows when to look things up.',specs:[['Parameters','12,200,192'],['Shape','20 layers × 256'],['Honesty test','120 / 133']],care:['laptop','phone','mit']}),
   M({name:'Spark 3.2',size:'22.8M',params:22.83,layers:20,date:'2026-10-01',hf:'Loom-Spark-3.2',what:'A small searcher that reads one sentence well.',specs:[['Parameters','22,827,840'],['Shape','20 layers × 320'],['Context','2,048 tokens'],['Honesty test','122 / 133']],care:['laptop','phone','offline','mit']}),
   M({name:'Spark 4.5 XS',size:'17.8M',params:17.77,layers:18,status:'Coming soon',what:'A tiny Spark for short reading and choosing tools.',specs:[['Parameters','17,769,728'],['Shape','18 layers × 256']],care:['laptop','phone','offline','mit']}),
   M({name:'Spark 4.5',size:'38.8M',params:38.81,layers:8,status:'Coming soon',what:'Reads short text you give it, calls tools, and makes small decisions.',specs:[['Parameters','38,806,016'],['Shape','First 8 layers of Crucible 4.5']],care:['laptop','phone','tools','mit']}),
   M({name:'Spark 4.5 XL',size:'54.0M',params:54.01,layers:12,status:'Coming soon',what:'The largest Spark: better reading, tool menus and small rules.',specs:[['Parameters','54,014,464'],['Shape','First 12 layers of Crucible 4.5']],care:['laptop','phone','tools','mit']})]},
 {id:'flash',name:'Flash',about:'A third of a parent, most of its manners.',models:[
   M({name:'Spark 1.5 Flash',size:'1.4M',params:1.35,layers:8,date:'2026-08-28',hf:'Loom-Spark-1.5-Flash',what:'The first Flash.',specs:[['Parameters','1,350,400']],care:['phone','offline','mit']}),
   M({name:'Spark 1.8 Flash',size:'2.6M',params:2.62,layers:8,date:'2026-08-28',hf:'Loom-Spark-1.8-Flash',what:'Spark 1.8, shrunk.',specs:[['Parameters','2,615,424']],care:['phone','offline','mit']}),
   M({name:'Weave 2 Flash',size:'19.9M',params:19.87,layers:12,date:'2026-09-03',hf:'Loom-Weave-2-Flash',what:'Weave 2, shrunk.',specs:[['Parameters','19,867,008']],care:['laptop','phone','mit']}),
   M({demo:'loom-tapestry-3-flash-f16.gguf',demoMB:14.5,name:'Tapestry 3 Flash',size:'7.2M',params:7.18,layers:20,date:'2026-09-10',hf:'Loom-Tapestry-3-Flash',what:'Full depth, narrow width.',specs:[['Parameters','7,184,064'],['Shape','20 layers × 192'],['Honesty test','112 / 133']],care:['laptop','phone','mit']}),
   M({name:'Spark 3 Flash',size:'7.2M',params:7.18,layers:20,date:'2026-09-12',hf:'Loom-Spark-3-Flash',what:'Spark 3 in a third of the size.',specs:[['Parameters','7,184,064'],['Honesty test','119 / 133']],care:['laptop','phone','mit']}),
   M({name:'Loom 4.5 Flash',size:'10.9M',params:10.89,layers:12,status:'Coming soon',what:'Quick decisions, routing and short replies.',specs:[['Parameters','10,885,376'],['Shape','12 layers × 256'],['Made','Taught by Crucible 4.5']],care:['laptop','phone','offline','mit']})]},
 {id:'swift',name:'Swift',about:'Trained in minutes.',models:[
   M({name:'Swift Micro',size:'1.2M',params:1.16,layers:12,date:'2026-09-13',hf:'Loom-Swift-Micro',what:'Trained in five minutes.',specs:[['Parameters','1,159,120'],['Honesty test','104 / 133']],care:['phone','offline','mit']}),
   M({name:'Swift Mini',size:'2.0M',params:2.0,layers:10,date:'2026-09-13',hf:'Loom-Swift-Mini',what:'Trained in ten minutes.',specs:[['Parameters','2,001,536'],['Honesty test','106 / 133']],care:['phone','offline','mit']}),
   M({name:'Swift Micro 2',size:'1.2M',params:1.17,layers:12,date:'2026-10-30',hf:'Loom-Swift-Micro-2',demo:'loom-swift-micro-2-q8_0.gguf',demoMB:1.4,what:'An experiment in very fast training, published honestly as one.',specs:[['Parameters','1,172,832']],care:['phone','offline','mit']}),
   M({name:'Swift Mini 2',size:'2.0M',params:2.01,layers:10,date:'2026-10-30',hf:'Loom-Swift-Mini-2',demo:'loom-swift-mini-2-q8_0.gguf',demoMB:2.3,what:'An experiment in very fast training, published honestly as one.',specs:[['Parameters','2,005,376']],care:['phone','offline','mit']})]},
 {id:'planck',name:'Planck',about:'Under two megabytes. For decisions, not paragraphs.',models:[
   M({name:'Planck 300K',size:'314K',params:0.31,layers:6,date:'2026-11-01',hf:'Loom-Planck-300k',what:'Our smallest Loom.',specs:[['Parameters','313,920']],care:['phone','offline','mit']}),
   M({name:'Planck 600K',size:'586K',params:0.59,layers:6,date:'2026-11-01',hf:'Loom-Planck-600k',what:'The middle Planck.',specs:[['Parameters','586,176']],care:['phone','offline','mit']}),
   M({demo:'loom-planck-1.2m-q8_0.gguf',demoMB:1.3,name:'Planck 1.2M',size:'1.2M',params:1.19,layers:6,date:'2026-11-01',hf:'Loom-Planck-1.2m',what:'The largest Planck.',specs:[['Parameters','1,186,912']],care:['phone','offline','mit']})]},
 {id:'tools',name:'Tools',about:'Tiny single-job models for inside an app.',models:[
   M({demo:'loom-router-1-f16.gguf',demoMB:2.9,demoMode:'route',name:'Router 1',size:'1.4M',params:1.44,layers:4,date:'2026-09-02',hf:'Loom-Router-1',what:'Reads a request and picks the tool, in one token.',specs:[['Parameters','1,435,040']],care:['phone','offline','mit']}),
   M({demo:'loom-atom-f16.gguf',demoMB:0.06,demoMode:'gate',name:'Atom',size:'22K',params:0.022,layers:4,date:'2026-09-03',hf:'Loom-Atom',what:'Decides whether a request needs a tool at all.',specs:[['Parameters','22,392']],care:['phone','offline','mit']})]}
];
// GGUF files on Hugging Face (checked 2026-11-16) and moments worth marking on the timeline
const FILES={'Loom-Spark':['F32'],'Loom-Spark-1.5':['F32'],'Loom-Spark-1.8':['F32'],'Loom-Spark-1.5-Flash':['F32'],'Loom-Spark-1.8-Flash':['F32'],'Loom-Weave-2':['F16','Q8_0'],
  'Loom-Weave-4':['F16','Q8_0','Q4_K_M'],'Loom-Crucible-4.5':['F16','Q8_0','Q4_K_M'],'Loom-Swift-Mini-2':['F16','Q8_0','Q4_K_M'],'Loom-Swift-Micro-2':['F16','Q8_0','Q4_K_M'],'Loom-Planck-300k':['F16','Q8_0','Q4_K_M'],'Loom-Planck-600k':['F16','Q8_0','Q4_K_M'],'Loom-Planck-1.2m':['F16','Q8_0','Q4_K_M']};
const FIRST={'Spark':'The first Loom','Spark 1.5 Flash':'The first Flash','Router 1':'The first single-job model','Tapestry 2':'First trained with Muon','Tapestry 3 Flash':'A third of the size, most of the score',
  'Weave 3':'First to read live Wikipedia','Tapestry 3':'First grown from a smaller Loom','Crucible Preview':'Our largest Loom so far','Weave 4':'Best honesty score: 127 / 133','Swift Micro':'Trained in five minutes','Planck 300K':'Our smallest Loom','Crucible 4.5':'Seven models from one run'};
const LOGOS=new Set(["atom", "crucible-preview", "crucible-4-5", "planck-1-2m", "planck-300k", "planck-600k", "router-1", "spark-2", "spark-3", "spark-3-2", "spark-3-flash", "swift-micro", "swift-micro-2", "swift-mini", "swift-mini-2", "tapestry-2", "tapestry-3", "tapestry-3-flash", "weave-2", "weave-2-flash", "weave-3", "weave-4"]), MARKLOGO=new Set(['spark','spark-1-5','spark-1-8','spark-1-5-flash','spark-1-8-flash']);
LINES.forEach(l=>l.models.forEach(m=>{ m.line=l.id; if(m.hf){ m.files=FILES[m.hf]||['F16']; m.tag=m.files.includes('Q4_K_M')?':Q4_K_M':(m.files.length>1?':'+m.files[m.files.length-1]:''); } if(FIRST[m.name]) m.first=FIRST[m.name]; m.lineName=l.name; if(m.hf) m.url=HF+m.hf; m.slug=m.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'); m.logo=LOGOS.has(m.slug)?'logo-'+m.slug+'.jpg':(MARKLOGO.has(m.slug)?'mark-large.png':null); }));
const MIX={
  crucible:{warp:'sage',weft:'copper',dot:'navy',navy:.7,gap:.05,accent:'red',accentEvery:9,accentRow:4},
  tapestry:{warp:'copper',weft:'navy',dot:'sage',navy:.5,gap:.08},
  weave:{warp:'navy',weft:'sage',dot:'copper',navy:.5,gap:.08},
  spark:{warp:'sage',weft:'copper',dot:'navy',navy:.5,gap:.1},
  flash:{warp:'copper',weft:'navy',dot:'red',navy:.4,gap:.14,warpEvery:3},
  swift:{warp:'copper',weft:'sage',dot:'navy',navy:.3,gap:.12},
  planck:{warp:'navy',weft:'navy',dot:'navy',navy:.1,gap:.55,accent:'red',accentEvery:6,accentRow:2,ground:'#EFE6D6'},
  tools:{warp:'navy',weft:'copper',dot:'red',navy:.3,gap:.2}};
const LINE_COL={crucible:'#B0612F',tapestry:'#1F2A4B',weave:'#7E9A7C',spark:'#C2763F',flash:'#B5372C',swift:'#B9864F',planck:'#141C36',tools:'#6B4A35'};
const CARE={laptop:['<rect x="5" y="6" width="16" height="11" rx="1"/><path d="M2 20h22"/>','Runs on a laptop'],phone:['<rect x="8" y="3" width="10" height="20" rx="2"/><path d="M12 19h2"/>','Fits on a phone'],
  offline:['<path d="M6 17a5 5 0 0 1 1-9.9A6 6 0 0 1 18.5 9 4 4 0 0 1 19 17"/><path d="M4 4l18 18"/>','Works offline'],scratch:['<circle cx="13" cy="13" r="8"/><path d="M5 13h16M13 5c3 3 3 13 0 16M13 5c-3 3-3 13 0 16"/>','Trained from scratch'],
  mit:['<rect x="3" y="7" width="20" height="12" rx="2"/><text x="13" y="16.5" font-size="7" text-anchor="middle" fill="#1D2847" stroke="none" font-family="sans-serif" font-weight="700">MIT</text>','MIT licence'],
  tools:['<path d="M15 4a5 5 0 0 0-5 6L4 16l4 4 6-6a5 5 0 0 0 6-5l-3 2-3-1-1-3z"/>','Uses tools you list']};
function commands(m){ if(!m.hf) return null; const r='textilelabs/'+m.hf;
  return [['Ollama','ollama run hf.co/'+r+m.tag],['llama.cpp','llama-cli -hf '+r+m.tag+' --repeat-penalty 1.0'],['LM Studio','lms get '+r],['Transformers','AutoModelForCausalLM.from_pretrained("'+r+'")']]; }
function fmtDate(d){ return new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}); }
function specsHTML(m){
  const L=LINES.find(l=>l.id===m.line), i=L.models.indexOf(m), prev=L.models[i-1], next=L.models[i+1];
  const acts=[]; if(m.demo) acts.push('<a href="try.html?model='+m.slug+'">Try it in your browser</a>');
  if(m.url) acts.push('<a class="quiet" href="'+m.url+'" target="_blank" rel="noopener">Hugging Face ↗</a>');
  const cmds=commands(m);
  const run = cmds ? '<div class="run"><div class="runTabs" role="tablist">'+cmds.map((c,k)=>'<button role="tab" aria-selected="'+(k===0)+'" data-k="'+k+'">'+c[0]+'</button>').join('')+'</div>'+
      cmds.map((c,k)=>'<div class="runCmd" data-k="'+k+'"'+(k?' hidden':'')+'><code>'+c[1].replace(/</g,'&lt;')+'</code><button class="copy" data-copy="'+c[1].replace(/"/g,'&quot;')+'">Copy</button></div>').join('')+'</div>'
    : '<p class="runSoon">Commands to run it appear here when it is released.</p>';
  const bar=Math.max(4,Math.min(100,(Math.log10(m.params*1e6)-4)/(Math.log10(2e8)-4)*100));
  return '<div class="sheetTop"><span class="lineTag" style="--lc:'+LINE_COL[m.line]+'">'+L.name+' line</span><span class="status">'+(m.date?'Released '+fmtDate(m.date):'Coming soon')+'</span></div>'+
    '<h3>'+(m.name.startsWith('Loom')?m.name:'Loom '+m.name)+'</h3>'+(m.first?'<p class="first">'+m.first+'</p>':'')+'<p class="what">'+m.what+'</p>'+
    '<div class="scale" aria-label="Size on a log scale"><span>'+m.size+' parameters</span><i style="width:'+bar+'%"></i></div>'+
    '<dl>'+m.specs.map(r=>'<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>').join('')+(m.files?'<dt>Files</dt><dd>GGUF '+m.files.join(', ')+', safetensors</dd>':'')+'<dt>Licence</dt><dd>MIT</dd></dl>'+
    '<div class="care" aria-label="Care label">'+m.care.map(k=>'<figure><svg viewBox="0 0 26 26" aria-hidden="true">'+CARE[k][0]+'</svg><figcaption>'+CARE[k][1]+'</figcaption></figure>').join('')+'</div>'+
    '<h4 class="runHead">Run it yourself</h4>'+run+
    '<div class="actions">'+acts.join('')+'</div>'+
    '<div class="sib">'+(prev?'<button data-goto="'+prev.slug+'">← '+prev.name+'</button>':'<span></span>')+(next?'<button data-goto="'+next.slug+'">'+next.name+' →</button>':'')+'</div>';
}
window.TLDATA={LINES,MIX,LINE_COL,CARE,specsHTML,commands,fmtDate,HF,all:()=>LINES.flatMap(l=>l.models),bySlug:s=>LINES.flatMap(l=>l.models).find(m=>m.slug===s)};
})();
