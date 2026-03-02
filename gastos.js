'use strict';

const SUPABASE_URL = 'https://dggxhpjevvixiwtflnar.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1ZM1iv0lxkSCSlfkCsyG7w_xZfaQ1fM';

const CAT_COLORS = {
  'Alimentação':     '#ea580c',
  'Transporte':      '#0891b2',
  'Saúde':           '#059669',
  'Lazer':           '#7c3aed',
  'Educação':        '#1d4ed8',
  'Moradia':         '#d97706',
  'Cabelo':          '#ec4899',
  'Pele & Skincare': '#f472b6',
  'Maquiagem':       '#a855f7',
  'Perfumes':        '#8b5cf6',
  'Unhas':           '#e879a0',
  'Corpo & Banho':   '#06b6d4',
  'Suplementos':     '#10b981',
  'Equipamentos':    '#6366f1',
  'Outro':           '#64748b',
};

const MONTHS       = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

let db          = null;
let currentUser = null;
let allExpenses = [];
let donutChart  = null;
let barChart    = null;
let sortCol     = 'data';
let sortDir     = 'desc';
let searchDebounce = null;

const fmtBRL  = n => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(n);
const fmtDate = s => { if (!s) return ''; const [y,m,d] = s.split('-'); return `${d}/${m}/${y}`; };

(async function init() {
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window.supabaseClient = db;

  const { data: { session } } = await db.auth.getSession();
  if (!session) { window.location.href = 'gastos-login.html'; return; }
  currentUser = session.user;

  setLoading(true);
  await Promise.all([loadProfile(), loadExpenses()]);
  setLoading(false);

  document.getElementById('pdfYear').value       = new Date().getFullYear();
  document.getElementById('pdfMonth').value      = new Date().getMonth() + 1;
  document.getElementById('expDate').valueAsDate = new Date();

  registerEvents();
})();

function setLoading(on) {
  document.getElementById('loadingOverlay').classList.toggle('active', on);
}

