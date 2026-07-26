/* ===== Minha Vida — Projetos ===== */
function ProjetosView(){
  const { state } = useStore();
  const U=window.U;
  const [open,setOpen]=React.useState(null); // project key
  const [modal,setModal]=React.useState(null);

  const projects=window.SEED.PROJECTS.filter(p=>p.key!=='pessoal');

  const countFor=(k)=>{
    const list=state.commitments.filter(c=>c.project===k);
    const done=list.filter(c=>c.done).length;
    const upcoming=list.filter(c=>!c.done && U.daysFromToday(c.date)>=0).length;
    return {total:list.length,done,upcoming};
  };

  if(open){
    const p=U.PROJ_BY_KEY[open];
    return <ProjectDetail project={p} onBack={()=>setOpen(null)}/>;
  }

  return (
    <div className="view-enter">
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))'}}>
        {projects.map(p=>{
          const c=countFor(p.key);
          const pct=c.total?Math.round(c.done/c.total*100):0;
          return (
            <button key={p.key} onClick={()=>setOpen(p.key)} className="card" style={{textAlign:'left',cursor:'pointer',border:'1px solid var(--border)',transition:'box-shadow .15s,transform .15s',padding:0}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--sh-md)';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--sh-sm)';e.currentTarget.style.transform='none';}}>
              <div style={{height:5,background:p.color,borderRadius:'16px 16px 0 0'}}></div>
              <div style={{padding:18}}>
                <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:11}}>
                  <span style={{width:40,height:40,borderRadius:11,background:`color-mix(in srgb,${p.color} 14%,#fff)`,color:p.color,display:'grid',placeItems:'center',flex:'0 0 40px'}}><Icon name={p.icon} size={21}/></span>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:14.5,letterSpacing:'-.01em'}}>{p.label}</div>
                    <div style={{fontSize:11.5,color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.desc}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:7,marginBottom:12,flexWrap:'wrap'}}>
                  {p.sections ? p.sections.slice(0,3).map((s,i)=><span key={i} className="chip" style={{fontSize:10,padding:'1px 8px',color:'var(--muted)'}}>{s}</span>) : null}
                  {p.sections && p.sections.length>3 && <span className="chip" style={{fontSize:10,padding:'1px 8px',color:'var(--faint)'}}>+{p.sections.length-3}</span>}
                </div>
                <div className="bar" style={{marginBottom:7}}><span style={{width:pct+'%',background:p.color}}></span></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11.5,color:'var(--faint)'}}>
                  <span><b style={{color:'var(--ink-2)'}}>{c.upcoming}</b> próximos · <b style={{color:'var(--ink-2)'}}>{c.total}</b> no total</span>
                  <span>{pct}% concluído</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectDetail({project, onBack}){
  const { state, addSection, removeSection } = useStore();
  const U=window.U;
  const p=project;
  const [sec,setSec]=React.useState('todos');
  const [modal,setModal]=React.useState(null);
  const [showDone,setShowDone]=React.useState(false);
  const [addingSec,setAddingSec]=React.useState(false);
  const [newSec,setNewSec]=React.useState('');

  const sections = window.sectionsFor(p.key, state.customSections);
  const baseSections = (p.sections||[]);
  const customList = (state.customSections[p.key]||[]);

  let list=state.commitments.filter(c=>c.project===p.key)
    .sort((a,b)=>(a.date+'T'+(a.time||'00')).localeCompare(b.date+'T'+(b.time||'00')));
  if(!showDone) list=list.filter(c=>!c.done);
  if(sec!=='todos') list=list.filter(c=>c.section===sec);

  const next=list.filter(c=>U.daysFromToday(c.date)>=0);
  const past=list.filter(c=>U.daysFromToday(c.date)<0);
  const countSec=(s)=>state.commitments.filter(c=>c.project===p.key&&c.section===s&&!c.done&&U.daysFromToday(c.date)>=0).length;

  return (
    <div className="view-enter">
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{marginBottom:16}}><Icon name="chevronL" size={15}/>Todos os projetos</button>

      <div className="card" style={{padding:0,marginBottom:18,overflow:'hidden'}}>
        <div style={{height:6,background:p.color}}></div>
        <div style={{padding:'20px 22px',display:'flex',alignItems:'center',gap:15,flexWrap:'wrap'}}>
          <span style={{width:50,height:50,borderRadius:13,background:`color-mix(in srgb,${p.color} 14%,#fff)`,color:p.color,display:'grid',placeItems:'center',flex:'0 0 50px'}}><Icon name={p.icon} size={26}/></span>
          <div style={{flex:1,minWidth:0}}>
            <h2 style={{fontSize:20,fontWeight:650,letterSpacing:'-.02em'}}>{p.label}</h2>
            <div style={{fontSize:13,color:'var(--muted)'}}>{p.desc}</div>
          </div>
          <button className="btn btn-primary" onClick={()=>setModal({project:p.key,date:U.TODAY,section:sec!=='todos'?sec:''})}><Icon name="plus" size={16}/>Compromisso</button>
        </div>
      </div>

      {p.key==='agencia' && <AgenciaPanel/>}

      {/* frentes — funcionais e adicionáveis */}
      <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:16,alignItems:'center'}}>
        <button onClick={()=>setSec('todos')} className="chip" style={{cursor:'pointer',borderColor:sec==='todos'?p.color:'var(--border)',background:sec==='todos'?`color-mix(in srgb,${p.color} 12%,#fff)`:'#fff',color:sec==='todos'?p.color:'var(--ink-2)',fontWeight:sec==='todos'?600:500}}>Todas as frentes</button>
        {baseSections.map(s=>{
          const on=sec===s; const n=countSec(s);
          return <button key={s} onClick={()=>setSec(s)} className="chip" style={{cursor:'pointer',borderColor:on?p.color:'var(--border)',background:on?`color-mix(in srgb,${p.color} 12%,#fff)`:'#fff',color:on?p.color:'var(--ink-2)',fontWeight:on?600:500}}>{s}{n>0&&<span style={{fontSize:10,opacity:.7}}>· {n}</span>}</button>;
        })}
        {customList.map(s=>{
          const on=sec===s; const n=countSec(s);
          return <span key={s} className="chip" style={{cursor:'pointer',borderColor:on?p.color:'var(--border)',background:on?`color-mix(in srgb,${p.color} 12%,#fff)`:'#fff',color:on?p.color:'var(--ink-2)',fontWeight:on?600:500,paddingRight:5}}>
            <span onClick={()=>setSec(s)}>{s}{n>0&&<span style={{fontSize:10,opacity:.7}}> · {n}</span>}</span>
            <span onClick={()=>{ if(sec===s)setSec('todos'); removeSection(p.key,s); }} title="Remover frente" style={{display:'inline-flex',marginLeft:2,color:'var(--faint)'}}><Icon name="x" size={12}/></span>
          </span>;
        })}
        {addingSec ? (
          <span style={{display:'inline-flex',gap:6,alignItems:'center'}}>
            <input className="input" autoFocus value={newSec} onChange={e=>setNewSec(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&newSec.trim()){addSection(p.key,newSec.trim());setNewSec('');setAddingSec(false);} if(e.key==='Escape')setAddingSec(false); }}
              placeholder="Nome da frente" style={{padding:'5px 10px',fontSize:12,width:150}}/>
            <button className="btn btn-primary btn-sm" onClick={()=>{ if(newSec.trim()){addSection(p.key,newSec.trim());setNewSec('');setAddingSec(false);} }}>Add</button>
          </span>
        ) : (
          <button onClick={()=>setAddingSec(true)} className="chip" style={{cursor:'pointer',borderStyle:'dashed',color:'var(--muted)'}}><Icon name="plus" size={13}/>Nova frente</button>
        )}
      </div>

      <div className="grid" style={{gridTemplateColumns: p.key==='agencia'?'1fr':'1fr',gap:18}}>
        <Card>
          <SectionH title="Próximos" sub={next.length+' compromissos'}
            action={<button className="btn btn-ghost btn-sm" onClick={()=>setShowDone(v=>!v)}>{showDone?'Ocultar concluídos':'Mostrar concluídos'}</button>}/>
          {next.length===0?<div className="empty"><Icon name="check"/><div>Tudo em dia nesta frente.</div></div>:
            next.map(c=><CommitmentRow key={c.id} c={c} onEdit={setModal}/>)}
        </Card>
        {past.length>0 && <Card>
          <SectionH title="Histórico" sub={past.length+' anteriores'}/>
          {past.slice().reverse().map(c=><CommitmentRow key={c.id} c={c} onEdit={setModal}/>)}
        </Card>}
      </div>

      {modal && <CommitmentModal initial={modal} onClose={()=>setModal(null)}/>}
    </div>
  );
}

