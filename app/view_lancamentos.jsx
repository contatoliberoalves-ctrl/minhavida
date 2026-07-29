/* ===== Minha Vida — Lançamentos ===== */
const LAUNCH_PHASES = {
  planejamento:{label:'Planejamento', color:'var(--faint)', step:0},
  pre:{label:'Pré-lançamento', color:'var(--warn)', step:1},
  aberto:{label:'Carrinho aberto', color:'var(--ok)', step:2},
  encerrado:{label:'Encerrado', color:'var(--c-vdec)', step:3},
};
function pct(a,b){ return b>0?Math.min(100,Math.round(a/b*100)):0; }

function LaunchModal({initial,onClose}){
  const { addLaunch, updateLaunch, removeLaunch } = useStore();
  const isEdit=!!(initial&&initial.id);
  const projects=window.SEED.PROJECTS.filter(p=>p.key!=='pessoal');
  const [f,setF]=React.useState(()=>({name:'',project:'pratflix',phase:'planejamento',openDate:window.U.TODAY,launchDate:window.U.TODAY,closeDate:'',goalRevenue:'',goalSales:'',actualRevenue:0,actualSales:0,notes:'',checklist:[],color:'var(--c-pratflix)',...(initial||{})}));
  const set=(k,v)=>setF(s=>({...s,[k]:v}));
  const save=()=>{ if(!f.name.trim())return; const p=window.U.PROJ_BY_KEY[f.project]; const payload={...f,color:p?p.color:f.color,goalRevenue:parseFloat(String(f.goalRevenue).replace(',','.'))||0,goalSales:parseInt(f.goalSales)||0}; if(isEdit)updateLaunch(initial.id,payload); else addLaunch(payload); onClose(); };
  return (
    <Modal title={isEdit?'Editar lançamento':'Novo lançamento'} icon="play" onClose={onClose}
      footer={<>
        {isEdit && <button className="btn btn-ghost" style={{marginRight:'auto',color:'var(--danger)',borderColor:'transparent'}} onClick={()=>{removeLaunch(initial.id);onClose();}}><Icon name="trash" size={15}/>Excluir</button>}
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>{isEdit?'Salvar':'Criar'}</button>
      </>}>
      <div className="grid" style={{gap:15}}>
        <div className="field"><label>Nome do lançamento</label><input className="input" autoFocus value={f.name} onChange={e=>set('name',e.target.value)} placeholder="Ex.: Pratflix — Lançamento"/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Projeto</label><select className="input" value={f.project} onChange={e=>set('project',e.target.value)}>{projects.map(p=><option key={p.key} value={p.key}>{p.label}</option>)}</select></div>
          <div className="field"><label>Fase</label><select className="input" value={f.phase} onChange={e=>set('phase',e.target.value)}>{Object.keys(LAUNCH_PHASES).map(k=><option key={k} value={k}>{LAUNCH_PHASES[k].label}</option>)}</select></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:11}}>
          <div className="field"><label>Aquecimento</label><input className="input" type="date" value={f.openDate} onChange={e=>set('openDate',e.target.value)}/></div>
          <div className="field"><label>Abertura</label><input className="input" type="date" value={f.launchDate} onChange={e=>set('launchDate',e.target.value)}/></div>
          <div className="field"><label>Fechamento</label><input className="input" type="date" value={f.closeDate} onChange={e=>set('closeDate',e.target.value)}/></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Meta de receita (R$)</label><input className="input tnum" value={f.goalRevenue} onChange={e=>set('goalRevenue',e.target.value)} placeholder="0,00"/></div>
          <div className="field"><label>Meta de vendas</label><input className="input tnum" value={f.goalSales} onChange={e=>set('goalSales',e.target.value)} placeholder="0"/></div>
        </div>
        <div className="field"><label>Observações</label><textarea className="input" value={f.notes} onChange={e=>set('notes',e.target.value)} placeholder="Estratégia, oferta, observações..."/></div>
      </div>
    </Modal>
  );
}