function showToast(msg, type = 'success') {
  const t   = document.getElementById('toast');
  const ico = t.querySelector('i');
  const map = { success:'fas fa-check-circle', error:'fas fa-exclamation-circle', info:'fas fa-info-circle' };
  ico.className = map[type] || map.success;
  t.className   = type;
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

function showConfirm(title, msg) {
  return new Promise(resolve => {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMsg').textContent   = msg;

    const overlay = document.getElementById('confirmModal');
    overlay.classList.add('active');

    function finish(result) {
      overlay.classList.remove('active');
      document.getElementById('btnConfirmOk').replaceWith(document.getElementById('btnConfirmOk').cloneNode(true));
      document.getElementById('btnConfirmCancel').replaceWith(document.getElementById('btnConfirmCancel').cloneNode(true));
      document.getElementById('btnCloseConfirm').replaceWith(document.getElementById('btnCloseConfirm').cloneNode(true));
      resolve(result);
    }

    document.getElementById('btnConfirmOk').addEventListener('click',     () => finish(true));
    document.getElementById('btnConfirmCancel').addEventListener('click',  () => finish(false));
    document.getElementById('btnCloseConfirm').addEventListener('click',   () => finish(false));
    overlay.addEventListener('click', e => { if (e.target === overlay) finish(false); }, { once: true });
  });
}

async function loadProfile() {
  const { data: { user } } = await db.auth.getUser();
  if (!user) return;
  currentUser = user;

  const { data: p } = await db.from('profiles').select('*').eq('id', user.id).single();
  const name   = p?.username || user.email.split('@')[0];
  const avatar = p?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d4ed8&color=fff`;

  ['headerAvatar','dropdownAvatar'].forEach(id => document.getElementById(id).src = avatar);
  document.getElementById('headerName').textContent    = name;
  document.getElementById('dropdownName').textContent  = name;
  document.getElementById('dropdownEmail').textContent = user.email;
  document.getElementById('editUsername').value = p?.username || '';
  document.getElementById('editBio').value      = p?.bio || '';
}

async function saveProfile() {
  if (!currentUser) return;
  const btn = document.getElementById('btnSaveProfile');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

  try {
    let avatarUrl = null;
    const fi = document.getElementById('avatarInput');
    if (fi.files.length > 0) {
      const file = fi.files[0], ext = file.name.split('.').pop();
      const path = `${currentUser.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await db.storage.from('avatars').upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      avatarUrl = db.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    }
    const payload = {
      id:         currentUser.id,
      username:   document.getElementById('editUsername').value.trim(),
      bio:        document.getElementById('editBio').value.trim(),
      updated_at: new Date(),
    };
    if (avatarUrl) payload.avatar_url = avatarUrl;
    const { error } = await db.from('profiles').upsert(payload);
    if (error) throw error;
    showToast('Perfil atualizado!');
    document.getElementById('profileModal').classList.remove('active');
    await loadProfile();
  } catch(e) {
    if (isAuthError(e)) return handleAuthExpired();
    showToast('Erro ao salvar: ' + e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-check"></i> Salvar Alterações';
  }
}

async function loadExpenses() {
  const { data, error } = await db
    .from('gastos')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('data', { ascending: false });

  if (error) {
    if (isAuthError(error)) return handleAuthExpired();
    showToast('Erro ao carregar gastos.', 'error');
    allExpenses = [];
  } else {
    allExpenses = data || [];
  }
  render();
}

async function addExpense(expense) {
  const { data, error } = await db
    .from('gastos')
    .insert([{ ...expense, user_id: currentUser.id }])
    .select()
    .single();
  if (error) {
    if (isAuthError(error)) handleAuthExpired();
    throw error;
  }
  allExpenses.unshift(data);
  return data;
}

async function updateExpense(id, fields) {
  const { data, error } = await db
    .from('gastos')
    .update(fields)
    .eq('id', id)
    .eq('user_id', currentUser.id)
    .select()
    .single();
  if (error) {
    if (isAuthError(error)) handleAuthExpired();
    throw error;
  }
  const idx = allExpenses.findIndex(e => e.id === id);
  if (idx !== -1) allExpenses[idx] = data;
  return data;
}

async function deleteExpense(id) {
  const { error } = await db
    .from('gastos')
    .delete()
    .eq('id', id)
    .eq('user_id', currentUser.id);
  if (error) {
    if (isAuthError(error)) handleAuthExpired();
    throw error;
  }
  allExpenses = allExpenses.filter(e => e.id !== id);
}

function isAuthError(err) {
  const msg = (err?.message || err?.error_description || '').toLowerCase();
  return msg.includes('jwt') || msg.includes('token') || msg.includes('auth') || err?.status === 401;
}

function handleAuthExpired() {
  showToast('Sessão expirada. Redirecionando...', 'error');
  setTimeout(() => { window.location.href = 'gastos-login.html'; }, 1800);
}

function getFilteredExpenses() {
  const fM     = document.getElementById('filterMonth').value;
  const fY     = document.getElementById('filterYear').value;
  const fC     = document.getElementById('filterCat').value;
  const search = document.getElementById('searchInput').value.trim().toLowerCase();

  let result = allExpenses.filter(e => {
    const [y, m] = (e.data || '').split('-');
    if (fM && m !== fM) return false;
    if (fY && y !== fY) return false;
    if (fC && e.categoria !== fC) return false;
    if (search) {
      const haystack = `${e.descricao} ${e.empresa || ''}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (sortCol === 'valor') { va = Number(va); vb = Number(vb); }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  return result;
}

function populateFilterDropdowns() {
  const ms = document.getElementById('filterMonth');
  const ys = document.getElementById('filterYear');
  const seenM = new Set(), seenY = new Set();
  allExpenses.forEach(e => {
    const [y, m] = (e.data || '').split('-');
    if (m) seenM.add(m);
    if (y) seenY.add(y);
  });
  const curM = ms.value, curY = ys.value;
  ms.innerHTML = '<option value="">Todos os meses</option>';
  ys.innerHTML = '<option value="">Todos os anos</option>';
  [...seenM].sort().forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = MONTHS_SHORT[parseInt(m) - 1];
    if (m === curM) o.selected = true;
    ms.appendChild(o);
  });
  [...seenY].sort((a,b) => b - a).forEach(y => {
    const o = document.createElement('option');
    o.value = y; o.textContent = y;
    if (y === curY) o.selected = true;
    ys.appendChild(o);
  });
}

function updateKPIs(expenses) {
  const total    = expenses.reduce((s, e) => s + Number(e.valor), 0);
  const avg      = expenses.length > 0 ? total / expenses.length : 0;
  const cats     = {};
  expenses.forEach(e => cats[e.categoria] = (cats[e.categoria] || 0) + Number(e.valor));
  const topEntry = Object.entries(cats).sort((a,b) => b[1] - a[1])[0];

  const fM  = document.getElementById('filterMonth').value;
  const fY  = document.getElementById('filterYear').value;
  const now = new Date();
  const label = fM && fY
    ? `${MONTHS_SHORT[parseInt(fM)-1]} ${fY}`
    : fM  ? MONTHS_SHORT[parseInt(fM)-1]
    : fY  ? fY
    : `${MONTHS_SHORT[now.getMonth()]} ${now.getFullYear()}`;

  document.getElementById('kpiTotal').textContent     = fmtBRL(total);
  document.getElementById('kpiTotalSub').textContent  = `${expenses.length} lançamentos — ${label}`;
  document.getElementById('kpiAvg').textContent       = fmtBRL(avg);
  document.getElementById('kpiAvgSub').textContent    = `${expenses.length} registros no período`;
  document.getElementById('kpiTopCat').textContent    = topEntry ? topEntry[0] : '—';
  document.getElementById('kpiTopCatSub').textContent = topEntry ? fmtBRL(topEntry[1]) : 'sem dados';
  document.getElementById('kpiCount').textContent     = expenses.length;
  document.getElementById('kpiCountSub').textContent  = 'no período filtrado';
}

function renderTable(expenses) {
  const tbody = document.getElementById('expenseTableBody');
  document.getElementById('tableCount').textContent = `${expenses.length} registro(s)`;

  document.querySelectorAll('thead th.sortable').forEach(th => {
    const col  = th.dataset.col;
    const icon = th.querySelector('i');
    icon.className = col === sortCol
      ? (sortDir === 'asc' ? 'fas fa-sort-up sort-icon active' : 'fas fa-sort-down sort-icon active')
      : 'fas fa-sort sort-icon';
  });

  if (!expenses.length) {
    tbody.innerHTML = `<tr><td colspan="7">
      <div class="empty-state"><i class="fas fa-inbox"></i>Nenhuma despesa encontrada.</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = expenses.map(e => {
    const color   = CAT_COLORS[e.categoria] || '#64748b';
    const empresa = e.empresa
      ? `<span class="td-empresa" title="${e.empresa}">${e.empresa}</span>`
      : `<span style="color:#cbd5e1;font-size:11px;">—</span>`;
    return `<tr class="tr-clickable" data-id="${e.id}">
      <td><span class="td-date">${fmtDate(e.data)}</span></td>
      <td><span class="td-desc" title="${e.descricao}">${e.descricao}</span></td>
      <td>${empresa}</td>
      <td>
        <span class="cat-badge" style="background:${color}18;color:${color};">
          <span class="cat-dot" style="background:${color};"></span>${e.categoria}
        </span>
      </td>
      <td><span class="pay-chip">${e.pagamento}</span></td>
      <td><span class="amount-val" style="color:${color};">${fmtBRL(Number(e.valor))}</span></td>
      <td>
        <button class="btn-del" data-del="${e.id}" title="Excluir">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>`;
  }).join('');
}

const CHART_TOOLTIP = {
  backgroundColor: 'rgba(15,23,42,0.92)',
  borderColor:     'rgba(255,255,255,0.08)',
  borderWidth:     1,
  titleColor:      '#f1f5f9',
  bodyColor:       '#94a3b8',
  padding:         12,
  cornerRadius:    10,
};

function renderDonut(expenses) {
  const cats = {};
  expenses.forEach(e => cats[e.categoria] = (cats[e.categoria] || 0) + Number(e.valor));
  const labels = Object.keys(cats);
  const data   = Object.values(cats);
  const colors = labels.map(l => CAT_COLORS[l] || '#64748b');
  const total  = data.reduce((s, v) => s + v, 0);

  document.getElementById('donutMeta').textContent = total > 0 ? fmtBRL(total) : '';

  if (donutChart) {
    donutChart.data.labels                  = labels;
    donutChart.data.datasets[0].data        = data;
    donutChart.data.datasets[0].backgroundColor = colors;
    donutChart.options.plugins.tooltip.callbacks.label = c =>
      ` ${c.label}: ${fmtBRL(c.raw)} (${((c.raw/total)*100).toFixed(1)}%)`;
    donutChart.update('active');
  } else {
    const ctx = document.getElementById('donutChart').getContext('2d');
    donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 3, borderColor: '#fff', hoverOffset: 8 }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { ...CHART_TOOLTIP, callbacks: { label: c => ` ${c.label}: ${fmtBRL(c.raw)} (${((c.raw/total)*100).toFixed(1)}%)` } }
        }
      }
    });
  }

  document.getElementById('donutLegend').innerHTML = labels.map((l,i) =>
    `<div class="legend-item"><div class="legend-dot" style="background:${colors[i]};"></div>${l}</div>`
  ).join('');
}

