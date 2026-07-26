/* ===== Minha Vida — App Shell ===== */
const PROFILES = {
  libero:{id:'libero', name:'Líbero Filho', initials:'LF', role:'Acesso completo', access:'all'},
  ana:{id:'ana', name:'Ana Cecília', initials:'AC', role:'Acesso limitado',
    access:['agenda','projetos','aperfeicoamento','metas','financas','integracoes']},
};

const NAV = [
  {section:'Principal'},
  {key:'inicio', label:'Início', icon:'home'},
  {key:'agenda', label:'Compromissos', icon:'calendar'},
  {key:'projetos', label:'Projetos', icon:'folder'},
  {key:'alunos', label:'Alunos', icon:'users'},
  {key:'aperfeicoamento', label:'Aperfeiçoamento', icon:'flame'},
  {section:'Negócio'},
  {key:'lancamentos', label:'Lançamentos', icon:'play'},
  {key:'conteudo', label:'Conteúdo', icon:'camera'},
  {key:'metas', label:'Metas', icon:'target'},
  {key:'financas', label:'Finanças', icon:'wallet'},
  {section:'Conexões'},
  {key:'cartorio', label:'Cartório', icon:'stamp'},
  {key:'email', label:'Caixa de entrada', icon:'mail', badge:'unread'},
  {key:'busca', label:'Busca inteligente', icon:'sparkles'},
  {key:'integracoes', label:'Integrações', icon:'plug'},
];
function navFor(profile){
  if(!profile || profile.access==='all') return NAV;
  const allow=new Set(profile.access);
  const out=[]; let lastSection=null, pendingSection=null;
  NAV.forEach(item=>{
    if(item.section){ pendingSection=item; return; }
    if(allow.has(item.key)){
      if(pendingSection){ out.push(pendingSection); pendingSection=null; }
      out.push(item);
    }
  });
  return out;
}

const PAGE_META = {
  inicio:{title:'Início', sub:'Sua vida organizada num só lugar'},
  agenda:{title:'Compromissos', sub:'Agenda, prazos e reuniões'},
  projetos:{title:'Projetos', sub:'Mentorias, VDE, Cartório, Conteúdo e mais'},
  alunos:{title:'Alunos & Mentorados', sub:'Suas alunas e alunos, sessões e pagamentos'},
  aperfeicoamento:{title:'Aperfeiçoamento Pessoal', sub:'Leituras, devocional, oração, exercício, inglês e negócios'},
  lancamentos:{title:'Lançamentos', sub:'Planeje, acompanhe e meça os resultados'},
  conteudo:{title:'Conteúdo', sub:'Pipeline editorial — Instagram, TikTok e YouTube'},
  metas:{title:'Metas', sub:'Receita, alunos e conteúdo com acompanhamento'},
  financas:{title:'Finanças', sub:'Gastos, recebimentos, contas e dízimo'},
  cartorio:{title:'Painel do Cartório', sub:'Curral Queimado — registros e serviços'},
  email:{title:'Caixa de entrada', sub:'Seus e-mails, resumidos'},
  busca:{title:'Busca inteligente', sub:'Pesquise na plataforma e nos locais conectados'},
  integracoes:{title:'Integrações', sub:'Conecte o Google e suas plataformas'},
};