function LancamentosView(){
  const { state, integrationStatus } = useStore();
  const U=window.U;
  const [open,setOpen]=React.useState(null);
  const [modal,setModal]=React.useState(false);
  const [filter,setFilter]=React.useState('todos');
  const [view,setView]=React.useState('cards'); // cards | board
  const trello = !!integrationStatus.trello;
  const goToIntegracoes = ()=>{ location.hash='integracoes'; };

  if(open){ const l=state.launches.find(x=>x.id===open); if(l) return <LaunchDetail launch={l} onBack={()=>setOpen(null)}/>; }

  let list=state.launches.slice().sort((a,b)=>(a.launchDate||'').localeCompare(b.launchDate||''));
  if(filter!=='todos') list=list.filter(l=>l.phase===filter);

  const ativos=state.launches.filter(l=>l.phase!=='encerrado');
  const prox=ativos.slice().sort((a,b)=>(a.launchDate||'').localeCompare(b.launchDate||'')).find(l=>U.daysFromToday(l.launchDate)>=0);
  const metaTotal=state.launches.reduce((a,l)=>a+(l.goalRevenue||0),0);
  const realTotal=state.launches.reduce((a,l)=>a+(l.actualRevenue||0),0);

  return (
    <div className="view-enter">
      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:18}}>
        <KPI label="Lançamentos ativos" icon="play" value={ativos.length} meta={state.launches.length+' no total'}/>
        <KPI label="Próximo" icon="calendar" value={prox?U.fmtDate(prox.launchDate,''):'—'} meta={prox?prox.name:'nenhum agendado'} accent="var(--c-pratflix)"/>
        <KPI label="Meta de receita" icon="target" value={U.brlShort(metaTotal)} meta="somatório das metas"/>
        <KPI label="Receita realizada" icon="trending" value={U.brlShort(realTotal)} meta={pct(realTotal,metaTotal)+'% da meta'} accent="var(--ok)"/>
      </div>

      <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:18}}>
        <div className="seg">
          <button className={view==='cards'?'on':''} onClick={()=>setView('cards')}><Icon name="grid" size={14} style={{verticalAlign:'-2px',marginRight:5}}/>Cartões</button>
          <button className={view==='board'?'on':''} onClick={()=>setView('board')}><Icon name="board" size={14} style={{verticalAlign:'-2px',marginRight:5}}/>Quadro</button>
          <button className={view==='playbook'?'on':''} onClick={()=>setView('playbook')}><Icon name="list" size={14} style={{verticalAlign:'-2px',marginRight:5}}/>Playbook</button>
        </div>
        {view==='cards' && <div className="seg">
          <button className={filter==='todos'?'on':''} onClick={()=>setFilter('todos')}>Todos</button>
          {Object.keys(LAUNCH_PHASES).map(k=><button key={k} className={filter===k?'on':''} onClick={()=>setFilter(k)}>{LAUNCH_PHASES[k].label}</button>)}
        </div>}
        <button className="btn btn-ghost" onClick={goToIntegracoes} style={Object.assign({marginLeft:'auto'}, trello?{borderColor:'color-mix(in srgb,#0079bf 40%,#fff)',color:'#0079bf'}:{})}>
          <span style={{width:15,height:15,borderRadius:3,background:trello?'#0079bf':'var(--muted)',display:'inline-grid',placeItems:'center'}}><Icon name="board" size={11} style={{color:'#fff'}}/></span>
          {trello?'Trello conectado':'Conectar Trello'}</button>
        <button className="btn btn-primary" onClick={()=>setModal(true)}><Icon name="plus" size={16}/>Novo lançamento</button>
      </div>

      {view==='board' ? <TrelloBoard launches={state.launches} trello={trello} onOpen={setOpen} onConnect={goToIntegracoes}/> :
      view==='playbook' ? <PlaybookView launches={state.launches}/> :
      list.length===0 ? <div className="empty"><Icon name="play"/><div>Nenhum lançamento neste filtro.</div></div> :
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(330px,1fr))'}}>
        {list.map(l=>{
          const ph=LAUNCH_PHASES[l.phase];
          const done=(l.checklist||[]).filter(k=>k.done).length, tot=(l.checklist||[]).length;
          const days=U.daysFromToday(l.launchDate);
          return (
            <button key={l.id} onClick={()=>setOpen(l.id)} className="card" style={{textAlign:'left',cursor:'pointer',padding:0}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--sh-md)';}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--sh-sm)';}}>
              <div style={{height:5,background:l.color,borderRadius:'16px 16px 0 0'}}></div>
              <div style={{padding:17}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:12}}>
                  <span style={{width:38,height:38,borderRadius:10,background:`color-mix(in srgb,${l.color} 14%,#fff)`,color:l.color,display:'grid',placeItems:'center',flex:'0 0 38px'}}><Icon name="play" size={19}/></span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:650,fontSize:14.5}}>{l.name}</div>
                    <div style={{fontSize:11.5,color:'var(--muted)'}}>{U.PROJ_BY_KEY[l.project]?.label}</div>
                  </div>
                  <span className="chip" style={{fontSize:10,padding:'1px 8px',color:ph.color,borderColor:`color-mix(in srgb,${ph.color} 30%,#fff)`}}><span className="dot" style={{background:ph.color}}></span>{ph.label}</span>
                </div>
                {/* phase stepper */}
                <div style={{display:'flex',gap:4,marginBottom:12}}>
                  {Object.keys(LAUNCH_PHASES).map(k=><div key={k} style={{flex:1,height:4,borderRadius:3,background:LAUNCH_PHASES[k].step<=ph.step?l.color:'var(--border-2)'}}></div>)}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11.5,color:'var(--muted)',marginBottom:10}}>
                  <span><Icon name="calendar" size={12} style={{verticalAlign:'-2px'}}/> Abertura {U.fmtDate(l.launchDate,'long')}</span>
                  {l.phase!=='encerrado' && days>=0 && <span style={{color:days<=7?'var(--danger)':'var(--olive-700)',fontWeight:600}}>{days===0?'hoje':'em '+days+'d'}</span>}
                </div>
                {tot>0 && <><div className="bar" style={{marginBottom:5}}><span style={{width:pct(done,tot)+'%',background:l.color}}></span></div>
                <div style={{fontSize:11,color:'var(--faint)'}}>Checklist {done}/{tot} · meta {U.brlShort(l.goalRevenue)}</div></>}
                {l.phase==='encerrado' && <div style={{marginTop:8,fontSize:12,fontWeight:600,color:'var(--ok)'}}>Resultado: {U.brl(l.actualRevenue)} ({pct(l.actualRevenue,l.goalRevenue)}% da meta)</div>}
              </div>
            </button>
          );
        })}
      </div>}

      {modal && <LaunchModal onClose={()=>setModal(false)}/>}
    </div>
  );
}