function renderBar() {
  const monthly = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthly[`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`] = 0;
  }
  allExpenses.forEach(e => {
    const [y,m] = (e.data || '').split('-'), k = `${y}-${m}`;
    if (k in monthly) monthly[k] += Number(e.valor);
  });
  const labels = Object.keys(monthly).map(k => MONTHS_SHORT[parseInt(k.split('-')[1]) - 1]);
  const data   = Object.values(monthly);
  const bgColors = data.map((v,i) => i === data.length-1 ? 'rgba(29,78,216,0.9)' : 'rgba(29,78,216,0.2)');
  const bdColors = data.map((v,i) => i === data.length-1 ? '#1d4ed8' : 'rgba(29,78,216,0.4)');

  if (barChart) {
    barChart.data.labels                          = labels;
    barChart.data.datasets[0].data               = data;
    barChart.data.datasets[0].backgroundColor    = bgColors;
    barChart.data.datasets[0].borderColor        = bdColors;
    barChart.update('active');
  } else {
    const ctx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data, backgroundColor: bgColors, borderColor: bdColors,
          borderWidth: 1, borderRadius: 6, borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...CHART_TOOLTIP, callbacks: { label: c => ` ${fmtBRL(c.raw)}` } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 11 },
            callback: v => 'R$' + (v >= 1000 ? (v/1000).toFixed(1)+'k' : v)
          }}
        }
      }
    });
  }
}

