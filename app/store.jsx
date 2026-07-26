/* ===== Minha Vida — Store (React context + localStorage) ===== */
const StoreCtx = React.createContext(null);
const useStore = () => React.useContext(StoreCtx);

const LS_KEY = 'minhavida_v1';

const DEFAULT_CARDS = [
  { id:'card1', name:'Cartão principal', color:'var(--c-vdec)', limit:8000 },
];

const STU_COLORS = ['var(--c-mentorias)','var(--c-vde1)','var(--c-vdec)','var(--c-vde2)','var(--c-pratflix)','var(--c-conteudo)','var(--c-renato)','var(--c-constitucional)'];
const DEFAULT_STUDENTS = [
  {name:'Laisinha', course:'mentorias', status:'ativo', value:0, paid:false, contact:'', notes:''},
  {name:'Gabriela', course:'mentorias', status:'ativo', value:0, paid:false, contact:'', notes:''},
  {name:'Débora',   course:'mentorias', status:'ativo', value:0, paid:false, contact:'', notes:''},
  {name:'Thamyres', course:'mentorias', status:'ativo', value:0, paid:false, contact:'', notes:''},
  {name:'Thiago',   course:'mentorias', status:'ativo', value:0, paid:false, contact:'', notes:''},
  {name:'Sara',     course:'mentorias', status:'ativo', value:0, paid:false, contact:'', notes:''},
  {name:'Cinara',   course:'mentorias', status:'ativo', value:0, paid:false, contact:'', notes:''},
  {name:'Michelle', course:'mentorias', status:'ativo', value:0, paid:false, contact:'', notes:''},
].map((s,i)=>({id:'al_'+i, color:STU_COLORS[i%STU_COLORS.length], ...s}));

// IDs dos dados de exemplo que devem ser zerados (mantendo o que é real)
const SAMPLE_IDS = {
  tx:['t1','t2','t3','t4','t5','t10','t11','t12','t13','t14','t15','t20','t21','t22','t23','card_ex1','card_ex2','card_ex3'],
  launches:['lan_pratflix','lan_vde2reg','lan_etica'],
  content:['ct1','ct2','ct3','ct4','ct5'],
  bills:['b1','b2','b3','b4','b5'],
  goals:['g1','g2','g3','g4'],
  readings:['rd1','rd2','rd3','rd4'],
  emails:['e1','e2','e3','e4','e5','e6','e7'],
  cards:['card1'],
};
function clearSamples(s){
  const f=(arr,ids)=>(arr||[]).filter(x=>!ids.includes(x.id));
  s.tx = f(s.tx, SAMPLE_IDS.tx);
  s.cards = f(s.cards, SAMPLE_IDS.cards);
  s.launches = f(s.launches, SAMPLE_IDS.launches);
  s.content = f(s.content, SAMPLE_IDS.content);
  s.bills = f(s.bills, SAMPLE_IDS.bills);
  s.goals = f(s.goals, SAMPLE_IDS.goals);
  s.readings = f(s.readings, SAMPLE_IDS.readings);
  s.emails = f(s.emails, SAMPLE_IDS.emails);
  s.tithes = [];
  s.practiceLogs = (s.practiceLogs||[]).filter(l=>!/^pl([1-9]|1[0-8])$/.test(l.id));
  s.students = (s.students||[]).map(st=> /^al_\d$/.test(st.id) ? {...st, value:0, paid:false, notes:''} : st);
  return s;
}