function LaunchDetail({launch, onBack}){
  const { state, updateLaunch } = useStore();
  const U=window.U; const l=launch; const ph=LAUNCH_PHASES[l.phase];
  const [edit,setEdit]=React.useState(false);
  const [newItem,setNewItem]=React.useState('');
  const [res,setRes]=React.useState({actualRevenue:l.actualRevenue||'',actualSales:l.actualSales||''});
  React.useEffect(()=>setRes({actualRevenue:l.actualRevenue||'',actualSales:l.actualSales||''}),[l.id]);
  const checklist=l.checklist||[];
  const done=checklist.filter(k=>k.done).length;
  const toggleItem=(id)=>updateLaunch(l.id,{checklist:checklist.map(k=>k.id===id?{...k,done:!k.done}:k)});
  const removeItem=(id)=>updateLaunch(l.id,{checklist:checklist.filter(k=>k.id!==id)});
  const addItem=()=>{ if(newItem.trim()){updateLaunch(l.id,{checklist:[...checklist,{id:'k'+Date.now(),text:newItem.trim(),done:false}]});setNewItem('');} };
  const saveRes=()=>updateLaunch(l.id,{actualRevenue:parseFloat(String(res.actualRevenue).replace(',','.'))||0,actualSales:parseInt(res.actualSales)||0});
  const phaseKeys=Object.keys(LAUNCH_PHASES);

  return (
    <div className="view-enter">
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{marginBottom:16}}><Icon name="chevronL" size={15}/>Todos os lançamentos</button>
      <div className="card" style={{padding:0,marginBottom:18,overflow:'hidden'}}>
        <div style={{height:6,background:l.color}}></div>
        <div style={{padding:'20px 22px',display:'flex',gap:15,alignItems:'center',flexWrap:'wrap'}}>
          <span style={{width:48,height:48,borderRadius:12,background:`color-mix(in srgb,${l.color} 14%,#fff)`,color:l.color,display:'grid',placeItems:'center',flex:'0 0 48px'}}><Icon name="play" size={24}/></span>
          <div style={{flex:1,minWidth:0}}>
            <h2 style={{fontSize:20,fontWeight:650,letterSpacing:'-.02em'}}>{l.name}</h2>
            <div style={{fontSize:13,color:'var(--muted)'}}>{U.PROJ_BY_KEY[l.project]?.label}</div>
          </div>
          <button className="btn btn-ghost" onClick={()=>setEdit(true)}><Icon name="edit" size={15}/>Editar</button>
        </div>
        {/* phase selector */}
        <div style={{display:'flex',gap:8,padding:'0 22px 18px',flexWrap:'wrap'}}>
          {phaseKeys.map(k=>{const on=l.phase===k;const c=LAUNCH_PHASES[k];return (
            <button key={k} onClick={()=>updateLaunch(l.id,{phase:k})} className="chip" style={{cursor:'pointer',borderColor:on?c.color:'var(--border)',background:on?`color-mix(in srgb,${c.color} 13%,#fff)`:'#fff',color:on?c.color:'var(--ink-2)',fontWeight:on?600:500}}>
              {on&&<Icon name="check" size={12}/>}{c.label}</button>
          );})}
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1.4fr 1fr',gap:18,alignItems:'start'}}>
        {/* checklist */}
        <Card>
          <SectionH title="Checklist do lançamento" sub={done+'/'+checklist.length+' concluídos'}/>
          <div className="bar" style={{marginBottom:14}}><span style={{width:pct(done,checklist.length)+'%',background:l.color}}></span></div>
          {checklist.map(k=>(
            <div key={k.id} style={{display:'flex',alignItems:'center',gap:11,padding:'9px 2px',borderBottom:'1px solid var(--border-2)'}}>
              <button onClick={()=>toggleItem(k.id)} style={{width:20,height:20,flex:'0 0 20px',borderRadius:6,border:'1.8px solid '+(k.done?'var(--ok)':'var(--border)'),background:k.done?'var(--ok)':'#fff',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}>{k.done&&<Icon name="check" size={12} strokeWidth={2.5}/>}</button>
              <span style={{flex:1,fontSize:13,textDecoration:k.done?'line-through':'none',color:k.done?'var(--muted)':'var(--ink)'}}>{k.text}</span>
              <button onClick={()=>removeItem(k.id)} style={{background:'none',border:'none',color:'var(--faint)',cursor:'pointer',padding:0}}><Icon name="x" size={14}/></button>
            </div>
          ))}
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <input className="input" value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addItem();}} placeholder="Adicionar etapa..." style={{flex:1}}/>
            <button className="btn btn-subtle" onClick={addItem}><Icon name="plus" size={15}/></button>
          </div>
        </Card>

        <div className="grid" style={{gridTemplateColumns:'1fr',gap:18,alignContent:'start'}}>
          {/* cronograma */}
          <Card>
            <SectionH title="Cronograma"/>
            {[['Aquecimento',l.openDate],['Abertura do carrinho',l.launchDate],['Fechamento',l.closeDate]].map(([lab,d],i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:11,padding:'9px 0',borderBottom:i<2?'1px solid var(--border-2)':'none'}}>
                <span style={{width:9,height:9,borderRadius:50,background:l.color,flex:'0 0 9px'}}></span>
                <span style={{flex:1,fontSize:12.5,color:'var(--ink-2)'}}>{lab}</span>
                <span style={{fontSize:12.5,fontWeight:600}}>{d?U.fmtDate(d,'long'):'—'}</span>
              </div>
            ))}
          </Card>
          {/* metas x resultados */}
          <Card>
            <SectionH title="Metas × Resultados"/>
            <GoalRow label="Receita" goal={l.goalRevenue} actual={l.actualRevenue} money color={l.color}/>
            <GoalRow label="Vendas" goal={l.goalSales} actual={l.actualSales} color={l.color}/>
            <div className="divider"></div>
            <div style={{fontSize:11.5,fontWeight:600,color:'var(--muted)',marginBottom:8}}>Registrar resultado</div>
            <div style={{display:'flex',gap:8,marginBottom:8}}>
              <div className="field" style={{flex:1,margin:0}}><label style={{fontSize:11}}>Receita (R$)</label><input className="input tnum" value={res.actualRevenue} onChange={e=>setRes({...res,actualRevenue:e.target.value})} placeholder="0,00"/></div>
              <div className="field" style={{flex:1,margin:0}}><label style={{fontSize:11}}>Vendas</label><input className="input tnum" value={res.actualSales} onChange={e=>setRes({...res,actualSales:e.target.value})} placeholder="0"/></div>
            </div>
            <button className="btn btn-primary btn-sm" style={{width:'100%'}} onClick={saveRes}><Icon name="check" size={14}/>Salvar resultado</button>
          </Card>
          {l.notes && <Card><SectionH title="Observações"/><div style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.5}}>{l.notes}</div></Card>}
        </div>
      </div>
      {edit && <LaunchModal initial={l} onClose={()=>setEdit(false)}/>}
    </div>
  );
}