function render() {
  populateFilterDropdowns();
  const filtered = getFilteredExpenses();
  updateKPIs(filtered);
  renderTable(filtered);
  renderDonut(filtered);
  renderBar();
  updateExportPreview();
}

function updateExportPreview() {
  const month = parseInt(document.getElementById('pdfMonth').value);
  const year  = parseInt(document.getElementById('pdfYear').value);
  const mStr  = String(month).padStart(2, '0');
  const yStr  = String(year);

  const expenses = allExpenses.filter(e => {
    const [y, m] = (e.data || '').split('-');
    return y === yStr && m === mStr;
  });

  const total = expenses.reduce((s, e) => s + Number(e.valor), 0);
  const cats  = {};
  expenses.forEach(e => cats[e.categoria] = (cats[e.categoria] || 0) + Number(e.valor));
  const top = Object.entries(cats).sort((a,b) => b[1] - a[1])[0];

  document.getElementById('prevPeriod').textContent  = `${MONTHS[month-1]} de ${year}`;
  document.getElementById('prevCount').textContent   = `${expenses.length} lançamentos`;
  document.getElementById('prevTopCat').textContent  = top ? top[0] : '—';
  document.getElementById('prevTotal').textContent   = fmtBRL(total);
}

function validateForm() {
  let valid = true;
  const rules = [
    { id: 'expValue',    err: 'errValue',    check: el => !el.value || parseFloat(el.value) <= 0, msg: 'Informe um valor válido.' },
    { id: 'expDesc',     err: 'errDesc',     check: el => !el.value.trim(), msg: 'Informe uma descrição.' },
    { id: 'expCategory', err: 'errCategory', check: el => !el.value, msg: 'Selecione uma categoria.' },
    { id: 'expPayment',  err: 'errPayment',  check: el => !el.value, msg: 'Selecione a forma de pagamento.' },
  ];
  rules.forEach(({ id, err, check, msg }) => {
    const el    = document.getElementById(id);
    const errEl = document.getElementById(err);
    const fail  = check(el);
    errEl.textContent = fail ? msg : '';
    el.classList.toggle('input-error', fail);
    if (fail) valid = false;
  });
  return valid;
}

