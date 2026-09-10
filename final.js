(()=>{
const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)],clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Theme */
const theme=q('button[data-theme]'),light=q('[data-light]'),dark=q('[data-dark]');
function paintTheme(){const d=document.documentElement.dataset.theme==='dark';light?.classList.toggle('is-active',!d);dark?.classList.toggle('is-active',d);try{localStorage.setItem('ak-theme',d?'dark':'light')}catch(e){}}
paintTheme();theme?.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';paintTheme()});

/* Fast type-on effect for statements. No blur, no scroll-scrubbing. */
function wrapWrite(el){if(!el||el.dataset.wrapped)return;let i=0;const walk=node=>{[...node.childNodes].forEach(ch=>{if(ch.nodeType===3&&ch.textContent.trim()){const f=document.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(t=>{if(/^\s+$/.test(t)){f.append(t)}else if(t){const s=document.createElement('span');s.className='write-word';s.style.setProperty('--write-i',i++);s.textContent=t;f.append(s)}});ch.replaceWith(f)}else if(ch.nodeType===1)walk(ch)})};walk(el);el.dataset.wrapped='1'}
const writeTargets=qa('[data-write]');writeTargets.forEach(wrapWrite);
if(reduced){writeTargets.forEach(el=>el.classList.add('write-on'))}else{
 const writeObs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>.22){entry.target.classList.add('write-on');writeObs.unobserve(entry.target)}}),{threshold:[.12,.22,.4]});
 writeTargets.forEach(el=>writeObs.observe(el));
}

/* Hero interpreter word, fixed-width so layout never jumps. */
const typed=q('[data-typed]');
if(typed&&!reduced){const words=['signal','reason','trigger'];let wi=0,ci=0,del=false;const tick=()=>{const w=words[wi];typed.textContent=w.slice(0,ci);if(!del){if(ci<w.length){ci++;setTimeout(tick,86)}else{del=true;setTimeout(tick,1050)}}else{if(ci>0){ci--;setTimeout(tick,45)}else{del=false;wi=(wi+1)%words.length;setTimeout(tick,140)}}};typed.textContent='';tick()}

