(()=>{
const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)],clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Theme */
const theme=q('button[data-theme]'),light=q('[data-light]'),dark=q('[data-dark]');
function paintTheme(){
  const d=document.documentElement.dataset.theme==='dark';
  light?.classList.toggle('is-active',!d);
  dark?.classList.toggle('is-active',d);
  try{localStorage.setItem('ak-theme',d?'dark':'light')}catch(e){}
}
paintTheme();
theme?.addEventListener('click',()=>{
  document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
  paintTheme();
});

/* Automatic word reveal for regular statements. Operating Belief is handled separately below. */
function wrapWrite(el){
  if(!el||el.dataset.wrapped)return;
  let i=0;
  const walk=node=>{
    [...node.childNodes].forEach(ch=>{
      if(ch.nodeType===3&&ch.textContent.trim()){
        const f=document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(t=>{
          if(/^\s+$/.test(t)){f.append(t)}
          else if(t){
            const s=document.createElement('span');
            s.className='write-word';
            s.style.setProperty('--write-i',i++);
            s.textContent=t;
            f.append(s);
          }
        });
        ch.replaceWith(f);
      }else if(ch.nodeType===1){walk(ch)}
    });
  };
  walk(el);
  el.dataset.wrapped='1';
}
const writeTargets=qa('[data-write]');
writeTargets.forEach(wrapWrite);
if(reduced){
  writeTargets.forEach(el=>el.classList.add('write-on'));
}else{
  const writeObs=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting&&entry.intersectionRatio>.18){
      entry.target.classList.add('write-on');
      writeObs.unobserve(entry.target);
    }
  }),{threshold:[.08,.18,.32]});
  writeTargets.forEach(el=>writeObs.observe(el));
}

/* Hero interpreter word */
const typed=q('[data-typed]');
if(typed&&!reduced){
  const words=['signal','reason','trigger'];let wi=0,ci=0,del=false;
  const tick=()=>{
    const w=words[wi];typed.textContent=w.slice(0,ci);
    if(!del){
      if(ci<w.length){ci++;setTimeout(tick,86)}
      else{del=true;setTimeout(tick,1050)}
    }else{
      if(ci>0){ci--;setTimeout(tick,45)}
      else{del=false;wi=(wi+1)%words.length;setTimeout(tick,140)}
    }
  };
  typed.textContent='';tick();
}

