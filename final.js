(()=>{
'use strict';
const q=(s,c=document)=>c.querySelector(s);
const qa=(s,c=document)=>[...c.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Last-mile visual layer: loaded after the canonical stylesheet. */
if(!q('link[data-refine-css]')){
  const link=document.createElement('link');
  link.rel='stylesheet';link.href='refine.css?v=7';link.dataset.refineCss='';
  document.head.appendChild(link);
}

/* Theme */
const theme=q('button[data-theme]'),light=q('[data-light]'),dark=q('[data-dark]');
function paintTheme(){
  const isDark=document.documentElement.dataset.theme==='dark';
  light?.classList.toggle('is-active',!isDark);
  dark?.classList.toggle('is-active',isDark);
  try{localStorage.setItem('ak-theme',isDark?'dark':'light')}catch(_){ }
}
paintTheme();theme?.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';paintTheme()});

/* Generic one-time write-on. Belief/About/final are scroll-scrubbed separately. */
function wrapWords(el,className='write-word'){
  if(!el||el.dataset.wordWrapped)return [];
  const words=[];
  const walk=node=>{[...node.childNodes].forEach(ch=>{
    if(ch.nodeType===3&&ch.textContent.trim()){
      const frag=document.createDocumentFragment();
      ch.textContent.split(/(\s+)/).forEach(token=>{
        if(/^\s+$/.test(token))frag.append(token);
        else if(token){const span=document.createElement('span');span.className=className;span.textContent=token;if(className==='write-word')span.style.setProperty('--write-i',String(words.length));frag.append(span);words.push(span)}
      });ch.replaceWith(frag);
    }else if(ch.nodeType===1)walk(ch);
  })};
  walk(el);el.dataset.wordWrapped='1';return words;
}
const genericWrites=qa('[data-write]').filter(el=>!el.closest('.belief-panel')&&!el.closest('.about-panel')&&!el.closest('.final-panel'));
genericWrites.forEach(el=>wrapWords(el));
if(reduced)genericWrites.forEach(el=>el.classList.add('write-on'));
else{const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>.18){entry.target.classList.add('write-on');obs.unobserve(entry.target)}}),{threshold:[.08,.18,.32]});genericWrites.forEach(el=>obs.observe(el))}

/* Hero interpreter word */
const typed=q('[data-typed]');
if(typed&&!reduced){const options=['signal','reason','trigger'];let wi=0,ci=0,deleting=false;const tick=()=>{const word=options[wi];typed.textContent=word.slice(0,ci);if(!deleting){if(ci<word.length){ci++;setTimeout(tick,86)}else{deleting=true;setTimeout(tick,1050)}}else if(ci>0){ci--;setTimeout(tick,45)}else{deleting=false;wi=(wi+1)%options.length;setTimeout(tick,140)}};typed.textContent='';tick()}

