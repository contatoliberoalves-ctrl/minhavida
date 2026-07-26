/* ===== Minha Vida — Início / Dashboard ===== */
function DashboardView({go}){
  const { state, toggleDone } = useStore();
  const U=window.U;
  const [modal,setModal]=React.useState(null);

  // upcoming commitments
  const upcoming=state.commitments.filter(c=>!c.done && U.daysFromToday(c.date)>=0)
    .sort((a,b)=>(a.date+'T'+(a.time||'00')).localeCompare(b.date+'T'+(b.time||'00')));
  const today=upcoming.filter(c=>c.date===U.TODAY);
  const week=upcoming.filter(c=>{ const d=U.daysFromToday(c.date); return d>0&&d<=7; });
  const urgentes=upcoming.filter(c=>window.priorityOf(c)==='urgente');
  const prioridades=upcoming.filter(c=>{const p=window.priorityOf(c);return p==='urgente'||p==='quase';})
    .sort((a,b)=> (window.priorityOf(a)==='urgente'?0:1)-(window.priorityOf(b)==='urgente'?0:1)).slice(0,6);

  // finance this month
  const thisMonth=(t)=>{ const d=U.parseDate(t.date),n=U.parseDate(U.TODAY); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); };
  const mtx=state.tx.filter(thisMonth);
  const inM=mtx.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0);
  const outM=mtx.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
  const tithe=inM*(state.settings.tithe/100);
  const unread=state.emails.filter(e=>e.unread).length;

  // next big milestone
  const milestone=upcoming.find(c=>window.priorityOf(c)==='urgente');

  const Greeting=()=>{
    return (
      <div style={{marginBottom:22}}>
        <div style={{fontSize:12.5,color:'var(--muted)',fontWeight:500}}>{U.fmtDate(U.TODAY,'full').replace(/^\w/,m=>m.toUpperCase())}</div>
        <h1 style={{fontSize:26,fontWeight:700,letterSpacing:'-.025em',marginTop:3}}>Bom te ver por aqui 🌿</h1>
        <p style={{fontSize:13.5,color:'var(--muted)',marginTop:4}}>
          {today.length>0?<>Você tem <b style={{color:'var(--ink)'}}>{today.length} compromisso(s)</b> hoje</>:<>Nenhum compromisso para hoje</>}
          {urgentes.length>0 && <> e <b style={{color:'var(--danger)'}}>{urgentes.length} urgente(s)</b> à vista.</>}
        </p>
      </div>
    );
  };

  return (
    <div className="view-enter">
      <Greeting/>

      {/* KPI row */}
      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:18}}>
        <button className="kpi" style={{textAlign:'left',cursor:'pointer'}} onClick={()=>go('agenda')}>
          <div className="kpi-label"><Icon name="calendar" size={14} style={{color:'var(--olive)'}}/>Hoje</div>
          <div className="kpi-val tnum">{today.length}</div>
          <div className="kpi-meta">{week.length} nos próximos 7 dias</div>
        </button>
        <button className="kpi" style={{textAlign:'left',cursor:'pointer'}} onClick={()=>go('financas')}>
          <div className="kpi-label"><Icon name="arrowD" size={14} style={{color:'var(--ok)'}}/>Recebido no mês</div>
          <div className="kpi-val tnum" style={{color:'var(--ok)'}}>{U.brlShort(inM)}</div>
          <div className="kpi-meta">Gasto {U.brlShort(outM)}</div>
        </button>
        <button className="kpi" style={{textAlign:'left',cursor:'pointer'}} onClick={()=>go('financas')}>
          <div className="kpi-label"><Icon name="heart" size={14} style={{color:'var(--olive)'}}/>Dízimo do mês</div>
          <div className="kpi-val tnum" style={{color:'var(--olive-800)'}}>{U.brlShort(tithe)}</div>
          <div className="kpi-meta">{state.settings.tithe}% dos recebimentos</div>
        </button>
        <button className="kpi" style={{textAlign:'left',cursor:'pointer'}} onClick={()=>go('email')}>
          <div className="kpi-label"><Icon name="mail" size={14} style={{color:'var(--c-vdec)'}}/>E-mails não lidos</div>
          <div className="kpi-val tnum">{unread}</div>
          <div className="kpi-meta">na caixa de entrada</div>
        </button>
      </div>

      {milestone && (
        <div className="card" style={{marginBottom:18,padding:0,overflow:'hidden',display:'flex',alignItems:'stretch'}}>
          <div style={{width:6,background:'var(--danger)'}}></div>
          <div style={{padding:'15px 18px',display:'flex',alignItems:'center',gap:14,flex:1,flexWrap:'wrap'}}>
            <span style={{width:40,height:40,borderRadius:11,background:'color-mix(in srgb,var(--danger) 12%,#fff)',color:'var(--danger)',display:'grid',placeItems:'center',flex:'0 0 40px'}}><Icon name="flag" size={20}/></span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--danger)'}}>Próximo marco importante</div>
              <div style={{fontWeight:600,fontSize:15}}>{milestone.title}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:650,fontSize:14}}>{U.relDate(milestone.date)}</div>
              <div style={{fontSize:11.5,color:'var(--faint)'}}>{U.fmtDate(milestone.date,'long')}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid" style={{gridTemplateColumns:'1.5fr 1fr'}}>
        {/* agenda da semana */}
        <Card>
          <SectionH title="Sua semana" sub={(today.length+week.length)+' compromissos próximos'}
            action={<button className="btn btn-ghost btn-sm" onClick={()=>go('agenda')}>Ver agenda<Icon name="chevronR" size={14}/></button>}/>
          {[...today,...week].length===0?<div className="empty"><Icon name="check"/><div>Semana livre por enquanto.</div></div>:
          [...today,...week].slice(0,8).map(c=>{
            const p=U.PROJ_BY_KEY[c.project];
            return (
              <div key={c.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 2px',borderBottom:'1px solid var(--border-2)'}}>
                <button onClick={()=>toggleDone(c.id)} style={{width:19,height:19,flex:'0 0 19px',borderRadius:6,border:'1.8px solid var(--border)',background:'#fff',cursor:'pointer'}}></button>
                <div style={{width:54,flex:'0 0 54px',textAlign:'center'}}>
                  <div style={{fontSize:11,fontWeight:600,color:c.date===U.TODAY?'var(--olive)':'var(--ink-2)'}}>{c.date===U.TODAY?'Hoje':U.fmtDate(c.date,'').replace(' ','\u00a0')}</div>
                  {c.time && <div style={{fontSize:11,color:'var(--faint)'}} className="tnum">{c.time}</div>}
                </div>
                <span style={{width:3,alignSelf:'stretch',borderRadius:3,background:p.color}}></span>
                <div style={{flex:1,minWidth:0,cursor:'pointer'}} onClick={()=>setModal(c)}>
                  <div style={{fontSize:13,fontWeight:550,display:'flex',alignItems:'center',gap:7}}>{c.title}{window.priorityOf(c)&&<PriorityBadge priority={window.priorityOf(c)} sm/>}{c.meet&&<Icon name="video" size={13} style={{color:'var(--c-vdec)'}}/>}</div>
                  <div style={{fontSize:11,color:'var(--faint)'}}>{p.label}</div>
                </div>
              </div>
            );
          })}
        </Card>

        <div className="grid" style={{gridTemplateColumns:'1fr',alignContent:'start'}}>
          {/* prioridades */}
          <Card>
            <SectionH title="Prioridades" sub={prioridades.length+' itens'} action={<Icon name="flag" size={17} style={{color:'var(--danger)'}}/>}/>
            {prioridades.length===0?<div style={{fontSize:12.5,color:'var(--muted)',padding:'4px 0'}}>Nada pegando fogo. Respira 🌿</div>:
            prioridades.map(c=>{
              const col=window.PRIORITIES[window.priorityOf(c)].color;
              return (
              <div key={c.id} onClick={()=>setModal(c)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid var(--border-2)',cursor:'pointer'}}>
                <span style={{width:7,height:7,borderRadius:50,background:col,flex:'0 0 7px'}}></span>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:12.5,fontWeight:550,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}</div></div>
                <span style={{fontSize:11,color:'var(--faint)',whiteSpace:'nowrap'}}>{U.relDate(c.date)}</span>
              </div>
            );})}
          </Card>
          {/* projetos quick */}
          <Card>
            <SectionH title="Projetos" action={<button className="btn btn-ghost btn-sm" onClick={()=>go('projetos')}>Todos<Icon name="chevronR" size={14}/></button>}/>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {window.SEED.PROJECTS.filter(p=>p.key!=='pessoal').slice(0,6).map(p=>{
                const cnt=state.commitments.filter(c=>c.project===p.key&&!c.done&&U.daysFromToday(c.date)>=0).length;
                return (
                  <button key={p.key} onClick={()=>go('projetos')} style={{display:'flex',alignItems:'center',gap:10,background:'none',border:'none',padding:'3px 0',cursor:'pointer',textAlign:'left'}}>
                    <span style={{width:28,height:28,borderRadius:8,background:`color-mix(in srgb,${p.color} 13%,#fff)`,color:p.color,display:'grid',placeItems:'center',flex:'0 0 28px'}}><Icon name={p.icon} size={15}/></span>
                    <span style={{flex:1,fontSize:12.5,fontWeight:500}}>{p.label}</span>
                    <span className="nav-badge muted" style={{position:'static'}}>{cnt}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {modal && <CommitmentModal initial={modal} onClose={()=>setModal(null)}/>}
    </div>
  );
}
window.DashboardView = DashboardView;
