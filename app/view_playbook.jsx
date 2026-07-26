/* ===== Minha Vida — Playbook de Lançamento (importado do Trello) ===== */
const PLAYBOOK_CAT = {
  'DATAS IMPORTANTES':{icon:'calendar', color:'var(--c-pratflix)'},
  'CURSO':{icon:'play', color:'var(--c-vde2)'},
  'DESIGN':{icon:'camera', color:'var(--c-conteudo)'},
  'TRÁFEGO PAGO':{icon:'trending', color:'var(--c-vdec)'},
  'FERRAMENTAS':{icon:'settings', color:'var(--cartorio)'},
  'LANDING PAGE':{icon:'grid', color:'var(--c-vde1)'},
  'PRODUÇÃO DE CONTEÚDOS':{icon:'edit', color:'var(--c-renato)'},
  'EDIÇÃO DE VÍDEOS':{icon:'video', color:'var(--c-vde2)'},
  'E-MAIL MARKETING':{icon:'mail', color:'var(--c-conteudo)'},
  'LIVE DE LANÇAMENTO':{icon:'video', color:'var(--c-pratflix)'},
  'SUPORTE AO ALUNO':{icon:'users', color:'var(--ok)'},
  'ADICIONAL':{icon:'sparkles', color:'var(--c-constitucional)'},
};
const ROLE_COLORS = {
  'EXPERT':'var(--olive)',
  'GESTOR DE TRÁFEGO':'var(--c-vdec)',
  'DESIGNER LP':'var(--c-conteudo)',
  'DESGINER':'var(--c-conteudo)',
  'VIDEOMAKER':'var(--c-pratflix)',
  'LÍBERO':'var(--c-cartorio)',
  'URGÊNCIA':'var(--danger)',
};
function roleLabel(r){ return r==='DESGINER'?'DESIGNER':r; }

