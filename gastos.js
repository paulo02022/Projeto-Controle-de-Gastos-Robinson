'use strict';

// ── THEME ─────────────────────────────────────────────────────────────────────
const TT = {backgroundColor:'rgba(15,23,42,.95)',borderColor:'rgba(255,255,255,.08)',borderWidth:1,titleColor:'#f8faff',bodyColor:'#94a3b8',padding:12,cornerRadius:10};

function updateChartTheme() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const bg   = dark ? 'rgba(28,35,51,.97)' : 'rgba(15,23,42,.95)';
  const bc   = dark ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.08)';
  Object.assign(TT, { backgroundColor: bg, borderColor: bc });
  [barChart, donutChart, annualChart, budgetChart].forEach(c => { if (c) c.update('none'); });
}

// ── CHART COLORS (adapted for new palette) ────────────────────────────────────
function getBarColors(data) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    bg: data.map((_, i) => i === data.length - 1
      ? 'rgba(5,150,105,.85)'
      : isDark ? 'rgba(5,150,105,.25)' : 'rgba(5,150,105,.18)'),
    border: data.map((_, i) => i === data.length - 1
      ? '#059669'
      : 'rgba(5,150,105,.4)')
  };
}

const SB_URL = 'https://dggxhpjevvixiwtflnar.supabase.co';
const SB_KEY = 'sb_publishable_1ZM1iv0lxkSCSlfkCsyG7w_xZfaQ1fM';

const DEFAULT_CATS = [
  {name:'1000.01 - MATRIZ VENDEDORES',color:'#0891b2',icon:''},{name:'1000.02 - BUY BRAZIL VIRTUAL',color:'#0e7490',icon:''},{name:'1000.03 - BELAWAYS B2B',color:'#0284c7',icon:''},{name:'1000.04 - AJUSTE CONTAS',color:'#0369a1',icon:''},{name:'1000.05 - BELAWAYS BR VIRTUAL',color:'#075985',icon:''},{name:'1000.06 - MERCADO LIVRE',color:'#f59e0b',icon:''},{name:'1000.07 - AMAZON BR',color:'#ea580c',icon:''},{name:'1000.08 - MAGALU MKT',color:'#ec4899',icon:''},{name:'1001.01 - COMPRA SÓCIOS',color:'#0891b2',icon:''},
  {name:'120.10 - CUSTOS OP. DE DEVOLUÇÕES',color:'#ef4444',icon:''},{name:'120.11 - PERDA DE CONTESTAÇÕES',color:'#dc2626',icon:''},
  {name:'200.01 - LOGÍSTICA',color:'#7c3aed',icon:''},
  {name:'280.01 - CORREIOS',color:'#0ea5e9',icon:''},{name:'280.02 - FEDEX',color:'#6366f1',icon:''},{name:'280.03 - FEDEX (GUILHERME)',color:'#4f46e5',icon:''},{name:'280.04 - FEDEX (DENIS)',color:'#4338ca',icon:''},{name:'280.05 - FEDEX (BRUNO)',color:'#3730a3',icon:''},{name:'280.06 - FEDEX (MARCOS)',color:'#312e81',icon:''},{name:'280.07 - FEDEX (LUCIANO)',color:'#1e1b4b',icon:''},{name:'280.08 - APP UBER/99',color:'#1e293b',icon:''},{name:'280.09 - OUTROS',color:'#334155',icon:''},{name:'280.10 - FEDEX (ROBERTA)',color:'#475569',icon:''},{name:'280.12 - FEDEX (PAULO)',color:'#64748b',icon:''},{name:'280.13 - FEDEX (ROBINSON JR)',color:'#6366f1',icon:''},{name:'280.15 - DHL',color:'#dc2626',icon:''},{name:'280.19 - FEDEX (ADRIANO)',color:'#b91c1c',icon:''},{name:'280.20 - UPS',color:'#92400e',icon:''},{name:'280.21 - TRANSPORTADORAS',color:'#78350f',icon:''},{name:'280.22 - FRETES, MOTOS E CARRETOS',color:'#d97706',icon:''},
  {name:'300.01 - DASN',color:'#dc2626',icon:''},{name:'300.02 - PIS',color:'#b91c1c',icon:''},{name:'300.03 - CONFINS',color:'#991b1b',icon:''},{name:'300.04 - IRPJ',color:'#7f1d1d',icon:''},{name:'300.05 - TAX. E TRIB. ALFANDEGÁRIOS',color:'#c2410c',icon:''},
  {name:'400.01 - TARIFAS BANCÁRIAS',color:'#d97706',icon:''},{name:'400.02 - TX CARTÕES E ALUGUÉIS DE MAQUINETAS',color:'#b45309',icon:''},{name:'400.03 - TAXAS PLATAFORMAS',color:'#92400e',icon:''},
  {name:'500.01 - SALÁRIO',color:'#059669',icon:''},{name:'500.02 - BONIFICAÇÕES',color:'#047857',icon:''},{name:'500.03 - 13º SALÁRIO',color:'#065f46',icon:''},
  {name:'600.01 - VENDEDORES',color:'#db2777',icon:''},{name:'600.02 - COMPRA COSMÉTICOS',color:'#ec4899',icon:''},{name:'600.03 - RETORNO MERCADORIA',color:'#be185d',icon:''},{name:'600.04 - INSUMOS',color:'#9d174d',icon:''},{name:'600.05 - COMPRA ELETRÔNICOS',color:'#3b82f6',icon:''},{name:'600.06 - COMPRA PRÓPOLIS',color:'#f59e0b',icon:''},{name:'600.07 - COMPRA BEBIDAS',color:'#f97316',icon:''},{name:'600.08 - VITAMINAS CAPILAR',color:'#10b981',icon:''},{name:'600.10 - COMPRA OUTROS PRODUTOS',color:'#64748b',icon:''},
  {name:'700.01 - MERCADO',color:'#78716c',icon:''},{name:'700.02 - FARMÁCIA',color:'#57534e',icon:''},{name:'700.03 - PAPELARIA',color:'#44403c',icon:''},{name:'700.04 - GÁZ',color:'#292524',icon:''},{name:'700.05 - MANUTENÇÃO',color:'#78716c',icon:''},{name:'700.06 - MANUTENÇÃO DE EQUIPAMENTOS',color:'#57534e',icon:''},{name:'700.07 - AMOSTRAS DE PRODUTOS',color:'#a8a29e',icon:''},{name:'700.08 - ENSUMOS DE EMBALAGEM',color:'#84cc16',icon:''},{name:'700.09 - CARTÓRIO',color:'#65a30d',icon:''},{name:'700.10 - CONSULTORIA',color:'#8b5cf6',icon:''},{name:'700.11 - CONTABILIDADE',color:'#6366f1',icon:''},{name:'700.11 - LIMPEZA',color:'#06b6d4',icon:''},{name:'700.12 - LOGÍSTICA E FULFILLMENT',color:'#0891b2',icon:''},{name:'700.13 - ENDEREÇO FISCAL',color:'#0e7490',icon:''},{name:'700.14 - CORTESIA',color:'#0284c7',icon:''},
  {name:'750.01 - HOTEL',color:'#6366f1',icon:''},{name:'750.02 - ALIMENTAÇÃO',color:'#f97316',icon:''},{name:'750.03 - COMBUSTÍVEL',color:'#eab308',icon:''},{name:'750.04 - PASSAGENS',color:'#6366f1',icon:''},{name:'750.05 - QUILOMETRAGEM',color:'#a3a3a3',icon:''},
  {name:'800.01 - ALUGUÉL',color:'#1d4ed8',icon:''},{name:'800.02 - ENERGIA',color:'#ca8a04',icon:''},{name:'800.03 - ÁGUA',color:'#0ea5e9',icon:''},{name:'800.04 - INTERNET',color:'#0891b2',icon:''},{name:'800.05 - ERP',color:'#7c3aed',icon:''},{name:'800.07 - SITE E-COMMERCE',color:'#0f766e',icon:''},{name:'800.08 - TÉCNOLOGIA',color:'#1e40af',icon:''},
  {name:'900.01 - AGÊNCIA MKT MD',color:'#a855f7',icon:''},{name:'900.02 - TRÂFEGO',color:'#8b5cf6',icon:''},{name:'900.03 - CRIAÇÃO DE ARTE',color:'#ec4899',icon:''},{name:'900.04 - BRINDES',color:'#f43f5e',icon:''},{name:'900.05 - E_MAIL MKT',color:'#6366f1',icon:''},
  {name:'940.01 - DOMÍNIO',color:'#06b6d4',icon:''},
  {name:'950.01 - PRÓ_LABORE',color:'#6366f1',icon:''},{name:'950.02 - LUCROS E DIVIDENDOS',color:'#4f46e5',icon:''},{name:'950.03 - INVESTIMENTOS',color:'#7c3aed',icon:''},
  {name:'970.01 - ATIVO FIXO',color:'#374151',icon:''},{name:'970.02 - COMPRA DE MÁQUINAS E EQUIPAMENTOS',color:'#374151',icon:''},{name:'970.03 - COMPRA DE SOFTWARE E APPs',color:'#1f2937',icon:''},{name:'970.04 - COMPRA DE VEÍCULOS',color:'#111827',icon:''},{name:'970.05 - MÓVEIS E ACESSÓRIOS',color:'#374151',icon:''},{name:'970.06 - COMPRA DE IMÓVEIS E TERRENOS',color:'#1f2937',icon:''},
  {name:'1100.1 - IRP SHIIPIN',color:'#991b1b',icon:''},
];