/* Evidence — current placeholders; raw originals can replace these without layout changes. */
const OLD='https://raw.githubusercontent.com/arsh44n/arshaan_portfolio/main/gtm-portfolio/evidence/';
const NEW='https://raw.githubusercontent.com/arsh44n/arshaan-gtm-portfolio/main/evidence/';
const evidenceSources={detect:[OLD+'detect.b64.txt'],research:[OLD+'research.b64.txt'],systemize:['/evidence/systemize.b64.txt?v=7',NEW+'systemize.b64.txt',OLD+'systemize.b64.txt'],activate:[OLD+'activate.b64.txt'],learn:[OLD+'learn.b64.txt']};
const evidence={};
async function fetchBase64(paths){let lastError;for(const path of paths){try{const res=await fetch(path,{cache:'no-store'});if(!res.ok)throw new Error(String(res.status));const b64=(await res.text()).replace(/\s+/g,'');if(!b64.startsWith('UklGR'))throw new Error('invalid webp');return `data:image/webp;base64,${b64}`}catch(err){lastError=err}}throw lastError||new Error('evidence unavailable')}
const stages=[
  {key:'detect',stage:'Detect',num:'01',title:'Start with movement.',caption:'A real signal creates the reason to look closer.',note:'Historical hiring signal reconstructed; original listing not retained.'},
  {key:'research',stage:'Research',num:'02',title:'Decide if the account deserves attention.',caption:'Validate fit before spending attention on outreach.',note:'Clay qualification evidence.'},
  {key:'systemize',stage:'Systemize',num:'03',title:'Turn research into reusable inputs.',caption:'Structure the reasoning so the workflow can reuse it.',note:'Messaging-input workflow evidence.'},
  {key:'activate',stage:'Activate',num:'04',title:'Let the available data choose the action.',caption:'The next step branches from what is actually known.',note:'Outbound branching workflow evidence.'},
  {key:'learn',stage:'Learn',num:'05',title:'A response becomes the next signal.',caption:'Feedback tells the system what to sharpen next.',note:'First touch → follow-up → reply.'}
];
const jShell=q('.journey-shell'),jStage=q('[data-j-stage]'),jNum=q('[data-j-num]'),jTitle=q('[data-j-title]'),jCap=q('[data-j-caption]'),jImg=q('[data-j-image]'),jNote=q('[data-j-note]'),jCounter=q('[data-stage-counter]'),proof=q('[data-proof-open]'),fallback=q('[data-proof-fallback]'),labels=qa('[data-label]'),stagebar=q('.stagebar'),dot=q('[data-stage-dot]'),progress=q('[data-stage-progress]');
let currentStage=0,lastStage=-1;
function placeholder(name){return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="680"><rect width="1200" height="680" fill="#f7fafb"/><text x="600" y="325" text-anchor="middle" font-family="Arial" font-size="28" fill="#8d99ae">${name} evidence</text><text x="600" y="365" text-anchor="middle" font-family="Arial" font-size="15" fill="#8d99ae">Proof asset is being replaced</text></svg>`)}`}
function setProof(src,stage){if(!jImg)return;proof?.classList.add('is-loading');proof?.classList.remove('is-ready','is-placeholder');jImg.onload=()=>{proof?.classList.remove('is-loading');proof?.classList.add('is-ready')};jImg.onerror=()=>{jImg.onerror=null;jImg.src=placeholder(stage);proof?.classList.remove('is-loading');proof?.classList.add('is-ready','is-placeholder');if(fallback)fallback.textContent='Proof asset is being replaced'};jImg.src=src||placeholder(stage)}
function renderStage(i){i=clamp(i,0,4);currentStage=i;const s=stages[i];if(i===lastStage&&evidence[s.key])return;lastStage=i;if(jStage)jStage.textContent=s.stage;if(jNum)jNum.textContent=s.num;if(jTitle)jTitle.textContent=s.title;if(jCap)jCap.textContent=s.caption;if(jNote)jNote.textContent=s.note;if(jCounter)jCounter.textContent=`Stage ${s.num} / 05`;setProof(evidence[s.key],s.stage);labels.forEach((label,x)=>{label.classList.toggle('active',x===i);label.classList.toggle('passed',x<i)})}
async function loadEvidence(){await Promise.all(stages.map(async(s,i)=>{try{evidence[s.key]=await fetchBase64(evidenceSources[s.key]);if(s.key==='activate'){const e=q('[data-eubrics-image]');if(e)e.src=evidence[s.key]}if(i===currentStage){lastStage=-1;renderStage(i)}}catch(err){console.warn('Evidence failed:',s.key,err)}}))}
function updateJourney(){if(!jShell)return;const rect=jShell.getBoundingClientRect(),max=Math.max(1,jShell.offsetHeight-innerHeight),raw=clamp(-rect.top/max),p=clamp((raw-.035)/.93),scaled=p*4,index=Math.min(4,Math.floor(scaled+1e-7));renderStage(index);if(stagebar&&dot&&progress&&labels.length){const track=stagebar.getBoundingClientRect(),centers=labels.map(label=>{const r=label.getBoundingClientRect();return r.left+r.width/2-track.left}),li=Math.min(4,Math.floor(scaled)),ri=Math.min(4,li+1),local=scaled-li,x=centers[li]+(centers[ri]-centers[li])*local,start=centers[0];dot.style.left=x+'px';progress.style.left=start+'px';progress.style.width=Math.max(0,x-start)+'px';const line=q('.stage-line',stagebar);if(line){line.style.left=start+'px';line.style.right=Math.max(0,track.width-centers[4])+'px'}}}
renderStage(0);loadEvidence();

