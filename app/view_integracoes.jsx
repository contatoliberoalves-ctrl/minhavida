/* ===== Minha Vida — Integrações ===== */
function IntegracoesView(){
  const { integrationStatus, notifySlack } = useStore();
  const [busy,setBusy]=React.useState('');
  const [msg,setMsg]=React.useState(null); // {type:'ok'|'error', text}
  const [trelloForm,setTrelloForm]=React.useState({apiKey:'',token:''});
  const [slackForm,setSlackForm]=React.useState({webhookUrl:''});

  React.useEffect(()=>{
    const q = (location.hash.split('?')[1]||'');
    const params = new URLSearchParams(q);
    if(params.get('google_connected')) setMsg({type:'ok', text:'Google conectado com sucesso!'});
    if(params.get('google_error')) setMsg({type:'error', text:'Falha ao conectar o Google: '+params.get('google_error')});
    if(params.get('google_connected') || params.get('google_error')){
      history.replaceState(null,'','#integracoes');
    }
  },[]);

  const run = async (key, fn)=>{
    setBusy(key); setMsg(null);
    try{ await fn(); }
    catch(e){ setMsg({type:'error', text: e.message || 'Algo deu errado.'}); }
    finally{ setBusy(''); }
  };

  const connectGoogle = ()=>run('google', async ()=>{
    const {url} = await window.mvCallFunction('google-oauth-start', {});
    window.location.href = url;
  });
  const disconnectGoogle = ()=>run('google', async ()=>{
    await window.mvCallFunction('google-disconnect', {});
    setMsg({type:'ok', text:'Google desconectado.'});
  });

  const saveTrello = ()=>run('trello', async ()=>{
    const r = await window.mvCallFunction('trello-save', trelloForm);
    setMsg({type:'ok', text:'Trello conectado como @'+r.username+'!'});
    setTrelloForm({apiKey:'',token:''});
  });
  const disconnectTrello = ()=>run('trello', async ()=>{
    await window.mvCallFunction('trello-disconnect', {});
    setMsg({type:'ok', text:'Trello desconectado.'});
  });

  const saveSlack = ()=>run('slack', async ()=>{
    await window.mvCallFunction('slack-save', slackForm);
    setMsg({type:'ok', text:'Slack conectado! Mande uma mensagem de teste se quiser conferir.'});
    setSlackForm({webhookUrl:''});
  });
  const disconnectSlack = ()=>run('slack', async ()=>{
    await window.mvCallFunction('slack-disconnect', {});
    setMsg({type:'ok', text:'Slack desconectado.'});
  });
  const testSlack = ()=>run('slack-test', async ()=>{
    await notifySlack('👋 Teste de notificação do Minha Vida.');
    setMsg({type:'ok', text:'Mensagem de teste enviada ao Slack.'});
  });

  const google=[
    {k:'google_calendar',icon:'calendar',name:'Google Agenda',desc:'Registra seus compromissos, cria eventos e dispara lembretes automáticos.',color:'var(--c-vdec)'},
    {k:'google_meet',icon:'video',name:'Google Meet',desc:'Gera o link da reunião quando um compromisso precisar.',color:'var(--c-vde1)'},
    {k:'google_gmail',icon:'mail',name:'Gmail',desc:'Lista seus e-mails resumidamente e encaminha com o seu aval.',color:'var(--c-conteudo)'},
    {k:'google_drive',icon:'drive',name:'Google Drive',desc:'Permite que a busca leia e entenda seus arquivos.',color:'var(--c-renato)'},
    {k:'google_docs',icon:'doc',name:'Google Docs',desc:'A IA analisa seus documentos para entender melhor o seu contexto.',color:'var(--c-vde2)'},
  ];

  const platforms=[
    {name:'Cartório Curral Queimado',desc:'Site do cartório, ativo e em produção.',url:'https://cartoriocurralqueimado.netlify.app/',meta:'cartoriocurralqueimado.netlify.app',color:'var(--c-cartorio)'},
    {name:'Sessão Claude Code — Cartório',desc:'Ambiente de desenvolvimento do site.',url:'https://claude.ai/code/session_01DhARVTdiAtTNdmC9FQX3tx',meta:'claude.ai/code',color:'var(--olive)'},
  ];

  const googleAnyConnected = google.some(g=>integrationStatus[g.k]);

  return (
    <div className="view-enter" style={{maxWidth:920}}>
      {msg && <div className="notice" style={{marginBottom:22, borderColor: msg.type==='error' ? 'color-mix(in srgb,#c0392b 30%,#fff)' : undefined}}>
        <Icon name="alert"/><div>{msg.text}</div>
      </div>}

      <h3 style={{fontSize:13,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--faint)',marginBottom:12}}>Conta Google</h3>
      <div className="notice" style={{marginBottom:16}}>
        <Icon name="alert"/>
        <div>Um único login com o Google libera Agenda, Meet, Gmail, Drive e Docs de uma vez (é assim que o Google autoriza os apps). {googleAnyConnected ? 'Sua conta Google já está conectada.' : 'Clique em conectar em qualquer um dos cartões abaixo para autorizar tudo.'}</div>
      </div>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',marginBottom:30}}>
        {google.map(g=>{
          const on=!!integrationStatus[g.k];
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
                <button className={'btn btn-sm '+(on?'btn-ghost':'btn-primary')} style={{marginLeft:'auto'}} disabled={busy==='google'}
                  onClick={on?disconnectGoogle:connectGoogle}>
                  {busy==='google' ? '...' : (on?'Desconectar':<><Icon name="link" size={14}/>Conectar</>)}</button>
              </div>
            </div>
          );
        })}
      </div>

      <h3 style={{fontSize:13,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--faint)',marginBottom:12}}>Notificações no Slack</h3>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',marginBottom:30}}>
        <div className="card" style={{padding:18,display:'flex',flexDirection:'column',gap:13}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
            <span style={{width:42,height:42,borderRadius:11,background:'color-mix(in srgb,#4A154B 13%,#fff)',color:'#4A154B',display:'grid',placeItems:'center',flex:'0 0 42px'}}><Icon name="bell" size={22}/></span>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:14}}>Slack</div>
              <div style={{fontSize:11.5,color:'var(--muted)',marginTop:2,lineHeight:1.4}}>Avisa automaticamente sobre novo compromisso, conta paga e contas vencendo em breve.</div>
            </div>
          </div>
          {integrationStatus.slack ? (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span className="chip" style={{fontSize:10.5,color:'var(--ok)',borderColor:'color-mix(in srgb,var(--ok) 30%,#fff)'}}><span className="dot" style={{background:'var(--ok)'}}></span>Conectado</span>
              <button className="btn btn-sm btn-ghost" style={{marginLeft:'auto'}} disabled={busy==='slack-test'} onClick={testSlack}>{busy==='slack-test'?'...':'Testar'}</button>
              <button className="btn btn-sm btn-ghost" disabled={busy==='slack'} onClick={disconnectSlack}>{busy==='slack'?'...':'Desconectar'}</button>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <input className="input" placeholder="https://hooks.slack.com/services/..." value={slackForm.webhookUrl}
                onChange={e=>setSlackForm({webhookUrl:e.target.value})} style={{fontSize:12.5}}/>
              <button className="btn btn-sm btn-primary" disabled={busy==='slack' || !slackForm.webhookUrl} onClick={saveSlack}>
                {busy==='slack'?'Conectando…':<><Icon name="link" size={14}/>Conectar</>}</button>
              <div style={{fontSize:10.5,color:'var(--faint)'}}>Crie um Incoming Webhook em api.slack.com/apps e cole a URL aqui.</div>
            </div>
          )}
        </div>
      </div>

      <h3 style={{fontSize:13,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--faint)',marginBottom:12}}>Ferramentas de organização</h3>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',marginBottom:30}}>
        <div className="card" style={{padding:18,display:'flex',flexDirection:'column',gap:13}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
            <span style={{width:42,height:42,borderRadius:11,background:'color-mix(in srgb,#0079bf 13%,#fff)',color:'#0079bf',display:'grid',placeItems:'center',flex:'0 0 42px'}}><Icon name="board" size={22}/></span>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>Trello</div><div style={{fontSize:11.5,color:'var(--muted)',marginTop:2,lineHeight:1.4}}>Sincroniza seus quadros de organização dos lançamentos (listas e cartões).</div></div>
          </div>
          {integrationStatus.trello ? (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span className="chip" style={{fontSize:10.5,color:'var(--ok)',borderColor:'color-mix(in srgb,var(--ok) 30%,#fff)'}}><span className="dot" style={{background:'var(--ok)'}}></span>Conectado</span>
              <button className="btn btn-sm btn-ghost" style={{marginLeft:'auto'}} disabled={busy==='trello'} onClick={disconnectTrello}>{busy==='trello'?'...':'Desconectar'}</button>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <input className="input" placeholder="API Key (trello.com/app-key)" value={trelloForm.apiKey}
                onChange={e=>setTrelloForm(f=>({...f,apiKey:e.target.value}))} style={{fontSize:12.5}}/>
              <input className="input" placeholder="Token" value={trelloForm.token}
                onChange={e=>setTrelloForm(f=>({...f,token:e.target.value}))} style={{fontSize:12.5}}/>
              <button className="btn btn-sm btn-primary" style={{background:'#0079bf'}} disabled={busy==='trello' || !trelloForm.apiKey || !trelloForm.token} onClick={saveTrello}>
                {busy==='trello'?'Conectando…':<><Icon name="link" size={14}/>Conectar</>}</button>
            </div>
          )}
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
