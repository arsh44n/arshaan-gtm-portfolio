(()=>{
  'use strict';

  const resumeHref = new URL('assets/Arshaan-Khan-GTM-Resume.pdf', document.baseURI).href;
  const resumeMail = 'mailto:arsh44n.me@gmail.com?subject=Resume%20request';

  document.querySelectorAll('[data-resume-download]').forEach(el => {
    el.textContent = 'Resume ↓';
    if (el.tagName === 'A') {
      el.href = resumeHref;
      el.setAttribute('download', 'Arshaan-Khan-GTM-Resume.pdf');
    }
  });

  // Keep the portfolio usable even while the resume asset is being repaired.
  document.addEventListener('click', async event => {
    const trigger = event.target.closest('[data-resume-download]');
    if (!trigger) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    try {
      const res = await fetch(resumeHref, { method: 'HEAD', cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));

      const link = document.createElement('a');
      link.href = resumeHref;
      link.download = 'Arshaan-Khan-GTM-Resume.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (_) {
      window.location.href = resumeMail;
    }
  }, true);

  // Talk GTM always resolves to the contact surface.
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-talk]');
    if (!trigger) return;
    const contact = document.getElementById('contact');
    if (!contact) return;
    event.preventDefault();
    contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, true);
})();