const MONTHS       = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];



const fmtBRL  = n => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
const fmtDate = s => { if(!s)return''; const[y,m,d]=s.split('-'); return`${d}/${m}/${y}`; };
const esc     = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const $       = id => document.getElementById(id);

let db, user, allExp=[], customCats=[], budgets={};
let donutChart=null, barChart=null, annualChart=null, budgetChart=null;
let sortCol='data', sortDir='desc', debounce=null;
let editStatusPago=false, expStatusPago=false;
let activeTab='dashboard';

// ── INIT ─────────────────────────────────────────────────────────────────────
(async function init(){
  db = window.supabase.createClient(SB_URL,SB_KEY);
  window.supabaseClient = db;
  const {data:{session}} = await db.auth.getSession();
  if(!session){location.href='gastos-login.html';return;}
  user=session.user;
  loadCats();
  loadBudgets();
  setLoading(true);
  await Promise.all([loadProfile(),loadExpenses()]);
  setLoading(false);
  $('pdfYear').value = new Date().getFullYear();
  $('pdfMonth').value = new Date().getMonth()+1;
  $('expDate').valueAsDate = new Date();
  populateAnnualYearFilter();
  populateBudgetMonthFilter();
  registerEvents();
})();

function setLoading(on){ $('loadingOverlay').classList.toggle('active',on); }

// ── TAB SYSTEM ───────────────────────────────────────────────────────────────
function switchTab(tabId){
  activeTab = tabId;
  document.querySelectorAll('.tab-content').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.nav-tab,.mobile-nav-btn').forEach(el=>{
    el.classList.toggle('active', el.dataset.tab===tabId);
  });
  const tabEl = $('tab-'+tabId);
  if(tabEl) tabEl.classList.add('active');

  if(tabId==='dashboard') renderDashboard();
  if(tabId==='despesas')  render();
  if(tabId==='novo')      renderQuickSummary();
  if(tabId==='orcamento') renderBudget();
  if(tabId==='relatorios'){updateExportPreview();renderAnnualChart();}
}

// ── CATEGORIES ───────────────────────────────────────────────────────────────
function loadCats(){
  const s = localStorage.getItem('bb_cats_v2_'+SB_URL);
  customCats = s ? JSON.parse(s) : [...DEFAULT_CATS];
  syncCatUI();
}
function saveCats(){
  localStorage.setItem('bb_cats_v2_'+SB_URL, JSON.stringify(customCats));
  syncCatUI();
}
function syncCatUI(){
  rebuildCatSelects();
  renderCatsModal();
  renderCatPreview();
}
function getCat(name){ return customCats.find(c=>c.name===name)||{name,color:'#64748b',icon:''}; }
function rebuildCatSelects(){
  const opts = ['<option value="">Selecione a categoria...</option>',
    ...customCats.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`)].join('');
  ['expCategory','editCategory','budgetCategory'].forEach(id=>{
    const el=$(id); if(!el)return;
    const v=el.value; el.innerHTML=opts; el.value=v;
  });
  const fc=$('filterCat');
  if(fc){const cv=fc.value; fc.innerHTML='<option value="">Todas as categorias</option>'+customCats.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join(''); fc.value=cv;}
}
function renderCatsModal(){
  const list=$('catsList'); if(!list)return;
  if(!customCats.length){list.innerHTML='<div style="text-align:center;color:var(--text3);padding:20px;font-size:13px;">Nenhuma categoria ainda.</div>';return;}
  list.innerHTML=customCats.map((c,i)=>`
    <div class="cat-row">
      <div class="cat-row-swatch" style="background:${c.color}22;color:${c.color};">▪</div>
      <span class="cat-row-name">${esc(c.name)}</span>
      <div class="cat-row-actions">
        <button class="cat-act edit" data-cat-edit="${i}" title="Editar"><i class="fas fa-pen"></i></button>
        <button class="cat-act" data-cat-del="${i}" title="Excluir"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}
function renderCatPreview(){
  const w=$('catPreview'); if(!w)return;
  w.innerHTML=customCats.slice(0,8).map(c=>`<span class="cat-chip-preview" style="background:${c.color}1a;color:${c.color};" title="${esc(c.name)}"><span style="font-size:10px;">${c.name.split(' - ')[0]}</span></span>`).join('')
    +(customCats.length>8?`<span style="font-size:11px;color:var(--text3);align-self:center;">+${customCats.length-8}</span>`:'');
}

// ── BUDGETS ──────────────────────────────────────────────────────────────────
function loadBudgets(){
  const s = localStorage.getItem('bb_budgets_'+SB_URL);
  budgets = s ? JSON.parse(s) : {};
}
function saveBudget(){
  const cat=$('budgetCategory').value;
  const amt=parseFloat($('budgetAmount').value);
  if(!cat){toast('Selecione uma categoria.','error');return;}
  if(!amt||amt<=0){toast('Informe um valor válido.','error');return;}
  budgets[cat]=amt;
  localStorage.setItem('bb_budgets_'+SB_URL, JSON.stringify(budgets));
  $('budgetAmount').value='';
  renderBudget();
  toast('Meta salva!');
}
function deleteBudget(cat){
  delete budgets[cat];
  localStorage.setItem('bb_budgets_'+SB_URL, JSON.stringify(budgets));
  renderBudget();
  toast('Meta removida.');
}

// ── TOAST & CONFIRM ───────────────────────────────────────────────────────────
function toast(msg,type='success'){
  const t=$('toast'),m={success:'fas fa-check-circle',error:'fas fa-exclamation-circle',info:'fas fa-info-circle'};
  t.querySelector('i').className=m[type]||m.success; t.className=type;
  $('toastMsg').textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3400);
}
function confirm2(title,msg){
  return new Promise(resolve=>{
    $('confirmTitle').textContent=title; $('confirmMsg').textContent=msg;
    openModal('confirmModal');
    const fresh=el=>{const n=el.cloneNode(true);el.replaceWith(n);return n;};
    const ok=fresh($('confirmOkBtn')),cancel=fresh($('confirmCancelBtn'));
    const done=r=>{closeModal('confirmModal');resolve(r);};
    ok.addEventListener('click',()=>done(true));
    cancel.addEventListener('click',()=>done(false));
  });
}

