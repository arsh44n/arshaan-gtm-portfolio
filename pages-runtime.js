(()=>{
  'use strict';

  const resumeHref = new URL('assets/Arshaan-Khan-GTM-Resume.pdf', document.baseURI).href;

  document.querySelectorAll('[data-resume-download]').forEach(el => {
    el.textContent = 'Resume ↓';
    if (el.tagName === 'A') {
      el.href = resumeHref;
      el.setAttribute('download', 'Arshaan-Khan-GTM-Resume.pdf');
    }
  });

  // Capture before final.js' legacy resume handler so Pages always serves
  // the build-generated, checksum-verified PDF directly.
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-resume-download]');
    if (!trigger) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const link = document.createElement('a');
    link.href = resumeHref;
    link.download = 'Arshaan-Khan-GTM-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, true);

  // Safety fallback: Talk GTM always resolves to the contact surface.
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-talk]');
    if (!trigger) return;
    const contact = document.getElementById('contact');
    if (!contact) return;
    event.preventDefault();
    contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, true);
})();