function PlaybookView({launches}){
  const { state, togglePlaybookTask, addPlaybookTask, removePlaybookTask, resetPlaybook } = useStore();
  const U=window.U;
  const PB = window.LAUNCH_PLAYBOOK||[];
  const [target,setTarget]=React.useState('_geral');
  const [role,setRole]=React.useState('todos');
  const [q,setQ]=React.useState('');
  const [hideDone,setHideDone]=React.useState(false);
  const [adding,setAdding]=React.useState(null); // listIdx
  const [newTask,setNewTask]=React.useState('');
  const [taskModal,setTaskModal]=React.useState(null); // {task, catName, catColor}

  const checks = state.playbookChecks[target]||{};
  const meta=(id)=>checks[id]||{};
  const isDone=(id)=>!!meta(id).done;

  // build categories with base + extra tasks
  const cats = PB.map((cat,li)=>{
    const base=cat.cards.map((c,ci)=>({id:li+'-'+ci, name:c.name, labels:c.labels||[], due:c.due}));
    const extra=state.playbookExtra.filter(p=>p.listIdx===li).map(p=>({id:p.id, name:p.name, labels:[], extra:true}));
    return {name:cat.name, idx:li, tasks:[...base,...extra]};
  });

  // all tasks for stats + filtering
  const allTasks=cats.flatMap(c=>c.tasks);
  const totalAll=allTasks.length, doneAll=allTasks.filter(t=>isDone(t.id)).length;
  const roles=[...new Set(allTasks.flatMap(t=>t.labels))].filter(r=>r!=='URGÊNCIA');

  const ql=q.trim().toLowerCase();
  const matches=(t)=>{
    if(role!=='todos' && !t.labels.includes(role)) return false;
    if(ql && !t.name.toLowerCase().includes(ql)) return false;
    if(hideDone && isDone(t.id)) return false;
    return true;
  };

  const targetName = target==='_geral'?'Modelo geral':(launches.find(l=>l.id===target)?.name||'Lançamento');

  return (
    <div>
      {/* barra de contexto */}
      <div className="card" style={{padding:'14px 18px',marginBottom:16,display:'flex',gap:14,alignItems:'center',flexWrap:'wrap'}}>
        <span style={{width:38,height:38,borderRadius:10,background:'color-mix(in srgb,#0079bf 13%,#fff)',color:'#0079bf',display:'grid',placeItems:'center',flex:'0 0 38px'}}><Icon name="board" size={19}/></span>
        <div style={{flex:1,minWidth:180}}>
          <div style={{fontWeight:650,fontSize:14}}>Playbook de Lançamento <span style={{fontSize:11,fontWeight:500,color:'var(--muted)'}}>· importado do Trello</span></div>
          <div style={{fontSize:11.5,color:'var(--muted)'}}>{totalAll} tarefas em {cats.length} frentes · checklist completo para executar um lançamento</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:12,color:'var(--faint)'}}>Checklist de:</span>
          <select className="input" style={{width:'auto',padding:'7px 11px',fontSize:12.5}} value={target} onChange={e=>setTarget(e.target.value)}>
            <option value="_geral">Modelo geral</option>
            {launches.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      </div>

      {/* progresso geral */}
      <div className="card" style={{padding:'16px 18px',marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:9}}>
          <div style={{fontSize:13,fontWeight:600}}>Progresso — {targetName}</div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span className="tnum" style={{fontSize:13,fontWeight:700,color:'var(--olive-800)'}}>{doneAll}/{totalAll} · {pct(doneAll,totalAll)}%</span>
            <button className="btn btn-ghost btn-sm" onClick={()=>{ if(confirm('Desmarcar todas as tarefas de "'+targetName+'"?')) resetPlaybook(target); }}>Limpar</button>
          </div>
        </div>
        <div className="bar" style={{height:10}}><span style={{width:pct(doneAll,totalAll)+'%',background:'var(--olive)'}}></span></div>
      </div>

      {/* filtros */}
      <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:16}}>
        <div style={{position:'relative',flex:'1 1 220px',maxWidth:300}}>
          <Icon name="search" size={15} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--muted)'}}/>
          <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar tarefa..." style={{padding:'8px 12px 8px 34px',fontSize:12.5}}/>
        </div>
        <select className="input" style={{width:'auto',padding:'8px 11px',fontSize:12.5}} value={role} onChange={e=>setRole(e.target.value)}>
          <option value="todos">Todos os responsáveis</option>
          {roles.map(r=><option key={r} value={r}>{roleLabel(r)}</option>)}
        </select>
        <button onClick={()=>setHideDone(h=>!h)} className="chip" style={{cursor:'pointer',borderColor:hideDone?'var(--olive)':'var(--border)',background:hideDone?'var(--olive-50)':'#fff',color:hideDone?'var(--olive-800)':'var(--ink-2)',fontWeight:hideDone?600:500}}>
          <Icon name={hideDone?'check':'list'} size={13}/>Ocultar concluídas</button>
      </div>

      {/* categorias */}
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',alignItems:'start'}}>
        {cats.map(cat=>{
          const catMeta=PLAYBOOK_CAT[cat.name]||{icon:'folder',color:'var(--olive)'};
          const visible=cat.tasks.filter(matches);
          const cd=cat.tasks.filter(t=>isDone(t.id)).length;
          if(visible.length===0 && (ql||role!=='todos'||hideDone)) return null;
          return (
            <Card key={cat.idx} pad={false}>
              <div style={{padding:'13px 16px',borderBottom:'1px solid var(--border-2)',display:'flex',alignItems:'center',gap:10}}>
                <span style={{width:30,height:30,borderRadius:8,background:`color-mix(in srgb,${catMeta.color} 14%,#fff)`,color:catMeta.color,display:'grid',placeItems:'center',flex:'0 0 30px'}}><Icon name={catMeta.icon} size={16}/></span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:650,letterSpacing:'.01em'}}>{cat.name}</div>
                  <div style={{fontSize:10.5,color:'var(--faint)'}}>{cd}/{cat.tasks.length} concluídas</div>
                </div>
                <div style={{width:44,height:44,flex:'0 0 44px'}}>
                  <Donut size={44} thickness={6} segments={[{value:cd,color:catMeta.color},{value:cat.tasks.length-cd,color:'var(--border-2)'}]}/>
                </div>
              </div>
              <div style={{padding:'4px 16px 12px'}}>
                {visible.map(t=>{
                  const m=meta(t.id); const done=!!m.done; const urgent=t.labels.includes('URGÊNCIA');
                  const nAtt=((m.links||[]).length)+((m.images||[]).length);
                  const hasInfo=m.notes||m.date||nAtt>0;
                  return (
                    <div key={t.id} onClick={()=>setTaskModal({task:t, catName:cat.name, catColor:catMeta.color})} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 4px',borderBottom:'1px solid var(--border-2)',cursor:'pointer',borderRadius:8,transition:'background .12s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <button onClick={(e)=>{e.stopPropagation();togglePlaybookTask(target,t.id);}} style={{marginTop:1,width:19,height:19,flex:'0 0 19px',borderRadius:6,border:'1.7px solid '+(done?'var(--ok)':'var(--border)'),background:done?'var(--ok)':'#fff',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}>{done&&<Icon name="check" size={12} strokeWidth={2.6}/>}</button>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12.5,lineHeight:1.35,textDecoration:done?'line-through':'none',color:done?'var(--muted)':'var(--ink)',fontWeight:500}}>{t.name}</div>
                        {m.notes && <div style={{fontSize:11,color:'var(--muted)',marginTop:2,lineHeight:1.4,display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{m.notes}</div>}
                        {(t.labels.length>0||t.due||hasInfo) && <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:5,alignItems:'center'}}>
                          {!done && <span className="chip" style={{fontSize:9,padding:'1px 7px',color:'var(--warn)',borderColor:'color-mix(in srgb,var(--warn) 30%,#fff)'}}>pendente</span>}
                          {done && <span className="chip" style={{fontSize:9,padding:'1px 7px',color:'var(--ok)',borderColor:'color-mix(in srgb,var(--ok) 30%,#fff)'}}><Icon name="check" size={9}/>concluído</span>}
                          {m.date && <span className="chip" style={{fontSize:9,padding:'1px 7px',color:'var(--c-vdec)'}}><Icon name="calendar" size={9}/>{U.fmtDate(m.date,'')}</span>}
                          {nAtt>0 && <span className="chip" style={{fontSize:9,padding:'1px 7px',color:'var(--muted)'}}><Icon name="link" size={9}/>{nAtt}</span>}
                          {urgent && <span className="badge-urgent" style={{fontSize:9}}><Icon name="alert" size={10}/>urgente</span>}
                          {t.labels.filter(l=>l!=='URGÊNCIA').map(l=>(
                            <span key={l} className="chip" style={{fontSize:9,padding:'1px 7px',color:ROLE_COLORS[l]||'var(--muted)',borderColor:`color-mix(in srgb,${ROLE_COLORS[l]||'var(--faint)'} 30%,#fff)`}}><span className="dot" style={{width:5,height:5,background:ROLE_COLORS[l]||'var(--faint)'}}></span>{roleLabel(l)}</span>
                          ))}
                        </div>}
                      </div>
                      {(m.images&&m.images.length>0) && <img src={m.images[0]} alt="" style={{width:30,height:30,borderRadius:6,objectFit:'cover',border:'1px solid var(--border)',flex:'0 0 30px'}}/>}
                      <Icon name="chevronR" size={14} style={{color:'var(--faint)',marginTop:3,flex:'0 0 14px'}}/>
                      {t.extra && <button onClick={(e)=>{e.stopPropagation();removePlaybookTask(t.id);}} title="Remover" style={{background:'none',border:'none',color:'var(--faint)',cursor:'pointer',padding:0,marginTop:2}}><Icon name="x" size={13}/></button>}
                    </div>
                  );
                })}
                {adding===cat.idx ? (
                  <div style={{display:'flex',gap:7,marginTop:10}}>
                    <input className="input" autoFocus value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&newTask.trim()){addPlaybookTask(cat.idx,newTask.trim());setNewTask('');} if(e.key==='Escape')setAdding(null);}} placeholder="Nova tarefa..." style={{flex:1,fontSize:12.5,padding:'7px 10px'}}/>
                    <button className="btn btn-subtle btn-sm" onClick={()=>{if(newTask.trim()){addPlaybookTask(cat.idx,newTask.trim());setNewTask('');}}}><Icon name="plus" size={14}/></button>
                  </div>
                ) : (
                  <button onClick={()=>{setAdding(cat.idx);setNewTask('');}} className="btn btn-ghost btn-sm" style={{marginTop:10,borderStyle:'dashed',color:'var(--muted)',width:'100%',justifyContent:'center'}}><Icon name="plus" size={13}/>Tarefa</button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {taskModal && <PlaybookTaskModal ctx={taskModal} target={target} targetName={targetName} onClose={()=>setTaskModal(null)}/>}
    </div>
  );
}

