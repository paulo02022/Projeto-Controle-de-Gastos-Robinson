'use strict';
const SB_URL = 'https://dggxhpjevvixiwtflnar.supabase.co';
const SB_KEY = 'sb_publishable_1ZM1iv0lxkSCSlfkCsyG7w_xZfaQ1fM';

// ── GRUPOS E CATEGORIAS (Fonte: Plano de Contas ERP XLS) ───────────────────
const CAT_GROUPS = {
  '1000':['#0891b2','RECEITAS POR CANAL DE VENDAS'],
  '120': ['#ef4444','DEVOLUÇÕES DE VENDAS'],
  '200': ['#7c3aed','SERVIÇOS INTERNACIONAIS'],
  '280': ['#0ea5e9','FRETES FOB E CIF'],
  '300': ['#dc2626','IMPOSTOS E TAXAS'],
  '400': ['#d97706','DESPESAS FINANCEIRAS'],
  '500': ['#059669','COLABORADORES / FUNCIONÁRIOS'],
  '600': ['#ec4899','DESPESAS COMERCIAIS'],
  '700': ['#78716c','DESPESAS DIVERSAS'],
  '750': ['#6366f1','DESLOCAMENTOS OP.'],
  '800': ['#1d4ed8','CUSTOS FIXOS'],
  '900': ['#a855f7','MARKETING'],
  '940': ['#06b6d4','TECNOLOGIA'],
  '950': ['#4f46e5','DIRETORIA'],
  '970': ['#374151','AQUISIÇÕES (ATIVO FÍSICO)'],
};

