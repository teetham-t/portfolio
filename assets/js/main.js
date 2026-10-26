document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    const close = () => { links.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => { const open = links.classList.toggle('open'); toggle.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); });
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('click', event => { if (!event.target.closest('.navbar')) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { const wasOpen = links.classList.contains('open'); close(); if (wasOpen) toggle.focus(); } });
  }
});