/* Evidence. Systemize is served by this repo first; others retain known proof sources. */
const OLD='https://raw.githubusercontent.com/arsh44n/arshaan_portfolio/main/gtm-portfolio/evidence/';
const NEW='https://raw.githubusercontent.com/arsh44n/arshaan-gtm-portfolio/main/evidence/';
const evidenceSources={
 detect:[OLD+'detect.b64.txt'],
 research:[OLD+'research.b64.txt'],
 systemize:['/evidence/systemize.b64.txt?v=4',NEW+'systemize.b64.txt'],
 activate:[OLD+'activate.b64.txt'],
 learn:[OLD+'learn.b64.txt']
};
const imgs={};
async function fetchBase64(sources){let last;for(const path of sources){try{const res=await fetch(path,{cache:'force-cache'});if(!res.ok)throw new Error(String(res.status));const b64=(await res.text()).replace(/\s+/g,'');if(!b64.startsWith('UklGR'))throw new Error('invalid webp');return `data:image/webp;base64,${b64}`}catch(e){last=e}}throw last||new Error('evidence unavailable')}
const stages=[
 {key:'detect',stage:'Detect',num:'01',title:'Start with movement.',caption:'A real signal creates the reason to look closer.',note:'Historical hiring signal reconstructed; original listing not retained.'},
 {key:'research',stage:'Research',num:'02',title:'Decide if the account deserves attention.',caption:'Validate fit before spending attention on outreach.',note:'Sanitized Clay qualification evidence.'},
 {key:'systemize',stage:'Systemize',num:'03',title:'Turn research into reusable inputs.',caption:'Structure the reasoning so the workflow can reuse it.',note:'Sanitized messaging-input workflow evidence.'},
 {key:'activate',stage:'Activate',num:'04',title:'Let the available data choose the action.',caption:'The next step branches from what is actually known.',note:'Privacy-sanitized outbound branching workflow.'},
 {key:'learn',stage:'Learn',num:'05',title:'A response becomes the next signal.',caption:'Feedback tells the system what to sharpen next.',note:'Privacy-redacted first touch → follow-up → reply.'}
];
const jShell=q('.journey-shell'),jCard=q('[data-journey-card]'),jStage=q('[data-j-stage]'),jNum=q('[data-j-num]'),jTitle=q('[data-j-title]'),jCap=q('[data-j-caption]'),jImg=q('[data-j-image]'),jNote=q('[data-j-note]'),jCounter=q('[data-stage-counter]'),proof=q('[data-proof-open]'),fallback=q('[data-proof-fallback]'),labels=qa('[data-label]'),dot=q('[data-stage-dot]'),prog=q('[data-stage-progress]'),stagebar=q('.stagebar');
let lastStage=-1,currentStage=0;
function stagePlaceholder(stage){return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="680" viewBox="0 0 1200 680"><rect width="1200" height="680" fill="#f7fafb"/><text x="600" y="320" text-anchor="middle" font-family="Arial" font-size="28" fill="#8d99ae">${stage} evidence</text><text x="600" y="362" text-anchor="middle" font-family="Arial" font-size="15" fill="#8d99ae">Loading proof…</text></svg>`)}`}
function setProof(src,stage){proof?.classList.add('is-loading');proof?.classList.remove('is-ready');if(jImg){jImg.onload=()=>{proof?.classList.remove('is-loading');proof?.classList.add('is-ready')};jImg.onerror=()=>{proof?.classList.remove('is-loading');if(fallback)fallback.textContent='Evidence unavailable'};jImg.src=src||stagePlaceholder(stage)}}
function renderStage(i){i=clamp(i,0,stages.length-1);currentStage=i;if(i===lastStage&&imgs[stages[i].key])return;lastStage=i;const s=stages[i];jCard?.animate([{opacity:.72,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'ease-out'});if(jStage)jStage.textContent=s.stage;if(jNum)jNum.textContent=s.num;if(jTitle)jTitle.textContent=s.title;if(jCap)jCap.textContent=s.caption;if(jNote)jNote.textContent=s.note;if(jCounter)jCounter.textContent=`Stage ${s.num} / 05`;setProof(imgs[s.key],s.stage);labels.forEach((l,x)=>{l.classList.toggle('active',x===i);l.classList.toggle('passed',x<i)})}
async function loadEvidence(){await Promise.all(stages.map(async(s,i)=>{try{imgs[s.key]=await fetchBase64(evidenceSources[s.key]);if(s.key==='activate'){const e=q('[data-eubrics-image]');if(e)e.src=imgs[s.key]}if(i===currentStage){lastStage=-1;renderStage(i)}}catch(err){console.warn('Evidence failed:',s.key,err)}}))}
function updateJourney(){if(!jShell)return;const r=jShell.getBoundingClientRect(),max=jShell.offsetHeight-innerHeight,raw=max?clamp(-r.top/max):0,p=clamp((raw-.035)/.93),scaled=p*4,i=Math.min(4,Math.floor(scaled+1e-7));renderStage(i);if(stagebar&&dot&&prog&&labels.length){const tr=stagebar.getBoundingClientRect(),centers=labels.map(l=>{const x=l.getBoundingClientRect();return x.left+x.width/2-tr.left}),li=Math.min(4,Math.floor(scaled)),ri=Math.min(4,li+1),local=scaled-li,x=centers[li]+(centers[ri]-centers[li])*local,start=centers[0];dot.style.left=x+'px';prog.style.left=start+'px';prog.style.width=Math.max(0,x-start)+'px';const line=q('.stage-line',stagebar);if(line){line.style.left=start+'px';line.style.right=Math.max(0,tr.width-centers[4])+'px'}}}
renderStage(0);loadEvidence();

/* Evidence lightbox */
const modal=q('[data-proof-modal]'),modalImg=q('[data-proof-modal-image]'),modalCap=q('[data-proof-modal-caption]');
function openProof(){const s=stages[currentStage],src=imgs[s.key];if(!src||!modal||!modalImg)return;modalImg.src=src;if(modalCap)modalCap.textContent=`${s.num} · ${s.stage} — ${s.note}`;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeProof(){if(!modal)return;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
proof?.addEventListener('click',openProof);q('[data-proof-close]')?.addEventListener('click',closeProof);modal?.addEventListener('click',e=>{if(e.target===modal)closeProof()});addEventListener('keydown',e=>{if(e.key==='Escape')closeProof()});

/* Operating belief reveals on arrival, then the same vertical wheel becomes horizontal work motion. */
const beliefLines=q('[data-belief-lines]');if(reduced){beliefLines?.classList.add('is-on')}else if(beliefLines){const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.38){beliefLines.classList.add('is-on');obs.disconnect()}}),{threshold:[.2,.38,.55]});obs.observe(beliefLines)}
const bShell=q('[data-belief-shell]'),bTrack=q('[data-belief-track]');
function updateBeliefTrack(){if(!bShell||!bTrack)return;if(innerWidth<=1050){bTrack.style.transform='none';return}const r=bShell.getBoundingClientRect(),max=bShell.offsetHeight-innerHeight,raw=max?clamp(-r.top/max):0,move=clamp((raw-.20)/.76);bTrack.style.transform=`translate3d(${-move*200/3}%,0,0)`}

/* About stays readable first; only then does the final CTA slide in from the right. */
const closeShell=q('[data-closing-shell]'),closeTrack=q('[data-closing-track]');
function updateClose(){if(!closeShell||!closeTrack)return;if(innerWidth<=1050){closeTrack.style.transform='none';return}const r=closeShell.getBoundingClientRect(),max=closeShell.offsetHeight-innerHeight,raw=max?clamp(-r.top/max):0,move=clamp((raw-.18)/.78);closeTrack.style.transform=`translate3d(${-move*50}%,0,0)`}

/* Navigation */
qa('[data-work-jump]').forEach(a=>a.addEventListener('click',e=>{if(innerWidth<=1050)return;e.preventDefault();const y=bShell.getBoundingClientRect().top+scrollY+(bShell.offsetHeight-innerHeight)*.48;scrollTo({top:y,behavior:reduced?'auto':'smooth'})}));
qa('[data-talk],[data-talk-secondary]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();if(innerWidth<=1050){q('#contact')?.scrollIntoView({behavior:reduced?'auto':'smooth'});return}const y=closeShell.getBoundingClientRect().top+scrollY+(closeShell.offsetHeight-innerHeight)*.98;scrollTo({top:y,behavior:reduced?'auto':'smooth'})}));
qa('[data-top]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:reduced?'auto':'smooth'})}));
q('[data-strategy]')?.addEventListener('click',()=>q('[data-strategy-note]')?.classList.toggle('open'));

let ticking=false;function update(){updateJourney();updateBeliefTrack();updateClose();ticking=false}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});addEventListener('resize',update,{passive:true});update();
})();