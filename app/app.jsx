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

function LoginScreen(){
  const { signIn, signUp, authError } = useStore();
  const [mode,setMode]=React.useState('signin'); // signin | signup
  const [email,setEmail]=React.useState('');
  const [password,setPassword]=React.useState('');
  const [busy,setBusy]=React.useState(false);
  const [signedUpMsg,setSignedUpMsg]=React.useState('');

  const submit=async(e)=>{
    e.preventDefault();
    setBusy(true); setSignedUpMsg('');
    if(mode==='signin'){ await signIn(email,password); }
    else {
      await signUp(email,password);
      setSignedUpMsg('Conta criada! Se pedirmos confirmação por e-mail, confirme e depois entre por aqui.');
      setMode('signin');
    }
    setBusy(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:20}}>
      <form onSubmit={submit} className="card" style={{textAlign:'center',maxWidth:360,width:'100%',padding:'32px 28px'}}>
        <div className="brand-mark" style={{width:52,height:52,fontSize:22,margin:'0 auto 18px'}}>MV</div>
        <h1 style={{fontSize:22,fontWeight:700,letterSpacing:'-.02em',marginBottom:6}}>Minha Vida</h1>
        <p style={{fontSize:13.5,color:'var(--muted)',marginBottom:22}}>{mode==='signin'?'Entre com sua conta':'Crie sua conta'}</p>

        <div style={{display:'flex',flexDirection:'column',gap:10,textAlign:'left'}}>
          <label style={{fontSize:11.5,fontWeight:600,color:'var(--faint)'}}>E-mail
            <input className="input" type="email" required autoFocus value={email} onChange={e=>setEmail(e.target.value)} style={{marginTop:4}}/>
          </label>
          <label style={{fontSize:11.5,fontWeight:600,color:'var(--faint)'}}>Senha
            <input className="input" type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} style={{marginTop:4}}/>
          </label>
        </div>

        {authError && <div className="notice" style={{marginTop:14,textAlign:'left'}}><Icon name="alert"/><div>{authError}</div></div>}
        {signedUpMsg && <div className="notice" style={{marginTop:14,textAlign:'left'}}><Icon name="alert"/><div>{signedUpMsg}</div></div>}

        <button className="btn btn-primary" type="submit" disabled={busy} style={{width:'100%',marginTop:18,justifyContent:'center'}}>
          {busy? 'Aguarde…' : (mode==='signin' ? 'Entrar' : 'Criar conta')}
        </button>
        <button type="button" onClick={()=>{setMode(mode==='signin'?'signup':'signin'); setSignedUpMsg('');}} className="btn btn-ghost" style={{width:'100%',marginTop:8,justifyContent:'center'}}>
          {mode==='signin' ? 'Primeira vez? Criar conta' : 'Já tenho conta — entrar'}
        </button>
      </form>
    </div>
  );
}

function LoadingScreen(){
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div className="brand-mark" style={{width:52,height:52,fontSize:22}}>MV</div>
    </div>
  );
}

// avisa no Slack (uma vez por dia) sobre contas a pagar vencendo nos próximos 2 dias
function useDueBillsNotice(state, notifySlack){
  React.useEffect(()=>{
    if(!state) return;
    const today = window.U.TODAY;
    const key = 'mv_due_notified_'+today;
    if(localStorage.getItem(key)) return;
    const soon = (state.bills||[]).filter(b=> b.type==='pagar' && !b.paid && window.U.daysFromToday(b.due)>=0 && window.U.daysFromToday(b.due)<=2);
    if(soon.length){
      const lines = soon.map(b=>`• ${b.desc} — ${window.U.brl(b.amount)} (vence ${window.U.fmtDate(b.due,'')})`).join('\n');
      notifySlack(`⏰ Contas vencendo nos próximos dias:\n${lines}`);
    }
    localStorage.setItem(key,'1');
  },[!!state]);
}

function App(){
  const { session, state, signOut, notifySlack } = useStore();
  useDueBillsNotice(state, notifySlack);

  const profile = state ? (PROFILES[state.activeProfile] || null) : null;
  const nav = navFor(profile);
  const allowedKeys = new Set(nav.filter(i=>!i.section).map(i=>i.key));
  const [page,setPage]=React.useState(()=> (location.hash||'').replace('#','').split('?')[0] || 'inicio');
  const go=(p)=>{ setPage(p); location.hash=p; const m=document.querySelector('.content'); if(m) m.scrollTop=0; window.scrollTo(0,0); };
  React.useEffect(()=>{
    const h=()=>{ const p=(location.hash||'').replace('#','').split('?')[0]; if(p) setPage(p); };
    window.addEventListener('hashchange',h); return ()=>window.removeEventListener('hashchange',h);
  },[]);
  React.useEffect(()=>{
    if(profile && profile.access!=='all' && !allowedKeys.has(page)){ go('agenda'); }
  },[profile, page]);

  if(session===undefined) return <LoadingScreen/>;
  if(!session) return <LoginScreen/>;
  if(!state) return <LoadingScreen/>;
  if(!profile) return <LoadingScreen/>;

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
          <button className="user-chip" style={{width:'100%',border:'none',background:'none',cursor:'pointer',textAlign:'left'}} onClick={signOut} title="Sair">
            <span className="avatar">{profile.initials}</span>
            <div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:600}}>{profile.name}</div><div style={{fontSize:11,color:'var(--faint)'}}>{profile.role} · sair</div></div>
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