function clearFieldError(el) {
  el.classList.remove('input-error');
  const errId = { expValue:'errValue', expDesc:'errDesc', expCategory:'errCategory', expPayment:'errPayment' }[el.id];
  if (errId) document.getElementById(errId).textContent = '';
}

function openEditModal(id) {
  const e = allExpenses.find(x => x.id === id);
  if (!e) return;
  document.getElementById('editId').value       = e.id;
  document.getElementById('editValue').value    = e.valor;
  document.getElementById('editDesc').value     = e.descricao;
  document.getElementById('editEmpresa').value  = e.empresa || '';
  document.getElementById('editCategory').value = e.categoria;
  document.getElementById('editDate').value     = e.data;
  document.getElementById('editPayment').value  = e.pagamento;
  document.getElementById('editModal').classList.add('active');
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const month   = parseInt(document.getElementById('pdfMonth').value);
  const year    = parseInt(document.getElementById('pdfYear').value);
  const company = document.getElementById('pdfCompany').value.trim() || 'Relatório de Gastos';
  const mStr    = String(month).padStart(2, '0');
  const yStr    = String(year);
  const periodo = `${MONTHS[month - 1]} de ${year}`;

  const expenses = allExpenses
    .filter(e => { const [y,m] = (e.data||'').split('-'); return y === yStr && m === mStr; })
    .sort((a,b) => a.data.localeCompare(b.data));

  if (!expenses.length) {
    showToast(`Nenhum lançamento em ${periodo}.`, 'info');
    return;
  }

  const total = expenses.reduce((s,e) => s + Number(e.valor), 0);
  const cats  = {};
  expenses.forEach(e => cats[e.categoria] = (cats[e.categoria] || 0) + Number(e.valor));

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W   = doc.internal.pageSize.getWidth();
  const H   = doc.internal.pageSize.getHeight();

  const BLUE_DARK  = [15, 23, 42];
  const BLUE_MID   = [29, 78, 216];
  const BLUE_LIGHT = [239, 246, 255];
  const GRAY_TEXT  = [71, 85, 105];
  const GRAY_LIGHT = [241, 245, 249];
  const WHITE      = [255, 255, 255];

  doc.setFillColor(...BLUE_DARK);
  doc.rect(0, 0, W, 42, 'F');
  doc.setFillColor(...BLUE_MID);
  doc.rect(0, 42, W, 4, 'F');

  doc.setTextColor(...WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(company, 14, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text('RELATÓRIO DE DESPESAS MENSAIS', 14, 26);
  doc.setFontSize(9);
  doc.text(`Período: ${periodo}`, 14, 34);
  doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 39);
  doc.setTextColor(...WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TOTAL DO PERÍODO', W - 14, 28, { align: 'right' });
  doc.setFontSize(18);
  doc.text(fmtBRL(total), W - 14, 38, { align: 'right' });

  const sumY = 55, colW = (W - 28) / 3;
  [
    { label: 'Lançamentos',    value: String(expenses.length) },
    { label: 'Maior Categoria', value: Object.entries(cats).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—' },
    { label: 'Média por Item',  value: fmtBRL(total / expenses.length) },
  ].forEach((item, i) => {
    const x = 14 + i * colW;
    doc.setFillColor(...BLUE_LIGHT);
    doc.roundedRect(x, sumY, colW - 4, 20, 3, 3, 'F');
    doc.setTextColor(...GRAY_TEXT);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(item.label.toUpperCase(), x + 6, sumY + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLUE_DARK);
    doc.text(item.value, x + 6, sumY + 15);
  });

  const tableY = sumY + 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BLUE_DARK);
  doc.text('Detalhamento de Despesas', 14, tableY - 4);

  doc.autoTable({
    startY: tableY,
    margin: { left: 14, right: 14 },
    head: [['Data', 'Descrição', 'Empresa / Fornecedor', 'Categoria', 'Pagamento', 'Valor']],
    body: expenses.map(e => [fmtDate(e.data), e.descricao, e.empresa || '—', e.categoria, e.pagamento, fmtBRL(Number(e.valor))]),
    headStyles: { fillColor: BLUE_MID, textColor: WHITE, fontStyle: 'bold', fontSize: 8, cellPadding: 4 },
    bodyStyles: { fontSize: 8, cellPadding: { top:4, bottom:4, left:4, right:4 }, textColor: GRAY_TEXT },
    alternateRowStyles: { fillColor: GRAY_LIGHT },
    columnStyles: {
      0: { cellWidth: 20 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 36 },
      3: { cellWidth: 26 }, 4: { cellWidth: 26 },
      5: { cellWidth: 24, halign: 'right', fontStyle: 'bold', textColor: BLUE_DARK },
    },
    foot: [['', '', '', '', 'TOTAL',
      { content: fmtBRL(total), styles: { fontStyle:'bold', halign:'right', textColor:BLUE_MID, fontSize:9 } }
    ]],
    footStyles: { fillColor: BLUE_LIGHT, textColor: BLUE_DARK, fontStyle: 'bold', fontSize: 8 },
    showFoot: 'lastPage',
  });

  const afterTable    = doc.lastAutoTable.finalY + 10;
  const pageRemaining = H - afterTable - 20;
  const catEntries    = Object.entries(cats).sort((a,b) => b[1] - a[1]);
  const catBlockH     = 8 + catEntries.length * 12;

  if (pageRemaining < catBlockH + 10) doc.addPage();
  const catY = pageRemaining < catBlockH + 10 ? 20 : afterTable;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BLUE_DARK);
  doc.text('Resumo por Categoria', 14, catY);

  const maxCatY = H - 20;
  catEntries.forEach(([cat, val], i) => {
    const rowY = catY + 8 + i * 12;
    if (rowY + 8 > maxCatY) return;
    const pct  = total > 0 ? val / total : 0;
    const barW = W - 28 - 50;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY_TEXT);
    doc.text(cat, 14, rowY + 4);
    doc.text(fmtBRL(val), W - 14, rowY + 4, { align: 'right' });
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`${(pct*100).toFixed(1)}%`, W - 14 - 28, rowY + 4, { align: 'right' });
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(52, rowY - 1, barW, 5, 2, 2, 'F');
    doc.setFillColor(...BLUE_MID);
    doc.roundedRect(52, rowY - 1, Math.max(barW * pct, 2), 5, 2, 2, 'F');
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(248, 250, 252);
    doc.rect(0, H - 12, W, 12, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`${company} — Relatório de Despesas ${periodo}`, 14, H - 5);
    doc.text(`Página ${i} de ${totalPages}`, W - 14, H - 5, { align: 'right' });
  }

  doc.save(`despesas_${MONTHS[month-1].toLowerCase()}_${year}.pdf`);
  showToast('PDF gerado com sucesso!');
}

