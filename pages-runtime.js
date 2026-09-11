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