// ── MODALS ───────────────────────────────────────────────────────────────────
function openModal(id){ $(id).classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id){ $(id).classList.remove('open'); document.body.style.overflow=''; }

// ── PROFILE ──────────────────────────────────────────────────────────────────
async function loadProfile(){
  const {data:{user:u}} = await db.auth.getUser();
  if(!u)return; user=u;
  const {data:p} = await db.from('profiles').select('*').eq('id',u.id).single();
  const name   = p?.username||u.email.split('@')[0];
  const avatar = p?.avatar_url||`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;
  const since  = new Date(u.created_at).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  ['headerAvatar','dropAvatar','profileAvatarPreview'].forEach(id=>{if($(id))$(id).src=avatar;});
  [['headerUserName',name],['dropName',name],['dropEmail',u.email],
   ['profileDisplayName',name],['profileDisplayEmail',u.email],['profileSince','Membro desde '+since]
  ].forEach(([id,v])=>{if($(id))$(id).textContent=v;});
  if($('editUsername'))$('editUsername').value=p?.username||'';

  // Sync sidebar email display (v2 patch)
  const sidebarEmail = document.getElementById('headerUserEmail');
  if (sidebarEmail) sidebarEmail.textContent = u.email;

  if($('editBio'))$('editBio').value=p?.bio||'';
}
async function saveProfile(){
  const btn=$('saveProfileBtn');
  btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Salvando...';
  try{
    let avatarUrl=null;
    const fi=$('avatarInput');
    if(fi.files.length){
      const f=fi.files[0],ext=f.name.split('.').pop();
      const path=`${user.id}/${Date.now()}.${ext}`;
      const{error:e}=await db.storage.from('avatars').upload(path,f,{upsert:true});
      if(e)throw e;
      avatarUrl=db.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    }
    const pay={id:user.id,username:$('editUsername').value.trim(),bio:$('editBio').value.trim(),updated_at:new Date()};
    if(avatarUrl)pay.avatar_url=avatarUrl;
    const{error}=await db.from('profiles').upsert(pay);
    if(error)throw error;
    toast('Perfil atualizado!'); closeModal('profileModal'); await loadProfile();
  }catch(e){if(isAuthErr(e))return authExpired(); toast('Erro: '+e.message,'error');}
  finally{btn.disabled=false;btn.innerHTML='<i class="fas fa-check"></i> Salvar Alterações';}
}

// ── SUPABASE CRUD ─────────────────────────────────────────────────────────────
async function loadExpenses(){
  const{data,error}=await db.from('gastos').select('*').eq('user_id',user.id).order('data',{ascending:false});
  if(error){if(isAuthErr(error))return authExpired();toast('Erro ao carregar.','error');allExp=[];}
  else allExp=data||[];
  renderDashboard(); render();
}
async function addExp(obj){
  const{data,error}=await db.from('gastos').insert([{...obj,user_id:user.id}]).select().single();
  if(error){if(isAuthErr(error))authExpired();throw error;}
  allExp.unshift(data);return data;
}
async function updExp(id,fields){
  const{data,error}=await db.from('gastos').update(fields).eq('id',id).eq('user_id',user.id).select().single();
  if(error){if(isAuthErr(error))authExpired();throw error;}
  const i=allExp.findIndex(e=>e.id===id);if(i!==-1)allExp[i]=data;return data;
}
async function delExp(id){
  const{error}=await db.from('gastos').delete().eq('id',id).eq('user_id',user.id);
  if(error){if(isAuthErr(error))authExpired();throw error;}
  allExp=allExp.filter(e=>e.id!==id);
}
const isAuthErr = e=>{const m=(e?.message||'').toLowerCase();return m.includes('jwt')||m.includes('token')||m.includes('auth')||e?.status===401;};
const authExpired=()=>{toast('Sessão expirada. Redirecionando...','error');setTimeout(()=>location.href='gastos-login.html',1800);};

async function toggleStatus(id){
  const e=allExp.find(x=>x.id===id); if(!e)return;
  const ns=(e.status||'pendente')==='pago'?'pendente':'pago';
  e.status=ns; renderTable(getFiltered()); updateKPIs(getFiltered());
  try{await updExp(id,{status:ns});toast(ns==='pago'?'Marcado como pago.':'Marcado como pendente.');}
  catch{e.status=ns==='pago'?'pendente':'pago';renderTable(getFiltered());updateKPIs(getFiltered());toast('Erro ao atualizar status.','error');}
}

// ── FILTERS ──────────────────────────────────────────────────────────────────
function getFilteredByPeriod(period){
  const now=new Date();
  return allExp.filter(e=>{
    if(!e.data)return false;
    const d=new Date(e.data+'T00:00:00');
    if(period==='mes_atual') return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();
    if(period==='mes_anterior'){const m=new Date(now.getFullYear(),now.getMonth()-1,1);return d.getFullYear()===m.getFullYear()&&d.getMonth()===m.getMonth();}
    if(period==='trimestre'){const t=new Date(now.getFullYear(),now.getMonth()-2,1);return d>=t;}
    if(period==='ano') return d.getFullYear()===now.getFullYear();
    return true;
  });
}
function getFiltered(){
  const fM=$('filterMonth').value,fY=$('filterYear').value,
        fC=$('filterCat').value,fE=$('filterEmpresa')?.value||'',
        fS=$('filterStatus').value,q=$('searchInput').value.trim().toLowerCase();
  let r=allExp.filter(e=>{
    const[y,m]=(e.data||'').split('-');
    if(fM&&m!==fM)return false;
    if(fY&&y!==fY)return false;
    if(fC&&e.categoria!==fC)return false;
    if(fE&&(e.empresa||'')!==fE)return false;
    if(fS&&(e.status||'pendente')!==fS)return false;
    if(q&&!`${e.descricao} ${e.empresa||''} ${e.categoria}`.toLowerCase().includes(q))return false;
    return true;
  });
  return [...r].sort((a,b)=>{
    let va=a[sortCol],vb=b[sortCol];
    if(sortCol==='valor'){va=Number(va);vb=Number(vb);}
    if(va<vb)return sortDir==='asc'?-1:1;
    if(va>vb)return sortDir==='asc'?1:-1;
    return 0;
  });
}
function populateDropdowns(){
  const ms=$('filterMonth'),ys=$('filterYear'),es=$('filterEmpresa');
  const sm=new Set(),sy=new Set(),se=new Set();
  allExp.forEach(e=>{const[y,m]=(e.data||'').split('-');if(m)sm.add(m);if(y)sy.add(y);if(e.empresa)se.add(e.empresa);});
  const cm=ms.value,cy=ys.value,ce=es?.value||'';
  ms.innerHTML='<option value="">Todos os meses</option>';
  ys.innerHTML='<option value="">Todos os anos</option>';
  [...sm].sort().forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=MONTHS_SHORT[parseInt(m)-1];if(m===cm)o.selected=true;ms.appendChild(o);});
  [...sy].sort((a,b)=>b-a).forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;if(y===cy)o.selected=true;ys.appendChild(o);});
  if(es){es.innerHTML='<option value="">Todas as empresas</option>';[...se].sort().forEach(emp=>{const o=document.createElement('option');o.value=emp;o.textContent=emp;if(emp===ce)o.selected=true;es.appendChild(o);});}
}

// ── DASHBOARD RENDER ──────────────────────────────────────────────────────────
function renderDashboard(){
  const period = $('dashPeriodFilter')?.value||'mes_atual';
  const exp    = getFilteredByPeriod(period);
  updateKPIsFull(exp, period);
  renderBarChart(exp);
  renderDonut(exp);
  renderTopCats(exp);
  renderRecentExp(exp);
}
function updateKPIsFull(exp, period){
  const tot  = exp.reduce((s,e)=>s+Number(e.valor),0);
  const pend = exp.filter(e=>(e.status||'pendente')==='pendente');
  const paid = exp.filter(e=>e.status==='pago');
  const labels={mes_atual:'Este mês',mes_anterior:'Mês anterior',trimestre:'Últimos 3 meses',ano:'Este ano',todos:'Todos'};
  if($('dashPeriodLabel'))$('dashPeriodLabel').textContent=labels[period]||'';
  $('kpiTotal').textContent=fmtBRL(tot);
  $('kpiTotalSub').textContent=`${exp.length} lançamentos`;
  $('kpiPendente').textContent=fmtBRL(pend.reduce((s,e)=>s+Number(e.valor),0));
  $('kpiPendenteSub').textContent=`${pend.length} pendente${pend.length!==1?'s':''}`;
  $('kpiPago').textContent=fmtBRL(paid.reduce((s,e)=>s+Number(e.valor),0));
  $('kpiPagoSub').textContent=`${paid.length} pago${paid.length!==1?'s':''}`;
  $('kpiCount').textContent=exp.length;
  $('kpiCountSub').textContent='lançamentos';
}
function updateKPIs(exp){
  const tot=exp.reduce((s,e)=>s+Number(e.valor),0);
  const pend=exp.filter(e=>(e.status||'pendente')==='pendente');
  const paid=exp.filter(e=>e.status==='pago');
  $('kpiTotal').textContent=fmtBRL(tot);
  $('kpiTotalSub').textContent=`${exp.length} lançamentos`;
  $('kpiPendente').textContent=fmtBRL(pend.reduce((s,e)=>s+Number(e.valor),0));
  $('kpiPendenteSub').textContent=`${pend.length} pendente${pend.length!==1?'s':''}`;
  $('kpiPago').textContent=fmtBRL(paid.reduce((s,e)=>s+Number(e.valor),0));
  $('kpiPagoSub').textContent=`${paid.length} pago${paid.length!==1?'s':''}`;
  $('kpiCount').textContent=exp.length;
}
function renderTopCats(exp){
  const body=$('topCatsBody'); if(!body)return;
  const map={};exp.forEach(e=>{map[e.categoria]=(map[e.categoria]||0)+Number(e.valor);});
  const sorted=Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const max=sorted[0]?.[1]||1;
  if(!sorted.length){body.innerHTML='<div class="empty-row" style="padding:24px 0;"><i class="fas fa-inbox"></i>Sem dados.</div>';return;}
  body.innerHTML=sorted.map(([cat,val])=>{
    const c=getCat(cat); const pct=(val/max*100).toFixed(0);
    return`<div class="top-cat-item">
      <div style="width:8px;height:8px;border-radius:50%;background:${c.color};flex-shrink:0;"></div>
      <div class="top-cat-info">
        <div class="top-cat-name">${esc(cat)}</div>
        <div class="top-cat-bar-wrap"><div class="top-cat-bar" style="width:${pct}%;background:${c.color};"></div></div>
      </div>
      <div class="top-cat-val">${fmtBRL(val)}</div>
    </div>`;
  }).join('');
}
function renderRecentExp(exp){
  const body=$('recentExpBody'); if(!body)return;
  const recent=[...exp].sort((a,b)=>(b.data||'').localeCompare(a.data||'')).slice(0,6);
  if(!recent.length){body.innerHTML='<div class="empty-row" style="padding:24px 0;"><i class="fas fa-inbox"></i>Sem dados.</div>';return;}
  body.innerHTML=recent.map(e=>{
    const c=getCat(e.categoria);
    return`<div class="recent-item">
      <div class="recent-dot" style="background:${c.color};"></div>
      <div class="recent-info">
        <div class="recent-desc">${esc(e.descricao)}</div>
        <div class="recent-date">${fmtDate(e.data)} · ${esc(e.categoria.split(' - ')[0])}</div>
      </div>
      <div class="recent-val">${fmtBRL(Number(e.valor))}</div>
    </div>`;
  }).join('');
}
function renderQuickSummary(){
  const now=new Date();
  const thisMonth=allExp.filter(e=>{
    if(!e.data)return false;
    const[y,m]=e.data.split('-');
    return parseInt(y)===now.getFullYear()&&parseInt(m)-1===now.getMonth();
  });
  const total=thisMonth.reduce((s,e)=>s+Number(e.valor),0);
  const pend=thisMonth.filter(e=>(e.status||'pendente')==='pendente').reduce((s,e)=>s+Number(e.valor),0);
  const paid=thisMonth.filter(e=>e.status==='pago').reduce((s,e)=>s+Number(e.valor),0);

  const body=$('quickSummaryBody'); if(!body)return;
  body.innerHTML=`
    <div class="summary-item"><span class="summary-item-label">Total do mês</span><span class="summary-item-val">${fmtBRL(total)}</span></div>
    <div class="summary-item"><span class="summary-item-label">Pago</span><span class="summary-item-val green">${fmtBRL(paid)}</span></div>
    <div class="summary-item"><span class="summary-item-label">Pendente</span><span class="summary-item-val orange">${fmtBRL(pend)}</span></div>
    <div class="summary-item"><span class="summary-item-label">Lançamentos</span><span class="summary-item-val">${thisMonth.length}</span></div>
  `;

  const lastBody=$('lastAddedBody'); if(!lastBody)return;
  const last=allExp.slice(0,5);
  if(!last.length){lastBody.innerHTML='<div class="empty-row" style="padding:16px 0;"><i class="fas fa-inbox"></i>Nenhum ainda.</div>';return;}
  lastBody.innerHTML=last.map(e=>{
    const c=getCat(e.categoria);
    return`<div class="recent-item">
      <div class="recent-dot" style="background:${c.color};"></div>
      <div class="recent-info">
        <div class="recent-desc">${esc(e.descricao)}</div>
        <div class="recent-date">${fmtDate(e.data)}</div>
      </div>
      <div class="recent-val">${fmtBRL(Number(e.valor))}</div>
    </div>`;
  }).join('');
}

// ── CHARTS ───────────────────────────────────────────────────────────────────
function renderBarChart(exp){
  const now=new Date(); const monthly={};
  for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);monthly[`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`]=0;}
  (exp||allExp).forEach(e=>{const[y,m]=(e.data||'').split('-'),k=`${y}-${m}`;if(k in monthly)monthly[k]+=Number(e.valor);});
  const labels=Object.keys(monthly).map(k=>MONTHS_SHORT[parseInt(k.split('-')[1])-1]);
  const data=Object.values(monthly);
  const {bg, border: bd} = getBarColors(data);
  if(barChart){barChart.data.labels=labels;barChart.data.datasets[0].data=data;const {bg: newBg, border: newBd} = getBarColors(data); barChart.data.datasets[0].backgroundColor=newBg;barChart.data.datasets[0].borderColor=newBd;barChart.update('active');return;}
  const ctx=$('barChart').getContext('2d');
  barChart=new Chart(ctx,{type:'bar',data:{labels,datasets:[{data,backgroundColor:bg,borderColor:bd,borderWidth:1,borderRadius:6,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>` ${fmtBRL(c.raw)}`}}},scales:{x:{grid:{display:false},ticks:{color:'#94a3b8',font:{size:10}}},y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{color:'#94a3b8',font:{size:10},callback:v=>'R$'+(v>=1000?(v/1000).toFixed(1)+'k':v)}}}}});
}
function renderDonut(exp){
  const map={};(exp||allExp).forEach(e=>{map[e.categoria]=(map[e.categoria]||0)+Number(e.valor);});
  const labels=Object.keys(map),data=Object.values(map);
  const colors=labels.map(l=>getCat(l).color);
  const total=data.reduce((s,v)=>s+v,0);
  if($('donutMeta'))$('donutMeta').textContent=total>0?fmtBRL(total):'';
  const ttCb=c=>` ${c.label}: ${fmtBRL(c.raw)} (${((c.raw/total)*100).toFixed(1)}%)`;
  if(donutChart){donutChart.data.labels=labels;donutChart.data.datasets[0].data=data;donutChart.data.datasets[0].backgroundColor=colors;donutChart.options.plugins.tooltip.callbacks.label=ttCb;donutChart.update('active');}
  else{const ctx=$('donutChart').getContext('2d');donutChart=new Chart(ctx,{type:'doughnut',data:{labels,datasets:[{data,backgroundColor:colors,borderWidth:3,borderColor: document.documentElement.getAttribute('data-theme')==='dark' ? '#1c2333' : '#ffffff', hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:ttCb}}}}});}
  if($('donutLegend'))$('donutLegend').innerHTML=labels.slice(0,8).map((l,i)=>`<div class="legend-item"><div class="legend-dot" style="background:${colors[i]};"></div>${esc(l.split(' - ')[0])}</div>`).join('');
}

// ── TABLE RENDER ─────────────────────────────────────────────────────────────
function render(){
  populateDropdowns();
  const f=getFiltered();
  updateKPIs(f);
  renderTable(f);
  updateExportPreview();
}
function renderTable(exp){
  if($('tableCount'))$('tableCount').textContent=`${exp.length} registro(s)`;
  document.querySelectorAll('thead th.sortable').forEach(th=>{
    const ico=th.querySelector('i'),col=th.dataset.col;
    ico.className=col===sortCol?(sortDir==='asc'?'fas fa-sort-up sort-ico on':'fas fa-sort-down sort-ico on'):'fas fa-sort sort-ico';
  });
  const tbody=$('expBody');
  if(!exp.length){tbody.innerHTML='<tr><td colspan="7"><div class="empty-row"><i class="fas fa-inbox"></i>Nenhuma despesa encontrada.</div></td></tr>';return;}
  tbody.innerHTML=exp.map(e=>{
    const cd=getCat(e.categoria),pago=(e.status||'pendente')==='pago';
    const emp=e.empresa?`<span class="td-emp">${esc(e.empresa)}</span>`:'';
    return`<tr data-id="${e.id}">
      <td><span class="td-date">${fmtDate(e.data)}</span></td>
      <td><span class="td-desc" title="${esc(e.descricao)}">${esc(e.descricao)}</span>${emp}</td>
      <td><span class="cat-pill" style="background:${cd.color}1a;color:${cd.color};">${esc(e.categoria.split(' - ')[0])}</span></td>
      <td><span class="pay-chip">${esc(e.pagamento)}</span></td>
      <td>
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;user-select:none;">
          <button type="button" class="toggle-track ${pago?'on':''}" data-toggle="${e.id}" style="margin:0;"></button>
          <span style="font-size:11px;font-weight:700;color:${pago?'var(--green)':'var(--text3)'};">${pago?'Pago':'Pendente'}</span>
        </label>
      </td>
      <td><span class="amt" style="color:${cd.color};">${fmtBRL(Number(e.valor))}</span></td>
      <td style="display:flex;gap:4px;justify-content:flex-end;">
        <button class="btn-edit" data-edit="${e.id}" title="Editar"><i class="fas fa-pen"></i></button>
        <button class="btn-del" data-del="${e.id}" title="Excluir"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

// ── BUDGET ───────────────────────────────────────────────────────────────────
function renderBudget(){
  const monthVal = $('budgetMonthFilter')?.value || '';
  const now = new Date();
  let targetY = now.getFullYear(), targetM = now.getMonth();
  if(monthVal){const[y,m]=monthVal.split('-');targetY=parseInt(y);targetM=parseInt(m)-1;}
  const monthExp = allExp.filter(e=>{
    if(!e.data)return false;
    const[y,m]=e.data.split('-');
    return parseInt(y)===targetY&&parseInt(m)-1===targetM;
  });

  const spent={};
  monthExp.forEach(e=>{spent[e.categoria]=(spent[e.categoria]||0)+Number(e.valor);});

  const entries=Object.entries(budgets).sort((a,b)=>b[1]-a[1]);
  const body=$('budgetListBody'); if(!body)return;

  if(!entries.length){
    body.innerHTML='<div class="empty-row"><i class="fas fa-bullseye"></i>Nenhum orçamento definido ainda.</div>';
    renderBudgetChart([]);
    if($('budgetSummaryMeta'))$('budgetSummaryMeta').textContent='';
    return;
  }

  const overCount=entries.filter(([cat,limit])=>(spent[cat]||0)>limit).length;
  if($('budgetSummaryMeta'))$('budgetSummaryMeta').textContent=overCount>0?`⚠ ${overCount} categoria${overCount>1?'s':''} acima do limite`:'✓ Tudo dentro do orçamento';

  body.innerHTML=entries.map(([cat,limit])=>{
    const s=spent[cat]||0,pct=Math.min((s/limit)*100,100).toFixed(0);
    const cls=pct>=100?'over':pct>=75?'warn':'ok';
    const c=getCat(cat);
    return`<div class="budget-item">
      <div class="budget-item-head">
        <span class="budget-item-name">${esc(cat)}</span>
        <div>
          <div class="budget-item-vals">
            <span class="budget-item-val-spent" style="color:${cls==='over'?'var(--red)':cls==='warn'?'var(--orange)':'var(--green)'};">${fmtBRL(s)}</span>
            <span style="color:var(--text3);"> / ${fmtBRL(limit)}</span>
          </div>
          <button class="budget-item-del" data-budget-del="${esc(cat)}" title="Remover meta"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="budget-bar-wrap"><div class="budget-bar ${cls}" style="width:${pct}%;background:${c.color};"></div></div>
    </div>`;
  }).join('');

  renderBudgetChart(entries.map(([cat,limit])=>({cat,limit,spent:spent[cat]||0,color:getCat(cat).color})));
}
function renderBudgetChart(data){
  const labels=data.map(d=>d.cat.split(' - ')[0]);
  const spentD=data.map(d=>d.spent);
  const limitD=data.map(d=>d.limit);
  const colors=data.map(d=>d.color);
  if(budgetChart){
    budgetChart.data.labels=labels;
    budgetChart.data.datasets[0].data=spentD;
    budgetChart.data.datasets[0].backgroundColor=colors.map(c=>c+'88');
    budgetChart.data.datasets[1].data=limitD;
    budgetChart.update('active');
    return;
  }
  const wrap=$('budgetChartWrap'); if(!wrap)return;
  const canvas=wrap.querySelector('canvas'); if(!canvas)return;
  const ctx=canvas.getContext('2d');
  budgetChart=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'Gasto',data:spentD,backgroundColor:colors.map(c=>c+'88'),borderColor:colors,borderWidth:1,borderRadius:4},{label:'Limite',data:limitD,backgroundColor:'rgba(148,163,184,.15)',borderColor:'rgba(148,163,184,.4)',borderWidth:1,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,labels:{color:'#475569',font:{size:11}}},tooltip:{...TT,callbacks:{label:c=>` ${c.dataset.label}: ${fmtBRL(c.raw)}`}}},scales:{x:{grid:{display:false},ticks:{color:'#94a3b8',font:{size:9}}},y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{color:'#94a3b8',font:{size:10},callback:v=>'R$'+(v>=1000?(v/1000).toFixed(1)+'k':v)}}}}});
}
function populateBudgetMonthFilter(){
  const sel=$('budgetMonthFilter'); if(!sel)return;
  const now=new Date();
  sel.innerHTML='<option value="">Mês atual</option>';
  for(let i=1;i<=11;i++){
    const d=new Date(now.getFullYear(),now.getMonth()-i,1);
    const val=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    sel.innerHTML+=`<option value="${val}">${MONTHS[d.getMonth()]} ${d.getFullYear()}</option>`;
  }
}