function LoginScreen({onPick}){
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:20}}>
      <div style={{textAlign:'center',maxWidth:460,width:'100%'}}>
        <div className="brand-mark" style={{width:52,height:52,fontSize:22,margin:'0 auto 18px'}}>MV</div>
        <h1 style={{fontSize:22,fontWeight:700,letterSpacing:'-.02em',marginBottom:6}}>Minha Vida</h1>
        <p style={{fontSize:13.5,color:'var(--muted)',marginBottom:28}}>Quem está entrando?</p>
        <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
          {Object.values(PROFILES).map(p=>(
            <button key={p.id} onClick={()=>onPick(p.id)} className="card" style={{padding:'24px 26px',width:190,cursor:'pointer',textAlign:'center'}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--sh-md)'} onMouseLeave={e=>e.currentTarget.style.boxShadow='var(--sh-sm)'}>
              <span className="avatar" style={{width:56,height:56,fontSize:19,margin:'0 auto 12px',background:'var(--olive-100)',color:'var(--olive-800)'}}>{p.initials}</span>
              <div style={{fontWeight:650,fontSize:14.5}}>{p.name}</div>
              <div style={{fontSize:11.5,color:'var(--muted)',marginTop:3}}>{p.role}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function App(){
  const { state, setProfile } = useStore();
  const profile = PROFILES[state.activeProfile] || null;
  const nav = navFor(profile);
  const allowedKeys = new Set(nav.filter(i=>!i.section).map(i=>i.key));
  const [page,setPage]=React.useState(()=> (location.hash||'').replace('#','') || 'inicio');
  const go=(p)=>{ setPage(p); location.hash=p; const m=document.querySelector('.content'); if(m) m.scrollTop=0; window.scrollTo(0,0); };
  React.useEffect(()=>{
    const h=()=>{ const p=(location.hash||'').replace('#',''); if(p) setPage(p); };
    window.addEventListener('hashchange',h); return ()=>window.removeEventListener('hashchange',h);
  },[]);
  React.useEffect(()=>{
    if(profile && profile.access!=='all' && !allowedKeys.has(page)){ go('agenda'); }
  },[profile, page]);

  if(!profile) return <LoginScreen onPick={(id)=>{ setProfile(id); go(id==='ana'?'agenda':'inicio'); }}/>;

  const unread=state.emails.filter(e=>e.unread).length;
  const meta=PAGE_META[page]||PAGE_META.inicio;
  const effectivePage = (profile.access!=='all' && !allowedKeys.has(page)) ? 'agenda' : page;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">MV</div>
          <div><div className="brand-name">Minha Vida</div><div className="brand-sub">painel pessoal</div></div>
        </div>
        <nav className="nav">
          {nav.map((item,i)=> item.section
            ? <div key={i} className="nav-section">{item.section}</div>
            : <button key={item.key} className={'nav-item'+(effectivePage===item.key?' active':'')} onClick={()=>go(item.key)}>
                <Icon name={item.icon} size={18} className="nav-ic"/>
                <span>{item.label}</span>
                {item.badge==='unread' && unread>0 && <span className="nav-badge">{unread}</span>}
              </button>
          )}
        </nav>
        <div className="sidebar-foot">
          <button className="user-chip" style={{width:'100%',border:'none',background:'none',cursor:'pointer',textAlign:'left'}} onClick={()=>setProfile(null)} title="Trocar de perfil">
            <span className="avatar">{profile.initials}</span>
            <div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:600}}>{profile.name}</div><div style={{fontSize:11,color:'var(--faint)'}}>{profile.role} · trocar</div></div>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="page-title">{meta.title}</div>
            <div className="page-sub">{meta.sub}</div>
          </div>
          {allowedKeys.has('busca') && <button className="topbar-search" onClick={()=>go('busca')}>
            <Icon name="search" size={16}/>
            <span>Buscar em tudo…</span>
            <kbd>/</kbd>
          </button>}
        </header>
        <div className="content">
          {effectivePage==='inicio' && <DashboardView go={go}/>}
          {effectivePage==='agenda' && <AgendaView/>}
          {effectivePage==='projetos' && <ProjetosView/>}
          {effectivePage==='alunos' && <AlunosView/>}
          {effectivePage==='aperfeicoamento' && <AperfeicoamentoView/>}
          {effectivePage==='lancamentos' && <LancamentosView/>}
          {effectivePage==='conteudo' && <ConteudoView/>}
          {effectivePage==='metas' && <MetasView/>}
          {effectivePage==='financas' && <FinancasView/>}
          {effectivePage==='cartorio' && <CartorioView/>}
          {effectivePage==='email' && <EmailView/>}
          {effectivePage==='busca' && <BuscaView/>}
          {effectivePage==='integracoes' && <IntegracoesView/>}
        </div>
      </main>
    </div>
  );
}

// keyboard "/" focuses search/navigates
window.addEventListener('keydown',(e)=>{
  if(e.key==='/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){
    e.preventDefault(); location.hash='busca';
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(StoreProvider, null, React.createElement(App))
);
