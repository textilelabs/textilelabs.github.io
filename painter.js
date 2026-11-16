/* Textile Labs painter: paints woven gouache into a canvas.
   paintWord(canvas, opts)   the big painted word: opts.style = classic | spark | gouache | drybrush | ink
   paintSwatch(canvas, opts) a rectangle of cloth for a model */
(function(){
  const PAL = {
    copper:['#B0612F','#9A4F27','#C2763F','#A85A2C'],
    sand:['#D49E6A','#C88E58','#DEAE7E'],
    sage:['#A7BEA5','#97B095','#B6CAB3'],
    navy:['#1A2442','#222E52','#141C36'],
    red:['#B5372C','#A12F25','#C0463A'],
    cream:['#EFE6D6','#E6DAC5','#F4ECDD']
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rng(seed){ let s=seed%2147483647; if(s<=0) s+=2147483646; return ()=>((s=s*16807%2147483647)-1)/2147483646; }

  // ---------- painted marks, pre-rendered once and stamped every frame ----------
  function makeSprite(kind, w, h, r, dpr, wet){
    const pad=Math.ceil(Math.max(w,h)*(wet?0.5:0.35)), c=document.createElement('canvas');
    c.width=Math.ceil((w+pad*2)*dpr); c.height=Math.ceil((h+pad*2)*dpr);
    const g=c.getContext('2d'); g.scale(dpr,dpr); g.translate(pad+w/2,pad+h/2);
    const col=PAL[kind];
    const blobs = wet ? 8 : (kind==='sage' ? 3 : 5);
    const alphas = wet ? [0.55,0.4,0.32,0.28,0.24,0.2,0.18,0.16] : [0.92,0.55,0.42,0.35,0.3];
    if(wet){ g.shadowColor=col[1]; g.shadowBlur=Math.min(w,h)*0.35; }
    for(let k=0;k<blobs;k++){
      g.globalAlpha=alphas[k]; g.fillStyle=col[Math.floor(r()*col.length)];
      const ww=w*(0.78+r()*(wet?0.5:0.34)), hh=h*(0.78+r()*(wet?0.5:0.34)), jx=(r()-.5)*w*(wet?0.3:0.18), jy=(r()-.5)*h*(wet?0.3:0.18);
      g.beginPath();
      const n=16; for(let a=0;a<=n;a++){ const t=a/n*Math.PI*2, wob=1+(r()-.5)*(wet?0.26:0.16);
        const px=Math.cos(t)*ww/2*wob, py=Math.sin(t)*hh/2*wob;
        const sq=Math.pow(Math.abs(Math.cos(t)),0.6)*Math.sign(Math.cos(t))*ww/2*wob, sy=Math.pow(Math.abs(Math.sin(t)),0.6)*Math.sign(Math.sin(t))*hh/2*wob;
        const X=jx+(px*0.45+sq*0.55), Y=jy+(py*0.45+sy*0.55); a?g.lineTo(X,Y):g.moveTo(X,Y); }
      g.closePath(); g.fill();
    }
    g.shadowBlur=0;
    if(kind==='copper'||kind==='sand'){ // metallic sheen, like the copper paint in the original
      const gr=g.createLinearGradient(-w/2,-h/2,w/2,h/2); gr.addColorStop(0,'rgba(255,214,170,0)'); gr.addColorStop(.45,'rgba(255,214,170,.32)'); gr.addColorStop(.6,'rgba(255,214,170,0)');
      g.globalAlpha=1; g.globalCompositeOperation='source-atop'; g.fillStyle=gr; g.fillRect(-w,-h,w*2,h*2); g.globalCompositeOperation='source-over';
    }
    if(kind==='navy'&&!wet){ g.globalAlpha=.2; g.fillStyle='#fff'; g.beginPath(); g.ellipse(-w*0.12,-h*0.16,w*0.1,h*0.08,0,0,Math.PI*2); g.fill(); }
    g.globalAlpha=wet?.22:.16; g.strokeStyle=col[1]; g.lineWidth=Math.max(.8,Math.min(w,h)*0.07);
    g.beginPath(); g.ellipse(0,0,w*0.44,h*0.44,0,0,Math.PI*2); g.stroke();
    return {c, ox:pad+w/2, oy:pad+h/2};
  }
  // a dry-brush stroke: many bristle lines that skip where the paint runs out
  function strokeSprite(kind, len, thick, vertical, r, dpr){
    const pad=thick*0.6, L=len+pad*2, T=thick+pad*2, c=document.createElement('canvas');
    c.width=Math.ceil((vertical?T:L)*dpr); c.height=Math.ceil((vertical?L:T)*dpr);
    const g=c.getContext('2d'); g.scale(dpr,dpr); const col=PAL[kind];
    if(vertical){ g.translate(T,0); g.rotate(Math.PI/2); }
    const bristles=Math.max(6,Math.round(thick/1.3)), bend=(r()-.5)*thick*0.5;
    for(let b=0;b<bristles;b++){
      const off=pad+(b+0.5)/bristles*thick+(r()-.5)*1.2, w=0.9+r()*2.2;
      g.strokeStyle=col[Math.floor(r()*col.length)]; g.lineWidth=w; g.lineCap='round';
      let x=pad+r()*thick*0.4; const end=pad+len-r()*thick*0.5;
      while(x<end){ const seg=thick*(1.2+r()*4), x2=Math.min(end,x+seg);
        g.globalAlpha=0.35+r()*0.55; g.beginPath();
        const y1=off+bend*Math.sin(x/L*Math.PI), y2=off+bend*Math.sin(x2/L*Math.PI);
        g.moveTo(x,y1); g.quadraticCurveTo((x+x2)/2,(y1+y2)/2+(r()-.5)*1.5,x2,y2); g.stroke();
        x=x2+(r()<0.75?r()*thick*0.25:thick*(0.4+r())); }
    }
    g.globalAlpha=0.18; g.fillStyle=col[0]; g.beginPath(); g.ellipse(pad+thick*0.3,pad+thick/2,thick*0.4,thick*0.55,0,0,Math.PI*2); g.fill();
    return {c, ox:(vertical?T:L)/2, oy:(vertical?L:T)/2, vertical};
  }

  // ---------- sprites for the new styles: graphite, glaze, clay, starlight ----------
  function customSprite(kind, w, h, r, dpr){
    const pad=Math.ceil(Math.max(w,h)*0.6), c=document.createElement('canvas');
    c.width=Math.ceil((w+pad*2)*dpr); c.height=Math.ceil((h+pad*2)*dpr);
    const g=c.getContext('2d'); g.scale(dpr,dpr); g.translate(pad+w/2,pad+h/2);
    if(kind==='graphiteA'||kind==='graphiteB'){ // a few pencil strokes on a diagonal
      if(kind==='graphiteB') g.rotate(Math.PI/2);
      const n=3+Math.floor(r()*2);
      for(let k=0;k<n;k++){ const o=(k-(n-1)/2)*w*0.22+(r()-.5)*2; g.strokeStyle='rgba(44,48,60,'+(0.35+r()*0.45)+')'; g.lineWidth=0.6+r()*0.9; g.lineCap='round';
        g.beginPath(); let x=-w*0.62, y=w*0.62; g.moveTo(x+o,y+o);
        for(let t=0;t<=1;t+=0.2){ x=-w*0.62+t*w*1.24; y=w*0.62-t*w*1.24; g.lineTo(x+o+(r()-.5)*1.2,y+o+(r()-.5)*1.2); }
        g.stroke(); }
    } else if(kind.startsWith('glaze')){ // a glazed ceramic tile
      const base={glazeBlue:['#24427A','#1B3361','#3A5C99'],glazeCream:['#EFE8DA','#E2D8C4','#F7F2E8'],glazeCopper:['#B0612F','#8E4A25','#C9814F'],glazeSage:['#8FAE95','#76967D','#A9C4AD']}[kind];
      const rad=Math.min(w,h)*0.22; g.fillStyle=base[0]; g.beginPath(); g.roundRect(-w/2,-h/2,w,h,rad); g.fill();
      const gr=g.createRadialGradient(-w*0.2,-h*0.25,1,0,0,w*0.75); gr.addColorStop(0,'rgba(255,255,255,.55)'); gr.addColorStop(.35,'rgba(255,255,255,.08)'); gr.addColorStop(1,'rgba(0,0,0,.18)');
      g.fillStyle=gr; g.beginPath(); g.roundRect(-w/2,-h/2,w,h,rad); g.fill();
      if(kind==='glazeCream'){ g.strokeStyle='#24427A'; g.lineWidth=Math.max(1,w*0.07); g.globalAlpha=.85; g.beginPath(); g.arc(0,0,w*0.18,0,Math.PI*2); g.stroke();
        for(let a=0;a<4;a++){ g.beginPath(); g.moveTo(Math.cos(a*Math.PI/2+.78)*w*0.26,Math.sin(a*Math.PI/2+.78)*w*0.26); g.lineTo(Math.cos(a*Math.PI/2+.78)*w*0.4,Math.sin(a*Math.PI/2+.78)*w*0.4); g.stroke(); } g.globalAlpha=1; }
      g.strokeStyle='rgba(30,25,20,.18)'; g.lineWidth=.6; for(let k=0;k<3;k++){ g.beginPath(); g.moveTo((r()-.5)*w,(r()-.5)*h); g.lineTo((r()-.5)*w,(r()-.5)*h); g.stroke(); }
      g.strokeStyle=base[1]; g.globalAlpha=.6; g.lineWidth=Math.max(1,w*0.05); g.beginPath(); g.roundRect(-w/2,-h/2,w,h,rad); g.stroke(); g.globalAlpha=1;
      g.fillStyle='rgba(255,255,255,.8)'; g.beginPath(); g.ellipse(-w*0.22,-h*0.24,w*0.1,h*0.06,-.5,0,Math.PI*2); g.fill();
    } else if(kind==='star'){ // starlight
      const R=w/2; const gr=g.createRadialGradient(0,0,0,0,0,R*1.6); const warm=r()<0.4;
      gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.18,warm?'rgba(255,224,170,.9)':'rgba(205,220,255,.9)'); gr.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle=gr; g.beginPath(); g.arc(0,0,R*1.6,0,Math.PI*2); g.fill();
      if(r()<0.35){ g.strokeStyle='rgba(255,255,255,.55)'; g.lineWidth=.7; g.beginPath(); g.moveTo(-R*1.7,0); g.lineTo(R*1.7,0); g.moveTo(0,-R*1.7); g.lineTo(0,R*1.7); g.stroke(); }
    } else if(kind.startsWith('leaf')){ // an autumn leaf: ovate or maple, with veins
      const pal={leafRust:['#A4431F','#8A3618','#C0592C'],leafAmber:['#D08A2C','#B87422','#E3A246'],leafGold:['#D9A93E','#C29230','#E8C063'],leafRed:['#8E2A1E','#741F16','#A83A2A'],leafBrown:['#7A4A28','#64391D','#91603A']}[kind];
      const maple=r()<0.35, L=w/2, Wd=h/2;
      const gr=g.createLinearGradient(-L,0,L,0); gr.addColorStop(0,pal[1]); gr.addColorStop(.55,pal[0]); gr.addColorStop(1,pal[2]);
      g.fillStyle=gr; g.beginPath();
      if(maple){ const n=5; for(let k=0;k<=n*2;k++){ const a=-Math.PI/2+k*Math.PI/n, rr=(k%2? 0.45 : 1)*Math.min(L,Wd)*1.05*(0.9+r()*0.2); const X=Math.cos(a)*rr, Y=Math.sin(a)*rr; k?g.lineTo(X,Y):g.moveTo(X,Y); } }
      else { g.moveTo(-L,0); g.bezierCurveTo(-L*0.4,-Wd*1.15,L*0.5,-Wd*0.9,L,0); g.bezierCurveTo(L*0.5,Wd*0.9,-L*0.4,Wd*1.15,-L,0); }
      g.closePath(); g.fill();
      g.strokeStyle='rgba(255,230,190,.35)'; g.lineWidth=Math.max(.6,h*0.05); g.beginPath();
      if(maple){ for(let k=0;k<5;k++){ const a=-Math.PI/2+k*2*Math.PI/5; g.moveTo(0,0); g.lineTo(Math.cos(a)*Math.min(L,Wd)*0.85,Math.sin(a)*Math.min(L,Wd)*0.85); } }
      else { g.moveTo(-L*0.95,0); g.lineTo(L*0.9,0); for(let k=-2;k<=2;k++){ if(!k) continue; const x0=k*L*0.28; g.moveTo(x0,0); g.lineTo(x0+L*0.22,-Wd*0.55); g.moveTo(x0,0); g.lineTo(x0+L*0.22,Wd*0.55); } }
      g.stroke();
      g.strokeStyle=pal[1]; g.lineWidth=Math.max(.8,h*0.07); g.beginPath(); g.moveTo(-L,0); g.lineTo(-L-w*0.12,h*0.08); g.stroke();
      if(r()<0.4){ g.fillStyle='rgba(60,30,10,.25)'; g.beginPath(); g.arc((r()-.5)*L,(r()-.5)*Wd*0.6,h*0.08,0,Math.PI*2); g.fill(); }
    } else if(kind==='charcoal'){ // a rough charcoal mark
      g.rotate((r()-.5)*2.4); g.strokeStyle='rgba(28,24,22,.85)'; g.lineCap='round';
      for(let k=0;k<3;k++){ g.lineWidth=0.8+r()*1.8; g.globalAlpha=0.4+r()*0.5; g.beginPath(); g.moveTo(-w/2+(r()-.5)*2,(r()-.5)*h*0.6); g.lineTo(w/2+(r()-.5)*2,(r()-.5)*h*0.6); g.stroke(); }
      g.globalAlpha=1;
    } else if(kind==='ochre'||kind==='ochreY'){ // pigment blown or dabbed onto rock
      const col= kind==='ochre' ? ['#9E3B23','#B5502E','#7E2E1C'] : ['#C08A3E','#A8742F','#D29B4E'];
      for(let k=0;k<4;k++){ g.globalAlpha=[0.8,0.5,0.4,0.3][k]; g.fillStyle=col[Math.floor(r()*3)]; g.beginPath();
        const n=12; for(let a=0;a<=n;a++){ const t=a/n*Math.PI*2, rr=(w/2)*(0.7+r()*0.5); const X=Math.cos(t)*rr+(r()-.5)*2, Y=Math.sin(t)*rr*(h/w)+(r()-.5)*2; a?g.lineTo(X,Y):g.moveTo(X,Y); } g.closePath(); g.fill(); }
      g.globalAlpha=1; g.fillStyle=col[0]; for(let k=0;k<16;k++){ const a=r()*Math.PI*2, d=w*(0.5+r()*0.35); g.globalAlpha=0.25+r()*0.4; g.fillRect(Math.cos(a)*d,Math.sin(a)*d,1.2,1.2); }
      g.globalAlpha=1;
    } else if(kind==='lightH'||kind==='lightV'){ // a thread of light
      g.shadowColor='rgba(255,220,160,.8)'; g.shadowBlur=Math.min(w,h)*3; g.strokeStyle='rgba(255,226,180,'+(0.3+r()*0.4)+')'; g.lineWidth=Math.max(.8,Math.min(w,h)*0.6); g.lineCap='round';
      g.beginPath(); if(kind==='lightH'){ g.moveTo(-w/2,0); g.quadraticCurveTo(0,(r()-.5)*h*2,w/2,0); } else { g.moveTo(0,-h/2); g.quadraticCurveTo((r()-.5)*w*2,0,0,h/2); } g.stroke();
    }
    return {c, ox:pad+w/2, oy:pad+h/2};
  }
  // a coil of clay, rolled by hand, with thumb dents
  function claySprite(kind, len, thick, r, dpr){
    const pad=thick*0.5, L=len+pad*2, T=thick+pad*2, c=document.createElement('canvas');
    c.width=Math.ceil(L*dpr); c.height=Math.ceil(T*dpr); const g=c.getContext('2d'); g.scale(dpr,dpr);
    const col={clayA:['#B4683D','#D08A5A','#7E4122'],clayB:['#C9A27E','#E0C09E','#8F6F52'],clayC:['#8F8A7C','#ABA698','#625E53']}[kind];
    const y0=pad, rad=thick/2;
    g.fillStyle='rgba(60,35,20,.22)'; g.beginPath(); g.roundRect(pad+2,y0+thick*0.18,len,thick,rad); g.fill();
    const gr=g.createLinearGradient(0,y0,0,y0+thick); gr.addColorStop(0,col[1]); gr.addColorStop(.45,col[0]); gr.addColorStop(1,col[2]);
    g.fillStyle=gr; g.beginPath();
    const n=Math.max(4,Math.round(len/(thick*0.6))); g.moveTo(pad,y0+rad);
    for(let k=0;k<=n;k++){ const x=pad+k/n*len; g.lineTo(x,y0+(r()-.5)*thick*0.08); }
    for(let k=n;k>=0;k--){ const x=pad+k/n*len; g.lineTo(x,y0+thick+(r()-.5)*thick*0.08); }
    g.closePath(); g.fill();
    for(let x=pad+thick*0.8;x<pad+len-thick*0.5;x+=thick*(1.2+r()*0.6)){
      g.fillStyle='rgba(0,0,0,.12)'; g.beginPath(); g.ellipse(x,y0+thick*0.5,thick*0.22,thick*0.3,0,0,Math.PI*2); g.fill();
      g.fillStyle='rgba(255,255,255,.14)'; g.beginPath(); g.ellipse(x-thick*0.06,y0+thick*0.38,thick*0.12,thick*0.08,0,0,Math.PI*2); g.fill(); }
    return {c, ox:L/2, oy:T/2, vertical:false};
  }
  function groundFor(style, W, H, mask, dpr){
    if(style==='cave'){
      const c=document.createElement('canvas'); c.width=W*dpr; c.height=H*dpr; const g=c.getContext('2d');
      g.drawImage(mask,0,0); g.globalCompositeOperation='source-in';
      const gr=g.createLinearGradient(0,0,0,c.height); gr.addColorStop(0,'#D6C3A5'); gr.addColorStop(1,'#B9A486'); g.fillStyle=gr; g.fillRect(0,0,c.width,c.height);
      g.globalCompositeOperation='source-atop'; const rr=rng(17);
      for(let k=0;k<W*H/40;k++){ g.fillStyle=rr()<0.5?'rgba(90,70,50,.18)':'rgba(255,245,225,.25)'; const z=dpr*(0.6+rr()*1.8); g.fillRect(rr()*c.width,rr()*c.height,z,z); }
      g.strokeStyle='rgba(70,52,38,.35)'; g.lineWidth=dpr*0.8;
      for(let k=0;k<W/40;k++){ let x=rr()*c.width,y=rr()*c.height; g.beginPath(); g.moveTo(x,y); for(let q=0;q<6;q++){ x+=(rr()-.4)*30*dpr; y+=(rr()-.5)*18*dpr; g.lineTo(x,y);} g.stroke(); }
      return c;
    }
    if(style!=='space') return null;
    const c=document.createElement('canvas'); c.width=W*dpr; c.height=H*dpr; const g=c.getContext('2d');
    g.drawImage(mask,0,0); g.globalCompositeOperation='source-in';
    const gr=g.createLinearGradient(0,0,W*dpr,H*dpr); gr.addColorStop(0,'#121A33'); gr.addColorStop(.5,'#1E2A55'); gr.addColorStop(1,'#141C36');
    g.fillStyle=gr; g.fillRect(0,0,c.width,c.height);
    const neb=g.createRadialGradient(W*dpr*0.55,H*dpr*0.45,0,W*dpr*0.55,H*dpr*0.45,W*dpr*0.4); neb.addColorStop(0,'rgba(181,55,44,.28)'); neb.addColorStop(1,'rgba(181,55,44,0)');
    g.globalCompositeOperation='source-atop'; g.fillStyle=neb; g.fillRect(0,0,c.width,c.height);
    g.fillStyle='rgba(255,255,255,.55)'; const rr=rng(31); for(let k=0;k<W*H/220;k++){ g.fillRect(rr()*c.width,rr()*c.height,dpr*0.8,dpr*0.8); }
    return c;
  }

  // ---------- the cloth used by swatches and the classic word ----------
  function buildMarks(W,H,s,inside,mix,seed){
    const r=rng(seed), list=[]; const cols=Math.ceil(W/s), rows=Math.ceil(H/s);
    const warpEvery = mix.warpEvery||4;
    for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){
      const x=i*s+s/2, y=j*s+s/2; if(!inside(x,y)) continue;
      if(i%warpEvery===0){ const over=((i/warpEvery)+j)%2===0; list.push({k:mix.warp||'sage',role:'warp',x,y,i,j,z: over?2:0}); continue; }
      const navy = (i%warpEvery===2 && j%2===0 && r()<mix.navy*2.2) || (i%(warpEvery*2)===5 && j%4===2);
      if(navy){ list.push({k:mix.dot||'navy',role:'dot',x,y,i,j,z:3}); continue; }
      if(r()<mix.gap) continue;
      const accent = mix.accentRow!=null && j%mix.accentEvery===mix.accentRow;
      list.push({k:accent?mix.accent:(mix.weft||'copper'),role:'weft',x,y,i,j,z:1});
    }
    return finish(list,s,r);
  }
  function finish(list,s,r){ list.forEach(m=>{ m.x+=(r()-.5)*s*0.18; m.y+=(r()-.5)*s*0.14; m.v=Math.floor(r()*6); m.rot=(r()-.5)*0.14; m.dx=0; m.dy=0; m.vx=0; m.vy=0; m.lift=0; }); return list; }

  // ---------- the four new word styles ----------
  function buildStyled(style,W,H,s,inside,seed){
    const r=rng(seed), list=[]; const cols=Math.ceil(W/s), rows=Math.ceil(H/s);
    if(style==='spark'){ // the Spark 3.2 painting: copper bars, broken sage dashes, stacked navy dots
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*s+s/2,y=j*s+s/2; if(!inside(x,y)) continue;
        if(i%4===0){ if(r()<0.55) list.push({k:'sage',role:'dash',x,y,i,j,z:(i/4+j)%2?2:0}); continue; }
        if(i%4===2 && j%2===0){ list.push({k:'navy',role:'dot',x,y,i,j,z:3}); continue; }
        if(r()<0.06) continue; list.push({k:'copper',role:'bar',x,y,i,j,z:1}); }
      return finish(list,s,r);
    }
    if(style==='gouache'){ // basketweave blocks: horizontal copper next to vertical navy, wet and bleeding
      const B=3;
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*s+s/2,y=j*s+s/2; if(!inside(x,y)) continue;
        const horiz=(Math.floor(i/B)+Math.floor(j/B))%2===0;
        if(horiz){ if(i%B!==1) continue; list.push({k:r()<0.25?'sand':'copper',role:'h',x,y,i,j,z:1,wet:1}); }
        else { if(j%B!==1) continue; list.push({k:r()<0.18?'red':'navy',role:'v',x,y,i,j,z:1,wet:1}); } }
      return finish(list,s,r);
    }
    if(style==='ink'){ // Planck: navy brushwork on paper, one red thread woven through every letter
      let minX=1e9,maxX=-1e9; const red=Math.round(rows*0.58);
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*s+s/2,y=j*s+s/2; if(!inside(x,y)) continue;
        minX=Math.min(minX,x); maxX=Math.max(maxX,x);
        if(j===red) continue;
        if(i%2===0){ if(r()<0.92) list.push({k:'navy',role:'ink',x,y,i,j,z:1}); }
        else if(r()<0.7) list.push({k:'navy',role:'inkbar',x,y,i,j,z:0}); }
      for(let x=minX-s*1.5;x<=maxX+s*1.5;x+=s*0.9){ const i=Math.round(x/s), y=red*s+s/2;
        list.push({k:'red',role:'thread',x,y,i,j:red,z:(i%2? 4: -1)}); }
      return finish(list,s,r);
    }
    if(style==='drybrush'){ // a few broad streaky strokes: down first, then dragged across
      const step=s*1.5;
      for(let x=step/2,c=0;x<W;x+=step,c++){ let y0=null;
        for(let y=0;y<=H;y+=s/3){ const inn=y<H&&inside(x,y);
          if(inn&&y0===null) y0=y; if(!inn&&y0!==null){ if(y-y0>s) list.push({type:'stroke',k:c%3===1?'copper':'navy',vertical:true,x,y:(y0+y)/2,len:y-y0,thick:s*1.3,i:c,j:0}); y0=null; } } }
      for(let y=step*0.6,c=0;y<H;y+=step*1.15,c++){ let x0=null;
        for(let x=0;x<=W;x+=s/3){ const inn=x<W&&inside(x,y);
          if(inn&&x0===null) x0=x; if(!inn&&x0!==null){ if(x-x0>s) list.push({type:'stroke',k:c%2?'sand':'copper',vertical:false,x:(x0+x)/2,y,len:x-x0,thick:s*0.85,i:0,j:c}); x0=null; } } }
      list.forEach((m,n)=>{ m.z=m.vertical?0:1; m.v=0; m.rot=(r()-.5)*0.03; m.dx=m.dy=m.vx=m.vy=m.lift=0; });
      return list;
    }
    if(style==='twill'){ // a tight twill weave: navy warp and copper weft stepping diagonally, with a red stripe
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*s+s/2,y=j*s+s/2; if(!inside(x,y)) continue;
        const up=((i+j)%4)<2;
        if(up) list.push({k:'navy',role:'warp',x,y,i,j,z:2});
        else list.push({k:j%9===4?'red':(j%9===5||j%9===3?'sand':'copper'),role:'weft',x,y,i,j,z:1}); }
      return finish(list,s*0.5,r);
    }
    if(style==='sand'){ // grains of desert sand fall and pile up into the letters
      const g2=s; for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*g2+g2/2,y=j*g2+g2/2; if(!inside(x,y)) continue;
        const tone=r(); const col= tone<0.08?'#9C7448':tone<0.3?'#C9A26F':tone<0.6?'#D9B98A':tone<0.85?'#E6CCA2':'#F2E1C1';
        for(let q=0;q<2;q++) list.push({grain:1,col,gs:g2*(0.7+r()*0.5),x:x+(r()-.5)*g2,y:y+(r()-.5)*g2,i,j,z:0}); }
      list.forEach(m=>{ m.v=0; m.rot=0; m.dx=m.dy=m.vx=m.vy=m.lift=0; m.y0=-20-r()*H*0.7; m.x0=m.x+(r()-.5)*s*6; });
      return list;
    }
    if(style==='leaves'){ // autumn leaves drift down and clump into the letters
      const kinds=['leafRust','leafAmber','leafGold','leafRed','leafBrown'];
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*s+s/2,y=j*s+s/2; if(!inside(x,y)) continue;
        if(r()<0.18) continue;
        list.push({k:kinds[Math.floor(r()*kinds.length)],role:'leaf',x:x+(r()-.5)*s*0.7,y:y+(r()-.5)*s*0.7,i,j,z:r(),custom:1,leaf:1,sc:0.85+r()*0.55}); }
      list.forEach(m=>{ m.v=Math.floor(r()*6); m.rot=r()*Math.PI*2; m.dx=m.dy=m.vx=m.vy=m.lift=0; m.y0=-30-r()*H*0.9; m.ph=r()*6.28; m.spin=(r()-.5)*7; });
      return list;
    }
    if(style==='cave'){ // ochre dabbed on a rock wall, outlined in charcoal
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*s+s/2,y=j*s+s/2; if(!inside(x,y)) continue;
        const edge=!inside(x+s,y)||!inside(x-s,y)||!inside(x,y+s)||!inside(x,y-s);
        if(edge){ list.push({k:'charcoal',role:'char',x,y,i,j,z:2,custom:1}); continue; }
        if((i+j)%2===0 && r()<0.72) list.push({k:r()<0.22?'ochreY':'ochre',role:'ochre',x,y,i,j,z:1,custom:1}); }
      return finish(list,s*0.35,r);
    }
    if(style==='sketch'){ // graphite hatching, then cross-hatching
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*s+s/2,y=j*s+s/2; if(!inside(x,y)) continue;
        if(r()<0.92) list.push({k:'graphiteA',role:'hatch',x,y,i,j,z:0,custom:1});
        if((i+j)%2===0 && r()<0.8) list.push({k:'graphiteB',role:'hatch',x,y,i,j,z:1,custom:1}); }
      return finish(list,s*0.4,r);
    }
    if(style==='pottery'){ // glazed tiles, blue and white with copper and celadon
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*s+s/2,y=j*s+s/2; if(!inside(x,y)) continue;
        const pick=(i+2*j)%5; const k=pick===0?'glazeBlue':pick===2?'glazeCopper':pick===4&&r()<0.5?'glazeSage':'glazeCream';
        list.push({k,role:'tile',x,y,i,j,z:1,custom:1,im:'drop'}); }
      return finish(list,s*0.25,r);
    }
    if(style==='clay'){ // hand-rolled coils, built from the bottom up like a coil pot
      const step=s*0.95;
      for(let y=H-step/2,c=0;y>0;y-=step,c++){ let x0=null;
        for(let x=0;x<=W;x+=s/4){ const inn=x<W&&inside(x,y);
          if(inn&&x0===null) x0=x; if(!inn&&x0!==null){ if(x-x0>s*0.6) list.push({type:'stroke',k:['clayA','clayB','clayC'][c%3],clay:1,vertical:false,x:(x0+x)/2,y,len:x-x0,thick:step*1.02,i:0,j:c}); x0=null; } } }
      list.forEach(m=>{ m.z=0; m.v=0; m.rot=(r()-.5)*0.01; m.dx=m.dy=m.vx=m.vy=m.lift=0; });
      return list;
    }
    if(style==='space'){ // a loom in space: stars at the crossings, threads of light woven between them
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const x=i*s+s/2,y=j*s+s/2; if(!inside(x,y)) continue;
        if(i%2===0&&j%2===0){ if(r()<0.62) list.push({k:'star',role:'star',x:x+(r()-.5)*s*1.1,y:y+(r()-.5)*s*1.1,i,j,z:3,custom:1,sc:0.4+Math.pow(r(),2)*1.6}); continue; }
        if(r()>0.3) continue;   // only some threads of light: woven, not a grid
        if(j%2===0) list.push({k:'lightH',role:'lh',x,y,i,j,z:(i+j)%4?2:0,custom:1});
        else if(i%2===0) list.push({k:'lightV',role:'lv',x,y,i,j,z:(i+j)%4?0:2,custom:1}); }
      return finish(list,s*0.3,r);
    }
    return buildMarks(W,H,s,inside,{navy:.5,gap:.1},seed);
  }
  const DIM={warp:[0.74,1.22], weft:[1.22,0.82], dot:[0.98,0.92], dash:[0.5,0.98], bar:[1.36,0.86], h:[2.75,0.9], v:[0.9,2.75], thread:[1.15,0.55], ink:[0.82,1.12], inkbar:[1.25,0.6], hatch:[1.25,1.25], leaf:[1.6,1.0], char:[0.95,0.5], ochre:[1.45,1.3], tile:[0.9,0.9], star:[0.5,0.5], lh:[1.1,0.1], lv:[0.1,1.1]};
  function spriteBank(s,dpr,seed,marks){
    const r=rng(seed+99), bank={};
    marks.forEach(m=>{
      if(m.grain) return;
      if(m.type==='stroke'){ m.sprite = m.clay ? claySprite(m.k,m.len,m.thick,r,dpr) : strokeSprite(m.k,m.len,m.thick,m.vertical,r,dpr); return; }
      const key=m.role+':'+m.k+(m.wet?':w':''); m.key=key; if(bank[key]) return; bank[key]=[];
      for(let v=0;v<6;v++) bank[key].push(m.custom ? customSprite(m.k,s*DIM[m.role][0],s*DIM[m.role][1],r,dpr) : makeSprite(m.k,s*DIM[m.role][0],s*DIM[m.role][1],r,dpr,m.wet)); });
    return bank;
  }
  function timing(marks,cols,style,rows){
    if(style==='leaves'){ const rr=rng(13); marks.forEach(m=>{ m.t = (rows-m.j)*22 + rr()*1500; }); return; }
    if(style==='sand'){ const rr=rng(9); marks.forEach(m=>{ m.t = (rows-m.j)*16 + rr()*700; }); return; }
    if(style==='cave'){ marks.forEach(m=>{ m.t = m.role==='char' ? 400+m.i*9+(m.j%3)*30 : 1300+m.i*6+m.j*14; }); return; }
    if(style==='sketch'){ marks.forEach(m=>{ m.t = m.k==='graphiteA' ? (m.i+m.j)*16 : 1500+(m.i-m.j+rows)*12; }); return; }
    if(style==='pottery'){ marks.forEach(m=>{ m.t = m.j*75 + m.i*7 + (m.i%3)*20; }); return; }
    if(style==='clay'){ marks.forEach(m=>{ m.t = m.j*190; }); return; }
    if(style==='space'){ const rr=rng(5); marks.forEach(m=>{ m.t = m.role==='star' ? 350+rr()*1100 : 1500+(m.i+m.j)*9; }); return; }
    marks.forEach(m=>{
      if(m.type==='stroke'){ m.t = m.vertical ? m.x*0.9 : 900 + m.j*170; return; }
      const down = m.role==='warp'||m.role==='dash'||m.role==='v'||m.role==='ink';
      const across = m.role==='weft'||m.role==='bar'||m.role==='h'||m.role==='inkbar';
      if(down) m.t = m.i*5 + m.j*9;
      else if(across){ const dir=m.j%2===0? m.i : (cols-m.i); m.t = 650 + m.j*70 + dir*4.2; }
      else if(m.role==='thread') m.t = 2300 + m.i*14;
      else m.t = 650 + m.j*70 + 260 + m.i*1.2;
    });
  }

  function paintWord(cv, o){
    const ctx=cv.getContext('2d'); let state=null, raf=0, pointer={x:-1e4,y:-1e4,in:false};
    const paper=new Image(); paper.src=o.paper||'paper-peach.jpg';
    function setup(){
      const dpr=Math.min(devicePixelRatio||1,2), W=Math.floor(cv.getBoundingClientRect().width);
      const fs=s=>(o.weight||900)+' '+s+'px '+o.font;
      ctx.font=fs(100); const mt=ctx.measureText(o.text); const FS=100*W*(o.fill||0.99)/mt.width;
      const ASC=mt.actualBoundingBoxAscent/100*FS, H=Math.round(ASC*1.14);
      cv.width=W*dpr; cv.height=H*dpr; cv.style.height=H+'px';
      const m=document.createElement('canvas'); m.width=W*dpr; m.height=H*dpr; const mg=m.getContext('2d');
      mg.scale(dpr,dpr); mg.font=fs(FS); mg.fillText(o.text,0,H*0.96);
      const md=mg.getImageData(0,0,m.width,m.height).data;
      const inside=(x,y)=>{const X=Math.round(x*dpr),Y=Math.round(y*dpr); return X>=0&&Y>=0&&X<m.width&&Y<m.height&&md[(Y*m.width+X)*4+3]>110;};
      const style=o.style||'classic';
      const s=Math.max(4,H/({gouache:22,drybrush:18,ink:19,sketch:26,pottery:17,clay:17,space:24,twill:26,sand:58,cave:22,leaves:15}[style]||20));
      const marks=buildStyled(style,W,H,s,inside,7);
      const bank=spriteBank(s,dpr,7,marks);
      const cols=Math.ceil(W/s), rows=Math.ceil(H/s); timing(marks,cols,style,rows);
      const end=Math.max(...marks.map(m=>m.t+(m.leaf?1150:m.grain?700:m.type==='stroke'?(m.clay?520:420):260)));
      const ground=groundFor(style,W,H,m,dpr);
      let prev=null; if(state && cv.width){ prev=document.createElement('canvas'); prev.width=cv.width; prev.height=cv.height; prev.getContext('2d').drawImage(cv,0,0); }
      state={W,H,dpr,s,marks,bank,end,ground,prev,t0:performance.now(), intro:!reduce && o.intro!==false, done:state&&state.done&&o.keepDone?true:false};
      marks.sort((a,b)=>a.z-b.z);
      loop();
    }
    function draw(now){
      const {W,H,dpr,marks,bank,s}=state; const t=now-state.t0;
      ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,W,H);
      let moving=false; const R=s*7.5;
      if(state.prev && state.intro && t<500){ ctx.globalAlpha=1-t/500; ctx.drawImage(state.prev,0,0,W,H); ctx.globalAlpha=1; moving=true; }
      if(state.ground){ ctx.globalAlpha=state.intro?Math.min(1,t/450):1; ctx.drawImage(state.ground,0,0,W,H); ctx.globalAlpha=1; }
      for(const m of marks){
        if(m.grain){ // sand: falling with gravity, then pushed by the cursor like wind
          let gx=m.x, gy=m.y;
          if(state.intro){ const q=(t-m.t)/700; if(q<=0) continue; if(q<1){ moving=true; const e=q*q; gy=m.y0+(m.y-m.y0)*e; gx=m.x0+(m.x-m.x0)*Math.min(1,q*1.4); } }
          if(o.interactive && !reduce){ let tx=0,ty=0; if(pointer.in){ const ddx=m.x-pointer.x, ddy=m.y-pointer.y, d=Math.hypot(ddx,ddy);
              if(d<R*1.3){ const f=Math.pow(1-d/(R*1.3),2); tx=ddx/(d||1)*s*5*f+s*2*f; ty=ddy/(d||1)*s*3*f-s*1.5*f; } }
            m.vx+=(tx-m.dx)*0.09; m.vy+=(ty-m.dy)*0.09; m.vx*=0.8; m.vy*=0.8; m.dx+=m.vx; m.dy+=m.vy; if(Math.abs(m.vx)+Math.abs(m.vy)>0.02) moving=true; }
          ctx.fillStyle=m.col; ctx.fillRect(gx+m.dx, gy+m.dy, m.gs, m.gs); continue; }
        let a=1, sc=1, p=1, fx=0, fy=0, fr=0;
        if(m.leaf && state.intro){ const q=(t-m.t)/1150; if(q<=0) continue; if(q<1){ moving=true; const e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2; fx=Math.sin(q*7+m.ph)*s*1.8*(1-q); fy=(m.y0-m.y)*(1-e); fr=(1-q)*m.spin; a=Math.min(1,q*4); } }
        else if(state.intro){ p=(t-m.t)/(m.type==='stroke'?(m.clay?520:420):240); if(p<=0) continue; if(p<1){ moving=true; if(m.type!=='stroke'){ a=p; sc = m.im==='drop' ? 1.35-0.35*easeOutBack(p) : (m.role==='star' ? 1.8-0.8*easeOut(p) : 0.55+0.45*easeOut(p)); } } else p=1; }
        if(o.interactive && !reduce){
          let tx=0,ty=0,tl=0;
          if(pointer.in){ const ddx=m.x-pointer.x, ddy=m.y-pointer.y, d=Math.hypot(ddx,ddy);
            if(d<R){ const f=Math.pow(1-d/R,2), k=m.type==='stroke'?0.35:1; const push=s*0.95*f*k; tx=ddx/(d||1)*push; ty=ddy/(d||1)*push*0.7; tl=f*k; } }
          m.vx+=(tx-m.dx)*0.16; m.vy+=(ty-m.dy)*0.16; m.vx*=0.72; m.vy*=0.72; m.dx+=m.vx; m.dy+=m.vy; m.lift+=(tl-m.lift)*0.18;
          if(Math.abs(m.vx)+Math.abs(m.vy)>0.02||Math.abs(tl-m.lift)>0.01) moving=true;
        }
        sc*=(m.sc||1)*(1+m.lift*0.22);
        ctx.globalAlpha=a; ctx.save(); ctx.translate(m.x+m.dx+fx, m.y+m.dy+fy - m.lift*s*0.25); ctx.rotate(m.rot+fr+m.lift*(m.v%2?(m.leaf?0.6:0.1):(m.leaf?-0.6:-0.1))); ctx.scale(sc,sc);
        if(m.lift>0.05){ ctx.globalAlpha=a*0.16*m.lift; ctx.fillStyle='#1A2442'; ctx.beginPath(); ctx.ellipse(0,s*0.35,s*0.5,s*0.18,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=a; }
        if(m.type==='stroke'){ const sp=m.sprite, cw=sp.c.width, ch=sp.c.height;
          if(sp.vertical) ctx.drawImage(sp.c,0,0,cw,ch*p,-sp.ox,-sp.oy,cw/dpr,ch*p/dpr);
          else ctx.drawImage(sp.c,0,0,cw*p,ch,-sp.ox,-sp.oy,cw*p/dpr,ch/dpr); }
        else { const sp=bank[m.key][m.v]; ctx.drawImage(sp.c,-sp.ox,-sp.oy,sp.c.width/dpr,sp.c.height/dpr); }
        ctx.restore();
      }
      ctx.globalAlpha=1;
      if(paper.complete && !state.ground){ ctx.save(); ctx.globalCompositeOperation='source-atop'; ctx.globalAlpha=0.06; ctx.drawImage(paper,0,0,W,H); ctx.restore(); }
      if(state.intro && t<state.end) moving=true;
      if(!state.done && (!state.intro || t>=state.end)){ state.done=true; o.onDone&&o.onDone(); }
      return moving;
    }
    function loop(){ cancelAnimationFrame(raf); const tick=now=>{ if(draw(now)) raf=requestAnimationFrame(tick); else raf=0; }; raf=requestAnimationFrame(tick); }
    const easeOut=k=>1-Math.pow(1-k,3), easeOutBack=k=>{const c1=1.7,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2);};
    const host=o.hoverHost||cv;
    host.addEventListener('pointermove',e=>{ const b=cv.getBoundingClientRect(); pointer={x:e.clientX-b.left,y:e.clientY-b.top,in:true}; if(!raf) loop(); });
    host.addEventListener('pointerleave',()=>{ pointer.in=false; if(!raf) loop(); });
    let rt; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>{ o.intro=false; setup(); },200); });
    return { start:setup, replay(){ o.intro=true; o.keepDone=false; state=null; setup(); }, setStyle(st,keep){ o.style=st; o.intro=true; o.keepDone=!!keep; setup(); }, get style(){return o.style;} };
  }

  function paintSwatch(cv, o){
    const dpr=Math.min(devicePixelRatio||1,2), b=cv.getBoundingClientRect(), W=Math.floor(o.w||b.width), H=Math.floor(o.h||b.height);
    cv.width=W*dpr; cv.height=H*dpr; const ctx=cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
    if(o.ground){ ctx.fillStyle=o.ground; ctx.fillRect(0,0,W,H); }
    const s=o.cell||12; const marks=buildMarks(W+s,H+s,s,()=>true,o.mix,o.seed||3);
    const bank=spriteBank(s,dpr,o.seed||3,marks);
    marks.sort((a,b)=>a.z-b.z);
    for(const m of marks){ const sp=bank[m.key][m.v]; ctx.save(); ctx.translate(m.x-s/2,m.y-s/2); ctx.rotate(m.rot); ctx.drawImage(sp.c,-sp.ox,-sp.oy,sp.c.width/dpr,sp.c.height/dpr); ctx.restore(); }
    return cv;
  }

  window.TL={paintWord,paintSwatch,PAL};
})();