/* Evidence */
const OLD='https://raw.githubusercontent.com/arsh44n/arshaan_portfolio/main/gtm-portfolio/evidence/';
const NEW='https://raw.githubusercontent.com/arsh44n/arshaan-gtm-portfolio/main/evidence/';
const evidenceSources={
  detect:[OLD+'detect.b64.txt'],
  research:[OLD+'research.b64.txt'],
  systemize:[NEW+'systemize.b64.txt','/evidence/systemize.b64.txt?v=6',OLD+'systemize.b64.txt'],
  activate:[OLD+'activate.b64.txt'],
  learn:[OLD+'learn.b64.txt']
};
const imgs={};
async function fetchBase64(sources){
  let last;
  for(const path of sources){
    try{
      const res=await fetch(path,{cache:'no-cache'});
      if(!res.ok)throw new Error(String(res.status));
      const b64=(await res.text()).replace(/\s+/g,'');
      if(!b64.startsWith('UklGR'))throw new Error('invalid webp');
      return `data:image/webp;base64,${b64}`;
    }catch(e){last=e}
  }
  throw last||new Error('evidence unavailable');
}
const stages=[
  {key:'detect',stage:'Detect',num:'01',title:'Start with movement.',caption:'A real signal creates the reason to look closer.',note:'Historical hiring signal reconstructed; original listing not retained.'},
  {key:'research',stage:'Research',num:'02',title:'Decide if the account deserves attention.',caption:'Validate fit before spending attention on outreach.',note:'Sanitized Clay qualification evidence.'},
  {key:'systemize',stage:'Systemize',num:'03',title:'Turn research into reusable inputs.',caption:'Structure the reasoning so the workflow can reuse it.',note:'Messaging-input workflow evidence.'},
  {key:'activate',stage:'Activate',num:'04',title:'Let the available data choose the action.',caption:'The next step branches from what is actually known.',note:'Outbound branching workflow evidence.'},
  {key:'learn',stage:'Learn',num:'05',title:'A response becomes the next signal.',caption:'Feedback tells the system what to sharpen next.',note:'First touch → follow-up → reply.'}
];
const jShell=q('.journey-shell'),jCard=q('[data-journey-card]'),jStage=q('[data-j-stage]'),jNum=q('[data-j-num]'),jTitle=q('[data-j-title]'),jCap=q('[data-j-caption]'),jImg=q('[data-j-image]'),jNote=q('[data-j-note]'),jCounter=q('[data-stage-counter]'),proof=q('[data-proof-open]'),fallback=q('[data-proof-fallback]'),labels=qa('[data-label]'),dot=q('[data-stage-dot]'),prog=q('[data-stage-progress]'),stagebar=q('.stagebar');
let lastStage=-1,currentStage=0;
function stagePlaceholder(stage){
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="680" viewBox="0 0 1200 680"><rect width="1200" height="680" fill="#f7fafb"/><text x="600" y="320" text-anchor="middle" font-family="Arial" font-size="28" fill="#8d99ae">${stage} evidence</text><text x="600" y="362" text-anchor="middle" font-family="Arial" font-size="15" fill="#8d99ae">Proof asset is being replaced</text></svg>`)}`;
}
function setProof(src,stage){
  proof?.classList.add('is-loading');proof?.classList.remove('is-ready');
  if(!jImg)return;
  jImg.style.display='block';
  jImg.onload=()=>{proof?.classList.remove('is-loading');proof?.classList.add('is-ready')};
  jImg.onerror=()=>{
    jImg.onerror=null;
    jImg.src=stagePlaceholder(stage);
    proof?.classList.remove('is-loading');proof?.classList.add('is-ready','is-placeholder');
    if(fallback)fallback.textContent='Proof asset is being replaced';
  };
  proof?.classList.remove('is-placeholder');
  jImg.src=src||stagePlaceholder(stage);
}
function renderStage(i){
  i=clamp(i,0,stages.length-1);currentStage=i;
  if(i===lastStage&&imgs[stages[i].key])return;
  lastStage=i;
  const s=stages[i];
  jCard?.animate([{opacity:.82,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
  if(jStage)jStage.textContent=s.stage;if(jNum)jNum.textContent=s.num;if(jTitle)jTitle.textContent=s.title;if(jCap)jCap.textContent=s.caption;if(jNote)jNote.textContent=s.note;if(jCounter)jCounter.textContent=`Stage ${s.num} / 05`;
  setProof(imgs[s.key],s.stage);
  labels.forEach((l,x)=>{l.classList.toggle('active',x===i);l.classList.toggle('passed',x<i)});
}
async function loadEvidence(){
  await Promise.all(stages.map(async(s,i)=>{
    try{
      imgs[s.key]=await fetchBase64(evidenceSources[s.key]);
      if(s.key==='activate'){const e=q('[data-eubrics-image]');if(e)e.src=imgs[s.key]}
      if(i===currentStage){lastStage=-1;renderStage(i)}
    }catch(err){console.warn('Evidence failed:',s.key,err)}
  }));
}
function updateJourney(){
  if(!jShell)return;
  const r=jShell.getBoundingClientRect(),max=jShell.offsetHeight-innerHeight,raw=max?clamp(-r.top/max):0,p=clamp((raw-.035)/.93),scaled=p*4,i=Math.min(4,Math.floor(scaled+1e-7));
  renderStage(i);
  if(stagebar&&dot&&prog&&labels.length){
    const tr=stagebar.getBoundingClientRect(),centers=labels.map(l=>{const x=l.getBoundingClientRect();return x.left+x.width/2-tr.left}),li=Math.min(4,Math.floor(scaled)),ri=Math.min(4,li+1),local=scaled-li,x=centers[li]+(centers[ri]-centers[li])*local,start=centers[0];
    dot.style.left=x+'px';prog.style.left=start+'px';prog.style.width=Math.max(0,x-start)+'px';
    const line=q('.stage-line',stagebar);if(line){line.style.left=start+'px';line.style.right=Math.max(0,tr.width-centers[4])+'px'}
  }
}
renderStage(0);loadEvidence();

/* Evidence lightbox */
const modal=q('[data-proof-modal]'),modalImg=q('[data-proof-modal-image]'),modalCap=q('[data-proof-modal-caption]');
function openProof(){
  const s=stages[currentStage],src=imgs[s.key];
  if(!src||!modal||!modalImg)return;
  modalImg.src=src;if(modalCap)modalCap.textContent=`${s.num} · ${s.stage} — ${s.note}`;
  modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeProof(){if(!modal)return;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
proof?.addEventListener('click',openProof);
q('[data-proof-close]')?.addEventListener('click',closeProof);
modal?.addEventListener('click',e=>{if(e.target===modal)closeProof()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeProof()});

/* Operating Belief — genuinely scroll-scrubbed, not timer/IntersectionObserver based. */
const beliefLines=q('[data-belief-lines]'),beliefPanel=q('.belief-panel'),bShell=q('[data-belief-shell]'),bTrack=q('[data-belief-track]');
function wrapBelief(el){
  if(!el||el.dataset.beliefWrapped)return;
  const walk=node=>{
    [...node.childNodes].forEach(ch=>{
      if(ch.nodeType===3&&ch.textContent.trim()){
        const f=document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(t=>{
          if(/^\s+$/.test(t)){f.append(t)}
          else if(t){
            const s=document.createElement('span');
            s.className='belief-word';
            s.textContent=t;
            s.style.display='inline-block';
            s.style.willChange='opacity,transform';
            s.style.transition='none';
            f.append(s);
          }
        });
        ch.replaceWith(f);
      }else if(ch.nodeType===1){walk(ch)}
    });
  };
  walk(el);
  el.dataset.beliefWrapped='1';
  el.style.opacity='1';
  el.style.transform='none';
  el.style.transition='none';
}
qa('[data-belief-write]').forEach(wrapBelief);
const beliefWords=beliefLines?qa('.belief-word',beliefLines):[];

function beliefProgress(){
  if(!bShell||!beliefPanel)return 1;
  if(innerWidth>1050){
    const r=bShell.getBoundingClientRect(),max=Math.max(1,bShell.offsetHeight-innerHeight),raw=clamp(-r.top/max);
    return clamp((raw-.018)/.245);
  }
  const r=beliefPanel.getBoundingClientRect();
  return clamp((innerHeight*.78-r.top)/(innerHeight*.72));
}
function updateBeliefWords(){
  if(!beliefWords.length)return;
  if(reduced){
    beliefWords.forEach(w=>{w.style.opacity='1';w.style.transform='none'});
    return;
  }
  const p=beliefProgress();
  const cursor=p*(beliefWords.length+1.15);
  beliefWords.forEach((w,i)=>{
    const local=clamp((cursor-i)/1.1);
    w.style.opacity=String(local);
    w.style.transform=`translate3d(0,${(1-local)*.34}em,0)`;
  });
}
function updateBeliefTrack(){
  if(!bShell||!bTrack)return;
  if(innerWidth<=1050){bTrack.style.transform='none';return}
  const r=bShell.getBoundingClientRect(),max=Math.max(1,bShell.offsetHeight-innerHeight),raw=clamp(-r.top/max);
  const move=clamp((raw-.31)/.69);
  bTrack.style.transform=`translate3d(${-move*200/3}%,0,0)`;
}

/* About / final CTA */
const closeShell=q('[data-closing-shell]'),closeTrack=q('[data-closing-track]'),finalCard=q('[data-final-card]');
function updateClose(){
  if(!closeShell||!closeTrack)return;
  if(innerWidth<=1050){closeTrack.style.transform='none';if(finalCard)finalCard.style.transform='none';return}
  const r=closeShell.getBoundingClientRect(),max=closeShell.offsetHeight-innerHeight,raw=max?clamp(-r.top/max):0,move=clamp((raw-.18)/.78);
  closeTrack.style.transform=`translate3d(${-move*50}%,0,0)`;
  if(finalCard){
    const scale=.955+move*.045,raise=(1-move)*16;
    finalCard.style.transform=`translateY(${raise}px) scale(${scale})`;
    finalCard.style.opacity=String(.78+move*.22);
  }
}

/* Contact: copy first, then invoke the visitor's mail client. */
const EMAIL='arsh44n.me@gmail.com';
async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(e){
    try{
      const ta=document.createElement('textarea');
      ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';
      document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok;
    }catch(_){return false}
  }
}
qa('[data-email-me]').forEach(a=>a.addEventListener('click',async e=>{
  e.preventDefault();
  await copyText(EMAIL);
  window.location.href=a.getAttribute('href')||`mailto:${EMAIL}`;
}));
qa('[data-copy-email]').forEach(btn=>btn.addEventListener('click',async()=>{
  const original=btn.textContent;
  const ok=await copyText(EMAIL);
  btn.textContent=ok?'Email copied ✓':EMAIL;
  setTimeout(()=>{btn.textContent=original},1500);
}));

/* Résumé download. The current temporary PDF can be replaced later without changing the UI. */
async function downloadResume(trigger){
  const original=trigger?.textContent;
  try{
    if(trigger){trigger.disabled=true;trigger.textContent='Preparing résumé…'}
    const res=await fetch('/assets/arshaan-khan-resume.b64.txt?v=1',{cache:'no-store'});
    if(!res.ok)throw new Error(`resume ${res.status}`);
    const b64=(await res.text()).replace(/\s+/g,'');
    const raw=atob(b64),bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
    const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
    const a=document.createElement('a');
    a.href=url;a.download='Arshaan-Khan-GTM-Resume.pdf';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1800);
  }catch(err){
    console.warn('Résumé download failed',err);
    window.open('/assets/arshaan-khan-resume.b64.txt','_blank','noopener');
  }finally{
    if(trigger){trigger.disabled=false;trigger.textContent=original}
  }
}
qa('[data-resume-download]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();downloadResume(el)}));

/* Navigation */
qa('[data-work-jump]').forEach(a=>a.addEventListener('click',e=>{
  if(innerWidth<=1050)return;
  e.preventDefault();
  const y=bShell.getBoundingClientRect().top+scrollY+(bShell.offsetHeight-innerHeight)*.56;
  scrollTo({top:y,behavior:reduced?'auto':'smooth'});
}));
qa('[data-talk],[data-talk-secondary]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();
  if(innerWidth<=1050){q('#contact')?.scrollIntoView({behavior:reduced?'auto':'smooth'});return}
  const y=closeShell.getBoundingClientRect().top+scrollY+(closeShell.offsetHeight-innerHeight)*.98;
  scrollTo({top:y,behavior:reduced?'auto':'smooth'});
}));
q('[data-strategy]')?.addEventListener('click',()=>{
  const note=q('[data-strategy-note]');
  note?.classList.toggle('open');
});

let ticking=false;
function update(){
  updateJourney();
  updateBeliefWords();
  updateBeliefTrack();
  updateClose();
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});
addEventListener('resize',()=>{update()},{passive:true});
update();
})();