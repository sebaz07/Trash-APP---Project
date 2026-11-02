(() => {
  const zones = {
    norte: {
      label: 'Sector Norte', days: [
        {day:'Lunes', date:'04', title:'Ordinarios y orgánicos', time:'7:00 a. m.', note:'Saca tus residuos cerca del inicio de la franja.'},
        {day:'Miércoles', date:'06', title:'Material aprovechable', time:'7:30 a. m.', note:'Enjuaga y separa los envases reciclables.'},
        {day:'Viernes', date:'08', title:'Ordinarios y orgánicos', time:'7:00 a. m.', note:'Horario de ejemplo para la zona seleccionada.'}
      ]
    },
    centro: {
      label: 'Sector Centro', days: [
        {day:'Martes', date:'05', title:'Ordinarios y orgánicos', time:'6:30 a. m.', note:'Horario simulado de la ruta del centro.'},
        {day:'Jueves', date:'07', title:'Material aprovechable', time:'7:00 a. m.', note:'Separa cartón, plástico, vidrio y metal limpios.'},
        {day:'Sábado', date:'09', title:'Ordinarios y orgánicos', time:'7:30 a. m.', note:'Ejemplo para revisar la pantalla de calendario.'}
      ]
    },
    sur: {
      label: 'Sector Sur', days: [
        {day:'Lunes', date:'04', title:'Material aprovechable', time:'8:00 a. m.', note:'Contenido ficticio de la demostración.'},
        {day:'Jueves', date:'07', title:'Ordinarios y orgánicos', time:'6:45 a. m.', note:'Saca tus residuos cerca de la franja indicada.'},
        {day:'Sábado', date:'09', title:'Residuos especiales · jornada de muestra', time:'9:00 a. m.', note:'No representa una jornada real ni un servicio disponible.'}
      ]
    }
  };
  const notices = [
    {id:'n1',type:'informativo',label:'Informativo',title:'Jornada de recolección de prueba',date:'2 nov 2026',body:'Este mensaje de ejemplo permite comprobar cómo se presenta una novedad. No corresponde a una jornada real y no reemplaza la información del prestador del servicio.'},
    {id:'n2',type:'cambio',label:'Cambio de horario',title:'Ajuste de horario en Sector Centro',date:'3 nov 2026',body:'En este caso de demostración, el horario de la ruta del Sector Centro cambia de forma temporal. Revisa el calendario de muestra para observar cómo se comunicaría el cambio. Los datos no son oficiales.'},
    {id:'n3',type:'retraso',label:'Retraso',title:'Demora simulada en la ruta del Sector Norte',date:'4 nov 2026',body:'Ejemplo de aviso de retraso para evaluar el tipo, la fecha y el contenido del mensaje. No se está reportando un vehículo real ni una demora efectiva.'}
  ];
  const routePoints = [
    {x:16,y:76,place:'Cerca del Parque de muestra',next:'Cruce de la Calle 2',time:'8:30 a. m.'},
    {x:51,y:47,place:'Cruce de la Calle 2',next:'Esquina de la Carrera 3',time:'8:42 a. m.'},
    {x:82,y:25,place:'Esquina de la Carrera 3',next:'Fin del recorrido de ejemplo',time:'8:55 a. m.'}
  ];
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  let currentZone = 'norte';
  let routeIndex = 0;
  let currentFilter = 'todos';
  let toastTimer;
  let readIds = new Set(JSON.parse(localStorage.getItem('rtb-read-notices') || '[]'));

  function setView(name) {
    $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${name}`));
    $$('.nav-link').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    if (name === 'notificaciones') renderNotifications();
    $('#mainContent').focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function syncZone(value) {
    currentZone = zones[value] ? value : 'norte';
    const label = zones[currentZone].label;
    $('#zoneSelect').value = currentZone;
    $('#scheduleZoneSelect').value = currentZone;
    $('#activeZoneLabel').textContent = `${label} · Zona de demostración`;
    $('#scheduleZone').textContent = label;
    $('#mapZone').textContent = label;
    renderSchedule();
    toast(`Zona de demostración: ${label}`);
  }
  function renderSchedule() {
    $('#scheduleList').innerHTML = zones[currentZone].days.map(item => `
      <article class="schedule-item">
        <div class="day-block"><strong>${item.date}</strong><small>${item.day}</small></div>
        <div class="schedule-detail"><h3>${item.title}</h3><p>${item.note}</p></div>
        <span class="schedule-time">◷ &nbsp;${item.time}</span>
      </article>`).join('');
    const next = zones[currentZone].days[0];
    $('#nextService').textContent = `${next.day} · ${next.time}`;
    $('#nextWaste').textContent = next.title;
  }
  function noticeCard(n) {
    const icon = n.type === 'retraso' ? '◷' : n.type === 'cambio' ? '↻' : '✦';
    return `<article class="notice-card" tabindex="0" role="button" data-notice="${n.id}" aria-label="Abrir aviso: ${n.title}">
      <span class="notice-symbol ${n.type}">${icon}</span><div><h3 class="notice-title">${n.title}</h3><p class="notice-desc">${n.body}</p></div>
      <div class="notice-meta"><span class="notice-type">${n.label}</span><time class="notice-date">${n.date}</time></div></article>`;
  }
  function renderNotices() {
    const filtered = currentFilter === 'todos' ? notices : notices.filter(n => n.type === currentFilter);
    $('#noticeList').innerHTML = filtered.map(noticeCard).join('') || '<p>No hay avisos de este tipo en la demostración.</p>';
    $('#noticeCount').textContent = notices.length;
    $$('.notice-card').forEach(card => {
      card.addEventListener('click', () => openNotice(card.dataset.notice));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();openNotice(card.dataset.notice);} });
    });
  }
  function openNotice(id) {
    const n = notices.find(item => item.id === id);
    if (!n) return;
    readIds.add(id);
    localStorage.setItem('rtb-read-notices', JSON.stringify([...readIds]));
    $('#dialogContent').innerHTML = `<span class="dialog-meta">${n.label} · ${n.date} · AVISO DE DEMOSTRACIÓN</span><h2 class="dialog-title">${n.title}</h2><p class="dialog-body">${n.body}</p><p class="dialog-body"><strong>Zona:</strong> ${zones[currentZone].label}. Este contenido es ficticio; consulta los canales oficiales para conocer información vigente.</p>`;
    $('#noticeDialog').showModal();
    updateUnread();
  }
  function renderNotifications() {
    $('#notificationPanel').innerHTML = notices.map(n => `<article class="notification-item ${readIds.has(n.id)?'':'unread'}"><span class="notice-symbol ${n.type}">${n.type==='retraso'?'◷':n.type==='cambio'?'↻':'✦'}</span><div><strong>${n.title}</strong><small>${n.label} · ${n.date} · Demostración</small></div><span class="read-state">${readIds.has(n.id)?'Revisado':'Nuevo'}</span></article>`).join('');
    updateUnread();
  }
  function updateUnread() {
    const dot = $('#unreadDot');
    dot.style.display = notices.some(n => !readIds.has(n.id)) ? 'block' : 'none';
  }
  function updateRoute() {
    const point = routePoints[routeIndex];
    const marker = $('#vehicleMarker');
    marker.style.left = `${point.x}%`;
    marker.style.bottom = `${100-point.y}%`;
    $('#routePlace').textContent = point.place;
    $('#routeNext').textContent = point.next;
    $('#routeTime').textContent = point.time;
    $('#progressLabel').textContent = `${routeIndex+1} de ${routePoints.length}`;
    $('#progressBar').style.width = `${((routeIndex+1)/routePoints.length)*100}%`;
    $('#routeState').textContent = routeIndex === routePoints.length-1 ? 'Recorrido de muestra finalizado' : 'En recorrido';
    $('#trackerStatus').textContent = routeIndex === routePoints.length-1 ? 'Recorrido de prueba finalizado' : 'Vehículo en recorrido';
    $('#trackerMeta').textContent = `Última actualización simulada · ${point.time}`;
    $('#advanceRoute').innerHTML = routeIndex === routePoints.length-1 ? 'Reiniciar simulación <span>↺</span>' : 'Avanzar simulación <span>→</span>';
  }
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  $$('.nav-link').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => setView(b.dataset.go)));
  $('#zoneSelect').addEventListener('change', e => syncZone(e.target.value));
  $('#scheduleZoneSelect').addEventListener('change', e => syncZone(e.target.value));
  $$('.filter-chip').forEach(b => b.addEventListener('click', () => {
    currentFilter = b.dataset.filter; $$('.filter-chip').forEach(x => x.classList.toggle('selected',x===b)); renderNotices();
  }));
  $('#openLatestNotice').addEventListener('click', () => openNotice('n1'));
  $('#notificationsButton').addEventListener('click', () => setView('notificaciones'));
  $('#advanceRoute').addEventListener('click', () => {routeIndex = routeIndex === routePoints.length-1 ? 0 : routeIndex+1;updateRoute();toast(routeIndex===0?'Simulación reiniciada':'Ubicación de muestra actualizada');});
  $('#markAllRead').addEventListener('click', () => {readIds = new Set(notices.map(n=>n.id));localStorage.setItem('rtb-read-notices',JSON.stringify([...readIds]));renderNotifications();toast('Avisos marcados como revisados en este navegador');});
  $('#noticeDialog').addEventListener('click', e => {if(e.target === $('#noticeDialog')) $('#noticeDialog').close();});

  renderSchedule(); renderNotices(); updateRoute(); updateUnread();
  // Optional view query keeps the demo easy to capture and review.
  const requestedView = new URLSearchParams(location.search).get('view');
  if (['inicio', 'horarios', 'avisos', 'rastreo', 'notificaciones'].includes(requestedView)) setView(requestedView);
})();
