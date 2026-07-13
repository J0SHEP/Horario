  // ── THEME: auto based on time (5am–5pm = light, else dark), manual toggle ──
  const themeBtn = document.getElementById('themeBtn');
  let manualOverride = false;

  function getAutoTheme() {
    const h = new Date().getHours();
    return (h >= 5 && h < 17) ? 'light' : 'dark';
  }

  function applyTheme(mode) {
    if (mode === 'light') {
      document.body.classList.add('light');
      themeBtn.textContent = '🌙 Modo nocturno';
    } else {
      document.body.classList.remove('light');
      themeBtn.textContent = '☀️ Modo diurno';
    }
  }

  applyTheme(getAutoTheme());

  themeBtn.addEventListener('click', () => {
    manualOverride = true;
    const isLight = document.body.classList.contains('light');
    applyTheme(isLight ? 'dark' : 'light');
  });

  // Re-check every minute if no manual override
  setInterval(() => {
    if (!manualOverride) applyTheme(getAutoTheme());
  }, 60000);

  // ── AUTO-DAY: show today's schedule on load ──
  const dayMap = {
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes'
  };
  const dayNames = {
    lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
    jueves: 'Jueves', viernes: 'Viernes'
  };

  const todayNum = new Date().getDay(); // 0=Sun, 6=Sat
  const todayKey = dayMap[todayNum] || null;

  const pills = document.querySelectorAll('.day-pill');
  const sections = document.querySelectorAll('.day-section');
  const todayBanner = document.getElementById('todayBanner');
  const weekendNotice = document.getElementById('weekendNotice');

  function showDay(key) {
    sections.forEach(sec => {
      sec.classList.toggle('hidden', key !== 'all' && sec.dataset.day !== key);
    });
    pills.forEach(p => {
      p.classList.toggle('active', p.dataset.day === (key === 'all' ? 'all' : key));
    });
    weekendNotice.style.display = 'none';
  }

  // Init: show today or weekend
  if (todayKey) {
    showDay(todayKey);
    todayBanner.innerHTML = `<span>📅 Mostrando el horario de hoy — <strong>${dayNames[todayKey]}</strong></span>`;
    // Mark today's pill
    const todayPill = document.querySelector(`.day-pill[data-day="${todayKey}"]`);
    if (todayPill) {
      const dot = document.createElement('span');
      dot.className = 'today-dot';
      todayPill.appendChild(dot);
    }
  } else {
    // Weekend
    sections.forEach(sec => sec.classList.add('hidden'));
    weekendNotice.style.display = 'block';
    document.querySelector('.day-pill[data-day="all"]').classList.add('active');
    todayBanner.innerHTML = `<span>🏖️ Hoy es fin de semana</span>`;
  }

  // ── MANUAL FILTER ──
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const target = pill.dataset.day;
      weekendNotice.style.display = 'none';
      sections.forEach(sec => {
        sec.classList.toggle('hidden', target !== 'all' && sec.dataset.day !== target);
      });
      if (target === 'all') {
        todayBanner.innerHTML = todayKey
          ? `<span>📅 Mostrando el horario de hoy — <strong>${dayNames[todayKey]}</strong> (filtrando todos)</span>`
          : `<span>🏖️ Hoy es fin de semana — mostrando toda la semana</span>`;
      } else {
        todayBanner.innerHTML = target === todayKey
          ? `<span>📅 Mostrando el horario de hoy — <strong>${dayNames[target]}</strong></span>`
          : `<span>📋 Mostrando <strong>${dayNames[target]}</strong></span>`;
      }
    });
  });

  // ── Card glimmer ──
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
  // ── ENFOQUE AUTOMÁTICO: resalta la clase que corresponde a la hora actual ──
(function() {
  function parseTimeRange(text) {
    const match = text.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
    if (!match) return null;
    const startMin = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    const endMin = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);
    return [startMin, endMin];
  }

  function updateCurrentFocus() {
    const dayMapFocus = { 1: 'lunes', 2: 'martes', 3: 'miercoles', 4: 'jueves', 5: 'viernes' };
    const now = new Date();
    const todayKeyFocus = dayMapFocus[now.getDay()] || null;
    const nowMin = now.getHours() * 60 + now.getMinutes();

    document.querySelectorAll('.day-section').forEach(section => {
      const cardsWrap = section.querySelector('.cards');
      const cards = section.querySelectorAll('.card');
      let foundCurrent = false;

      cards.forEach(card => card.classList.remove('current-focus'));

      if (section.dataset.day === todayKeyFocus) {
        cards.forEach(card => {
          const timeEl = card.querySelector('.card-time');
          if (!timeEl) return;
          const range = parseTimeRange(timeEl.textContent);
          if (range && nowMin >= range[0] && nowMin < range[1]) {
            card.classList.add('current-focus');
            foundCurrent = true;
          }
        });
      }

      if (cardsWrap) cardsWrap.classList.toggle('has-focus', foundCurrent);
    });
  }

  updateCurrentFocus();
  setInterval(updateCurrentFocus, 30000);
})();
