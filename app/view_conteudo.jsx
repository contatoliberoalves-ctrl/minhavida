/* ===== Minha Vida — Conteúdo (pipeline editorial) ===== */
const CHANNELS = {
  instagram:{label:'Instagram', color:'var(--c-conteudo)', icon:'camera'},
  tiktok:{label:'TikTok', color:'var(--c-vde2)', icon:'video'},
  youtube:{label:'YouTube', color:'var(--c-pratflix)', icon:'play'},
};
const CONTENT_STAGES = [
  {key:'ideia', label:'Ideia', color:'var(--faint)'},
  {key:'roteiro', label:'Roteiro', color:'var(--c-vdec)'},
  {key:'gravado', label:'Gravado', color:'var(--warn)'},
  {key:'editado', label:'Editado', color:'var(--c-vde2)'},
  {key:'publicado', label:'Publicado', color:'var(--ok)'},
];

function ContentModal({initial,onClose}){
  const { state, addContent, updateContent, removeContent } = useStore();
  const isEdit=!!(initial&&initial.id);
  const projects=window.SEED.PROJECTS.filter(p=>['conteudo','constitucional','renato','agencia','pratflix'].includes(p.key));
  const [f,setF]=React.useState(()=>({title:'',channel:'instagram',status:'ideia',date:window.U.TODAY,assignee:'',project:'conteudo',notes:'',links:[],images:[],...(initial||{})}));
  const set=(k,v)=>setF(s=>({...s,[k]:v}));
  const save=()=>{ if(!f.title.trim())return; if(isEdit)updateContent(initial.id,f); else addContent(f); onClose(); };
  return (
    <Modal title={isEdit?'Editar conteúdo':'Novo conteúdo'} icon="camera" onClose={onClose}
      footer={<>
        {isEdit && <button className="btn btn-ghost" style={{marginRight:'auto',color:'var(--danger)',borderColor:'transparent'}} onClick={()=>{removeContent(initial.id);onClose();}}><Icon name="trash" size={15}/>Excluir</button>}
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>{isEdit?'Salvar':'Adicionar'}</button>
      </>}>
      <div className="grid" style={{gap:15}}>
        <div className="field"><label>Título / pauta</label><input className="input" autoFocus value={f.title} onChange={e=>set('title',e.target.value)} placeholder="Ex.: Reels — 3 erros na 2ª fase"/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Canal</label><select className="input" value={f.channel} onChange={e=>set('channel',e.target.value)}>{Object.keys(CHANNELS).map(k=><option key={k} value={k}>{CHANNELS[k].label}</option>)}</select></div>
          <div className="field"><label>Etapa</label><select className="input" value={f.status} onChange={e=>set('status',e.target.value)}>{CONTENT_STAGES.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}</select></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Data prevista</label><input className="input" type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></div>
          <div className="field"><label>Responsável</label>
            <select className="input" value={f.assignee} onChange={e=>set('assignee',e.target.value)}>
              <option value="">— Eu / a definir —</option>
              {state.collabs.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
        </div>
        <div className="field"><label>Projeto</label><select className="input" value={f.project} onChange={e=>set('project',e.target.value)}>{projects.map(p=><option key={p.key} value={p.key}>{p.label}</option>)}</select></div>
        <div className="field"><label>Notas</label><textarea className="input" value={f.notes} onChange={e=>set('notes',e.target.value)} placeholder="Roteiro, referências, legenda..."/></div>
        <Attachments links={f.links} images={f.images} onLinks={v=>set('links',v)} onImages={v=>set('images',v)}/>
      </div>
    </Modal>
  );
}

function ConteudoView(){
  const { state, updateContent } = useStore();
  const U=window.U;
  const [modal,setModal]=React.useState(null); // 'new'|item|{status}
  const [chan,setChan]=React.useState('todos');
  const collabMap={}; state.collabs.forEach(c=>collabMap[c.id]=c);

  let items=state.content.slice();
  if(chan!=='todos') items=items.filter(c=>c.channel===chan);
  const byStage={}; CONTENT_STAGES.forEach(s=>byStage[s.key]=[]);
  items.forEach(c=>{ if(byStage[c.status]) byStage[c.status].push(c); });

  const move=(c,dir)=>{ const idx=CONTENT_STAGES.findIndex(s=>s.key===c.status); const ni=idx+dir; if(ni>=0&&ni<CONTENT_STAGES.length) updateContent(c.id,{status:CONTENT_STAGES[ni].key}); };
  const pubMonth=state.content.filter(c=>c.status==='publicado'&&(()=>{const d=U.parseDate(c.date),t=U.parseDate(U.TODAY);return d.getMonth()===t.getMonth()&&d.getFullYear()===t.getFullYear();})()).length;

  return (
    <div className="view-enter">
      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:18}}>
        <KPI label="Em produção" icon="camera" value={state.content.filter(c=>c.status!=='publicado').length} meta="ideias → editado"/>
        <KPI label="Publicados no mês" icon="check" value={pubMonth} meta="este mês" accent="var(--ok)"/>
        <KPI label="Com Daniel (edição)" icon="edit" value={state.content.filter(c=>c.assignee==='daniel'&&c.status!=='publicado').length} meta="em edição"/>
        <KPI label="Com Séfora (gravação)" icon="camera" value={state.content.filter(c=>c.assignee==='sefora'&&c.status!=='publicado').length} meta="em captação"/>
      </div>

      <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:16}}>
        <div className="seg">
          <button className={chan==='todos'?'on':''} onClick={()=>setChan('todos')}>Todos</button>
          {Object.keys(CHANNELS).map(k=><button key={k} className={chan===k?'on':''} onClick={()=>setChan(k)}>{CHANNELS[k].label}</button>)}
        </div>
        <button className="btn btn-primary" style={{marginLeft:'auto'}} onClick={()=>setModal('new')}><Icon name="plus" size={16}/>Novo conteúdo</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,minmax(210px,1fr))',gap:12,overflowX:'auto',paddingBottom:6}}>
        {CONTENT_STAGES.map(stage=>(
          <div key={stage.key} style={{background:'var(--surface-2)',border:'1px solid var(--border-2)',borderRadius:14,padding:10,minWidth:210}}>
            <div style={{display:'flex',alignItems:'center',gap:7,padding:'4px 6px 10px'}}>
              <span style={{width:8,height:8,borderRadius:50,background:stage.color}}></span>
              <span style={{fontSize:12.5,fontWeight:650}}>{stage.label}</span>
              <span style={{marginLeft:'auto',fontSize:11,color:'var(--faint)',fontWeight:600}}>{byStage[stage.key].length}</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {byStage[stage.key].map(c=>{
                const ch=CHANNELS[c.channel]; const asg=collabMap[c.assignee]; const p=U.PROJ_BY_KEY[c.project];
                const idx=CONTENT_STAGES.findIndex(s=>s.key===c.status);
                return (
                  <div key={c.id} className="card" style={{padding:11,cursor:'pointer'}} onClick={()=>setModal(c)}>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                      <span style={{width:22,height:22,borderRadius:6,background:`color-mix(in srgb,${ch.color} 14%,#fff)`,color:ch.color,display:'grid',placeItems:'center',flex:'0 0 22px'}}><Icon name={ch.icon} size={12}/></span>
                      <span style={{fontSize:10.5,color:'var(--faint)'}}>{ch.label}</span>
                      <span style={{marginLeft:'auto',fontSize:10.5,color:'var(--faint)'}}>{U.fmtDate(c.date,'')}</span>
                    </div>
                    <div style={{fontSize:12.5,fontWeight:550,lineHeight:1.35,marginBottom:8}}>{c.title}</div>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      {p && <span className="dot" style={{background:p.color,width:7,height:7,borderRadius:50}} title={p.label}></span>}
                      {asg ? <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:10.5,color:'var(--muted)'}}><span style={{width:16,height:16,borderRadius:50,background:`color-mix(in srgb,${asg.color} 18%,#fff)`,color:asg.color,display:'grid',placeItems:'center',fontSize:8,fontWeight:700}}>{asg.name[0]}</span>{asg.name}</span> : <span style={{fontSize:10.5,color:'var(--faint)'}}>sem responsável</span>}
                      <span style={{marginLeft:'auto',display:'flex',gap:2}} onClick={e=>e.stopPropagation()}>
                        <button disabled={idx===0} onClick={()=>move(c,-1)} className="btn btn-icon" style={{padding:3,background:'var(--surface-2)',opacity:idx===0?.3:1}}><Icon name="chevronL" size={13}/></button>
                        <button disabled={idx===CONTENT_STAGES.length-1} onClick={()=>move(c,1)} className="btn btn-icon" style={{padding:3,background:'var(--surface-2)',opacity:idx===CONTENT_STAGES.length-1?.3:1}}><Icon name="chevronR" size={13}/></button>
                      </span>
                    </div>
                  </div>
                );
              })}
              <button onClick={()=>setModal({status:stage.key})} className="btn btn-ghost btn-sm" style={{borderStyle:'dashed',color:'var(--muted)',justifyContent:'center'}}><Icon name="plus" size={13}/></button>
            </div>
          </div>
        ))}
      </div>

      {modal && <ContentModal initial={modal==='new'?null:(modal.status&&!modal.id?{status:modal.status}:modal)} onClose={()=>setModal(null)}/>}
    </div>
  );
}
window.ConteudoView = ConteudoView;
