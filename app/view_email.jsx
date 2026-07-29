/* ===== Minha Vida — Caixa de Entrada (Gmail) ===== */
function parseGmailMessage(m){
  const headers = (m.payload && m.payload.headers) || [];
  const get = (n)=> (headers.find(h=>h.name===n)||{}).value || '';
  const fromRaw = get('From');
  const emailMatch = fromRaw.match(/<(.+)>/);
  const fromName = fromRaw.replace(/<.*>/,'').replace(/"/g,'').trim() || fromRaw || 'Desconhecido';
  const dateRaw = get('Date');
  let time = '';
  try{ if(dateRaw) time = window.U.fmtDate(new Date(dateRaw).toISOString().slice(0,10),'short'); }catch(e){}
  return {
    id: 'gm_'+m.id,
    from: fromName,
    email: emailMatch ? emailMatch[1] : '',
    subject: get('Subject') || '(sem assunto)',
    time,
    preview: m.snippet || '',
    unread: (m.labelIds||[]).includes('UNREAD'),
    star: (m.labelIds||[]).includes('STARRED'),
    label: '',
  };
}

function EmailView(){
  const { state, markRead, toggleStar, integrationStatus } = useStore();
  const connected = !!integrationStatus.google_gmail;
  const [sel,setSel]=React.useState(null);
  const [filter,setFilter]=React.useState('todos');
  const [fwd,setFwd]=React.useState(null);
  const [liveEmails,setLiveEmails]=React.useState(null);
  const [liveError,setLiveError]=React.useState('');
  const [loadingLive,setLoadingLive]=React.useState(false);
  const [overrides,setOverrides]=React.useState({});

  React.useEffect(()=>{
    if(!connected){ setLiveEmails(null); return; }
    let alive=true;
    setLoadingLive(true); setLiveError('');
    window.mvCallFunction('google-api', {api:'gmail_list', q:'in:inbox'})
      .then(r=>{ if(!alive) return; setLiveEmails((r.messages||[]).filter(m=>m && m.id).map(parseGmailMessage)); })
      .catch(e=>{ if(alive) setLiveError(e.message); })
      .finally(()=>{ if(alive) setLoadingLive(false); });
    return ()=>{ alive=false; };
  },[connected]);

  const isLive = (id)=> typeof id==='string' && id.startsWith('gm_');
  const withOverride = (e)=> overrides[e.id] ? {...e, ...overrides[e.id]} : e;

  let emails = (connected ? (liveEmails||[]) : state.emails).map(withOverride);
  if(filter==='nao')emails=emails.filter(e=>e.unread);
  if(filter==='fav')emails=emails.filter(e=>e.star);
  const unreadCount = (connected ? (liveEmails||[]) : state.emails).map(withOverride).filter(e=>e.unread).length;

  const handleOpen=(e)=>{
    setSel(e);
    if(e.unread){
      if(isLive(e.id)) setOverrides(o=>({...o,[e.id]:{...o[e.id], unread:false}}));
      else markRead(e.id);
    }
  };
  const handleToggleStar=(id)=>{
    if(isLive(id)){
      const cur = withOverride((liveEmails||[]).find(e=>e.id===id) || {});
      setOverrides(o=>({...o,[id]:{...o[id], star: !cur.star}}));
    } else toggleStar(id);
  };
  const labelColor=(l)=>{ const p=window.U.PROJ_BY_KEY[l]; return p?p.color:'var(--faint)'; };

  return (
    <div className="view-enter">
      {!connected && <div className="notice" style={{marginBottom:16}}>
        <Icon name="alert"/>
        <div><b>Pré-visualização com e-mails de exemplo.</b> Conecte sua conta do Gmail na aba <b>Integrações</b> para listar seus e-mails reais e encaminhar com o seu aval.</div>
      </div>}
      {connected && loadingLive && <div className="notice" style={{marginBottom:16}}><Icon name="alert"/><div>Carregando e-mails do Gmail…</div></div>}
      {connected && liveError && <div className="notice" style={{marginBottom:16}}><Icon name="alert"/><div>Não consegui carregar o Gmail: {liveError}</div></div>}

      <div className="grid" style={{gridTemplateColumns:'minmax(280px,360px) 1fr',gap:16,alignItems:'start'}}>
        <Card pad={false}>
          <div style={{padding:'13px 16px',borderBottom:'1px solid var(--border-2)',display:'flex',alignItems:'center',gap:8}}>
            <Icon name="mail" size={17} style={{color:'var(--olive)'}}/>
            <b style={{fontSize:14}}>Caixa de entrada</b>
            {unreadCount>0 && <span className="nav-badge" style={{position:'static'}}>{unreadCount}</span>}
            <div className="seg" style={{marginLeft:'auto',padding:2}}>
              {[['todos','Todos'],['nao','Não lidos'],['fav','★']].map(([k,l])=>
                <button key={k} className={filter===k?'on':''} style={{padding:'4px 9px',fontSize:11}} onClick={()=>setFilter(k)}>{l}</button>)}
            </div>
          </div>
          <div style={{maxHeight:560,overflowY:'auto'}}>
            {emails.length===0 && !loadingLive && <div className="empty"><Icon name="mail"/><div>Nenhum e-mail por aqui.</div></div>}
            {emails.map(e=>(
              <div key={e.id} onClick={()=>handleOpen(e)} style={{
                display:'flex',gap:11,padding:'13px 16px',borderBottom:'1px solid var(--border-2)',cursor:'pointer',
                background:sel&&sel.id===e.id?'var(--olive-50)':(e.unread?'#fff':'var(--surface-2)')
              }}>
                <button onClick={ev=>{ev.stopPropagation();handleToggleStar(e.id);}} style={{background:'none',border:'none',padding:0,color:e.star?'var(--warn)':'var(--faint)',marginTop:2}}>
                  <Icon name="star" size={15} style={{fill:e.star?'var(--warn)':'none'}}/></button>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:7}}>
                    <span style={{fontWeight:e.unread?650:550,fontSize:13,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.from}</span>
                    <span style={{fontSize:11,color:'var(--faint)'}}>{e.time}</span>
                  </div>
                  <div style={{fontSize:12.5,fontWeight:e.unread?600:500,color:'var(--ink-2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginTop:1}}>{e.subject}</div>
                  <div style={{fontSize:11.5,color:'var(--faint)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginTop:1}}>{e.preview}</div>
                  {e.label && <span className="chip" style={{fontSize:9.5,padding:'1px 7px',marginTop:6,color:labelColor(e.label)}}><span className="dot" style={{width:5,height:5,background:labelColor(e.label)}}></span>{window.U.PROJ_BY_KEY[e.label]?.label}</span>}
                </div>
                {e.unread && <span style={{width:8,height:8,borderRadius:50,background:'var(--olive)',marginTop:5,flex:'0 0 8px'}}></span>}
              </div>
            ))}
          </div>
        </Card>

        <Card pad={false} style={{minHeight:400}}>
          {!sel ? <div className="empty" style={{padding:'90px 20px'}}><Icon name="mail"/><div>Selecione um e-mail para ler.</div></div> :
          <div>
            <div style={{padding:'18px 22px',borderBottom:'1px solid var(--border-2)'}}>
              <h2 style={{fontSize:18,fontWeight:650,letterSpacing:'-.01em',marginBottom:10}}>{sel.subject}</h2>
              <div style={{display:'flex',alignItems:'center',gap:11}}>
                <span className="avatar">{sel.from[0]}</span>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>{sel.from}</div><div style={{fontSize:11.5,color:'var(--faint)'}}>{sel.email} · {sel.time}</div></div>
                <button className="btn btn-icon btn-ghost" onClick={()=>handleToggleStar(sel.id)} title="Favoritar"><Icon name="star" size={16} style={{fill:sel.star?'var(--warn)':'none',color:sel.star?'var(--warn)':'var(--muted)'}}/></button>
              </div>
            </div>
            <div style={{padding:'22px',fontSize:13.5,color:'var(--ink-2)',lineHeight:1.65}}>
              <p style={{marginBottom:12}}>{sel.preview}</p>
              {!connected && <p style={{marginBottom:12,color:'var(--faint)',fontStyle:'italic'}}>[ conteúdo completo do e-mail aparece aqui quando sua conta do Gmail estiver conectada ]</p>}
            </div>
            <div style={{padding:'16px 22px',borderTop:'1px solid var(--border-2)',display:'flex',gap:10,flexWrap:'wrap'}}>
              <button className="btn btn-primary"><Icon name="send" size={15}/>Responder</button>
              <button className="btn btn-ghost" onClick={()=>setFwd(sel)}><Icon name="external" size={15}/>Encaminhar com meu aval</button>
            </div>
          </div>}
        </Card>
      </div>

      {fwd && <ForwardModal email={fwd} connected={connected} onClose={()=>setFwd(null)}/>}
    </div>
  );
}

function ForwardModal({email,connected,onClose}){
  const [to,setTo]=React.useState('');
  const [note,setNote]=React.useState('');
  const [sent,setSent]=React.useState(false);
  const [sending,setSending]=React.useState(false);
  const [error,setError]=React.useState('');

  const approve = async ()=>{
    if(!connected){ setSent(true); return; }
    setSending(true); setError('');
    try{
      await window.mvCallFunction('google-api', {
        api:'gmail_send', to,
        subject: 'Fwd: '+email.subject,
        text: (note ? note+'\n\n---\n' : '')+(email.preview||''),
      });
      setSent(true);
    }catch(e){ setError(e.message||'Falha ao enviar.'); }
    finally{ setSending(false); }
  };

  return (
    <Modal title="Encaminhar com seu aval" icon="send" onClose={onClose}
      footer={sent?<button className="btn btn-primary" onClick={onClose}>Fechar</button>:<>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" disabled={!to.trim()||sending} onClick={approve}>
          {sending?'Enviando…':<><Icon name="check" size={15}/>Aprovar e encaminhar</>}</button>
      </>}>
      {sent ? <div style={{textAlign:'center',padding:'10px 0'}}>
        <span style={{width:54,height:54,borderRadius:50,background:'var(--olive-50)',color:'var(--olive)',display:'inline-grid',placeItems:'center'}}><Icon name="check" size={28} strokeWidth={2.2}/></span>
        <div style={{fontWeight:600,marginTop:12,fontSize:15}}>{connected?'E-mail encaminhado!':'Encaminhamento aprovado'}</div>
        <div style={{fontSize:12.5,color:'var(--muted)',marginTop:6,maxWidth:360,marginInline:'auto'}}>
          {connected ? <>Enviado para <b>{to}</b> pelo Gmail.</> : <>Quando o Gmail estiver conectado, o e-mail será enviado a <b>{to}</b> automaticamente após o seu aval.</>}
        </div>
      </div> : <div className="grid" style={{gap:14}}>
        <div style={{background:'var(--surface-2)',border:'1px solid var(--border-2)',borderRadius:11,padding:'11px 13px'}}>
          <div style={{fontSize:11.5,color:'var(--faint)'}}>Encaminhando</div>
          <div style={{fontWeight:600,fontSize:13.5}}>{email.subject}</div>
          <div style={{fontSize:11.5,color:'var(--muted)'}}>de {email.from}</div>
        </div>
        <div className="field"><label>Para</label><input className="input" autoFocus value={to} onChange={e=>setTo(e.target.value)} placeholder="email@destino.com"/></div>
        <div className="field"><label>Bilhete (opcional)</label><textarea className="input" value={note} onChange={e=>setNote(e.target.value)} placeholder="Encaminho para sua análise..."/></div>
        {error && <div className="notice"><Icon name="alert"/><div>{error}</div></div>}
        <div className="notice"><Icon name="alert"/><div>Nada é enviado sem o seu aval. Você confirma o destinatário e o texto antes de cada envio.</div></div>
      </div>}
    </Modal>
  );
}
window.EmailView = EmailView;