// ── ANNUAL CHART ──────────────────────────────────────────────────────────────
function populateAnnualYearFilter(){
  const sel=$('annualYearFilter'); if(!sel)return;
  const years=new Set(allExp.map(e=>(e.data||'').split('-')[0]).filter(Boolean));
  const now=new Date().getFullYear();
  years.add(String(now));
  sel.innerHTML=[...years].sort((a,b)=>b-a).map(y=>`<option value="${y}">${y}</option>`).join('');
  renderAnnualChart();
}
function renderAnnualChart(){
  const sel=$('annualYearFilter'); if(!sel)return;
  const year=parseInt(sel.value||new Date().getFullYear());
  const monthly=Array(12).fill(0);
  allExp.forEach(e=>{
    if(!e.data)return;
    const[y,m]=e.data.split('-');
    if(parseInt(y)===year)monthly[parseInt(m)-1]+=Number(e.valor);
  });
  const total=monthly.reduce((s,v)=>s+v,0);
  const maxM=Math.max(...monthly);
  const topMIdx=monthly.indexOf(maxM);
  if($('annualSummary'))$('annualSummary').innerHTML=`
    <div class="annual-stat"><div class="annual-stat-val">${fmtBRL(total)}</div><div class="annual-stat-lbl">Total ${year}</div></div>
    <div class="annual-stat"><div class="annual-stat-val">${fmtBRL(total/12)}</div><div class="annual-stat-lbl">Média mensal</div></div>
    <div class="annual-stat"><div class="annual-stat-val">${MONTHS_SHORT[topMIdx]}</div><div class="annual-stat-lbl">Maior mês</div></div>
  `;
  const bg=monthly.map((_,i)=>i===topMIdx?'rgba(5,150,105,.85)':'rgba(5,150,105,.2)');
  if(annualChart){annualChart.data.datasets[0].data=monthly;annualChart.data.datasets[0].backgroundColor=monthly.map((_,i)=>i===topMIdx?'rgba(5,150,105,.85)':'rgba(5,150,105,.2)');annualChart.update('active');return;}
  const ctx=$('annualChart')?.getContext('2d'); if(!ctx)return;
  annualChart=new Chart(ctx,{type:'bar',data:{labels:MONTHS_SHORT,datasets:[{data:monthly,backgroundColor:bg,borderColor:monthly.map((_,i)=>i===topMIdx?'#059669':'rgba(5,150,105,.4)'),borderWidth:1,borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>` ${fmtBRL(c.raw)}`}}},scales:{x:{grid:{display:false},ticks:{color:'#94a3b8',font:{size:10}}},y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{color:'#94a3b8',font:{size:10},callback:v=>'R$'+(v>=1000?(v/1000).toFixed(1)+'k':v)}}}}});
}

