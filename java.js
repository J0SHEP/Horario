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