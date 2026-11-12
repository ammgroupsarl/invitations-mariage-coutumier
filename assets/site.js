(() => {
  'use strict';
  const c = window.WEDDING_CONFIG;
  if (!c) return;
  const theme = document.documentElement.dataset.theme || 'royal';
  const couple = `${c.bride} & ${c.groom}`;
  const fields = { ...c, couple, initials: `${c.bride[0]} ♡ ${c.groom[0]}`, namesShort: `${c.bride[0]} + ${c.groom[0]}` };
  Object.keys(fields).forEach(key => {
    document.querySelectorAll(`[data-field="${key}"]`).forEach(el => { el.textContent = String(fields[key] ?? ''); });
  });
  document.title = `${couple} | Mariage coutumier — ${theme === 'royal' ? 'L’Éternel' : theme === 'cinema' ? 'Notre Histoire' : 'Nos Racines'}`;

  const agenda = document.querySelector('[data-agenda]');
  if (agenda) {
    c.agenda.forEach((item, i) => {
      const article = document.createElement('article');
      article.className = 'agenda-item';
      const time = document.createElement('span'); time.className = 'agenda-time'; time.textContent = item.time;
      const content = document.createElement('div'); content.className = 'agenda-copy';
      const heading = document.createElement('h3'); heading.textContent = item.title;
      const desc = document.createElement('p'); desc.textContent = item.description;
      const index = document.createElement('span'); index.className = 'agenda-index'; index.textContent = String(i+1).padStart(2,'0');
      content.append(heading, desc); article.append(time, content, index); agenda.append(article);
    });
  }

  const date = new Date(c.dateISO);
  const countdownTargets = document.querySelectorAll('[data-countdown]');
  function updateCountdown() {
    if (Number.isNaN(+date)) return;
    const remaining = +date - Date.now();
    if (remaining <= 0) { countdownTargets.forEach(el => { el.textContent = 'Le grand jour est arrivé'; }); return; }
    const d = Math.floor(remaining / 86400000);
    const h = Math.floor(remaining % 86400000 / 3600000);
    const m = Math.floor(remaining % 3600000 / 60000);
    countdownTargets.forEach(el => { el.textContent = `${d} jours · ${h} heures · ${m} minutes`; });
  }
  updateCountdown(); setInterval(updateCountdown, 60000);

  document.querySelectorAll('[data-map-link]').forEach(link => {
    if (c.mapUrl && /^https:\/\//i.test(c.mapUrl)) {
      link.href = c.mapUrl;
      link.target = '_blank'; link.rel = 'noopener noreferrer';
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled','true');
      link.title = 'Adresse à renseigner dans assets/config.js';
      link.textContent = 'Itinéraire bientôt disponible';
    }
  });
  // Deux contacts distincts : aucun numéro ni adresse n'est inventé dans la démo.
  document.querySelectorAll('[data-contact-card]').forEach(card => {
    const recipient = card.dataset.contactCard;
    const info = c.contacts?.[recipient] || {};
    const available = [];
    const labels = { whatsapp: 'WhatsApp', phone: 'appel', email: 'e-mail' };
    card.querySelectorAll('[data-channel]').forEach(link => {
      const channel = link.dataset.channel;
      const raw = String(info[channel] || '').trim();
      let url = '';
      if (channel === 'whatsapp') {
        const digits = raw.replace(/\D/g, '');
        if (digits.length >= 9) url = `https://wa.me/${digits}?text=${encodeURIComponent('Bonjour, je vous contacte au sujet du mariage coutumier de ' + couple + '.')}`;
      } else if (channel === 'phone' && /^[+0-9() .-]{8,25}$/.test(raw)) {
        url = `tel:${raw.replace(/[^+0-9]/g, '')}`;
      } else if (channel === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        url = `mailto:${raw}?subject=${encodeURIComponent('Mariage coutumier - ' + couple)}`;
      }
      if (url) { link.href = url; available.push(labels[channel]); }
      else {
        link.removeAttribute('href'); link.setAttribute('aria-disabled', 'true');
        link.title = 'À compléter dans assets/config.js';
      }
    });
    const caption = card.querySelector('[data-contact-caption]');
    if (caption) caption.textContent = available.length ? `Contact disponible par ${available.join(', ')}.` : 'Coordonnées à renseigner dans assets/config.js avant publication.';
  });

  const navToggle = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-menu]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false'); }
    });
  }

  const form = document.querySelector('[data-rsvp-form]');
  if (form) {
    const key = `ammgroup-wedding-demo-${theme}`;
    const status = document.querySelector('[data-rsvp-status]');
    const saved = document.querySelector('[data-rsvp-saved]');
    const presence = form.querySelector('[name="presence"]');
    const count = form.querySelector('[name="guests"]');
    function renderSaved() {
      let data; try { data = JSON.parse(localStorage.getItem(key)||'null'); } catch(e) { data = null; }
      if (data && saved) {
        saved.hidden = false;
        saved.textContent = `Réponse enregistrée sur cet appareil : ${data.name} — ${data.presence === 'oui' ? 'présent(e)' : 'absent(e)'}. Vous pouvez la modifier ci-dessous.`;
        ['name','phone','presence','guests','message'].forEach(k => { const input = form.elements.namedItem(k); if (input && data[k] !== undefined) input.value = data[k]; });
      }
    }
    function toggleGuests() { if (count) { count.disabled = presence?.value === 'non'; if (count.disabled) count.value='0'; else if (count.value==='0') count.value='1'; } }
    presence?.addEventListener('change', toggleGuests);
    renderSaved(); toggleGuests();
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form).entries());
      data.guests = data.presence === 'non' ? '0' : data.guests;
      try {
        localStorage.setItem(key, JSON.stringify(data));
        if (status) { status.textContent = 'Merci ! Votre réponse a été enregistrée localement pour cette démonstration. Elle n’a pas été envoyée aux mariés.'; status.dataset.state = 'success'; }
        if (saved) { saved.hidden = false; saved.textContent = `${data.name} : ${data.presence === 'oui' ? 'présence confirmée' : 'absence indiquée'} (sur cet appareil uniquement).`; }
      } catch(err) {
        if (status) { status.textContent = 'Votre navigateur bloque l’enregistrement local. Aucune réponse n’a été transmise.'; status.dataset.state = 'error'; }
      }
    });
  }

  document.querySelectorAll('[data-share]').forEach(button => button.addEventListener('click', async () => {
    const message = `${c.whatsappMessage}\n${couple} — ${c.dateText}\n${location.href}`;
    if (navigator.share) {
      try { await navigator.share({ title: `Mariage coutumier de ${couple}`, text: message, url: location.href }); } catch(e) { /* partage annulé */ }
    } else { window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); }
  }));

  document.querySelectorAll('[data-calendar]').forEach(button => button.addEventListener('click', () => {
    const stamp = d => d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    const start = date;
    const end = new Date(+date+4*3600000);
    const encodeText = s => String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
    const ics = [ 'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AMMGROUP Digital//Invitation de demonstration//FR','BEGIN:VEVENT',`UID:demo-${theme}-mariage-coutumier@ammgroup.digital`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${encodeText('Mariage coutumier — '+couple)}`,`LOCATION:${encodeText(c.venue+', '+c.city)}`,`DESCRIPTION:${encodeText('Invitation de démonstration. Vérifier les informations auprès des familles.')}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const href=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
    const a=document.createElement('a'); a.href=href; a.download='mariage-coutumier.ics'; a.click(); setTimeout(()=>URL.revokeObjectURL(href),1000);
  }));

  const lightbox=document.querySelector('[data-lightbox]');
  if (lightbox) {
    const target=lightbox.querySelector('img');
    const close=()=>{ lightbox.hidden=true; document.body.classList.remove('lightbox-open'); };
    document.querySelectorAll('[data-gallery-image]').forEach(button=>button.addEventListener('click',()=>{
      const img=button.querySelector('img'); if (!img) return;
      target.src=img.currentSrc||img.src; target.alt=img.alt; lightbox.hidden=false; document.body.classList.add('lightbox-open');
    }));
    lightbox.querySelector('[data-lightbox-close]')?.addEventListener('click',close);
    lightbox.addEventListener('click',e=>{ if(e.target===lightbox) close(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape')close(); });
  }

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('appeared');obs.unobserve(entry.target);}
    }),{threshold:0.08});
    document.querySelectorAll('[data-reveal]').forEach(el=>{el.classList.add('will-reveal');obs.observe(el);});
  }
})();