function registerEvents() {
  const toggle   = document.getElementById('profileToggle');
  const dropdown = document.getElementById('profileDropdown');
  toggle.addEventListener('click', e => { e.stopPropagation(); dropdown.classList.toggle('active'); });
  document.addEventListener('click', () => dropdown.classList.remove('active'));
  dropdown.addEventListener('click', e => e.stopPropagation());

  const profileModal = document.getElementById('profileModal');
  document.getElementById('btnOpenEditor').addEventListener('click', () => {
    dropdown.classList.remove('active');
    profileModal.classList.add('active');
  });
  document.getElementById('btnCloseModal').addEventListener('click', () => profileModal.classList.remove('active'));
  profileModal.addEventListener('click', e => { if (e.target === profileModal) profileModal.classList.remove('active'); });
  document.getElementById('btnSaveProfile').addEventListener('click', saveProfile);

  const editModal = document.getElementById('editModal');
  document.getElementById('btnCloseEdit').addEventListener('click', () => editModal.classList.remove('active'));
  editModal.addEventListener('click', e => { if (e.target === editModal) editModal.classList.remove('active'); });

  document.getElementById('btnSaveEdit').addEventListener('click', async () => {
    const id  = document.getElementById('editId').value;
    const btn = document.getElementById('btnSaveEdit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    try {
      await updateExpense(id, {
        valor:     parseFloat(document.getElementById('editValue').value),
        descricao: document.getElementById('editDesc').value.trim(),
        empresa:   document.getElementById('editEmpresa').value.trim(),
        categoria: document.getElementById('editCategory').value,
        data:      document.getElementById('editDate').value,
        pagamento: document.getElementById('editPayment').value,
      });
      editModal.classList.remove('active');
      render();
      showToast('Lançamento atualizado!');
    } catch(e) {
      showToast('Erro ao atualizar: ' + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check"></i> Salvar Alterações';
    }
  });

  document.getElementById('btnLogout').addEventListener('click', async () => {
    await db.auth.signOut();
    window.location.href = 'gastos-login.html';
  });

  const form = document.getElementById('expenseForm');
  ['expValue','expDesc','expCategory','expPayment'].forEach(id => {
    document.getElementById(id).addEventListener('input', e => clearFieldError(e.target));
    document.getElementById(id).addEventListener('change', e => clearFieldError(e.target));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const btn = document.getElementById('btnAdd');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

    try {
      await addExpense({
        valor:     parseFloat(document.getElementById('expValue').value),
        descricao: document.getElementById('expDesc').value.trim(),
        empresa:   document.getElementById('expEmpresa').value.trim(),
        categoria: document.getElementById('expCategory').value,
        data:      document.getElementById('expDate').value,
        pagamento: document.getElementById('expPayment').value,
      });
      form.reset();
      document.getElementById('expDate').valueAsDate = new Date();
      render();
      showToast('Despesa registrada!');
    } catch(err) {
      showToast('Erro: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-plus"></i> Registrar Despesa';
    }
  });

  ['filterMonth','filterYear','filterCat'].forEach(id =>
    document.getElementById(id).addEventListener('change', render)
  );

  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('btnSearchClear');
  searchInput.addEventListener('input', () => {
    searchClear.style.display = searchInput.value ? 'flex' : 'none';
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(render, 220);
  });
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    render();
  });

  document.getElementById('clearFilters').addEventListener('click', () => {
    ['filterMonth','filterYear','filterCat'].forEach(id => document.getElementById(id).value = '');
    searchInput.value = '';
    searchClear.style.display = 'none';
    render();
  });

  document.querySelectorAll('thead th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortCol === col) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortCol = col;
        sortDir = col === 'valor' ? 'desc' : 'asc';
      }
      render();
    });
  });

  document.getElementById('expenseTableBody').addEventListener('click', async e => {
    const delBtn = e.target.closest('[data-del]');
    const row    = e.target.closest('[data-id]');

    if (delBtn) {
      e.stopPropagation();
      const id = delBtn.dataset.del;
      const confirmed = await showConfirm(
        'Excluir lançamento',
        'Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.'
      );
      if (!confirmed) return;
      try {
        await deleteExpense(id);
        render();
        showToast('Lançamento excluído.');
      } catch(err) {
        showToast('Erro ao excluir.', 'error');
      }
      return;
    }

    if (row) openEditModal(row.dataset.id);
  });

  ['pdfMonth','pdfYear'].forEach(id =>
    document.getElementById(id).addEventListener('change', updateExportPreview)
  );

  document.getElementById('btnExportPdf').addEventListener('click', () => {
    const btn = document.getElementById('btnExportPdf');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PDF...';
    setTimeout(() => {
      try { generatePDF(); } catch(e) { showToast('Erro ao gerar PDF: ' + e.message, 'error'); }
      finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-download"></i> Gerar e Baixar PDF';
      }
    }, 100);
  });
}
