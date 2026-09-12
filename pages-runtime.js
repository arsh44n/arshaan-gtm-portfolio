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