function PlaybookTaskModal({ctx, target, targetName, onClose}){
  const { state, setPlaybookTask, togglePlaybookTask } = useStore();
  const U=window.U;
  const {task, catName, catColor} = ctx;
  const m = (state.playbookChecks[target]||{})[task.id] || {};
  const done = !!m.done;
  const set=(patch)=>setPlaybookTask(target, task.id, patch);
  const urgent=task.labels.includes('URGÊNCIA');
  return (
    <Modal title={task.name} icon="board" onClose={onClose}
      footer={<button className="btn btn-primary" onClick={onClose}><Icon name="check" size={15}/>Concluir edição</button>}>
      <div className="grid" style={{gap:16}}>
        {/* contexto */}
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <span className="chip" style={{fontSize:10.5,color:catColor,borderColor:`color-mix(in srgb,${catColor} 30%,#fff)`}}><span className="dot" style={{background:catColor}}></span>{catName}</span>
          <span className="chip" style={{fontSize:10.5,color:'var(--muted)'}}>{targetName}</span>
          {urgent && <span className="badge-urgent" style={{fontSize:9.5}}><Icon name="alert" size={10}/>urgente</span>}
          {task.labels.filter(l=>l!=='URGÊNCIA').map(l=>(
            <span key={l} className="chip" style={{fontSize:10,color:ROLE_COLORS[l]||'var(--muted)',borderColor:`color-mix(in srgb,${ROLE_COLORS[l]||'var(--faint)'} 30%,#fff)`}}><span className="dot" style={{width:6,height:6,background:ROLE_COLORS[l]||'var(--faint)'}}></span>{roleLabel(l)}</span>
          ))}
        </div>

        {/* status */}
        <div className="field">
          <label>Status</label>
          <div className="seg" style={{width:'100%'}}>
            <button className={!done?'on':''} style={{flex:1}} onClick={()=>{ if(done) togglePlaybookTask(target,task.id); }}>Pendente</button>
            <button className={done?'on':''} style={{flex:1,color:done?'var(--ok)':undefined}} onClick={()=>{ if(!done) togglePlaybookTask(target,task.id); }}><Icon name="check" size={14} style={{verticalAlign:'-2px',marginRight:5}}/>Concluído</button>
          </div>
        </div>

        {/* data */}
        <div className="field">
          <label>Data <span style={{color:'var(--faint)',fontWeight:400}}>(prazo ou execução)</span></label>
          <input className="input" type="date" value={m.date||''} onChange={e=>set({date:e.target.value})}/>
        </div>

        {/* anotações */}
        <div className="field">
          <label>Informações / anotações</label>
          <textarea className="input" value={m.notes||''} onChange={e=>set({notes:e.target.value})} placeholder="Escreva detalhes, links de referência, responsáveis, observações..." style={{minHeight:90}}/>
        </div>

        {/* anexos */}
        <Attachments links={m.links||[]} images={m.images||[]} onLinks={v=>set({links:v})} onImages={v=>set({images:v})}/>
      </div>
    </Modal>
  );
}
window.PlaybookView = PlaybookView;