const DEFAULT_CATS = [
  // 1000 - RECEITAS POR CANAL DE VENDAS
  { name:'1000.01 - MATRIZ VENDEDORES',    color:'#0891b2', icon:'' },
  { name:'1000.02 - BUY BRAZIL VIRTUAL',   color:'#0e7490', icon:'' },
  { name:'1000.03 - BELAWAYS B2B',         color:'#0284c7', icon:'' },
  { name:'1000.04 - AJUSTE CONTAS',        color:'#0369a1', icon:'' },
  { name:'1000.05 - BELAWAYS BR VIRTUAL',  color:'#075985', icon:'' },
  { name:'1000.06 - MERCADO LIVRE',        color:'#f59e0b', icon:'' },
  { name:'1000.07 - AMAZON BR',            color:'#ea580c', icon:'' },
  { name:'1000.08 - MAGALU MKT',           color:'#ec4899', icon:'' },
  { name:'1001.01 - COMPRA SÓCIOS',        color:'#0891b2', icon:'' },
  // 120 - DEVOLUÇÕES DE VENDAS
  { name:'120.10 - CUSTOS OP. DE DEVOLUÇÕES', color:'#ef4444', icon:'' },
  { name:'120.11 - PERDA DE CONTESTAÇÕES',    color:'#dc2626', icon:'' },
  // 200 - SERVIÇOS INTERNACIONAIS
  { name:'200.01 - LOGÍSTICA',             color:'#7c3aed', icon:'' },
  // 280 - FRETES FOB E CIF
  { name:'280.01 - CORREIOS',              color:'#0ea5e9', icon:'' },
  { name:'280.02 - FEDEX',                 color:'#6366f1', icon:'' },
  { name:'280.03 - FEDEX (GUILHERME)',     color:'#4f46e5', icon:'' },
  { name:'280.04 - FEDEX (DENIS)',         color:'#4338ca', icon:'' },
  { name:'280.05 - FEDEX (BRUNO)',         color:'#3730a3', icon:'' },
  { name:'280.06 - FEDEX (MARCOS)',        color:'#312e81', icon:'' },
  { name:'280.07 - FEDEX (LUCIANO)',       color:'#1e1b4b', icon:'' },
  { name:'280.08 - APP UBER/99',           color:'#1e293b', icon:'' },
  { name:'280.09 - OUTROS',               color:'#334155', icon:'' },
  { name:'280.10 - FEDEX (ROBERTA)',       color:'#475569', icon:'' },
  { name:'280.12 - FEDEX (PAULO)',         color:'#64748b', icon:'' },
  { name:'280.13 - FEDEX (ROBINSON JR)',   color:'#6366f1', icon:'' },
  { name:'280.15 - DHL',                   color:'#dc2626', icon:'' },
  { name:'280.19 - FEDEX (ADRIANO)',       color:'#b91c1c', icon:'' },
  { name:'280.20 - UPS',                   color:'#92400e', icon:'' },
  { name:'280.21 - TRANSPORTADORAS',       color:'#78350f', icon:'' },
  { name:'280.22 - FRETES, MOTOS E CARRETOS', color:'#d97706', icon:'' },
  // 300 - IMPOSTOS E TAXAS
  { name:'300.01 - DASN',                  color:'#dc2626', icon:'' },
  { name:'300.02 - PIS',                   color:'#b91c1c', icon:'' },
  { name:'300.03 - CONFINS',               color:'#991b1b', icon:'' },
  { name:'300.04 - IRPJ',                  color:'#7f1d1d', icon:'' },
  { name:'300.05 - TAX. E TRIB. ALFANDEGÁRIOS', color:'#c2410c', icon:'' },
  // 400 - DESPESAS FINANCEIRAS
  { name:'400.01 - TARIFAS BANCÁRIAS',     color:'#d97706', icon:'' },
  { name:'400.02 - TX CARTÕES E ALUGUÉIS DE MAQUINETAS', color:'#b45309', icon:'' },
  { name:'400.03 - TAXAS PLATAFORMAS',     color:'#92400e', icon:'' },
  // 500 - COLABORADORES / FUNCIONÁRIOS
  { name:'500.01 - SALÁRIO',               color:'#059669', icon:'' },
  { name:'500.02 - BONIFICAÇÕES',          color:'#047857', icon:'' },
  { name:'500.03 - 13º SALÁRIO',           color:'#065f46', icon:'' },
  // 600 - DESPESAS COMERCIAIS
  { name:'600.01 - VENDEDORES',            color:'#db2777', icon:'' },
  { name:'600.02 - COMPRA COSMÉTICOS',     color:'#ec4899', icon:'' },
  { name:'600.03 - RETORNO MERCADORIA',    color:'#be185d', icon:'' },
  { name:'600.04 - INSUMOS',               color:'#9d174d', icon:'' },
  { name:'600.05 - COMPRA ELETRÔNICOS',    color:'#3b82f6', icon:'' },
  { name:'600.06 - COMPRA PRÓPOLIS',       color:'#f59e0b', icon:'' },
  { name:'600.07 - COMPRA BEBIDAS',        color:'#f97316', icon:'' },
  { name:'600.08 - VITAMINAS CAPILAR',     color:'#10b981', icon:'' },
  { name:'600.10 - COMPRA OUTROS PRODUTOS',color:'#64748b', icon:'' },
  // 700 - DESPESAS DIVERSAS
  { name:'700.01 - MERCADO',               color:'#78716c', icon:'' },
  { name:'700.02 - FARMÁCIA',              color:'#57534e', icon:'' },
  { name:'700.03 - PAPELARIA',             color:'#44403c', icon:'' },
  { name:'700.04 - GÁZ',                   color:'#292524', icon:'' },
  { name:'700.05 - MANUTENÇÃO',            color:'#78716c', icon:'' },
  { name:'700.06 - MANUTENÇÃO DE EQUIPAMENTOS', color:'#57534e', icon:'' },
  { name:'700.07 - AMOSTRAS DE PRODUTOS',  color:'#a8a29e', icon:'' },
  { name:'700.08 - ENSUMOS DE EMBALAGEM',  color:'#84cc16', icon:'' },
  { name:'700.09 - CARTÓRIO',              color:'#65a30d', icon:'' },
  { name:'700.10 - CONSULTORIA',           color:'#8b5cf6', icon:'' },
  { name:'700.11 - CONTABILIDADE',         color:'#6366f1', icon:'' },
  { name:'700.11 - LIMPEZA',               color:'#06b6d4', icon:'' },
  { name:'700.12 - LOGÍSTICA E FULFILLMENT', color:'#0891b2', icon:'' },
  { name:'700.13 - ENDEREÇO FISCAL',       color:'#0e7490', icon:'' },
  { name:'700.14 - CORTESIA',              color:'#0284c7', icon:'' },
  // 750 - DESLOCAMENTOS OP.
  { name:'750.01 - HOTEL',                 color:'#6366f1', icon:'' },
  { name:'750.02 - ALIMENTAÇÃO',           color:'#f97316', icon:'' },
  { name:'750.03 - COMBUSTÍVEL',           color:'#eab308', icon:'' },
  { name:'750.04 - PASSAGENS',             color:'#6366f1', icon:'' },
  { name:'750.05 - QUILOMETRAGEM',         color:'#a3a3a3', icon:'' },
  // 800 - CUSTOS FIXOS
  { name:'800.01 - ALUGUÉL',               color:'#1d4ed8', icon:'' },
  { name:'800.02 - ENERGIA',               color:'#ca8a04', icon:'' },
  { name:'800.03 - ÁGUA',                  color:'#0ea5e9', icon:'' },
  { name:'800.04 - INTERNET',              color:'#0891b2', icon:'' },
  { name:'800.05 - ERP',                   color:'#7c3aed', icon:'' },
  { name:'800.07 - SITE E-COMMERCE',       color:'#0f766e', icon:'' },
  { name:'800.08 - TÉCNOLOGIA',            color:'#1e40af', icon:'' },
  // 900 - MARKETING
  { name:'900.01 - AGÊNCIA MKT MD',        color:'#a855f7', icon:'' },
  { name:'900.02 - TRÂFEGO',               color:'#8b5cf6', icon:'' },
  { name:'900.03 - CRIAÇÃO DE ARTE',       color:'#ec4899', icon:'' },
  { name:'900.04 - BRINDES',               color:'#f43f5e', icon:'' },
  { name:'900.05 - E_MAIL MKT',            color:'#6366f1', icon:'' },
  // 940 - TECNOLOGIA
  { name:'940.01 - DOMÍNIO',               color:'#06b6d4', icon:'' },
  // 950 - DIRETORIA
  { name:'950.01 - PRÓ_LABORE',            color:'#6366f1', icon:'' },
  { name:'950.02 - LUCROS E DIVIDENDOS',   color:'#4f46e5', icon:'' },
  { name:'950.03 - INVESTIMENTOS',         color:'#7c3aed', icon:'' },
  // 970 - AQUISIÇÕES (ATIVO FÍSICO)
  { name:'970.01 - ATIVO FIXO',            color:'#374151', icon:'' },
  { name:'970.02 - COMPRA DE MÁQUINAS E EQUIPAMENTOS', color:'#374151', icon:'' },
  { name:'970.03 - COMPRA DE SOFTWARE E APPs', color:'#1f2937', icon:'' },
  { name:'970.04 - COMPRA DE VEÍCULOS',    color:'#111827', icon:'' },
  { name:'970.05 - MÓVEIS E ACESSÓRIOS',   color:'#374151', icon:'' },
  { name:'970.06 - COMPRA DE IMÓVEIS E TERRENOS', color:'#1f2937', icon:'' },
  // OUTROS
  { name:'1100.1 - IRP SHIIPIN',           color:'#991b1b', icon:'' },
];

