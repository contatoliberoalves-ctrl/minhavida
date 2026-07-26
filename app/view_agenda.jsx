/* ===== Minha Vida — Agenda / Compromissos ===== */
function CommitmentRow({c, onEdit}){
  const { toggleDone } = useStore();
  const p = window.U.PROJ_BY_KEY[c.project];
  const [lb,setLb]=React.useState(-1);
  return (
    <div className="commit-row" style={{
      display:'flex',alignItems:'flex-start',gap:13,padding:'13px 4px',borderBottom:'1px solid var(--border-2)',
      opacity:c.done?.55:1
    }}>
      <button onClick={()=>toggleDone(c.id)} title="Concluir" style={{
        marginTop:1,width:21,height:21,flex:'0 0 21px',borderRadius:7,border:'1.8px solid '+(c.done?'var(--ok)':'var(--border)'),
        background:c.done?'var(--ok)':'#fff',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer',transition:'all .14s'
      }}>{c.done && <Icon name="check" size={13} strokeWidth={2.5}/>}</button>
      <div style={{flex:1,minWidth:0,cursor:'pointer'}} onClick={()=>onEdit(c)}>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <span style={{fontWeight:550,fontSize:13.5,textDecoration:c.done?'line-through':'none'}}>{c.title}</span>
          {!c.done && <PriorityBadge priority={window.priorityOf(c)}/>}
          {c.section && <span className="chip" style={{fontSize:10,padding:'1px 8px',color:'var(--muted)'}}>{c.section}</span>}
          {c.meet && <span className="chip" style={{fontSize:10.5,padding:'1px 8px',color:'var(--c-vdec)',borderColor:'color-mix(in srgb,var(--c-vdec) 30%,#fff)'}}><Icon name="video" size={12}/>Meet</span>}
          {c.images && c.images.length>0 && <span className="chip" style={{fontSize:10.5,padding:'1px 8px',color:'var(--muted)'}}><Icon name="camera" size={12}/>{c.images.length}</span>}
          {c.links && c.links.length>0 && <span className="chip" style={{fontSize:10.5,padding:'1px 8px',color:'var(--muted)'}}><Icon name="link" size={12}/>{c.links.length}</span>}
        </div>
        {c.desc && <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{c.desc}</div>}
        {c.images && c.images.length>0 && <div style={{display:'flex',gap:6,marginTop:7,flexWrap:'wrap'}} onClick={e=>e.stopPropagation()}>
          {c.images.slice(0,5).map((src,i)=>(
            <img key={i} src={src} alt="" onClick={()=>setLb(i)} style={{width:46,height:46,borderRadius:8,objectFit:'cover',border:'1px solid var(--border)',cursor:'zoom-in'}}/>
          ))}
          {c.images.length>5 && <span style={{fontSize:11,color:'var(--faint)',alignSelf:'center'}}>+{c.images.length-5}</span>}
        </div>}
        {c.links && c.links.length>0 && <div style={{display:'flex',gap:6,marginTop:7,flexWrap:'wrap'}} onClick={e=>e.stopPropagation()}>
          {c.links.map((l,i)=>(
            <a key={i} href={l} target="_blank" rel="noopener" className="chip" style={{fontSize:11,color:'var(--olive-700)',textDecoration:'none',cursor:'pointer'}}><Icon name="link" size={12}/>{window.urlLabel?window.urlLabel(l):l}</a>
          ))}
        </div>}
        <div style={{display:'flex',alignItems:'center',gap:11,marginTop:5,fontSize:11.5,color:'var(--faint)'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:4}}><Icon name="calendar" size={12}/>{window.U.fmtDate(c.date,'dow')}</span>
          {c.time && <span style={{display:'inline-flex',alignItems:'center',gap:4}}><Icon name="clock" size={12}/>{c.time}</span>}
          <span className="chip" style={{fontSize:10.5,padding:'1px 8px'}}><span className="dot" style={{background:p.color,width:6,height:6}}></span>{p.label}</span>
        </div>
      </div>
      {lb>=0 && <Lightbox images={c.images} index={lb} onClose={()=>setLb(-1)}/>}
    </div>
  );
}