/* Proof lightbox */
const proofModal=q('[data-proof-modal]'),proofModalImg=q('[data-proof-modal-image]'),proofModalCaption=q('[data-proof-modal-caption]');
function openProof(){const s=stages[currentStage],src=evidence[s.key];if(!src||!proofModal||!proofModalImg)return;proofModalImg.src=src;if(proofModalCaption)proofModalCaption.textContent=`${s.num} · ${s.stage} — ${s.note}`;proofModal.classList.add('is-open');proofModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeProof(){if(!proofModal)return;proofModal.classList.remove('is-open');proofModal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
proof?.addEventListener('click',openProof);q('[data-proof-close]')?.addEventListener('click',closeProof);proofModal?.addEventListener('click',e=>{if(e.target===proofModal)closeProof()});addEventListener('keydown',e=>{if(e.key==='Escape')closeProof()});

/* Selected Work content corrections */
const leadCard=q('.project-leados');
if(leadCard){const primary=q('.project-actions a.cyan',leadCard);if(primary){primary.removeAttribute('target');primary.removeAttribute('rel');primary.href='#';primary.textContent='Visit website ↗';primary.dataset.leadosPlaceholder='';primary.addEventListener('click',e=>{e.preventDefault();q('.lead-site-note',leadCard)?.classList.toggle('open')})}if(!q('.lead-site-note',leadCard)){const note=document.createElement('div');note.className='lead-site-note';note.textContent='LeadOS website · coming soon';q('.project-actions',leadCard)?.insertAdjacentElement('afterend',note)}}
const techCard=q('.project-techie');
if(techCard){const assignment=q('[data-strategy]',techCard);if(assignment)assignment.textContent='View assignment';const secondary=q('.project-actions a',techCard);if(secondary){secondary.href='https://ramp.com/';secondary.target='_blank';secondary.rel='noopener';secondary.textContent='Ramp ↗';secondary.removeAttribute('data-talk-secondary')}const note=q('[data-strategy-note]',techCard);if(note)note.innerHTML='<strong>Private assessment</strong><br>Available on request.';const visual=q('.project-visual',techCard);if(visual)visual.innerHTML='<div class="private-docs"><span class="private-lock" aria-hidden="true">↗</span><small>TECHIEBUTLER × RAMP</small><strong>Private assessment</strong><p>Available on request.</p></div>'}

/* Scroll typography helper */
function scrubWords(words,p,rise=.34){const cursor=clamp(p)*(words.length+1.1);words.forEach((word,i)=>{const local=clamp((cursor-i)/1.08);word.style.opacity=String(reduced?1:local);word.style.transform=reduced?'none':`translate3d(0,${(1-local)*rise}em,0)`;word.style.transition='none'})}

/* Operating Belief — scroll-scrubbed word by word. */
const beliefShell=q('[data-belief-shell]'),beliefTrack=q('[data-belief-track]'),beliefPanel=q('.belief-panel'),beliefLines=q('[data-belief-lines]');
qa('[data-belief-write]').forEach(el=>wrapWords(el,'belief-word'));const beliefWords=beliefLines?qa('.belief-word',beliefLines):[];
function beliefProgress(){if(!beliefShell||!beliefPanel)return 1;if(innerWidth>1050){const r=beliefShell.getBoundingClientRect(),max=Math.max(1,beliefShell.offsetHeight-innerHeight),raw=clamp(-r.top/max);return clamp((raw-.018)/.245)}const r=beliefPanel.getBoundingClientRect();return clamp((innerHeight*.80-r.top)/(innerHeight*.70))}
function updateBelief(){scrubWords(beliefWords,beliefProgress());if(!beliefShell||!beliefTrack)return;if(innerWidth<=1050){beliefTrack.style.transform='none';return}const r=beliefShell.getBoundingClientRect(),max=Math.max(1,beliefShell.offsetHeight-innerHeight),raw=clamp(-r.top/max),move=clamp((raw-.31)/.69);beliefTrack.style.transform=`translate3d(${-move*200/3}%,0,0)`}

/* About + final CTA — same scroll-scrub language as Operating Belief. */
const closingShell=q('[data-closing-shell]'),closingTrack=q('[data-closing-track]'),aboutPanel=q('.about-panel'),aboutTitle=q('.about-title'),aboutMantra=q('.about-mantra'),aboutMeta=q('.about-meta'),finalPanel=q('.final-panel'),finalCard=q('[data-final-card]'),finalTitle=q('.final-inner h2');
const aboutWords=[...wrapWords(aboutTitle,'scrub-word'),...wrapWords(aboutMantra,'scrub-word'),...wrapWords(aboutMeta,'scrub-word')];const finalWords=wrapWords(finalTitle,'scrub-word');
function closingRaw(){if(!closingShell)return 0;const r=closingShell.getBoundingClientRect(),max=Math.max(1,closingShell.offsetHeight-innerHeight);return clamp(-r.top/max)}
function viewportProgress(el,start=.78,end=.30){if(!el)return 1;const r=el.getBoundingClientRect();return clamp((innerHeight*start-r.top)/(innerHeight*(start-end)))}
function updateClosing(){if(innerWidth<=1050){scrubWords(aboutWords,viewportProgress(aboutPanel,.82,.28),.26);scrubWords(finalWords,viewportProgress(finalPanel,.82,.30),.26);if(closingTrack)closingTrack.style.transform='none';if(finalCard){finalCard.style.transform='none';finalCard.style.opacity='1'}return}const raw=closingRaw();scrubWords(aboutWords,clamp((raw-.015)/.31),.26);const move=clamp((raw-.42)/.55);if(closingTrack)closingTrack.style.transform=`translate3d(${-move*50}%,0,0)`;scrubWords(finalWords,clamp((move-.30)/.48),.26);if(finalCard){const scale=.955+move*.045,raise=(1-move)*16;finalCard.style.transform=`translateY(${raise}px) scale(${scale})`;finalCard.style.opacity=String(.78+move*.22)}}

/* Contact channels: each button owns its visible detail. */
const EMAIL='arsh44n.me@gmail.com',PHONE='+91 88378 66368',WA='https://wa.me/918837866368',LINKEDIN='https://www.linkedin.com/in/arsh44n/';
async function copyText(text){try{await navigator.clipboard.writeText(text);return true}catch(_){try{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok}catch(__){return false}}}
function buildContactGrid(){const actions=q('.final-actions'),meta=q('.contact-meta');if(!actions)return;actions.className='contact-grid';actions.innerHTML=`<div class="contact-channel"><a class="btn cyan contact-primary" href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=GTM%20opportunity" target="_blank" rel="noopener">Email me ↗</a><a class="contact-detail" href="mailto:${EMAIL}">${EMAIL}</a><button class="micro-action" type="button" data-copy-email>Copy address</button></div><div class="contact-channel"><a class="btn red" href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn ↗</a><a class="contact-detail" href="${LINKEDIN}" target="_blank" rel="noopener">linkedin.com/in/arsh44n</a></div><div class="contact-channel"><a class="btn contact-ghost" href="${WA}" target="_blank" rel="noopener">WhatsApp ↗</a><a class="contact-detail" href="tel:+918837866368">${PHONE}</a></div><div class="contact-channel"><a class="btn contact-ghost" href="/assets/Arshaan-Khan-GTM-Resume.pdf" download="Arshaan-Khan-GTM-Resume.pdf" data-resume-link>Résumé ↓</a><span class="contact-detail">Current résumé · PDF</span></div>`;meta?.remove();q('[data-copy-email]')?.addEventListener('click',async e=>{const btn=e.currentTarget,original=btn.textContent,ok=await copyText(EMAIL);btn.textContent=ok?'Copied ✓':EMAIL;setTimeout(()=>btn.textContent=original,1400)})}
buildContactGrid();qa('[data-resume-download]').forEach(el=>{el.href='/assets/Arshaan-Khan-GTM-Resume.pdf';el.setAttribute('download','Arshaan-Khan-GTM-Resume.pdf')});

/* Navigation */
qa('[data-work-jump]').forEach(a=>a.addEventListener('click',e=>{if(innerWidth<=1050)return;e.preventDefault();const y=beliefShell.getBoundingClientRect().top+scrollY+(beliefShell.offsetHeight-innerHeight)*.56;scrollTo({top:y,behavior:reduced?'auto':'smooth'})}));
qa('[data-talk]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();if(innerWidth<=1050){q('#contact')?.scrollIntoView({behavior:reduced?'auto':'smooth'});return}const y=closingShell.getBoundingClientRect().top+scrollY+(closingShell.offsetHeight-innerHeight)*.98;scrollTo({top:y,behavior:reduced?'auto':'smooth'})}));
q('[data-strategy]')?.addEventListener('click',()=>q('[data-strategy-note]')?.classList.toggle('open'));

let ticking=false;function update(){updateJourney();updateBelief();updateClosing();ticking=false}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});addEventListener('resize',update,{passive:true});update();
})();