// ── PDF ───────────────────────────────────────────────────────────────────────
function updateExportPreview(){
  const mo=parseInt($('pdfMonth').value),yr=parseInt($('pdfYear').value);
  const ms=String(mo).padStart(2,'0'),ys=String(yr);
  const exp=allExp.filter(e=>{const[y,m]=(e.data||'').split('-');return y===ys&&m===ms;});
  const tot=exp.reduce((s,e)=>s+Number(e.valor),0);
  const pend=exp.filter(e=>(e.status||'pendente')==='pendente').reduce((s,e)=>s+Number(e.valor),0);
  $('prevPeriod').textContent=`${MONTHS[mo-1]} de ${yr}`;
  $('prevCount').textContent=`${exp.length} lançamentos`;
  $('prevPend').textContent=fmtBRL(pend);
  $('prevTotal').textContent=fmtBRL(tot);
}
function generatePDF(){
  const{jsPDF}=window.jspdf;
  const mo=parseInt($('pdfMonth').value),yr=parseInt($('pdfYear').value);
  const co=$('pdfCompany').value.trim()||'BuyBrazil10';
  const ms=String(mo).padStart(2,'0'),ys=String(yr),per=`${MONTHS[mo-1]} de ${yr}`;
  const exp=allExp.filter(e=>{const[y,m]=(e.data||'').split('-');return y===ys&&m===ms;}).sort((a,b)=>a.data.localeCompare(b.data));
  if(!exp.length){toast(`Nenhum lançamento em ${per}.`,'info');return;}
  const tot=exp.reduce((s,e)=>s+Number(e.valor),0);
  const pend=exp.filter(e=>(e.status||'pendente')==='pendente').reduce((s,e)=>s+Number(e.valor),0);
  const paid=exp.filter(e=>e.status==='pago').reduce((s,e)=>s+Number(e.valor),0);
  const cats={};exp.forEach(e=>cats[e.categoria]=(cats[e.categoria]||0)+Number(e.valor));
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
  const D=[15,23,42],B=[37,99,235],BL=[239,246,255],G=[71,85,105],GL=[248,250,255],W_=[255,255,255];
  doc.setFillColor(...D);doc.rect(0,0,W,44,'F');
  doc.setFillColor(...B);doc.rect(0,44,W,3,'F');
  doc.setTextColor(...W_);doc.setFont('helvetica','bold');doc.setFontSize(20);doc.text(co,14,18);
  doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(180,175,166);
  doc.text('RELATÓRIO DE DESPESAS — PLANO DE CONTAS ERP',14,26);
  doc.text(`Período: ${per}`,14,33);doc.text(`Emitido: ${new Date().toLocaleDateString('pt-BR')}`,14,39);
  doc.setTextColor(...W_);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('TOTAL',W-14,28,{align:'right'});
  doc.setFontSize(18);doc.text(fmtBRL(tot),W-14,38,{align:'right'});
  const sy=55,cw=(W-28)/3;
  [{l:'Lançamentos',v:String(exp.length)},{l:'Total Pago',v:fmtBRL(paid)},{l:'Total Pendente',v:fmtBRL(pend)}].forEach((it,i)=>{
    const x=14+i*cw;
    doc.setFillColor(...BL);doc.roundedRect(x,sy,cw-4,20,3,3,'F');
    doc.setTextColor(...G);doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.text(it.l.toUpperCase(),x+5,sy+7);
    doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(...D);doc.text(it.v,x+5,sy+15);
  });
  const ty=sy+28;
  doc.setFont('helvetica','bold');doc.setFontSize(11);doc.setTextColor(...D);doc.text('Detalhamento de Despesas',14,ty-4);
  doc.autoTable({startY:ty,margin:{left:14,right:14},
    head:[['Data','Descrição','Empresa','Categoria','Pagamento','Status','Valor']],
    body:exp.map(e=>[fmtDate(e.data),e.descricao,e.empresa||'—',e.categoria,e.pagamento,(e.status||'pendente').toUpperCase(),fmtBRL(Number(e.valor))]),
    headStyles:{fillColor:B,textColor:W_,fontStyle:'bold',fontSize:7,cellPadding:3},
    bodyStyles:{fontSize:7,cellPadding:{top:3,bottom:3,left:3,right:3},textColor:G},
    alternateRowStyles:{fillColor:GL},
    columnStyles:{0:{cellWidth:18},1:{cellWidth:'auto'},2:{cellWidth:26},3:{cellWidth:32},4:{cellWidth:20},5:{cellWidth:17},6:{cellWidth:22,halign:'right',fontStyle:'bold',textColor:D}},
    foot:[['','','','','','TOTAL',{content:fmtBRL(tot),styles:{fontStyle:'bold',halign:'right',textColor:B,fontSize:9}}]],
    footStyles:{fillColor:BL,textColor:D,fontStyle:'bold',fontSize:7},showFoot:'lastPage'
  });
  const ay=doc.lastAutoTable.finalY+10,pr=H-ay-20;
  const ce=Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  if(pr<ce.length*12+18)doc.addPage();
  const cy2=pr<ce.length*12+18?20:ay;
  doc.setFont('helvetica','bold');doc.setFontSize(11);doc.setTextColor(...D);doc.text('Resumo por Categoria',14,cy2);
  ce.forEach(([cat,val],i)=>{
    const ry=cy2+8+i*12;if(ry+8>H-20)return;
    const pct=tot>0?val/tot:0,bw=W-28-50;
    doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(...G);
    doc.text(cat,14,ry+4);doc.text(fmtBRL(val),W-14,ry+4,{align:'right'});
    doc.setFontSize(7);doc.setTextColor(180,175,166);doc.text(`${(pct*100).toFixed(1)}%`,W-14-28,ry+4,{align:'right'});
    doc.setFillColor(227,225,221);doc.roundedRect(52,ry-1,bw,5,2,2,'F');
    doc.setFillColor(...B);doc.roundedRect(52,ry-1,Math.max(bw*pct,2),5,2,2,'F');
  });
  const tp=doc.internal.getNumberOfPages();
  for(let i=1;i<=tp;i++){doc.setPage(i);doc.setFillColor(248,250,255);doc.rect(0,H-11,W,11,'F');doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(180,175,166);doc.text(`${co} — Relatório ERP ${per}`,14,H-4);doc.text(`${i}/${tp}`,W-14,H-4,{align:'right'});}
  doc.save(`despesas_${MONTHS[mo-1].toLowerCase()}_${yr}.pdf`);
  toast('PDF gerado com sucesso!');
}