const MONTHS       = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

let db = null, user = null, allExp = [];
let donutChart = null, barChart = null;
let sortCol = 'data', sortDir = 'desc', debounce = null;
let customCats = []; // array of {name, color, icon}
let editStatusPago = false;
let expStatusPago  = false;

const fmtBRL  = n => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
const fmtDate = s => { if(!s)return''; const[y,m,d]=s.split('-'); return`${d}/${m}/${y}`; };

// ── INIT ────────────────────────────────────────────────────────────────
(async function init() {
  db = window.supabase.createClient(SB_URL, SB_KEY);
  window.supabaseClient = db;
  const { data:{session} } = await db.auth.getSession();
  if (!session) { location.href='gastos-login.html'; return; }
  user = session.user;
  loadCats();
  setLoading(true);
  await Promise.all([loadProfile(), loadExpenses()]);
  setLoading(false);
  document.getElementById('pdfYear').value       = new Date().getFullYear();
  document.getElementById('pdfMonth').value      = new Date().getMonth()+1;
  document.getElementById('expDate').valueAsDate = new Date();
  registerEvents();
})();

function setLoading(on){ document.getElementById('loadingOverlay').classList.toggle('active',on); }

// ── CATEGORIAS ──────────────────────────────────────────────────────────
function loadCats() {
  const stored = localStorage.getItem('bb_cats_'+SB_URL);
  customCats = stored ? JSON.parse(stored) : [...DEFAULT_CATS];
  rebuildCatSelects();
  renderCatsModal();
  renderCatPreview();
}
function saveCats() {
  localStorage.setItem('bb_cats_'+SB_URL, JSON.stringify(customCats));
  rebuildCatSelects();
  renderCatsModal();
  renderCatPreview();
}
function getCatData(name) {
  return customCats.find(c=>c.name===name) || {name, color:'#64748b', icon:'📌'};
}
function rebuildCatSelects() {
  const opts = ['<option value="">Selecione a categoria...</option>',
    ...customCats.map(c=>`<option value="${escHtml(c.name)}">${escHtml(c.name)}</option>`)
  ].join('');
  ['expCategory','editCategory'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) { const v=el.value; el.innerHTML=opts; el.value=v; }
  });
  // rebuild filter
  const fc = document.getElementById('filterCat');
  if(fc){
    const cv=fc.value;
    fc.innerHTML='<option value="">Todas as categorias</option>'+
      customCats.map(c=>`<option value="${escHtml(c.name)}">${escHtml(c.name)}</option>`).join('');
    fc.value=cv;
  }
}
function renderCatsModal() {
  const list = document.getElementById('catsList');
  if(!list) return;
  if(!customCats.length){list.innerHTML='<div style="text-align:center;color:var(--ink4);padding:20px;font-size:13px;">Nenhuma categoria ainda.</div>';return;}
  list.innerHTML = customCats.map((c,i)=>`
    <div class="cat-row">
      <div class="cat-row-icon" style="background:${c.color}18;color:${c.color};">▪</div>
      <span class="cat-row-name">${escHtml(c.name)}</span>
      <div class="cat-row-actions">
        <button class="cat-act edit" data-cat-edit="${i}" title="Editar"><i class="fas fa-pen"></i></button>
        <button class="cat-act" data-cat-del="${i}" title="Excluir"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}
function renderCatPreview() {
  const wrap = document.getElementById('catPreview');
  if(!wrap) return;
  wrap.innerHTML = customCats.slice(0,8).map(c=>
    `<span class="cat-chip-preview" style="background:${c.color}18;color:${c.color};" title="${escHtml(c.name)}"><span style="font-size:10px;font-weight:700;">${c.name.split(' - ')[0]}</span></span>`
  ).join('') + (customCats.length>8?`<span style="font-size:11px;color:var(--ink4);align-self:center;">+${customCats.length-8} mais</span>`:'');
}
function escHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── TOAST & CONFIRM ─────────────────────────────────────────────────────
function toast(msg,type='success'){
  const t=document.getElementById('toast'),map={success:'fas fa-check-circle',error:'fas fa-exclamation-circle',info:'fas fa-info-circle'};
  t.querySelector('i').className=map[type]||map.success; t.className=type;
  document.getElementById('toastMsg').textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3400);
}
function confirm2(title,msg){
  return new Promise(resolve=>{
    document.getElementById('confirmTitle').textContent=title;
    document.getElementById('confirmMsg').textContent=msg;
    openModal('confirmModal');
    const ok=document.getElementById('btnConfirmOk');
    const cancel=document.getElementById('btnConfirmCancel');
    const fresh=el=>{const n=el.cloneNode(true);el.replaceWith(n);return n;};
    const nok=fresh(ok),ncancel=fresh(cancel);
    const done=r=>{closeModal('confirmModal');resolve(r);};
    nok.addEventListener('click',()=>done(true));
    ncancel.addEventListener('click',()=>done(false));
  });
}

// ── MODALS ──────────────────────────────────────────────────────────────
function openModal(id){ document.getElementById(id).classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id){ document.getElementById(id).classList.remove('open'); document.body.style.overflow=''; }

// ── PROFILE ─────────────────────────────────────────────────────────────
async function loadProfile() {
  const { data:{user:u} } = await db.auth.getUser();
  if(!u) return; user=u;
  const { data:p } = await db.from('profiles').select('*').eq('id',u.id).single();
  const name   = p?.username || u.email.split('@')[0];
  const avatar = p?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;
  const since  = new Date(u.created_at).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  ['hdrAvatar','dropAvatar','profileAvatarPreview'].forEach(id=>document.getElementById(id).src=avatar);
  document.getElementById('hdrName').textContent=name;
  document.getElementById('dropName').textContent=name;
  document.getElementById('dropEmail').textContent=u.email;
  document.getElementById('profileDisplayName').textContent=name;
  document.getElementById('profileDisplayEmail').textContent=u.email;
  document.getElementById('profileSince').textContent='Membro desde '+since;
  document.getElementById('editUsername').value=p?.username||'';
  document.getElementById('editBio').value=p?.bio||'';
}
async function saveProfile() {
  const btn=document.getElementById('btnSaveProfile');
  btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Salvando...';
  try {
    let avatarUrl=null;
    const fi=document.getElementById('avatarInput');
    if(fi.files.length){
      const f=fi.files[0],ext=f.name.split('.').pop();
      const path=`${user.id}/${Date.now()}.${ext}`;
      const {error:e}=await db.storage.from('avatars').upload(path,f,{upsert:true});
      if(e) throw e;
      avatarUrl=db.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    }
    const pay={id:user.id,username:document.getElementById('editUsername').value.trim(),bio:document.getElementById('editBio').value.trim(),updated_at:new Date()};
    if(avatarUrl) pay.avatar_url=avatarUrl;
    const {error}=await db.from('profiles').upsert(pay);
    if(error) throw error;
    toast('Perfil atualizado!');
    closeModal('profileModal');
    await loadProfile();
  } catch(e){ if(isAuthErr(e))return authExpired(); toast('Erro: '+e.message,'error'); }
  finally{ btn.disabled=false; btn.innerHTML='<i class="fas fa-check"></i> Salvar Alterações'; }
}

// ── SUPABASE CRUD ────────────────────────────────────────────────────────
async function loadExpenses(){
  const {data,error}=await db.from('gastos').select('*').eq('user_id',user.id).order('data',{ascending:false});
  if(error){ if(isAuthErr(error))return authExpired(); toast('Erro ao carregar.','error'); allExp=[]; }
  else allExp=data||[];
  render();
}
async function addExp(obj){
  const {data,error}=await db.from('gastos').insert([{...obj,user_id:user.id}]).select().single();
  if(error){if(isAuthErr(error))authExpired();throw error;}
  allExp.unshift(data); return data;
}
async function updExp(id,fields){
  const {data,error}=await db.from('gastos').update(fields).eq('id',id).eq('user_id',user.id).select().single();
  if(error){if(isAuthErr(error))authExpired();throw error;}
  const i=allExp.findIndex(e=>e.id===id); if(i!==-1)allExp[i]=data; return data;
}
async function delExp(id){
  const {error}=await db.from('gastos').delete().eq('id',id).eq('user_id',user.id);
  if(error){if(isAuthErr(error))authExpired();throw error;}
  allExp=allExp.filter(e=>e.id!==id);
}

function isAuthErr(e){ const m=(e?.message||'').toLowerCase(); return m.includes('jwt')||m.includes('token')||m.includes('auth')||e?.status===401; }
function authExpired(){ toast('Sessão expirada. Redirecionando...','error'); setTimeout(()=>location.href='gastos-login.html',1800); }

// ── STATUS TOGGLE (direto na linha) ─────────────────────────────────────
async function toggleStatus(id){
  const e=allExp.find(x=>x.id===id); if(!e) return;
  const ns=( (e.status||'pendente')==='pago')?'pendente':'pago';
  // atualiza localmente primeiro para feedback imediato
  e.status=ns;
  renderTable(getFiltered());
  updateKPIs(getFiltered());
  try{
    await updExp(id,{status:ns});
    toast(ns==='pago'?'Marcado como pago.':'Marcado como pendente.');
  } catch(err){
    // reverte se der erro
    e.status=ns==='pago'?'pendente':'pago';
    renderTable(getFiltered()); updateKPIs(getFiltered());
    toast('Erro ao atualizar status.','error');
  }
}

// ── FILTERS & RENDER ─────────────────────────────────────────────────────
function getFiltered(){
  const fM=document.getElementById('filterMonth').value;
  const fY=document.getElementById('filterYear').value;
  const fC=document.getElementById('filterCat').value;
  const fE=document.getElementById('filterEmpresa')?.value||'';
  const fS=document.getElementById('filterStatus').value;
  const q=document.getElementById('searchInput').value.trim().toLowerCase();
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
  const ms=document.getElementById('filterMonth'),ys=document.getElementById('filterYear'),es=document.getElementById('filterEmpresa');
  const sm=new Set(),sy=new Set(),se=new Set();
  allExp.forEach(e=>{const[y,m]=(e.data||'').split('-');if(m)sm.add(m);if(y)sy.add(y);if(e.empresa)se.add(e.empresa);});
  const cm=ms.value,cy=ys.value,ce2=es?.value||'';
  ms.innerHTML='<option value="">Todos os meses</option>';
  ys.innerHTML='<option value="">Todos os anos</option>';
  [...sm].sort().forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=MONTHS_SHORT[parseInt(m)-1];if(m===cm)o.selected=true;ms.appendChild(o);});
  [...sy].sort((a,b)=>b-a).forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;if(y===cy)o.selected=true;ys.appendChild(o);});
  if(es){es.innerHTML='<option value="">Todas as empresas</option>';[...se].sort().forEach(emp=>{const o=document.createElement('option');o.value=emp;o.textContent=emp;if(emp===ce2)o.selected=true;es.appendChild(o);});}
}
function updateKPIs(exp){
  const tot=exp.reduce((s,e)=>s+Number(e.valor),0);
  const pend=exp.filter(e=>(e.status||'pendente')==='pendente');
  const paid=exp.filter(e=>e.status==='pago');
  const fM=document.getElementById('filterMonth').value,fY=document.getElementById('filterYear').value,now=new Date();
  const lbl=fM&&fY?`${MONTHS_SHORT[parseInt(fM)-1]} ${fY}`:fM?MONTHS_SHORT[parseInt(fM)-1]:fY||`${MONTHS_SHORT[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById('kpiTotal').textContent=fmtBRL(tot);
  document.getElementById('kpiTotalSub').textContent=`${exp.length} lançamentos — ${lbl}`;
  document.getElementById('kpiPendente').textContent=fmtBRL(pend.reduce((s,e)=>s+Number(e.valor),0));
  document.getElementById('kpiPendenteSub').textContent=`${pend.length} lançamento${pend.length!==1?'s':''}`;
  document.getElementById('kpiPago').textContent=fmtBRL(paid.reduce((s,e)=>s+Number(e.valor),0));
  document.getElementById('kpiPagoSub').textContent=`${paid.length} lançamento${paid.length!==1?'s':''}`;
  document.getElementById('kpiCount').textContent=exp.length;
  document.getElementById('kpiCountSub').textContent='no período filtrado';
}
function renderTable(exp){
  document.getElementById('tableCount').textContent=`${exp.length} registro(s)`;
  document.querySelectorAll('thead th.sortable').forEach(th=>{
    const ico=th.querySelector('i'); const col=th.dataset.col;
    ico.className=col===sortCol?(sortDir==='asc'?'fas fa-sort-up sort-ico on':'fas fa-sort-down sort-ico on'):'fas fa-sort sort-ico';
  });
  const tbody=document.getElementById('expBody');
  if(!exp.length){tbody.innerHTML='<tr><td colspan="7"><div class="empty-row"><i class="fas fa-inbox"></i>Nenhuma despesa encontrada.</div></td></tr>';return;}
  tbody.innerHTML=exp.map(e=>{
    const cd=getCatData(e.categoria);
    const pago=(e.status||'pendente')==='pago';
    const emp=e.empresa?`<span class="td-emp">${escHtml(e.empresa)}</span>`:'';
    return`<tr data-id="${e.id}">
      <td><span class="td-date">${fmtDate(e.data)}</span></td>
      <td><span class="td-desc" title="${escHtml(e.descricao)}">${escHtml(e.descricao)}</span>${emp}</td>
      <td><span class="cat-pill" style="background:${cd.color}18;color:${cd.color};">${escHtml(e.categoria)}</span></td>
      <td><span class="pay-chip">${escHtml(e.pagamento)}</span></td>
      <td>
        <label class="pay-toggle" title="${pago?'Clique para marcar pendente':'Clique para marcar como pago'}">
          <button type="button" class="pay-toggle-track ${pago?'on':''}" data-toggle="${e.id}"></button>
          <span class="pay-toggle-lbl ${pago?'on':'off'}">${pago?'Pago':'Pendente'}</span>
        </label>
      </td>
      <td><span class="amt" style="color:${cd.color};">${fmtBRL(Number(e.valor))}</span></td>
      <td style="display:flex;gap:4px;justify-content:flex-end;">
        <button class="btn-edit" data-edit="${e.id}" title="Editar"><i class="fas fa-pen"></i></button>
        <button class="btn-del"  data-del="${e.id}"  title="Excluir"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}
const TT={backgroundColor:'rgba(26,23,20,.9)',borderColor:'rgba(255,255,255,.08)',borderWidth:1,titleColor:'#f8f6f3',bodyColor:'#a8a29e',padding:10,cornerRadius:8};
function renderDonut(exp){
  const map={};
  exp.forEach(e=>{map[e.categoria]=(map[e.categoria]||0)+Number(e.valor);});
  const labels=Object.keys(map),data=Object.values(map);
  const colors=labels.map(l=>getCatData(l).color);
  const total=data.reduce((s,v)=>s+v,0);
  document.getElementById('donutMeta').textContent=total>0?fmtBRL(total):'';
  if(donutChart){donutChart.data.labels=labels;donutChart.data.datasets[0].data=data;donutChart.data.datasets[0].backgroundColor=colors;donutChart.options.plugins.tooltip.callbacks.label=c=>` ${c.label}: ${fmtBRL(c.raw)} (${((c.raw/total)*100).toFixed(1)}%)`;donutChart.update('active');}
  else{const ctx=document.getElementById('donutChart').getContext('2d');donutChart=new Chart(ctx,{type:'doughnut',data:{labels,datasets:[{data,backgroundColor:colors,borderWidth:3,borderColor:'#fff',hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,cutout:'70%',plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>` ${c.label}: ${fmtBRL(c.raw)} (${((c.raw/total)*100).toFixed(1)}%)`}}}}});}
  document.getElementById('donutLegend').innerHTML=labels.map((l,i)=>`<div class="legend-item"><div class="legend-dot" style="background:${colors[i]};"></div>${escHtml(l)}</div>`).join('');
}
function renderBar(){
  const monthly={},now=new Date();
  for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);monthly[`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`]=0;}
  allExp.forEach(e=>{const[y,m]=(e.data||'').split('-'),k=`${y}-${m}`;if(k in monthly)monthly[k]+=Number(e.valor);});
  const labels=Object.keys(monthly).map(k=>MONTHS_SHORT[parseInt(k.split('-')[1])-1]);
  const data=Object.values(monthly);
  const bg=data.map((_,i)=>i===data.length-1?'rgba(37,99,235,.9)':'rgba(37,99,235,.18)');
  const bd=data.map((_,i)=>i===data.length-1?'#2563eb':'rgba(37,99,235,.4)');
  if(barChart){barChart.data.labels=labels;barChart.data.datasets[0].data=data;barChart.data.datasets[0].backgroundColor=bg;barChart.data.datasets[0].borderColor=bd;barChart.update('active');}
  else{const ctx=document.getElementById('barChart').getContext('2d');barChart=new Chart(ctx,{type:'bar',data:{labels,datasets:[{data,backgroundColor:bg,borderColor:bd,borderWidth:1,borderRadius:7,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>` ${fmtBRL(c.raw)}`}}},scales:{x:{grid:{display:false},ticks:{color:'#b5afa6',font:{size:10}}},y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{color:'#b5afa6',font:{size:10},callback:v=>'R$'+(v>=1000?(v/1000).toFixed(1)+'k':v)}}}}})}
}
function updateExportPreview(){
  const mo=parseInt(document.getElementById('pdfMonth').value),yr=parseInt(document.getElementById('pdfYear').value);
  const ms=String(mo).padStart(2,'0'),ys=String(yr);
  const exp=allExp.filter(e=>{const[y,m]=(e.data||'').split('-');return y===ys&&m===ms;});
  const tot=exp.reduce((s,e)=>s+Number(e.valor),0);
  const pend=exp.filter(e=>(e.status||'pendente')==='pendente').reduce((s,e)=>s+Number(e.valor),0);
  document.getElementById('prevPeriod').textContent=`${MONTHS[mo-1]} de ${yr}`;
  document.getElementById('prevCount').textContent=`${exp.length} lançamentos`;
  document.getElementById('prevPend').textContent=fmtBRL(pend);
  document.getElementById('prevTotal').textContent=fmtBRL(tot);
}
function render(){populateDropdowns();const f=getFiltered();updateKPIs(f);renderTable(f);renderDonut(f);renderBar();updateExportPreview();}

// ── STATUS TOGGLE HELPER ─────────────────────────────────────────────────
function setToggle(trackEl, labelEl, on) {
  trackEl.classList.toggle('on', on);
  if(labelEl){ labelEl.textContent=on?'Pago':'Pendente'; labelEl.className='pay-toggle-lbl '+(on?'on':'off'); }
}

// ── VALIDATE ─────────────────────────────────────────────────────────────
function validate(){
  let ok=true;
  [{id:'expValue',err:'errValue',fn:el=>!el.value||parseFloat(el.value)<=0,msg:'Valor inválido.'},
   {id:'expDesc',err:'errDesc',fn:el=>!el.value.trim(),msg:'Informe uma descrição.'},
   {id:'expCategory',err:'errCategory',fn:el=>!el.value,msg:'Selecione uma categoria.'},
   {id:'expPayment',err:'errPayment',fn:el=>!el.value,msg:'Selecione o pagamento.'}
  ].forEach(({id,err,fn,msg})=>{
    const el=document.getElementById(id),ee=document.getElementById(err);
    const fail=fn(el); ee.textContent=fail?msg:''; el.classList.toggle('err-border',fail); if(fail)ok=false;
  });
  return ok;
}
function clrErr(el){ el.classList.remove('err-border'); const m={expValue:'errValue',expDesc:'errDesc',expCategory:'errCategory',expPayment:'errPayment'}; if(m[el.id])document.getElementById(m[el.id]).textContent=''; }

// ── EDIT MODAL ────────────────────────────────────────────────────────────
function openEdit(id){
  const e=allExp.find(x=>x.id===id); if(!e)return;
  document.getElementById('editId').value=e.id;
  document.getElementById('editValue').value=e.valor;
  document.getElementById('editDesc').value=e.descricao;
  document.getElementById('editEmpresa').value=e.empresa||'';
  document.getElementById('editCategory').value=e.categoria;
  document.getElementById('editDate').value=e.data;
  document.getElementById('editPayment').value=e.pagamento;
  editStatusPago=(e.status||'pendente')==='pago';
  const trk=document.getElementById('editStatusToggle');
  const lbl=document.getElementById('editStatusLabel');
  setToggle(trk,null,editStatusPago);
  lbl.textContent=editStatusPago?'Pago':'Pendente';
  document.getElementById('editStatusSub').textContent=editStatusPago?'Clique para marcar como pendente':'Clique para marcar como pago';
  openModal('editModal');
}

// ── PDF ───────────────────────────────────────────────────────────────────
function generatePDF(){
  const {jsPDF}=window.jspdf;
  const mo=parseInt(document.getElementById('pdfMonth').value),yr=parseInt(document.getElementById('pdfYear').value);
  const co=document.getElementById('pdfCompany').value.trim()||'BuyBrazil10';
  const ms=String(mo).padStart(2,'0'),ys=String(yr),per=`${MONTHS[mo-1]} de ${yr}`;
  const exp=allExp.filter(e=>{const[y,m]=(e.data||'').split('-');return y===ys&&m===ms;}).sort((a,b)=>a.data.localeCompare(b.data));
  if(!exp.length){toast(`Nenhum lançamento em ${per}.`,'info');return;}
  const tot=exp.reduce((s,e)=>s+Number(e.valor),0);
  const pend=exp.filter(e=>(e.status||'pendente')==='pendente').reduce((s,e)=>s+Number(e.valor),0);
  const paid=exp.filter(e=>e.status==='pago').reduce((s,e)=>s+Number(e.valor),0);
  const cats={};exp.forEach(e=>cats[e.categoria]=(cats[e.categoria]||0)+Number(e.valor));
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
  const D=[26,23,20],B=[37,99,235],BL=[239,246,255],G=[71,85,105],GL=[247,246,243],W_=[255,255,255];
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
    const ry=cy2+8+i*12; if(ry+8>H-20)return;
    const pct=tot>0?val/tot:0,bw=W-28-50;
    doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(...G);
    doc.text(cat,14,ry+4);doc.text(fmtBRL(val),W-14,ry+4,{align:'right'});
    doc.setFontSize(7);doc.setTextColor(180,175,166);doc.text(`${(pct*100).toFixed(1)}%`,W-14-28,ry+4,{align:'right'});
    doc.setFillColor(227,225,221);doc.roundedRect(52,ry-1,bw,5,2,2,'F');
    doc.setFillColor(...B);doc.roundedRect(52,ry-1,Math.max(bw*pct,2),5,2,2,'F');
  });
  const tp=doc.internal.getNumberOfPages();
  for(let i=1;i<=tp;i++){doc.setPage(i);doc.setFillColor(247,246,243);doc.rect(0,H-11,W,11,'F');doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(180,175,166);doc.text(`${co} — Relatório ERP ${per}`,14,H-4);doc.text(`${i}/${tp}`,W-14,H-4,{align:'right'});}
  doc.save(`despesas_${MONTHS[mo-1].toLowerCase()}_${yr}.pdf`);
  toast('PDF gerado!');
}

// ── EVENTS ────────────────────────────────────────────────────────────────
function registerEvents(){
  // profile dropdown
  const pb=document.getElementById('profBtn'),pd=document.getElementById('profDrop');
  pb.addEventListener('click',e=>{e.stopPropagation();pd.classList.toggle('open');});
  document.addEventListener('click',()=>pd.classList.remove('open'));
  pd.addEventListener('click',e=>e.stopPropagation());

  // open/close modals
  document.getElementById('btnOpenProfile').addEventListener('click',()=>{pd.classList.remove('open');openModal('profileModal');});
  document.getElementById('btnSaveProfile').addEventListener('click',saveProfile);
  document.getElementById('btnLogout').addEventListener('click',async()=>{await db.auth.signOut();location.href='gastos-login.html';});

  // close buttons via data-close
  document.querySelectorAll('[data-close]').forEach(btn=>{
    btn.addEventListener('click',()=>closeModal(btn.dataset.close));
  });
  // close on overlay click
  ['profileModal','confirmModal','editModal','catsModal'].forEach(id=>{
    document.getElementById(id).addEventListener('click',e=>{if(e.target.id===id)closeModal(id);});
  });

  // cats modal
  document.getElementById('btnOpenCats').addEventListener('click',()=>openModal('catsModal'));
  document.getElementById('catsList').addEventListener('click',e=>{
    const del=e.target.closest('[data-cat-del]');
    const edt=e.target.closest('[data-cat-edit]');
    if(del){const i=parseInt(del.dataset.catDel);customCats.splice(i,1);saveCats();render();}
    if(edt){
      const i=parseInt(edt.dataset.catEdit);const c=customCats[i];
      document.getElementById('newCatColor').value=c.color;
      document.getElementById('newCatName').value=c.name;
      document.getElementById('newCatIcon').value=c.icon;
      customCats.splice(i,1);saveCats();
      document.getElementById('newCatName').focus();
    }
  });
  document.getElementById('btnAddCat').addEventListener('click',()=>{
    const name=document.getElementById('newCatName').value.trim();
    const color=document.getElementById('newCatColor').value||'#64748b';
    const icon=document.getElementById('newCatIcon').value.trim()||'📌';
    if(!name){toast('Informe o nome da categoria.','error');return;}
    if(customCats.find(c=>c.name===name)){toast('Categoria já existe.','info');return;}
    customCats.push({name,color,icon});
    saveCats(); render();
    document.getElementById('newCatName').value='';
    document.getElementById('newCatIcon').value='';
    toast('Categoria adicionada!');
  });

  // edit status toggle in edit modal
  document.getElementById('editStatusToggle').addEventListener('click',()=>{
    editStatusPago=!editStatusPago;
    const trk=document.getElementById('editStatusToggle');
    const lbl=document.getElementById('editStatusLabel');
    setToggle(trk,null,editStatusPago);
    lbl.textContent=editStatusPago?'Pago':'Pendente';
    document.getElementById('editStatusSub').textContent=editStatusPago?'Clique para marcar como pendente':'Clique para marcar como pago';
  });

  // save edit
  document.getElementById('btnSaveEdit').addEventListener('click',async()=>{
    const id=document.getElementById('editId').value;
    const btn=document.getElementById('btnSaveEdit');
    btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
    try{
      await updExp(id,{valor:parseFloat(document.getElementById('editValue').value),descricao:document.getElementById('editDesc').value.trim(),empresa:document.getElementById('editEmpresa').value.trim(),categoria:document.getElementById('editCategory').value,data:document.getElementById('editDate').value,pagamento:document.getElementById('editPayment').value,status:editStatusPago?'pago':'pendente'});
      closeModal('editModal'); render(); toast('Lançamento atualizado!');
    }catch(e){toast('Erro: '+e.message,'error');}
    finally{btn.disabled=false;btn.innerHTML='<i class="fas fa-check"></i> Salvar Alterações';}
  });

  // exp form status toggle
  document.getElementById('expStatusToggle').addEventListener('click',()=>{
    expStatusPago=!expStatusPago;
    setToggle(document.getElementById('expStatusToggle'),document.getElementById('expStatusLabel'),expStatusPago);
  });

  // form submit
  document.getElementById('expForm').addEventListener('submit',async e=>{
    e.preventDefault(); if(!validate())return;
    const btn=document.getElementById('btnAdd');
    btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Registrando...';
    try{
      await addExp({valor:parseFloat(document.getElementById('expValue').value),descricao:document.getElementById('expDesc').value.trim(),empresa:document.getElementById('expEmpresa').value.trim(),categoria:document.getElementById('expCategory').value,data:document.getElementById('expDate').value,pagamento:document.getElementById('expPayment').value,status:expStatusPago?'pago':'pendente'});
      document.getElementById('expForm').reset();
      document.getElementById('expDate').valueAsDate=new Date();
      expStatusPago=false;setToggle(document.getElementById('expStatusToggle'),document.getElementById('expStatusLabel'),false);
      render();toast('Despesa registrada!');
    }catch(err){toast('Erro: '+err.message,'error');}
    finally{btn.disabled=false;btn.innerHTML='<i class="fas fa-plus"></i> Registrar Despesa';}
  });

  // field error clear
  ['expValue','expDesc','expCategory','expPayment'].forEach(id=>{
    document.getElementById(id).addEventListener('input',e=>clrErr(e.target));
    document.getElementById(id).addEventListener('change',e=>clrErr(e.target));
  });

  // filters
  ['filterMonth','filterYear','filterCat','filterEmpresa','filterStatus'].forEach(id=>document.getElementById(id)?.addEventListener('change',render));
  const si=document.getElementById('searchInput'),sc=document.getElementById('btnSearchClear');
  si.addEventListener('input',()=>{sc.style.display=si.value?'flex':'none';clearTimeout(debounce);debounce=setTimeout(render,220);});
  sc.addEventListener('click',()=>{si.value='';sc.style.display='none';render();});
  document.getElementById('clearFilters').addEventListener('click',()=>{
    ['filterMonth','filterYear','filterCat','filterEmpresa','filterStatus'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
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

  // table clicks: toggle / edit / delete
  document.getElementById('expBody').addEventListener('click',async e=>{
    const tog=e.target.closest('[data-toggle]');
    const edt=e.target.closest('[data-edit]');
    const del=e.target.closest('[data-del]');
    const row=e.target.closest('[data-id]');
    if(tog){e.stopPropagation();await toggleStatus(tog.dataset.toggle);return;}
    if(del){e.stopPropagation();const ok=await confirm2('Excluir lançamento','Tem certeza? Esta ação não pode ser desfeita.');if(!ok)return;try{await delExp(del.dataset.del);render();toast('Excluído.');}catch(err){toast('Erro ao excluir.','error');}return;}
    if(edt){e.stopPropagation();openEdit(edt.dataset.edit);return;}
    if(row) openEdit(row.dataset.id);
  });

  // pdf
  ['pdfMonth','pdfYear'].forEach(id=>document.getElementById(id).addEventListener('change',updateExportPreview));
  document.getElementById('btnExportPdf').addEventListener('click',()=>{
    const btn=document.getElementById('btnExportPdf');
    btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Gerando...';
    setTimeout(()=>{try{generatePDF();}catch(e){toast('Erro PDF: '+e.message,'error');}finally{btn.disabled=false;btn.innerHTML='<i class="fas fa-download"></i> Gerar e Baixar PDF';}},80);
  });
}
