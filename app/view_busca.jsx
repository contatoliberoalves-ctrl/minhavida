/* ===== Minha Vida — Busca inteligente ===== */
function BuscaView(){
  const { state, integrationStatus } = useStore();
  const U=window.U;
  const [q,setQ]=React.useState('');
  const [scope,setScope]=React.useState({plataforma:true,drive:false,gmail:false,docs:false});
  const conn={drive:!!integrationStatus.google_drive, gmail:!!integrationStatus.google_gmail, docs:!!integrationStatus.google_docs};

  const toggleScope=(k)=>setScope(s=>({...s,[k]:!s[k]}));

  // local results (always available — searches the platform itself)
  const ql=q.trim().toLowerCase();
  const localResults = ql? [
    ...state.commitments.filter(c=>c.title.toLowerCase().includes(ql)||c.desc.toLowerCase().includes(ql)).slice(0,6).map(c=>({
      kind:'Compromisso', icon:'calendar', title:c.title, meta:U.fmtDate(c.date,'long')+(c.time?' · '+c.time:''), color:U.PROJ_BY_KEY[c.project].color
    })),
    ...state.tx.filter(t=>t.desc.toLowerCase().includes(ql)).slice(0,4).map(t=>({
      kind:t.type==='income'?'Recebimento':'Gasto', icon:'wallet', title:t.desc, meta:U.fmtDate(t.date,'long')+' · '+U.brl(t.amount), color:'var(--olive)'
    })),
    ...window.SEED.PROJECTS.filter(p=>p.label.toLowerCase().includes(ql)||p.desc.toLowerCase().includes(ql)).slice(0,3).map(p=>({
      kind:'Projeto', icon:p.icon, title:p.label, meta:p.desc, color:p.color
    })),
    ...state.emails.filter(e=>e.subject.toLowerCase().includes(ql)||e.from.toLowerCase().includes(ql)).slice(0,4).map(e=>({
      kind:'E-mail', icon:'mail', title:e.subject, meta:'de '+e.from, color:'var(--c-vdec)'
    })),
  ] : [];

  const extScopes=[['drive','Google Drive','drive'],['gmail','Gmail','mail'],['docs','Google Docs','doc']];
  const activeExt=extScopes.filter(([k])=>scope[k]);

  return (
    <div className="view-enter" style={{maxWidth:840,margin:'0 auto'}}>
      <div style={{textAlign:'center',marginBottom:6}}>
        <span style={{width:50,height:50,borderRadius:14,background:'var(--olive-50)',color:'var(--olive)',display:'inline-grid',placeItems:'center',marginBottom:12}}><Icon name="sparkles" size={26}/></span>
        <h2 style={{fontSize:22,fontWeight:680,letterSpacing:'-.02em'}}>Busca inteligente</h2>
        <p style={{fontSize:13.5,color:'var(--muted)',marginTop:5,maxWidth:520,marginInline:'auto'}}>Pesquise dentro da plataforma e, quando conectado, nos seus locais do Google. A IA entende o contexto das suas coisas para responder melhor.</p>
      </div>

      <div style={{position:'relative',margin:'22px 0 14px'}}>
        <Icon name="search" size={20} style={{position:'absolute',left:18,top:'50%',transform:'translateY(-50%)',color:'var(--muted)'}}/>
        <input className="input" autoFocus value={q} onChange={e=>setQ(e.target.value)}
          placeholder="Ex.: reuniões da VDE em julho, gastos com saúde, e-mail da Eduarda..."
          style={{padding:'15px 18px 15px 50px',fontSize:15,borderRadius:14,boxShadow:'var(--sh-sm)'}}/>
      </div>

      {/* scope selector */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:18,alignItems:'center'}}>
        <span style={{fontSize:12,color:'var(--faint)',fontWeight:550}}>Buscar em:</span>
        <button onClick={()=>toggleScope('plataforma')} className="chip" style={{cursor:'pointer',borderColor:scope.plataforma?'var(--olive)':'var(--border)',background:scope.plataforma?'var(--olive-50)':'#fff',color:scope.plataforma?'var(--olive-800)':'var(--ink-2)',fontWeight:scope.plataforma?600:500}}>
          <Icon name="home" size={13}/>Esta plataforma</button>
        {extScopes.map(([k,l,ic])=>(
          <button key={k} onClick={()=>toggleScope(k)} className="chip" style={{cursor:'pointer',borderColor:scope[k]?'var(--olive)':'var(--border)',background:scope[k]?'var(--olive-50)':'#fff',color:scope[k]?'var(--olive-800)':'var(--ink-2)',fontWeight:scope[k]?600:500,opacity:conn[k]?1:.7}}>
            <Icon name={ic} size={13}/>{l}{!conn[k] && <span style={{fontSize:9.5,color:'var(--faint)'}}>· não conectado</span>}</button>
        ))}
      </div>

      {!ql && (
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:12}}>
          {[['Quanto recebi este mês e qual o dízimo?','wallet'],['Quais reuniões da VDE têm Meet?','video'],['O que tenho de urgente antes do casamento?','alert'],['Resuma os e-mails não lidos do cartório','mail']].map(([s,ic])=>(
            <button key={s} onClick={()=>setQ(s)} className="card" style={{padding:'14px 16px',textAlign:'left',cursor:'pointer',display:'flex',gap:11,alignItems:'center'}}>
              <span style={{width:32,height:32,borderRadius:9,background:'var(--olive-50)',color:'var(--olive)',display:'grid',placeItems:'center',flex:'0 0 32px'}}><Icon name={ic} size={16}/></span>
              <span style={{fontSize:12.5,color:'var(--ink-2)',fontWeight:500}}>{s}</span>
            </button>
          ))}
        </div>
      )}

      {ql && <>
        {/* AI answer band */}
        <Card style={{marginBottom:14,border:'1px solid var(--olive-200)',background:'linear-gradient(120deg,var(--olive-50),#fff 70%)'}}>
          <div style={{display:'flex',gap:11}}>
            <span style={{width:30,height:30,borderRadius:9,background:'var(--olive)',color:'#fff',display:'grid',placeItems:'center',flex:'0 0 30px'}}><Icon name="sparkles" size={16}/></span>
            <div>
              <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>Resposta da IA</div>
              <div style={{fontSize:12.5,color:'var(--ink-2)',lineHeight:1.55}}>Encontrei <b>{localResults.length}</b> resultado(s) nesta plataforma para “{q}”. {activeExt.length>0 && <>Para incluir resultados de <b>{activeExt.map(e=>e[1]).join(', ')}</b> e gerar um resumo com IA, é necessário conectar suas contas.</>}</div>
            </div>
          </div>
        </Card>

        {/* local results */}
        <div style={{fontSize:11,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--faint)',margin:'18px 4px 8px'}}>Nesta plataforma</div>
        {localResults.length===0 ? <div className="empty"><Icon name="search"/><div>Nada encontrado por aqui.</div></div> :
        <Card pad={false}>
          {localResults.map((r,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 18px',borderBottom:i<localResults.length-1?'1px solid var(--border-2)':'none'}}>
              <span style={{width:32,height:32,borderRadius:9,background:`color-mix(in srgb,${r.color} 13%,#fff)`,color:r.color,display:'grid',placeItems:'center',flex:'0 0 32px'}}><Icon name={r.icon} size={16}/></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:550}}>{r.title}</div>
                <div style={{fontSize:11.5,color:'var(--faint)'}}>{r.meta}</div>
              </div>
              <span className="chip" style={{fontSize:10}}>{r.kind}</span>
            </div>
          ))}
        </Card>}

        {/* external scope placeholders */}
        {activeExt.map(([k,l,ic])=>(
          <div key={k}>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--faint)',margin:'20px 4px 8px'}}>{l}</div>
            <div className="notice"><Icon name="alert"/><div><b>{l} não conectado.</b> Conecte na aba Integrações para buscar e resumir seus arquivos e mensagens com IA. <i>Requer conexão real.</i></div></div>
          </div>
        ))}
      </>}
    </div>
  );
}
window.BuscaView = BuscaView;
