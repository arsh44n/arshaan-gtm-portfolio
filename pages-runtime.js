(()=>{
  'use strict';

  const EMAIL='arsh44n.me@gmail.com';
  const resumeHref=new URL('assets/Arshaan-Khan-GTM-Resume.pdf',document.baseURI).href;
  const resumeRequest=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent('Requesting Arshaan Khan resume')}`;
  let resumeAvailable=false;

  async function detectResume(){
    try{
      const res=await fetch(resumeHref,{method:'HEAD',cache:'no-store'});
      resumeAvailable=res.ok&&/pdf/i.test(res.headers.get('content-type')||'application/pdf');
    }catch(_){
      resumeAvailable=false;
    }
    document.querySelectorAll('[data-resume-download]').forEach(el=>{
      el.textContent=resumeAvailable?'Resume ↓':'Resume on request ↗';
      if(el.tagName==='A'){
        el.href=resumeAvailable?resumeHref:resumeRequest;
        if(resumeAvailable){
          el.setAttribute('download','Arshaan-Khan-GTM-Resume.pdf');
          el.removeAttribute('target');
        }else{
          el.removeAttribute('download');
          el.setAttribute('target','_blank');
          el.setAttribute('rel','noopener');
        }
      }
    });
  }
  detectResume();

  /* Own resume clicks in capture phase so final.js' legacy downloader can never fire on Pages. */
  document.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-resume-download]');
    if(!trigger)return;
    event.preventDefault();
    event.stopImmediatePropagation();

    if(resumeAvailable){
      const link=document.createElement('a');
      link.href=resumeHref;
      link.download='Arshaan-Khan-GTM-Resume.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    }else{
      window.open(resumeRequest,'_blank','noopener');
    }
  },true);

  /* Final high-resolution proof journey. It only replaces the legacy journey
     after all six PNGs are available, so an incomplete asset upload can never
     break the live portfolio. */
  const journeySlides=[
    {num:'00',stage:'Example',kind:'Slide',file:'evidence/slide-00-example-from-signal-to-meeting.png',alt:'From Signal to Meeting example proof'},
    {num:'01',stage:'Detect',kind:'Stage',file:'evidence/stage-01-detect-meaningful-signals.png',alt:'Stage 01 Detect proof'},
    {num:'02',stage:'Research',kind:'Stage',file:'evidence/stage-02-find-the-right-contacts.png',alt:'Stage 02 Research proof'},
    {num:'03',stage:'Systemize',kind:'Stage',file:'evidence/stage-03-turn-the-motion-into-a-system.png',alt:'Stage 03 Systemize proof'},
    {num:'04',stage:'Activate',kind:'Stage',file:'evidence/stage-04-activate-the-workflow.png',alt:'Stage 04 Activate proof'},
    {num:'05',stage:'Learn',kind:'Stage',file:'evidence/stage-05-learn-from-outcomes.png',alt:'Stage 05 Learn proof'}
  ].map(slide=>({...slide,src:new URL(slide.file,document.baseURI).href}));

  function preloadImage(src){
    return new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>resolve(true);
      img.onerror=()=>resolve(false);
      img.src=src;
    });
  }

  async function integrateJourneyV2(){
    const legacy=document.querySelector('.journey-shell#proof');
    if(!legacy)return;

    const availability=await Promise.all(journeySlides.map(slide=>preloadImage(slide.src)));
    if(availability.some(ok=>!ok)){
      console.info('Final proof journey waiting for all six evidence PNGs.');
      return;
    }

    const section=document.createElement('section');
    section.className='journey-v2';
    section.id='proof';
    section.innerHTML=`
      <div class="journey-v2-sticky">
        <div class="journey-v2-top">
          <p class="eyebrow">A real lead journey</p>
          <h2>One reason. Five decisions.</h2>
        </div>
        <div class="journey-v2-stagebar" aria-label="Lead journey stages">
          <div class="journey-v2-line"></div>
          <div class="journey-v2-progress" data-v2-progress></div>
          <div class="journey-v2-dot" data-v2-dot></div>
          <div class="journey-v2-labels">
            ${journeySlides.map((slide,index)=>`<div class="journey-v2-label${index===0?' active':''}" data-v2-label><span>${slide.num}</span><strong>${slide.stage}</strong></div>`).join('')}
          </div>
        </div>
        <article class="journey-v2-card">
          <div class="journey-v2-meta"><span data-v2-stage>Example</span><span data-v2-num>00</span></div>
          <button class="journey-v2-proof" type="button" data-v2-open aria-label="Open proof full screen">
            <img data-v2-image src="${journeySlides[0].src}" alt="${journeySlides[0].alt}" decoding="async" fetchpriority="high">
            <span class="journey-v2-zoom">Inspect proof ↗</span>
          </button>
        </article>
        <div class="journey-v2-foot"><span data-v2-counter>Slide 00 / 05</span><span>Signal → decision → proof.</span></div>
      </div>`;

    legacy.replaceWith(section);

    if(!document.getElementById('journey-v2-styles')){
      const style=document.createElement('style');
      style.id='journey-v2-styles';
      style.textContent=`
        .journey-v2{height:620svh;position:relative;background:var(--page)}
        .journey-v2-sticky{position:sticky;top:0;height:100svh;padding:92px 24px 14px;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;overflow:hidden;background-color:var(--page);background-image:radial-gradient(circle at 14% 18%,rgba(239,35,60,.045),transparent 24%),radial-gradient(circle at 86% 72%,rgba(61,213,243,.05),transparent 26%),linear-gradient(rgba(43,45,66,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(43,45,66,.018) 1px,transparent 1px);background-size:auto,auto,56px 56px,56px 56px}
        html[data-theme="dark"] .journey-v2-sticky{background-image:radial-gradient(circle at 14% 18%,rgba(193,18,31,.06),transparent 24%),radial-gradient(circle at 86% 72%,rgba(61,213,243,.055),transparent 26%),linear-gradient(rgba(102,155,188,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(102,155,188,.018) 1px,transparent 1px)}
        .journey-v2-top{width:var(--container);margin:0 auto 6px}
        .journey-v2-top .eyebrow{margin-bottom:7px}
        .journey-v2-top h2{margin:0;font-size:clamp(42px,4.2vw,66px);line-height:.95;letter-spacing:-.064em;white-space:nowrap}
        .journey-v2-stagebar{width:var(--container);margin:0 auto 7px;padding:8px 0 1px;position:relative}
        .journey-v2-line,.journey-v2-progress{position:absolute;top:14px;height:2px;border-radius:999px}
        .journey-v2-line{left:0;right:0;background:var(--line)}
        .journey-v2-progress{left:0;width:0;background:linear-gradient(90deg,var(--red2),var(--red),var(--cyan2))}
        .journey-v2-dot{position:absolute;top:7px;left:0;width:16px;height:16px;border-radius:50%;transform:translateX(-50%);background:radial-gradient(circle at 35% 35%,#fff,var(--red) 58%,var(--red2));box-shadow:0 0 0 8px rgba(239,35,60,.10),0 8px 20px rgba(217,4,41,.18)}
        .journey-v2-labels{display:grid;grid-template-columns:repeat(6,1fr);position:relative;z-index:2}
        .journey-v2-label{text-align:center;padding-top:14px;font-family:"DM Mono",monospace;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:color-mix(in srgb,var(--text) 40%,transparent)}
        .journey-v2-label strong{display:block;margin-top:4px;font-family:Inter,sans-serif;font-size:11px;letter-spacing:-.025em;color:color-mix(in srgb,var(--text) 72%,transparent)}
        .journey-v2-label.active,.journey-v2-label.passed{color:var(--red)}
        .journey-v2-label.active strong,.journey-v2-label.passed strong{color:var(--text)}
        .journey-v2-card{width:var(--container);height:100%;min-height:0;margin:0 auto;border:1px solid var(--line);border-radius:28px;background:color-mix(in srgb,var(--panel) 88%,transparent);box-shadow:var(--shadow);padding:10px 12px 12px;display:grid;grid-template-rows:auto minmax(0,1fr);overflow:hidden}
        .journey-v2-meta{display:flex;justify-content:space-between;padding:0 4px 6px;font-family:"DM Mono",monospace;font-size:8px;text-transform:uppercase;letter-spacing:.11em;color:var(--muted)}
        .journey-v2-proof{position:relative;min-height:0;width:100%;height:100%;margin:0;border:0;border-radius:20px;background:transparent;overflow:hidden;display:grid;place-items:center;padding:0;cursor:zoom-in;appearance:none;color:inherit}
        .journey-v2-proof img{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;border-radius:18px;background:#fff;box-shadow:0 12px 34px rgba(43,45,66,.10);transition:opacity .18s ease,transform .30s ease}
        .journey-v2-proof:hover img{transform:scale(1.004)}
        .journey-v2-zoom{position:absolute;right:14px;bottom:12px;padding:8px 11px;border-radius:999px;background:rgba(0,0,0,.72);color:#fff;font-size:10px;font-weight:700;opacity:0;transform:translateY(4px);transition:.22s}
        .journey-v2-proof:hover .journey-v2-zoom{opacity:1;transform:none}
        .journey-v2-foot{width:var(--container);margin:4px auto 0;display:flex;justify-content:space-between;font-family:"DM Mono",monospace;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
        @media(max-width:1050px){
          .journey-v2{height:620svh}
          .journey-v2-sticky{padding:84px 14px 12px;background-size:auto,auto,44px 44px,44px 44px}
          .journey-v2-top{width:min(100% - 20px,1320px)}
          .journey-v2-top h2{font-size:clamp(34px,6.6vw,54px);white-space:normal}
          .journey-v2-stagebar{width:min(100% - 20px,1320px)}
          .journey-v2-label{font-size:7px}.journey-v2-label strong{font-size:9px}
          .journey-v2-card{width:min(100% - 20px,1320px);padding:8px 8px 10px}
          .journey-v2-foot{width:min(100% - 20px,1320px);font-size:7px}
        }
        @media(max-width:680px){
          .journey-v2-sticky{padding:76px 8px 10px}
          .journey-v2-top{margin-bottom:2px}.journey-v2-top .eyebrow{font-size:8px;margin-bottom:4px}.journey-v2-top h2{font-size:34px}
          .journey-v2-stagebar{margin-bottom:4px;padding-top:5px}.journey-v2-line,.journey-v2-progress{top:10px}.journey-v2-dot{top:3px}
          .journey-v2-label{padding-top:12px;font-size:6px}.journey-v2-label strong{font-size:7px}
          .journey-v2-card{border-radius:20px;padding:6px}.journey-v2-meta{font-size:7px;padding-bottom:4px}.journey-v2-proof{border-radius:14px}.journey-v2-proof img{border-radius:12px}
          .journey-v2-zoom{display:none}.journey-v2-foot{font-size:6px}
        }
      `;
      document.head.appendChild(style);
    }

    const image=section.querySelector('[data-v2-image]');
    const stageName=section.querySelector('[data-v2-stage]');
    const stageNum=section.querySelector('[data-v2-num]');
    const counter=section.querySelector('[data-v2-counter]');
    const labels=[...section.querySelectorAll('[data-v2-label]')];
    const stagebar=section.querySelector('.journey-v2-stagebar');
    const dot=section.querySelector('[data-v2-dot]');
    const progress=section.querySelector('[data-v2-progress]');
    const open=section.querySelector('[data-v2-open]');
    let current=-1;

    function render(index){
      if(index===current)return;
      current=index;
      const slide=journeySlides[index];
      image.style.opacity='.42';
      image.src=slide.src;
      image.alt=slide.alt;
      stageName.textContent=slide.stage;
      stageNum.textContent=slide.num;
      counter.textContent=`${slide.kind} ${slide.num} / 05`;
      labels.forEach((label,i)=>{
        label.classList.toggle('active',i===index);
        label.classList.toggle('passed',i<index);
      });
      requestAnimationFrame(()=>{image.style.opacity='1'});
    }

    function update(){
      const rect=section.getBoundingClientRect();
      const max=Math.max(1,section.offsetHeight-innerHeight);
      const raw=Math.max(0,Math.min(1,-rect.top/max));
      const index=Math.min(journeySlides.length-1,Math.floor(raw*journeySlides.length));
      render(index);

      const track=stagebar.getBoundingClientRect();
      const centers=labels.map(label=>{
        const r=label.getBoundingClientRect();
        return r.left+r.width/2-track.left;
      });
      if(centers.length){
        const position=raw*(centers.length-1);
        const leftIndex=Math.min(centers.length-1,Math.floor(position));
        const rightIndex=Math.min(centers.length-1,leftIndex+1);
        const local=position-leftIndex;
        const x=centers[leftIndex]+(centers[rightIndex]-centers[leftIndex])*local;
        const start=centers[0];
        dot.style.left=`${x}px`;
        progress.style.left=`${start}px`;
        progress.style.width=`${Math.max(0,x-start)}px`;
        const line=section.querySelector('.journey-v2-line');
        line.style.left=`${start}px`;
        line.style.right=`${Math.max(0,track.width-centers.at(-1))}px`;
      }
    }

    let ticking=false;
    const requestUpdate=()=>{
      if(ticking)return;
      ticking=true;
      requestAnimationFrame(()=>{update();ticking=false});
    };
    addEventListener('scroll',requestUpdate,{passive:true});
    addEventListener('resize',requestUpdate,{passive:true});
    render(0);
    update();

    open.addEventListener('click',()=>{
      const modal=document.querySelector('[data-proof-modal]');
      const modalImage=document.querySelector('[data-proof-modal-image]');
      const modalCaption=document.querySelector('[data-proof-modal-caption]');
      if(!modal||!modalImage)return;
      const slide=journeySlides[current<0?0:current];
      modalImage.src=slide.src;
      modalImage.alt=slide.alt;
      if(modalCaption)modalCaption.textContent=`${slide.num} · ${slide.stage}`;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    });
  }
  integrateJourneyV2();

  /* LeadOS is now a real public coming-soon surface, not a portfolio placeholder. */
  function integrateLeadOS(){
    const card=document.querySelector('.project-leados');
    if(!card)return;

    const site='https://arsh44n.github.io/leados-coming-soon/';
    const repo='https://github.com/arsh44n/LeadOS';
    const meta=card.querySelector('.project-meta span:first-child');
    const copy=card.querySelector(':scope > p');
    const actions=card.querySelector('.project-actions');
    const visual=card.querySelector('.project-visual');

    if(meta)meta.textContent='Private build · live surface';
    if(copy)copy.textContent='A signal-first GTM workspace connecting accounts, research, fit and next action inside one live operating surface.';

    if(actions){
      actions.innerHTML=`<a class="btn cyan" href="${site}" target="_blank" rel="noopener">Visit website ↗</a><a class="btn red" href="${repo}" target="_blank" rel="noopener">GitHub ↗</a>`;
    }

    if(visual){
      visual.innerHTML=`<a class="leados-live-preview" href="${site}" target="_blank" rel="noopener" aria-label="Open the LeadOS coming-soon site"><iframe src="${site}" title="LeadOS coming-soon live preview" loading="lazy" tabindex="-1" aria-hidden="true"></iframe><div class="leados-preview-tag"><span>LEADOS · LIVE PREVIEW</span><strong>Signals → context → coordinated action</strong></div></a>`;
    }

    if(!document.getElementById('leados-live-preview-styles')){
      const style=document.createElement('style');
      style.id='leados-live-preview-styles';
      style.textContent=`
        .project-leados .project-visual{position:relative;background:linear-gradient(180deg,#d9e7ee,#adc2cb);border-color:rgba(61,213,243,.22)}
        .leados-live-preview{position:relative;display:block;width:100%;height:100%;min-height:220px;overflow:hidden;background:linear-gradient(180deg,#d9e7ee,#adc2cb);isolation:isolate}
        .leados-live-preview iframe{position:absolute;left:50%;top:50%;width:1440px;height:820px;border:0;transform:translate(-56%,-50%) scale(.46);transform-origin:center;pointer-events:none;background:#d9e7ee}
        .leados-live-preview:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 54%,rgba(3,12,24,.52));z-index:1}
        .leados-preview-tag{position:absolute;left:14px;right:14px;bottom:13px;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(3,12,24,.68);backdrop-filter:blur(12px);color:#edf2f4}
        .leados-preview-tag span{font-family:"DM Mono",monospace;font-size:7px;letter-spacing:.13em;color:rgba(237,242,244,.66);white-space:nowrap}
        .leados-preview-tag strong{font-size:10px;line-height:1.2;text-align:right;letter-spacing:-.01em}
        @media(max-width:1050px){.leados-live-preview iframe{transform:translate(-56%,-50%) scale(.50)}}
        @media(max-width:680px){.leados-live-preview iframe{width:1180px;height:760px;transform:translate(-56%,-50%) scale(.46)}.leados-preview-tag{left:10px;right:10px;bottom:10px}.leados-preview-tag strong{font-size:9px}}
      `;
      document.head.appendChild(style);
    }
  }
  integrateLeadOS();

  function revealContactCopy(){
    const contact=document.getElementById('contact');
    if(!contact)return;
    contact.querySelectorAll('[data-write]').forEach(el=>el.classList.add('write-on'));
  }

  function goToContact(){
    const contact=document.getElementById('contact');
    if(!contact)return;

    revealContactCopy();

    const shell=document.querySelector('[data-closing-shell]');
    if(innerWidth>1050&&shell){
      const max=Math.max(0,shell.offsetHeight-innerHeight);
      const y=shell.getBoundingClientRect().top+scrollY+max*.985;
      scrollTo({top:y,behavior:'smooth'});
    }else{
      contact.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }

  /* The closing area is a horizontal sticky scene. scrollIntoView(#contact)
     targets its DOM position, not the scroll progress that reveals the second panel.
     Use the shell's actual progress instead. */
  document.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-talk],[data-talk-secondary]');
    if(!trigger)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    goToContact();
  },true);
})();