// migrate / ensure shape across versions
function migrate(s){
  s.commitments = (s.commitments||[]).map(c=>({
    ...c,
    priority: c.priority!==undefined ? c.priority : (c.urgent ? 'urgente' : ''),
    section: c.section||'',
  }));
  s.tx = (s.tx||[]).map(t=> t.type==='expense' ? ({
    card: '', parcelas: 1, parcelaAtual: 1, recorrente:false, ...t
  }) : t);
  if(!s.cards) s.cards = DEFAULT_CARDS.map(c=>({...c}));
  if(!s.customSections) s.customSections = {};
  if(!s.students) s.students = DEFAULT_STUDENTS.map(x=>({...x}));
  if(!s.tithes) s.tithes = [];
  if(!s.launches) s.launches = DEFAULT_LAUNCHES.map(x=>({...x}));
  if(!s.content) s.content = DEFAULT_CONTENT.map(x=>({...x}));
  if(!s.bills) s.bills = DEFAULT_BILLS.map(x=>({...x}));
  if(!s.goals) s.goals = DEFAULT_GOALS.map(x=>({...x}));
  if(!s.practices) s.practices = DEFAULT_PRACTICES.map(x=>({...x}));
  if(!s.practiceLogs) s.practiceLogs = DEFAULT_PLOGS.map(x=>({...x}));
  if(!s.readings) s.readings = DEFAULT_READINGS.map(x=>({...x}));
  if(!s.playbookChecks) s.playbookChecks = {};
  if(!s.playbookExtra) s.playbookExtra = [];
  // migra checks booleanos antigos -> objetos ricos {done,date,notes,links,images}
  if(!s._playbookRich){
    const rich={};
    Object.keys(s.playbookChecks).forEach(lk=>{
      rich[lk]={};
      Object.keys(s.playbookChecks[lk]||{}).forEach(tid=>{
        const v=s.playbookChecks[lk][tid];
        rich[lk][tid] = (v===true)?{done:true}:(typeof v==='object'&&v?v:{done:!!v});
      });
    });
    s.playbookChecks=rich; s._playbookRich=true;
  }
  if(!s._cleared){ clearSamples(s); s._cleared = true; }
  if(s.activeProfile===undefined) s.activeProfile = null;
  s._v = 5;
  return s;
}

const DEFAULT_PRACTICES = [
  {key:'leituras',   label:'Leituras',          icon:'bookopen', color:'var(--c-renato)',         goal:5, sub:'livros e artigos'},
  {key:'devocional', label:'Devocional',        icon:'sun',      color:'var(--olive)',            goal:7, sub:'tempo com Deus'},
  {key:'oracao',     label:'Oração',            icon:'heart',    color:'var(--c-conteudo)',       goal:7, sub:'momento de oração'},
  {key:'exercicio',  label:'Exercício físico',  icon:'activity', color:'var(--ok)',               goal:4, sub:'corrida ou academia'},
  {key:'ingles',     label:'Estudo de Inglês',  icon:'globe',    color:'var(--c-vdec)',           goal:5, sub:'aula ou prática'},
  {key:'negocios',   label:'Negócios',          icon:'briefcase',color:'var(--c-pratflix)',       goal:3, sub:'estudo e visão'},
];
const DEFAULT_PLOGS = [
  {id:'pl1',practice:'devocional',date:'2026-06-09'},{id:'pl2',practice:'devocional',date:'2026-06-10'},{id:'pl3',practice:'devocional',date:'2026-06-11'},{id:'pl4',practice:'devocional',date:'2026-06-12'},{id:'pl5',practice:'devocional',date:'2026-06-13'},
  {id:'pl6',practice:'oracao',date:'2026-06-10'},{id:'pl7',practice:'oracao',date:'2026-06-11'},{id:'pl8',practice:'oracao',date:'2026-06-12'},{id:'pl9',practice:'oracao',date:'2026-06-13'},
  {id:'pl10',practice:'leituras',date:'2026-06-10'},{id:'pl11',practice:'leituras',date:'2026-06-12'},{id:'pl12',practice:'leituras',date:'2026-06-13'},
  {id:'pl13',practice:'exercicio',date:'2026-06-09',detail:'Corrida 5km'},{id:'pl14',practice:'exercicio',date:'2026-06-11',detail:'Academia'},{id:'pl15',practice:'exercicio',date:'2026-06-13',detail:'Corrida 6km'},
  {id:'pl16',practice:'ingles',date:'2026-06-11'},{id:'pl17',practice:'ingles',date:'2026-06-12'},
  {id:'pl18',practice:'negocios',date:'2026-06-12',detail:'Aula sobre lançamentos'},
];
const DEFAULT_READINGS = [
  {id:'rd1',title:'Bíblia — plano anual',author:'',category:'Devocional',status:'lendo',progress:46},
  {id:'rd2',title:'A Coragem de Ser Imperfeito',author:'Brené Brown',category:'Pessoal',status:'concluido',progress:100},
  {id:'rd3',title:'Os Segredos da Mente Milionária',author:'T. Harv Eker',category:'Negócios',status:'lendo',progress:30},
  {id:'rd4',title:'Essencialismo',author:'Greg McKeown',category:'Negócios',status:'quero',progress:0},
];