function AgenciaPanel(){
  const { state, addCollab } = useStore();
  const U=window.U;
  // income tagged like agency? use 'reforcos'? We'll show collaborators + simple value tracking placeholder
  const [adding,setAdding]=React.useState(false);
  const [f,setF]=React.useState({name:'',role:'',rate:''});
  return (
    <Card style={{marginBottom:18}}>
      <SectionH title="Colaboradores & valores" sub="Equipe da Agência e produção de conteúdo"
        action={<button className="btn btn-ghost btn-sm" onClick={()=>setAdding(v=>!v)}><Icon name="plus" size={14}/>Colaborador</button>}/>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))'}}>
        {state.collabs.map(c=>(
          <div key={c.id} style={{border:'1px solid var(--border)',borderRadius:13,padding:'14px 15px',display:'flex',gap:12,alignItems:'flex-start'}}>
            <span className="avatar" style={{background:`color-mix(in srgb,${c.color||'var(--olive)'} 16%,#fff)`,color:c.color||'var(--olive-800)'}}>{c.name[0]}</span>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:600,fontSize:13.5}}>{c.name}</div>
              <div style={{fontSize:11.5,color:'var(--muted)',marginTop:2}}>{c.role}</div>
              {c.rate ? <div className="tnum" style={{fontSize:12,fontWeight:600,color:'var(--olive-700)',marginTop:6}}>{U.brl(c.rate)}</div>
                : <div style={{fontSize:11,color:'var(--faint)',marginTop:6}}>Valor a definir</div>}
            </div>
          </div>
        ))}
      </div>
      {adding && (
        <div style={{display:'flex',gap:10,marginTop:14,flexWrap:'wrap',alignItems:'flex-end',borderTop:'1px solid var(--border-2)',paddingTop:14}}>
          <div className="field" style={{flex:'1 1 140px'}}><label>Nome</label><input className="input" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
          <div className="field" style={{flex:'2 1 200px'}}><label>Função</label><input className="input" value={f.role} onChange={e=>setF({...f,role:e.target.value})}/></div>
          <div className="field" style={{flex:'1 1 120px'}}><label>Valor (R$)</label><input className="input tnum" value={f.rate} onChange={e=>setF({...f,rate:e.target.value})} placeholder="opcional"/></div>
          <button className="btn btn-primary" onClick={()=>{ if(f.name.trim()){ addCollab({name:f.name,role:f.role,rate:f.rate?parseFloat(String(f.rate).replace(',','.')):null,color:'var(--c-agencia)'}); setF({name:'',role:'',rate:''}); setAdding(false);} }}>Adicionar</button>
        </div>
      )}
    </Card>
  );
}
window.ProjetosView = ProjetosView;