function MonthCalendar({month, year, items, onDay, onEdit}){
  const U=window.U;
  const first = new Date(year,month,1);
  const startDow = first.getDay();
  const daysIn = new Date(year,month+1,0).getDate();
  const cells=[];
  for(let i=0;i<startDow;i++) cells.push(null);
  for(let d=1;d<=daysIn;d++) cells.push(d);
  while(cells.length%7!==0) cells.push(null);
  const byDay={};
  items.forEach(c=>{ const dt=U.parseDate(c.date); if(dt.getMonth()===month&&dt.getFullYear()===year){ (byDay[dt.getDate()]=byDay[dt.getDate()]||[]).push(c);} });
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6,marginBottom:8}}>
        {U.DOW.map(d=><div key={d} style={{textAlign:'center',fontSize:11,fontWeight:600,color:'var(--faint)',letterSpacing:'.03em'}}>{d}</div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6}}>
        {cells.map((d,i)=>{
          if(!d) return <div key={i} style={{minHeight:96}}></div>;
          const iso=U.toISO(new Date(year,month,d));
          const isToday=iso===U.TODAY;
          const list=(byDay[d]||[]).sort((a,b)=>(a.time||'99').localeCompare(b.time||'99'));
          return (
            <div key={i} onClick={()=>onDay(iso)} style={{
              minHeight:96,border:'1px solid '+(isToday?'var(--olive)':'var(--border-2)'),borderRadius:11,padding:'7px 8px',
              background:isToday?'var(--olive-50)':'#fff',cursor:'pointer',overflow:'hidden',transition:'border .12s'
            }}>
              <div style={{fontSize:12,fontWeight:isToday?700:550,color:isToday?'var(--olive-800)':'var(--ink-2)',marginBottom:4}}>{d}</div>
              <div style={{display:'flex',flexDirection:'column',gap:3}}>
                {list.slice(0,3).map(c=>{
                  const p=U.PROJ_BY_KEY[c.project];
                  const pr=window.priorityOf(c);
                  return <div key={c.id} onClick={e=>{e.stopPropagation();onEdit(c);}} title={c.title} style={{
                    fontSize:10.5,fontWeight:500,padding:'2px 6px',borderRadius:6,
                    background:`color-mix(in srgb,${p.color} 13%,#fff)`,color:p.color,
                    whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                    textDecoration:c.done?'line-through':'none',opacity:c.done?.6:1,
                    borderLeft:pr?('2px solid '+window.PRIORITIES[pr].color):'2px solid transparent'
                  }}>{c.time?c.time.slice(0,5)+' ':''}{c.title}</div>;
                })}
                {list.length>3 && <div style={{fontSize:10,color:'var(--faint)',paddingLeft:4}}>+{list.length-3} mais</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaView(){
  const { state } = useStore();
  const U=window.U;
  const [view,setView]=React.useState('lista'); // lista | mes
  const [proj,setProj]=React.useState('todos');
  const [filter,setFilter]=React.useState('proximos'); // proximos | todos | concluidos
  const [prio,setPrio]=React.useState('todas'); // todas | urgente | quase | espera
  const [modal,setModal]=React.useState(null); // commitment or 'new'
  const [cursor,setCursor]=React.useState({m:5,y:2026}); // junho 2026

  let items = state.commitments.slice();
  if(proj!=='todos') items=items.filter(c=>c.project===proj);
  if(prio!=='todas') items=items.filter(c=>window.priorityOf(c)===prio);
  let listItems=items.slice().sort((a,b)=> (a.date+'T'+(a.time||'00:00')).localeCompare(b.date+'T'+(b.time||'00:00')));
  if(filter==='proximos') listItems=listItems.filter(c=>!c.done && U.daysFromToday(c.date)>=0);
  else if(filter==='concluidos') listItems=listItems.filter(c=>c.done);

  // group by date for list
  const groups={};
  listItems.forEach(c=>{ (groups[c.date]=groups[c.date]||[]).push(c); });
  const dates=Object.keys(groups).sort();

  const projects=[{key:'todos',label:'Todos'},...window.SEED.PROJECTS];

  const monthName = U.MONTHS[cursor.m]+' '+cursor.y;
  const moveMonth=(d)=>setCursor(c=>{ let m=c.m+d,y=c.y; if(m<0){m=11;y--;} if(m>11){m=0;y++;} return {m,y}; });

  return (
    <div className="view-enter">
      {/* toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18,flexWrap:'wrap'}}>
        <div className="seg">
          <button className={view==='lista'?'on':''} onClick={()=>setView('lista')}><Icon name="list" size={14} style={{verticalAlign:'-2px',marginRight:5}}/>Lista</button>
          <button className={view==='mes'?'on':''} onClick={()=>setView('mes')}><Icon name="calendar" size={14} style={{verticalAlign:'-2px',marginRight:5}}/>Calendário</button>
        </div>
        {view==='lista' && <div className="seg">
          {[['proximos','Próximos'],['concluidos','Concluídos'],['todos','Todos']].map(([k,l])=>
            <button key={k} className={filter===k?'on':''} onClick={()=>setFilter(k)}>{l}</button>)}
        </div>}
        {view==='lista' && <div className="pill-row" style={{gap:6}}>
          {[['todas','Todas'],['urgente','Urgente'],['quase','Quase urgente'],['espera','Dá pra esperar']].map(([k,l])=>{
            const col = k==='todas'?'var(--olive)':window.PRIORITIES[k].color;
            const on = prio===k;
            return <button key={k} className="chip" onClick={()=>setPrio(k)} style={{cursor:'pointer',
              borderColor:on?col:'var(--border)',background:on?`color-mix(in srgb,${col} 12%,#fff)`:'#fff',
              color:on?col:'var(--ink-2)',fontWeight:on?600:500,padding:'6px 11px',fontSize:11.5}}>
              {k!=='todas' && <span className="dot" style={{background:col}}></span>}{l}</button>;
          })}
        </div>}
        {view==='mes' && <div style={{display:'flex',alignItems:'center',gap:6}}>
          <button className="btn btn-icon btn-ghost" onClick={()=>moveMonth(-1)}><Icon name="chevronL" size={16}/></button>
          <span style={{fontWeight:600,fontSize:14,minWidth:130,textAlign:'center'}}>{monthName}</span>
          <button className="btn btn-icon btn-ghost" onClick={()=>moveMonth(1)}><Icon name="chevronR" size={16}/></button>
        </div>}
        <button className="btn btn-primary" style={{marginLeft:'auto'}} onClick={()=>setModal('new')}><Icon name="plus" size={16}/>Novo compromisso</button>
      </div>

      {/* project tabs */}
      <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:20,overflowX:'auto',paddingBottom:2}}>
        {projects.map(p=>(
          <button key={p.key} onClick={()=>setProj(p.key)} className="chip" style={{
            cursor:'pointer',whiteSpace:'nowrap',
            borderColor:proj===p.key?(p.color||'var(--olive)'):'var(--border)',
            background:proj===p.key?(p.key==='todos'?'var(--olive-50)':`color-mix(in srgb,${p.color} 13%,#fff)`):'#fff',
            color:proj===p.key?(p.color||'var(--olive-800)'):'var(--ink-2)',fontWeight:proj===p.key?600:500,padding:'6px 12px'
          }}>
            {p.color && <span className="dot" style={{background:p.color}}></span>}{p.label}
          </button>
        ))}
      </div>

      {view==='lista' ? (
        <Card>
          {dates.length===0 ? <div className="empty"><Icon name="calendar"/><div>Nenhum compromisso aqui.</div></div> :
          dates.map(date=>(
            <div key={date} style={{marginBottom:8}}>
              <div style={{display:'flex',alignItems:'baseline',gap:9,padding:'6px 4px 4px',position:'sticky'}}>
                <span style={{fontSize:13,fontWeight:650,color:'var(--ink)'}}>{U.fmtDate(date,'full').replace(/^\w/,m=>m.toUpperCase())}</span>
                <span style={{fontSize:11.5,color:'var(--olive)',fontWeight:600}}>{U.relDate(date)}</span>
              </div>
              {groups[date].map(c=><CommitmentRow key={c.id} c={c} onEdit={setModal}/>)}
            </div>
          ))}
        </Card>
      ) : (
        <Card>
          <MonthCalendar month={cursor.m} year={cursor.y} items={items}
            onDay={(iso)=>setModal({date:iso})} onEdit={setModal}/>
        </Card>
      )}

      {modal && <CommitmentModal initial={modal==='new'?null:modal} onClose={()=>setModal(null)}/>}
    </div>
  );
}
window.AgendaView = AgendaView;
window.CommitmentRow = CommitmentRow;