const DEFAULT_LAUNCHES = [
  {id:'lan_pratflix', name:'Pratflix — Lançamento', project:'pratflix', color:'var(--c-pratflix)', phase:'planejamento',
   openDate:'2026-07-28', launchDate:'2026-07-31', closeDate:'2026-08-04',
   goalRevenue:60000, goalSales:200, actualRevenue:0, actualSales:0,
   notes:'Primeiro lançamento do curso. Workshop antes do carrinho.',
   checklist:[
     {id:'k1',text:'Definir oferta e preço',done:true},
     {id:'k2',text:'Página de vendas',done:false},
     {id:'k3',text:'Sequência de e-mails',done:false},
     {id:'k4',text:'Workshop de aquecimento',done:false},
     {id:'k5',text:'Abertura de carrinho',done:false},
     {id:'k6',text:'Fechamento e remarketing',done:false},
   ]},
  {id:'lan_vde2reg', name:'VDE 2ª Fase — Turma Regular', project:'vde2', color:'var(--c-vde2)', phase:'pre',
   openDate:'2026-09-13', launchDate:'2026-09-13', closeDate:'2026-09-20',
   goalRevenue:120000, goalSales:300, actualRevenue:0, actualSales:0,
   notes:'Lançamento da turma regular após resultado da 1ª fase.',
   checklist:[
     {id:'k1',text:'Aula de lançamento',done:false},
     {id:'k2',text:'Páginas e checkout',done:false},
     {id:'k3',text:'Captação de leads',done:false},
   ]},
  {id:'lan_etica', name:'Maratona de Ética + Saúde Mental', project:'vde1', color:'var(--c-vde1)', phase:'planejamento',
   openDate:'2026-08-31', launchDate:'2026-08-31', closeDate:'2026-09-04',
   goalRevenue:25000, goalSales:400, actualRevenue:0, actualSales:0,
   notes:'Evento gratuito + oferta de assinatura do Insta.', checklist:[]},
];
const DEFAULT_CONTENT = [
  {id:'ct1', title:'Reels: 3 erros na 2ª fase', channel:'instagram', status:'roteiro', date:'2026-06-16', assignee:'daniel', project:'conteudo', notes:'', links:[], images:[]},
  {id:'ct2', title:'TikTok: rotina de estudos', channel:'tiktok', status:'ideia', date:'2026-06-18', assignee:'', project:'conteudo', notes:'', links:[], images:[]},
  {id:'ct3', title:'YouTube: como passar na OAB', channel:'youtube', status:'gravado', date:'2026-06-12', assignee:'sefora', project:'conteudo', notes:'Gravado, falta editar.', links:[], images:[]},
  {id:'ct4', title:'Carrossel Constitucional Gabaritado', channel:'instagram', status:'editado', date:'2026-06-14', assignee:'daniel', project:'constitucional', notes:'', links:[], images:[]},
  {id:'ct5', title:'Reels Renato Torres — clube de leitura', channel:'instagram', status:'publicado', date:'2026-06-10', assignee:'sefora', project:'renato', notes:'', links:[], images:[]},
];
const DEFAULT_BILLS = [
  {id:'b1', type:'pagar', desc:'Anuidade OAB', amount:680, due:'2026-06-20', paid:false, tag:'impostos', receipt:'', notes:''},
  {id:'b2', type:'pagar', desc:'Aluguel + condomínio', amount:2600, due:'2026-06-10', paid:true, tag:'casa', receipt:'', notes:''},
  {id:'b3', type:'pagar', desc:'Fatura do cartão', amount:730, due:'2026-06-15', paid:false, tag:'sistemas', receipt:'', notes:''},
  {id:'b4', type:'receber', desc:'Mensalidade — Laisinha', amount:600, due:'2026-06-15', paid:false, tag:'mentorias', receipt:'', notes:''},
  {id:'b5', type:'receber', desc:'Repasse do Cartório', amount:6200, due:'2026-06-25', paid:false, tag:'cartorio', receipt:'', notes:''},
];
const DEFAULT_GOALS = [
  {id:'g1', label:'Receita do mês', type:'receita', target:25000, color:'var(--olive)', period:'mes'},
  {id:'g2', label:'Alunos ativos', type:'alunos', target:12, color:'var(--c-vdec)', period:'mes'},
  {id:'g3', label:'Posts publicados no mês', type:'posts', target:12, color:'var(--c-conteudo)', period:'mes'},
  {id:'g4', label:'Dízimo entregue (R$)', type:'custom', target:2500, current:0, color:'var(--c-renato)', period:'mes'},
];