// ── CSV EXPORT ────────────────────────────────────────────────────────────────
function exportCSV(){
  const from=$('csvDateFrom').value, to=$('csvDateTo').value;
  let data=allExp;
  if(from)data=data.filter(e=>e.data>=from);
  if(to)data=data.filter(e=>e.data<=to);
  if(!data.length){toast('Nenhum registro no período selecionado.','info');return;}
  const headers=['Data','Descrição','Empresa','Categoria','Pagamento','Status','Valor (R$)'];
  const rows=data.map(e=>[fmtDate(e.data),`"${(e.descricao||'').replace(/"/g,'""')}"`,`"${(e.empresa||'').replace(/"/g,'""')}"`,`"${(e.categoria||'').replace(/"/g,'""')}"`,e.pagamento||'',(e.status||'pendente').toUpperCase(),Number(e.valor).toFixed(2).replace('.',',')]);
  const csv=[headers.join(';'),...rows.map(r=>r.join(';'))].join('\n');
  const bom='\uFEFF';
  const blob=new Blob([bom+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;
  const label=from&&to?`${from}_${to}`:from?`de_${from}`:to?`ate_${to}`:'todos';
  a.download=`despesas_${label}.csv`;a.click();
  URL.revokeObjectURL(url);
  toast(`CSV exportado: ${data.length} registros!`);
}

// ── EDIT MODAL ────────────────────────────────────────────────────────────────
function openEdit(id){
  const e=allExp.find(x=>x.id===id);if(!e)return;
  $('editId').value=e.id;$('editValue').value=e.valor;$('editDesc').value=e.descricao;
  $('editEmpresa').value=e.empresa||'';$('editCategory').value=e.categoria;
  $('editDate').value=e.data;$('editPayment').value=e.pagamento;
  editStatusPago=(e.status||'pendente')==='pago';
  setToggle($('editStatusToggle'),null,editStatusPago);
  $('editStatusLabel').textContent=editStatusPago?'Pago':'Pendente';
  $('editStatusLabel').className='status-label '+(editStatusPago?'on':'off');
  $('editStatusHint').textContent=editStatusPago?'Clique para marcar como pendente':'Clique para marcar como pago';
  openModal('editModal');
}

// ── TOGGLE HELPER ─────────────────────────────────────────────────────────────
function setToggle(trackEl,labelEl,on){
  trackEl.classList.toggle('on',on);
  if(labelEl){labelEl.textContent=on?'Pago':'Pendente';labelEl.className='status-label '+(on?'on':'off');}
}

// ── VALIDATE ─────────────────────────────────────────────────────────────────
function validate(){
  let ok=true;
  [{id:'expValue',err:'errValue',fn:el=>!el.value||parseFloat(el.value)<=0,msg:'Valor inválido.'},
   {id:'expDesc',err:'errDesc',fn:el=>!el.value.trim(),msg:'Informe uma descrição.'},
   {id:'expCategory',err:'errCategory',fn:el=>!el.value,msg:'Selecione uma categoria.'},
   {id:'expPayment',err:'errPayment',fn:el=>!el.value,msg:'Selecione o pagamento.'}
  ].forEach(({id,err,fn,msg})=>{
    const el=$(id),ee=$(err);const fail=fn(el);
    ee.textContent=fail?msg:'';el.classList.toggle('err',fail);if(fail)ok=false;
  });
  return ok;
}
function clrErr(el){el.classList.remove('err');const m={expValue:'errValue',expDesc:'errDesc',expCategory:'errCategory',expPayment:'errPayment'};if(m[el.id])$(m[el.id]).textContent='';}

// ── EVENTS ────────────────────────────────────────────────────────────────────
function registerEvents(){
  // tab navigation
  document.querySelectorAll('.nav-tab,.mobile-nav-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{ if(btn.dataset.tab) switchTab(btn.dataset.tab); });
  });

  // profile dropdown
  const pb=$('profileBtn'),pd=$('profileDrop');
  pb.addEventListener('click',e=>{e.stopPropagation();pd.classList.toggle('open');});
  document.addEventListener('click',()=>pd.classList.remove('open'));
  pd.addEventListener('click',e=>e.stopPropagation());

  $('openProfileBtn').addEventListener('click',()=>{pd.classList.remove('open');openModal('profileModal');});
  $('saveProfileBtn').addEventListener('click',saveProfile);
  $('logoutBtn').addEventListener('click',async()=>{await db.auth.signOut();location.href='gastos-login.html';});

  // modals
  document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.dataset.close)));
  ['profileModal','confirmModal','editModal','catsModal'].forEach(id=>{
    $(id).addEventListener('click',e=>{if(e.target.id===id)closeModal(id);});
  });

  // cats modal
  $('openCatsBtn').addEventListener('click',()=>openModal('catsModal'));
  $('catsList').addEventListener('click',e=>{
    const del=e.target.closest('[data-cat-del]'),edt=e.target.closest('[data-cat-edit]');
    if(del){customCats.splice(parseInt(del.dataset.catDel),1);saveCats();render();}
    if(edt){const i=parseInt(edt.dataset.catEdit),c=customCats[i];$('newCatColor').value=c.color;$('newCatName').value=c.name;$('newCatIcon').value=c.icon;customCats.splice(i,1);saveCats();$('newCatName').focus();}
  });
  $('addCatBtn').addEventListener('click',()=>{
    const name=$('newCatName').value.trim(),color=$('newCatColor').value||'#64748b',icon=$('newCatIcon').value.trim()||'📌';
    if(!name){toast('Informe o nome da categoria.','error');return;}
    if(customCats.find(c=>c.name===name)){toast('Categoria já existe.','info');return;}
    customCats.push({name,color,icon});saveCats();render();$('newCatName').value='';$('newCatIcon').value='';toast('Categoria adicionada!');
  });

  // edit modal
  $('editStatusToggle').addEventListener('click',()=>{
    editStatusPago=!editStatusPago;
    setToggle($('editStatusToggle'),null,editStatusPago);
    $('editStatusLabel').textContent=editStatusPago?'Pago':'Pendente';
    $('editStatusLabel').className='status-label '+(editStatusPago?'on':'off');
    $('editStatusHint').textContent=editStatusPago?'Clique para marcar como pendente':'Clique para marcar como pago';
  });
  $('saveEditBtn').addEventListener('click',async()=>{
    const id=$('editId').value,btn=$('saveEditBtn');
    btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
    try{
      await updExp(id,{valor:parseFloat($('editValue').value),descricao:$('editDesc').value.trim(),empresa:$('editEmpresa').value.trim(),categoria:$('editCategory').value,data:$('editDate').value,pagamento:$('editPayment').value,status:editStatusPago?'pago':'pendente'});
      closeModal('editModal');render();renderDashboard();toast('Lançamento atualizado!');
    }catch(e){toast('Erro: '+e.message,'error');}
    finally{btn.disabled=false;btn.innerHTML='<i class="fas fa-check"></i> Salvar Alterações';}
  });

  // new expense form
  $('expStatusToggle').addEventListener('click',()=>{
    expStatusPago=!expStatusPago;
    setToggle($('expStatusToggle'),$('expStatusLabel'),expStatusPago);
  });
  $('expForm').addEventListener('submit',async e=>{
    e.preventDefault();if(!validate())return;
    const btn=$('btnAdd');btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Registrando...';
    try{
      await addExp({valor:parseFloat($('expValue').value),descricao:$('expDesc').value.trim(),empresa:$('expEmpresa').value.trim(),categoria:$('expCategory').value,data:$('expDate').value,pagamento:$('expPayment').value,status:expStatusPago?'pago':'pendente'});
      $('expForm').reset();$('expDate').valueAsDate=new Date();
      expStatusPago=false;setToggle($('expStatusToggle'),$('expStatusLabel'),false);
      render();renderDashboard();renderQuickSummary();toast('Despesa registrada!');
    }catch(err){toast('Erro: '+err.message,'error');}
    finally{btn.disabled=false;btn.innerHTML='<i class="fas fa-plus"></i> Registrar Despesa';}
  });
  ['expValue','expDesc','expCategory','expPayment'].forEach(id=>{
    $(id).addEventListener('input',e=>clrErr(e.target));
    $(id).addEventListener('change',e=>clrErr(e.target));
  });

  // filters
  ['filterMonth','filterYear','filterCat','filterEmpresa','filterStatus'].forEach(id=>$(id)?.addEventListener('change',render));
  const si=$('searchInput'),sc=$('searchClearBtn');
  si.addEventListener('input',()=>{sc.style.display=si.value?'flex':'none';clearTimeout(debounce);debounce=setTimeout(render,220);});
  sc.addEventListener('click',()=>{si.value='';sc.style.display='none';render();});
  $('clearFiltersBtn').addEventListener('click',()=>{
    ['filterMonth','filterYear','filterCat','filterEmpresa','filterStatus'].forEach(id=>{const el=$(id);if(el)el.value='';});
    si.value='';sc.style.display='none';render();
  });

  // sort
  document.querySelectorAll('thead th.sortable').forEach(th=>{
    th.addEventListener('click',()=>{
      const col=th.dataset.col;
      if(sortCol===col)sortDir=sortDir==='asc'?'desc':'asc';
      else{sortCol=col;sortDir=col==='valor'?'desc':'asc';}
      render();
    });
  });

  // table actions
  $('expBody').addEventListener('click',async e=>{
    const tog=e.target.closest('[data-toggle]'),edt=e.target.closest('[data-edit]'),del=e.target.closest('[data-del]'),row=e.target.closest('[data-id]');
    if(tog){e.stopPropagation();await toggleStatus(tog.dataset.toggle);return;}
    if(del){e.stopPropagation();const ok=await confirm2('Excluir lançamento','Tem certeza? Esta ação não pode ser desfeita.');if(!ok)return;try{await delExp(del.dataset.del);render();renderDashboard();toast('Excluído.');}catch{toast('Erro ao excluir.','error');}return;}
    if(edt){e.stopPropagation();openEdit(edt.dataset.edit);return;}
    if(row)openEdit(row.dataset.id);
  });

  // pdf
  ['pdfMonth','pdfYear'].forEach(id=>$(id).addEventListener('change',updateExportPreview));
  $('exportPdfBtn').addEventListener('click',()=>{
    const btn=$('exportPdfBtn');btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Gerando...';
    setTimeout(()=>{try{generatePDF();}catch(e){toast('Erro PDF: '+e.message,'error');}finally{btn.disabled=false;btn.innerHTML='<i class="fas fa-download"></i> Gerar e Baixar PDF';}},80);
  });

  // csv
  $('exportCsvBtn').addEventListener('click',exportCSV);

  // annual chart year filter
  $('annualYearFilter')?.addEventListener('change',renderAnnualChart);

  // budget
  $('saveBudgetBtn').addEventListener('click',saveBudget);
  $('budgetMonthFilter')?.addEventListener('change',renderBudget);
  document.addEventListener('click',e=>{
    const del=e.target.closest('[data-budget-del]');
    if(del)deleteBudget(del.dataset.budgetDel);
  });

  // dashboard period filter
  $('dashPeriodFilter')?.addEventListener('change',renderDashboard);
}
