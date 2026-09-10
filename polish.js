(()=>{
  const q=(s,c=document)=>c.querySelector(s);
  const qa=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cleanBelief(){
    const panel=q('.belief-panel');
    if(!panel)return;
    panel.classList.add('belief-auto');
    const words=qa('.belief-word',panel);
    if(!words.length)return;
    let started=false;
    const reveal=()=>{
      if(started)return;
      started=true;
      words.forEach((word,i)=>setTimeout(()=>word.classList.add('polish-on'),reduced?0:i*58));
    };
    if(reduced){reveal();return}
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting&&entry.intersectionRatio>=.46){reveal();obs.disconnect()}
    }),{threshold:[.2,.46,.65]});
    obs.observe(panel);
  }

  function refreshAbout(){
    const about=q('.about-inner');
    if(!about)return;
    const h2=q('h2',about);
    const ps=qa('p[data-auto-words]',about);
    if(h2){
      h2.textContent='I build where GTM strategy meets execution.';
      h2.removeAttribute('data-wordified');
      h2.classList.remove('auto-on');
    }
    if(ps[0]){
      ps[0].textContent='I’ve run outbound manually, so I design around the places it actually breaks: qualification, research, routing, personalization, execution state, and feedback.';
      ps[0].removeAttribute('data-wordified');
      ps[0].classList.remove('auto-on');
    }
    if(ps[1]){
      ps[1].textContent='The goal is not to automate everything. It is to make the next decision clearer, faster, and inspectable.';
      ps[1].removeAttribute('data-wordified');
      ps[1].classList.remove('auto-on');
    }

    const targets=[h2,...ps].filter(Boolean);
    targets.forEach(el=>{
      const words=el.textContent.trim().split(/\s+/);
      el.textContent='';
      words.forEach((word,i)=>{
        const s=document.createElement('span');
        s.className='polish-word';
        s.textContent=word;
        s.style.setProperty('--pw',i);
        el.appendChild(s);
        if(i<words.length-1)el.append(' ');
      });
    });
    const style=document.createElement('style');
    style.textContent=`
      .about-inner .polish-word{display:inline-block;opacity:0;transform:translateY(.35em);transition:opacity .36s ease,transform .42s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--pw)*26ms)}
      .about-inner.about-on .polish-word{opacity:1;transform:none}
    `;
    document.head.appendChild(style);
    if(reduced){about.classList.add('about-on');return}
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting&&entry.intersectionRatio>.38){about.classList.add('about-on');obs.disconnect()}
    }),{threshold:[.2,.38,.55]});
    obs.observe(about);
  }

  function restartFlowWhenVisible(){
    const flow=q('.flow-cont');
    if(!flow)return;
    flow.style.scrollMarginTop='72px';
  }

  addEventListener('DOMContentLoaded',()=>{
    cleanBelief();
    refreshAbout();
    restartFlowWhenVisible();
  },{once:true});
})();