function freshFromSeed(){
  const S = window.SEED;
  return {
    commitments: S.COMMITMENTS.map(c=>({...c})),
    tx: S.TX.map(t=>({...t})),
    expenseTags: S.EXPENSE_TAGS.map(t=>({...t})),
    incomeTags: S.INCOME_TAGS.map(t=>({...t})),
    emails: S.EMAILS.map(e=>({...e})),
    collabs: S.COLLABS.map(c=>({...c})),
    settings: { tithe: 10, connected: { calendar:false, gmail:false, drive:false, docs:false, meet:false } },
    _v: 1,
  };
}

function loadState(){
  let s=null;
  try{ const raw = localStorage.getItem(LS_KEY); if(raw) s = JSON.parse(raw); }catch(e){}
  if(!s) s = freshFromSeed();
  return migrate(s);
}

function StoreProvider({children}){
  const [state, setState] = React.useState(loadState);
  React.useEffect(()=>{
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
  }, [state]);

  const api = React.useMemo(()=>({
    // commitments
    addCommitment:(c)=>setState(s=>({...s, commitments:[...s.commitments, {...c, id:'c'+Date.now()}]})),
    updateCommitment:(id,patch)=>setState(s=>({...s, commitments:s.commitments.map(c=>c.id===id?{...c,...patch}:c)})),
    toggleDone:(id)=>setState(s=>({...s, commitments:s.commitments.map(c=>c.id===id?{...c,done:!c.done}:c)})),
    removeCommitment:(id)=>setState(s=>({...s, commitments:s.commitments.filter(c=>c.id!==id)})),
    // transactions
    addTx:(t)=>setState(s=>({...s, tx:[...s.tx, {...t, id:'t'+Date.now()}]})),
    updateTx:(id,patch)=>setState(s=>({...s, tx:s.tx.map(t=>t.id===id?{...t,...patch}:t)})),
    removeTx:(id)=>setState(s=>({...s, tx:s.tx.filter(t=>t.id!==id)})),
    // tags
    addExpenseTag:(t)=>setState(s=>({...s, expenseTags:[...s.expenseTags,{...t,id:t.id||'et'+Date.now()}]})),
    addIncomeTag:(t)=>setState(s=>({...s, incomeTags:[...s.incomeTags,{...t,id:t.id||'it'+Date.now()}]})),
    removeExpenseTag:(id)=>setState(s=>({...s, expenseTags:s.expenseTags.filter(t=>t.id!==id)})),
    removeIncomeTag:(id)=>setState(s=>({...s, incomeTags:s.incomeTags.filter(t=>t.id!==id)})),
    // emails
    markRead:(id)=>setState(s=>({...s, emails:s.emails.map(e=>e.id===id?{...e,unread:false}:e)})),
    toggleStar:(id)=>setState(s=>({...s, emails:s.emails.map(e=>e.id===id?{...e,star:!e.star}:e)})),
    // settings
    setTithe:(v)=>setState(s=>({...s, settings:{...s.settings, tithe:v}})),
    toggleConnect:(k)=>setState(s=>({...s, settings:{...s.settings, connected:{...s.settings.connected, [k]:!s.settings.connected[k]}}})),
    setProfile:(p)=>setState(s=>({...s, activeProfile:p})),
    // cartões
    addCard:(c)=>setState(s=>({...s, cards:[...s.cards,{...c,id:'card'+Date.now()}]})),
    updateCard:(id,patch)=>setState(s=>({...s, cards:s.cards.map(c=>c.id===id?{...c,...patch}:c)})),
    removeCard:(id)=>setState(s=>({...s, cards:s.cards.filter(c=>c.id!==id)})),
    // frentes (seções) por projeto
    addSection:(pk,name)=>setState(s=>({...s, customSections:{...s.customSections, [pk]:[...(s.customSections[pk]||[]), name]}})),
    removeSection:(pk,name)=>setState(s=>({...s, customSections:{...s.customSections, [pk]:(s.customSections[pk]||[]).filter(n=>n!==name)}})),
    // collabs
    addCollab:(c)=>setState(s=>({...s, collabs:[...s.collabs,{...c,id:'col'+Date.now()}]})),
    // alunos / mentorados
    addStudent:(st)=>setState(s=>({...s, students:[...s.students,{...st,id:'al'+Date.now()}]})),
    updateStudent:(id,patch)=>setState(s=>({...s, students:s.students.map(x=>x.id===id?{...x,...patch}:x)})),
    removeStudent:(id)=>setState(s=>({...s, students:s.students.filter(x=>x.id!==id)})),
    toggleStudentPaid:(id)=>setState(s=>({...s, students:s.students.map(x=>x.id===id?{...x,paid:!x.paid}:x)})),
    // dízimo
    addTithe:(t)=>setState(s=>({...s, tithes:[...s.tithes,{...t,id:'dz'+Date.now()}]})),
    removeTithe:(id)=>setState(s=>({...s, tithes:s.tithes.filter(t=>t.id!==id)})),
    // lançamentos
    addLaunch:(l)=>setState(s=>({...s, launches:[...s.launches,{...l,id:'lan'+Date.now()}]})),
    updateLaunch:(id,patch)=>setState(s=>({...s, launches:s.launches.map(l=>l.id===id?{...l,...patch}:l)})),
    removeLaunch:(id)=>setState(s=>({...s, launches:s.launches.filter(l=>l.id!==id)})),
    // conteúdo
    addContent:(c)=>setState(s=>({...s, content:[...s.content,{...c,id:'ct'+Date.now()}]})),
    updateContent:(id,patch)=>setState(s=>({...s, content:s.content.map(c=>c.id===id?{...c,...patch}:c)})),
    removeContent:(id)=>setState(s=>({...s, content:s.content.filter(c=>c.id!==id)})),
    // contas a pagar/receber
    addBill:(b)=>setState(s=>({...s, bills:[...s.bills,{...b,id:'b'+Date.now()}]})),
    updateBill:(id,patch)=>setState(s=>({...s, bills:s.bills.map(b=>b.id===id?{...b,...patch}:b)})),
    removeBill:(id)=>setState(s=>({...s, bills:s.bills.filter(b=>b.id!==id)})),
    toggleBillPaid:(id)=>setState(s=>({...s, bills:s.bills.map(b=>b.id===id?{...b,paid:!b.paid,paidDate:!b.paid?window.U.TODAY:''}:b)})),
    // metas
    addGoal:(g)=>setState(s=>({...s, goals:[...s.goals,{...g,id:'g'+Date.now()}]})),
    updateGoal:(id,patch)=>setState(s=>({...s, goals:s.goals.map(g=>g.id===id?{...g,...patch}:g)})),
    removeGoal:(id)=>setState(s=>({...s, goals:s.goals.filter(g=>g.id!==id)})),
    // aperfeiçoamento pessoal
    togglePractice:(practice,date)=>setState(s=>{
      const ex=s.practiceLogs.find(l=>l.practice===practice&&l.date===date);
      return ex ? {...s, practiceLogs:s.practiceLogs.filter(l=>l!==ex)}
                : {...s, practiceLogs:[...s.practiceLogs,{id:'pl'+Date.now(),practice,date}]};
    }),
    setPracticeDetail:(practice,date,detail)=>setState(s=>{
      const ex=s.practiceLogs.find(l=>l.practice===practice&&l.date===date);
      if(ex) return {...s, practiceLogs:s.practiceLogs.map(l=>l===ex?{...l,detail}:l)};
      return {...s, practiceLogs:[...s.practiceLogs,{id:'pl'+Date.now(),practice,date,detail}]};
    }),
    addPractice:(p)=>setState(s=>({...s, practices:[...s.practices,{...p,key:'pr'+Date.now()}]})),
    removePractice:(key)=>setState(s=>({...s, practices:s.practices.filter(p=>p.key!==key), practiceLogs:s.practiceLogs.filter(l=>l.practice!==key)})),
    addReading:(r)=>setState(s=>({...s, readings:[...s.readings,{...r,id:'rd'+Date.now()}]})),
    updateReading:(id,patch)=>setState(s=>({...s, readings:s.readings.map(r=>r.id===id?{...r,...patch}:r)})),
    removeReading:(id)=>setState(s=>({...s, readings:s.readings.filter(r=>r.id!==id)})),
    // playbook de lançamento
    togglePlaybookTask:(launchKey,taskId)=>setState(s=>{
      const cur=s.playbookChecks[launchKey]||{};
      const t=cur[taskId]||{};
      return {...s, playbookChecks:{...s.playbookChecks,[launchKey]:{...cur,[taskId]:{...t,done:!t.done}}}};
    }),
    setPlaybookTask:(launchKey,taskId,patch)=>setState(s=>{
      const cur=s.playbookChecks[launchKey]||{};
      const t=cur[taskId]||{};
      return {...s, playbookChecks:{...s.playbookChecks,[launchKey]:{...cur,[taskId]:{...t,...patch}}}};
    }),
    addPlaybookTask:(listIdx,name)=>setState(s=>({...s, playbookExtra:[...s.playbookExtra,{id:'px'+Date.now(),listIdx,name}]})),
    removePlaybookTask:(id)=>setState(s=>{
      const checks={...s.playbookChecks};
      Object.keys(checks).forEach(k=>{ if(checks[k][id]){ const c={...checks[k]}; delete c[id]; checks[k]=c; } });
      return {...s, playbookExtra:s.playbookExtra.filter(p=>p.id!==id), playbookChecks:checks};
    }),
    resetPlaybook:(launchKey)=>setState(s=>({...s, playbookChecks:{...s.playbookChecks,[launchKey]:{}}})),
    reset:()=>{ localStorage.removeItem(LS_KEY); setState(loadState()); },
  }), []);

  const value = React.useMemo(()=>({state, ...api}), [state, api]);
  return React.createElement(StoreCtx.Provider, {value}, children);
}

window.StoreProvider = StoreProvider;
window.useStore = useStore;