function GoalRow({label,goal,actual,money,color}){
  const U=window.U; const p=pct(actual||0,goal||0);
  const fmt=money?(v=>U.brl(v||0)):(v=>(v||0).toLocaleString('pt-BR'));
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:12.5,marginBottom:5}}>
        <span style={{fontWeight:550}}>{label}</span>
        <span className="tnum"><b>{fmt(actual)}</b> <span style={{color:'var(--faint)'}}>/ {fmt(goal)}</span></span>
      </div>
      <div className="bar"><span style={{width:p+'%',background:color}}></span></div>
      <div style={{fontSize:10.5,color:'var(--faint)',marginTop:3,textAlign:'right'}}>{p}% da meta</div>
    </div>
  );
}

function TrelloBoard({launches, trello, onOpen, onConnect}){
  const U=window.U;
  const phaseKeys=Object.keys(LAUNCH_PHASES);
  return (
    <div>
      {/* barra de conexão */}
      <div className="card" style={{padding:'13px 16px',marginBottom:14,display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',
        borderColor: trello?'color-mix(in srgb,#0079bf 35%,#fff)':'var(--border)',
        background: trello?'color-mix(in srgb,#0079bf 6%,#fff)':'var(--surface)'}}>
        <span style={{width:34,height:34,borderRadius:9,background:'#0079bf',display:'grid',placeItems:'center',flex:'0 0 34px'}}><Icon name="board" size={18} style={{color:'#fff'}}/></span>
        <div style={{flex:1,minWidth:180}}>
          <div style={{fontWeight:600,fontSize:13.5}}>Trello {trello?'· conectado':''}</div>
          <div style={{fontSize:11.5,color:'var(--muted)'}}>{trello?'Quadros sincronizados — listas e cartões refletem seus lançamentos.':'Conecte para sincronizar seus quadros reais de organização dos lançamentos.'}</div>
        </div>
        <button className={'btn '+(trello?'btn-ghost':'btn-primary')} onClick={onConnect} style={trello?null:{background:'#0079bf'}}>
          {trello?'Desconectar':<><Icon name="link" size={15}/>Conectar Trello</>}</button>
      </div>

      {!trello && <div className="notice" style={{marginBottom:14}}><Icon name="alert"/><div>Abaixo está o quadro local dos seus lançamentos (organizado por fase). Ao <b>conectar o Trello</b> de verdade, este quadro passa a espelhar as listas e cartões dos seus quadros reais, com sincronização nos dois sentidos. <i>Requer conexão real.</i></div></div>}

      {/* board */}
      <div style={{display:'flex',gap:12,overflowX:'auto',paddingBottom:8,alignItems:'flex-start'}}>
        {phaseKeys.map(k=>{
          const ph=LAUNCH_PHASES[k];
          const cards=launches.filter(l=>l.phase===k);
          return (
            <div key={k} style={{flex:'0 0 270px',width:270,background:'var(--surface-2)',border:'1px solid var(--border-2)',borderRadius:14,padding:10}}>
              <div style={{display:'flex',alignItems:'center',gap:7,padding:'4px 6px 10px'}}>
                <span style={{width:9,height:9,borderRadius:3,background:ph.color}}></span>
                <span style={{fontSize:12.5,fontWeight:650}}>{ph.label}</span>
                <span style={{marginLeft:'auto',fontSize:11,color:'var(--faint)',fontWeight:600,background:'#fff',borderRadius:20,padding:'1px 8px',border:'1px solid var(--border-2)'}}>{cards.length}</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {cards.map(l=>{
                  const done=(l.checklist||[]).filter(c=>c.done).length, tot=(l.checklist||[]).length;
                  const p=U.PROJ_BY_KEY[l.project];
                  return (
                    <div key={l.id} className="card" style={{padding:11,cursor:'pointer'}} onClick={()=>onOpen(l.id)}>
                      <div style={{height:6,width:42,borderRadius:4,background:l.color,marginBottom:8}}></div>
                      <div style={{fontSize:13,fontWeight:600,lineHeight:1.35,marginBottom:7}}>{l.name}</div>
                      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',fontSize:10.5,color:'var(--muted)'}}>
                        {l.launchDate && <span style={{display:'inline-flex',alignItems:'center',gap:4,background:U.daysFromToday(l.launchDate)<0?'color-mix(in srgb,var(--danger) 12%,#fff)':'var(--surface-2)',color:U.daysFromToday(l.launchDate)<0?'var(--danger)':'var(--muted)',padding:'1px 7px',borderRadius:6,fontWeight:600}}><Icon name="clock" size={11}/>{U.fmtDate(l.launchDate,'')}</span>}
                        {tot>0 && <span style={{display:'inline-flex',alignItems:'center',gap:4}}><Icon name="check" size={11}/>{done}/{tot}</span>}
                        {p && <span style={{display:'inline-flex',alignItems:'center',gap:4}}><span style={{width:7,height:7,borderRadius:50,background:p.color}}></span>{p.label}</span>}
                      </div>
                      {tot>0 && <div className="bar" style={{marginTop:8,height:5}}><span style={{width:pct(done,tot)+'%',background:l.color}}></span></div>}
                    </div>
                  );
                })}
                {cards.length===0 && <div style={{fontSize:11.5,color:'var(--faint)',textAlign:'center',padding:'14px 0'}}>Nenhum cartão</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.LancamentosView = LancamentosView;
