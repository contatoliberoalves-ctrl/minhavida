/* ===== Minha Vida — Integrações ===== */
function IntegracoesView(){
  const { state, toggleConnect } = useStore();
  const conn=state.settings.connected;

  const google=[
    {k:'calendar',icon:'calendar',name:'Google Agenda',desc:'Registra seus compromissos, cria eventos e dispara lembretes automáticos.',color:'var(--c-vdec)'},
    {k:'meet',icon:'video',name:'Google Meet',desc:'Gera o link da reunião quando um compromisso precisar.',color:'var(--c-vde1)'},
    {k:'gmail',icon:'mail',name:'Gmail',desc:'Lista seus e-mails resumidamente e encaminha com o seu aval.',color:'var(--c-conteudo)'},
    {k:'drive',icon:'drive',name:'Google Drive',desc:'Permite que a busca leia e entenda seus arquivos.',color:'var(--c-renato)'},
    {k:'docs',icon:'doc',name:'Google Docs',desc:'A IA analisa seus documentos para entender melhor o seu contexto.',color:'var(--c-vde2)'},
  ];

  const platforms=[
    {name:'Cartório Curral Queimado',desc:'Site do cartório, ativo e em produção.',url:'https://cartoriocurralqueimado.netlify.app/',meta:'cartoriocurralqueimado.netlify.app',color:'var(--c-cartorio)'},
    {name:'Sessão Claude Code — Cartório',desc:'Ambiente de desenvolvimento do site.',url:'https://claude.ai/code/session_01DhARVTdiAtTNdmC9FQX3tx',meta:'claude.ai/code',color:'var(--olive)'},
  ];

  return (
    <div className="view-enter" style={{maxWidth:920}}>
      <div className="notice" style={{marginBottom:22}}>
        <Icon name="alert"/>
        <div><b>Como funciona.</b> Os botões abaixo simulam a conexão para você ver o fluxo completo. A conexão real com o Google (Agenda, Gmail, Drive, Docs, Meet) exige uma etapa técnica de autorização que o seu desenvolvedor pluga depois — a interface já está pronta para isso.</div>
      </div>

      <h3 style={{fontSize:13,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--faint)',marginBottom:12}}>Conta Google</h3>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',marginBottom:30}}>
        {google.map(g=>{
          const on=conn[g.k];
          return (
            <div key={g.k} className="card" style={{padding:18,display:'flex',flexDirection:'column',gap:13}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
                <span style={{width:42,height:42,borderRadius:11,background:`color-mix(in srgb,${g.color} 13%,#fff)`,color:g.color,display:'grid',placeItems:'center',flex:'0 0 42px'}}><Icon name={g.icon} size={22}/></span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14}}>{g.name}</div>
                  <div style={{fontSize:11.5,color:'var(--muted)',marginTop:2,lineHeight:1.4}}>{g.desc}</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginTop:'auto'}}>
                <span className="chip" style={{fontSize:10.5,color:on?'var(--ok)':'var(--faint)',borderColor:on?'color-mix(in srgb,var(--ok) 30%,#fff)':'var(--border)'}}>
                  <span className="dot" style={{background:on?'var(--ok)':'var(--faint)'}}></span>{on?'Conectado':'Não conectado'}</span>
                <button className={'btn btn-sm '+(on?'btn-ghost':'btn-primary')} style={{marginLeft:'auto'}} onClick={()=>toggleConnect(g.k)}>
                  {on?'Desconectar':<><Icon name="link" size={14}/>Conectar</>}</button>
              </div>
            </div>
          );
        })}
      </div>

      <h3 style={{fontSize:13,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--faint)',marginBottom:12}}>Ferramentas de organização</h3>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',marginBottom:30}}>
        <div className="card" style={{padding:18,display:'flex',flexDirection:'column',gap:13}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
            <span style={{width:42,height:42,borderRadius:11,background:'color-mix(in srgb,#0079bf 13%,#fff)',color:'#0079bf',display:'grid',placeItems:'center',flex:'0 0 42px'}}><Icon name="board" size={22}/></span>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>Trello</div><div style={{fontSize:11.5,color:'var(--muted)',marginTop:2,lineHeight:1.4}}>Sincroniza seus quadros de organização dos lançamentos (listas e cartões).</div></div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:'auto'}}>
            <span className="chip" style={{fontSize:10.5,color:conn.trello?'var(--ok)':'var(--faint)',borderColor:conn.trello?'color-mix(in srgb,var(--ok) 30%,#fff)':'var(--border)'}}><span className="dot" style={{background:conn.trello?'var(--ok)':'var(--faint)'}}></span>{conn.trello?'Conectado':'Não conectado'}</span>
            <button className={'btn btn-sm '+(conn.trello?'btn-ghost':'btn-primary')} style={{marginLeft:'auto',background:conn.trello?undefined:'#0079bf'}} onClick={()=>toggleConnect('trello')}>{conn.trello?'Desconectar':<><Icon name="link" size={14}/>Conectar</>}</button>
          </div>
        </div>
      </div>

      <h3 style={{fontSize:13,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--faint)',marginBottom:12}}>Minhas plataformas (Claude Code)</h3>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',marginBottom:18}}>
        {platforms.map((p,i)=>(
          <a key={i} href={p.url} target="_blank" rel="noopener" className="card" style={{padding:18,textDecoration:'none',color:'inherit',display:'flex',gap:13,alignItems:'center'}}>
            <span style={{width:42,height:42,borderRadius:11,background:`color-mix(in srgb,${p.color} 13%,#fff)`,color:p.color,display:'grid',placeItems:'center',flex:'0 0 42px'}}><Icon name="grid" size={21}/></span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:14,display:'flex',alignItems:'center',gap:7}}>{p.name}<span className="chip" style={{fontSize:9,padding:'1px 7px',color:'var(--ok)',borderColor:'color-mix(in srgb,var(--ok) 30%,#fff)'}}><span className="dot" style={{width:5,height:5,background:'var(--ok)'}}></span>ativo</span></div>
              <div style={{fontSize:11.5,color:'var(--muted)'}}>{p.desc}</div>
              {p.meta && <div style={{fontSize:10.5,color:'var(--olive-700)',marginTop:2,fontWeight:550}}>{p.meta}</div>}
            </div>
            <Icon name="external" size={17} style={{color:'var(--muted)'}}/>
          </a>
        ))}
        <div className="card" style={{padding:18,display:'flex',gap:13,alignItems:'center',borderStyle:'dashed',color:'var(--muted)'}}>
          <span style={{width:42,height:42,borderRadius:11,background:'var(--surface-2)',color:'var(--faint)',display:'grid',placeItems:'center',flex:'0 0 42px'}}><Icon name="plus" size={21}/></span>
          <div><div style={{fontWeight:600,fontSize:13.5,color:'var(--ink-2)'}}>Adicionar plataforma</div><div style={{fontSize:11.5}}>Cole o link de outro app seu para integrar aqui.</div></div>
        </div>
      </div>
    </div>
  );
}
window.IntegracoesView = IntegracoesView;
