/* ===== Minha Vida — Aperfeiçoamento Pessoal ===== */
function weekDays(){
  const U=window.U; const t=U.parseDate(U.TODAY);
  const dow=(t.getDay()+6)%7; // 0=segunda
  const mon=new Date(t); mon.setDate(t.getDate()-dow);
  return Array.from({length:7},(_,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return U.toISO(d); });
}
function streakOf(logs, practice){
  const U=window.U; const set=new Set(logs.filter(l=>l.practice===practice).map(l=>l.date));
  let n=0; let d=U.parseDate(U.TODAY);
  if(!set.has(U.toISO(d))) d.setDate(d.getDate()-1); // se hoje não feito, conta a partir de ontem
  while(set.has(U.toISO(d))){ n++; d.setDate(d.getDate()-1); }
  return n;
}

function PracticeDetailModal({practice, onClose}){
  const { state, togglePractice, setPracticeDetail, removePractice } = useStore();
  const U=window.U; const p=practice;
  const isCustom = String(p.key).startsWith('pr');
  const logs=state.practiceLogs.filter(l=>l.practice===p.key).sort((a,b)=>b.date.localeCompare(a.date));
  const today=logs.find(l=>l.date===U.TODAY);
  const [detail,setDetail]=React.useState(today?(today.detail||''):'');
  return (
    <Modal title={p.label} icon={p.icon} onClose={onClose}
      footer={<>
        {isCustom && <button className="btn btn-ghost" style={{marginRight:'auto',color:'var(--danger)',borderColor:'transparent'}} onClick={()=>{ if(confirm('Excluir a atividade "'+p.label+'"? O histórico dela será removido.')){ removePractice(p.key); onClose(); } }}><Icon name="trash" size={15}/>Excluir atividade</button>}
        <button className="btn btn-primary" onClick={onClose}>Fechar</button>
      </>}>
      <div className="grid" style={{gap:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12,background:`color-mix(in srgb,${p.color} 8%,#fff)`,border:`1px solid color-mix(in srgb,${p.color} 25%,#fff)`,borderRadius:12,padding:'12px 14px'}}>
          <button onClick={()=>togglePractice(p.key,U.TODAY)} style={{width:24,height:24,flex:'0 0 24px',borderRadius:7,border:'2px solid '+(today?p.color:'var(--border)'),background:today?p.color:'#fff',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}>{today&&<Icon name="check" size={15} strokeWidth={2.5}/>}</button>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>{today?'Feito hoje ✓':'Marcar como feito hoje'}</div><div style={{fontSize:11.5,color:'var(--muted)'}}>{U.fmtDate(U.TODAY,'full')}</div></div>
        </div>
        <div className="field">
          <label>Detalhe de hoje <span style={{color:'var(--faint)',fontWeight:400}}>(opcional)</span></label>
          <input className="input" value={detail} onChange={e=>setDetail(e.target.value)} onBlur={()=>setPracticeDetail(p.key,U.TODAY,detail)}
            placeholder={p.key==='exercicio'?'Ex.: Corrida 5km':p.key==='leituras'?'Ex.: 20 páginas — capítulo 3':'Ex.: o que estudou/leu'}/>
        </div>
        <div>
          <div style={{fontSize:11.5,fontWeight:600,color:'var(--muted)',marginBottom:8}}>Histórico recente</div>
          {logs.length===0 ? <div style={{fontSize:12.5,color:'var(--faint)'}}>Nenhum registro ainda.</div> :
          logs.slice(0,12).map(l=>(
            <div key={l.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 2px',borderBottom:'1px solid var(--border-2)'}}>
              <span style={{width:7,height:7,borderRadius:50,background:p.color,flex:'0 0 7px'}}></span>
              <span style={{flex:1,fontSize:12.5}}>{U.fmtDate(l.date,'full')}</span>
              {l.detail && <span style={{fontSize:11.5,color:'var(--muted)'}}>{l.detail}</span>}
              <button onClick={()=>togglePractice(p.key,l.date)} style={{background:'none',border:'none',color:'var(--faint)',cursor:'pointer',padding:0}}><Icon name="x" size={13}/></button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function ReadingModal({initial,onClose}){
  const { addReading, updateReading, removeReading } = useStore();
  const isEdit=!!(initial&&initial.id);
  const [f,setF]=React.useState(()=>({title:'',author:'',category:'Leitura',status:'quero',progress:0,...(initial||{})}));
  const set=(k,v)=>setF(s=>({...s,[k]:v}));
  const save=()=>{ if(!f.title.trim())return; const st=f.progress>=100?'concluido':(f.progress>0?'lendo':f.status); const payload={...f,status:st}; if(isEdit)updateReading(initial.id,payload); else addReading(payload); onClose(); };
  return (
    <Modal title={isEdit?'Editar leitura':'Nova leitura'} icon="bookopen" onClose={onClose}
      footer={<>
        {isEdit && <button className="btn btn-ghost" style={{marginRight:'auto',color:'var(--danger)',borderColor:'transparent'}} onClick={()=>{removeReading(initial.id);onClose();}}><Icon name="trash" size={15}/>Excluir</button>}
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>{isEdit?'Salvar':'Adicionar'}</button>
      </>}>
      <div className="grid" style={{gap:15}}>
        <div className="field"><label>Título</label><input className="input" autoFocus value={f.title} onChange={e=>set('title',e.target.value)} placeholder="Ex.: Essencialismo"/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Autor</label><input className="input" value={f.author} onChange={e=>set('author',e.target.value)} placeholder="opcional"/></div>
          <div className="field"><label>Categoria</label><select className="input" value={f.category} onChange={e=>set('category',e.target.value)}>{['Leitura','Devocional','Negócios','Estudo','Pessoal'].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        </div>
        <div className="field"><label>Progresso <span className="tnum" style={{color:'var(--olive-700)',fontWeight:650}}>{f.progress}%</span></label>
          <input type="range" min="0" max="100" step="5" value={f.progress} onChange={e=>set('progress',parseInt(e.target.value))} style={{width:'100%',accentColor:'var(--olive)'}}/></div>
      </div>
    </Modal>
  );
}

function AperfeicoamentoView(){
  const { state, togglePractice } = useStore();
  const U=window.U;
  const [modal,setModal]=React.useState(null); // practice detail
  const [rmodal,setRmodal]=React.useState(null); // reading
  const [pmodal,setPmodal]=React.useState(false); // nova atividade
  const week=weekDays();
  const logSet=new Set(state.practiceLogs.map(l=>l.practice+'|'+l.date));
  const did=(pk,date)=>logSet.has(pk+'|'+date);
  const todayDone=state.practices.filter(p=>did(p.key,U.TODAY)).length;
  const weekTotal=state.practices.reduce((a,p)=>a+week.filter(d=>did(p.key,d)).length,0);
  const bestStreak=Math.max(0,...state.practices.map(p=>streakOf(state.practiceLogs,p.key)));
  const DOW=['S','T','Q','Q','S','S','D'];

  return (
    <div className="view-enter">
      <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:18}}>
        <KPI label="Práticas de hoje" icon="check" value={todayDone+'/'+state.practices.length} meta="concluídas hoje" accent="var(--olive)"/>
        <KPI label="Na semana" icon="calendar" value={weekTotal} meta="registros nesta semana"/>
        <KPI label="Melhor sequência" icon="flame" value={bestStreak+(bestStreak===1?' dia':' dias')} meta="streak atual" accent="var(--c-pratflix)"/>
      </div>

      {/* check-in de hoje */}
      <Card style={{marginBottom:18}}>
        <SectionH title="Check-in de hoje" sub={U.fmtDate(U.TODAY,'full')}
          action={<button className="btn btn-primary btn-sm" onClick={()=>setPmodal(true)}><Icon name="plus" size={14}/>Nova atividade</button>}/>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {state.practices.map(p=>{
            const on=did(p.key,U.TODAY);
            return (
              <button key={p.key} onClick={()=>togglePractice(p.key,U.TODAY)} style={{
                display:'flex',alignItems:'center',gap:9,padding:'10px 14px',borderRadius:12,cursor:'pointer',
                border:'1.5px solid '+(on?p.color:'var(--border)'),background:on?`color-mix(in srgb,${p.color} 12%,#fff)`:'#fff',transition:'all .14s'
              }}>
                <span style={{width:26,height:26,borderRadius:7,background:on?p.color:`color-mix(in srgb,${p.color} 12%,#fff)`,color:on?'#fff':p.color,display:'grid',placeItems:'center',flex:'0 0 26px'}}>
                  {on?<Icon name="check" size={15} strokeWidth={2.5}/>:<Icon name={p.icon} size={15}/>}</span>
                <span style={{fontSize:13,fontWeight:on?600:550,color:on?p.color:'var(--ink-2)'}}>{p.label}</span>
              </button>
            );
          })}
          <button onClick={()=>setPmodal(true)} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:12,cursor:'pointer',border:'1.5px dashed var(--border)',background:'#fff',color:'var(--muted)'}}>
            <Icon name="plus" size={15}/><span style={{fontSize:13,fontWeight:550}}>Nova atividade</span>
          </button>
        </div>
      </Card>

      {/* cards das práticas */}
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))',marginBottom:24}}>
        {state.practices.map(p=>{
          const streak=streakOf(state.practiceLogs,p.key);
          const doneWeek=week.filter(d=>did(p.key,d)).length;
          const todayLog=state.practiceLogs.find(l=>l.practice===p.key&&l.date===U.TODAY);
          return (
            <Card key={p.key} style={{cursor:'pointer'}} className="" >
              <div onClick={()=>setModal(p)}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                  <span style={{width:42,height:42,borderRadius:11,background:`color-mix(in srgb,${p.color} 14%,#fff)`,color:p.color,display:'grid',placeItems:'center',flex:'0 0 42px'}}><Icon name={p.icon} size={22}/></span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:14.5}}>{p.label}</div>
                    <div style={{fontSize:11.5,color:'var(--muted)'}}>{p.sub}</div>
                  </div>
                  {streak>0 && <span className="chip" style={{fontSize:11,color:'var(--c-pratflix)',borderColor:'color-mix(in srgb,var(--c-pratflix) 30%,#fff)'}}><Icon name="flame" size={12}/>{streak}</span>}
                </div>
                {/* semana */}
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  {week.map((d,i)=>{ const on=did(p.key,d); const isToday=d===U.TODAY;
                    return <div key={d} style={{textAlign:'center',flex:1}}>
                      <div style={{fontSize:9.5,color:'var(--faint)',marginBottom:4}}>{DOW[i]}</div>
                      <div style={{width:24,height:24,margin:'0 auto',borderRadius:7,background:on?p.color:'var(--border-2)',color:'#fff',display:'grid',placeItems:'center',border:isToday?'2px solid '+p.color:'2px solid transparent'}}>{on&&<Icon name="check" size={13} strokeWidth={2.6}/>}</div>
                    </div>;
                  })}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11.5,color:'var(--faint)'}}>
                  <span>{doneWeek}/{p.goal} na semana {doneWeek>=p.goal && <span style={{color:'var(--ok)',fontWeight:600}}>· meta ✓</span>}</span>
                  {todayLog&&todayLog.detail && <span style={{color:p.color,fontWeight:550}}>{todayLog.detail}</span>}
                </div>
              </div>
              <div className="bar" style={{marginTop:9}}><span style={{width:Math.min(100,doneWeek/p.goal*100)+'%',background:p.color}}></span></div>
            </Card>
          );
        })}
      </div>

      {/* leituras */}
      <Card>
        <SectionH title="Minhas leituras" sub={state.readings.length+' livros'}
          action={<button className="btn btn-primary btn-sm" onClick={()=>setRmodal('new')}><Icon name="plus" size={14}/>Leitura</button>}/>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))'}}>
          {state.readings.map(r=>{
            const stColor=r.status==='concluido'?'var(--ok)':r.status==='lendo'?'var(--c-vdec)':'var(--faint)';
            const stLabel=r.status==='concluido'?'Concluído':r.status==='lendo'?'Lendo':'Quero ler';
            return (
              <div key={r.id} onClick={()=>setRmodal(r)} style={{border:'1px solid var(--border)',borderRadius:13,padding:14,cursor:'pointer'}}>
                <div style={{display:'flex',gap:11,marginBottom:10}}>
                  <span style={{width:34,height:46,borderRadius:5,background:'linear-gradient(150deg,var(--c-renato),color-mix(in srgb,var(--c-renato) 60%,#000))',flex:'0 0 34px',display:'grid',placeItems:'center',color:'#fff'}}><Icon name="bookopen" size={16}/></span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,lineHeight:1.3}}>{r.title}</div>
                    {r.author && <div style={{fontSize:11,color:'var(--faint)'}}>{r.author}</div>}
                    <span className="chip" style={{fontSize:9.5,padding:'1px 7px',marginTop:5,color:stColor,borderColor:`color-mix(in srgb,${stColor} 30%,#fff)`}}>{stLabel}</span>
                  </div>
                </div>
                <div className="bar"><span style={{width:r.progress+'%',background:stColor}}></span></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10.5,color:'var(--faint)',marginTop:5}}>
                  <span>{r.category}</span><span className="tnum">{r.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {modal && <PracticeDetailModal practice={modal} onClose={()=>setModal(null)}/>}
      {rmodal && <ReadingModal initial={rmodal==='new'?null:rmodal} onClose={()=>setRmodal(null)}/>}
      {pmodal && <PracticeModal onClose={()=>setPmodal(false)}/>}
    </div>
  );
}

const PRACTICE_ICONS = ['flame','bookopen','sun','heart','activity','globe','briefcase','target','star','sparkles','play','camera','edit','users','clock','check'];
const PRACTICE_COLORS = ['var(--olive)','var(--c-vdec)','var(--c-conteudo)','var(--c-pratflix)','var(--c-vde2)','var(--c-renato)','var(--c-vde1)','var(--ok)','var(--c-cartorio)','var(--c-constitucional)'];

function PracticeModal({onClose}){
  const { addPractice } = useStore();
  const [f,setF]=React.useState({label:'',sub:'',icon:'flame',color:'var(--olive)',goal:5});
  const set=(k,v)=>setF(s=>({...s,[k]:v}));
  const save=()=>{ if(!f.label.trim())return; addPractice({label:f.label.trim(),sub:f.sub.trim(),icon:f.icon,color:f.color,goal:f.goal}); onClose(); };
  return (
    <Modal title="Nova atividade" icon={f.icon} onClose={onClose}
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>Criar atividade</button>
      </>}>
      <div className="grid" style={{gap:16}}>
        {/* preview */}
        <div style={{display:'flex',alignItems:'center',gap:12,background:`color-mix(in srgb,${f.color} 8%,#fff)`,border:`1px solid color-mix(in srgb,${f.color} 25%,#fff)`,borderRadius:12,padding:'13px 15px'}}>
          <span style={{width:42,height:42,borderRadius:11,background:`color-mix(in srgb,${f.color} 16%,#fff)`,color:f.color,display:'grid',placeItems:'center',flex:'0 0 42px'}}><Icon name={f.icon} size={22}/></span>
          <div><div style={{fontWeight:600,fontSize:14.5}}>{f.label||'Nome da atividade'}</div><div style={{fontSize:11.5,color:'var(--muted)'}}>{f.sub||'descrição curta'}</div></div>
        </div>
        <div className="field"><label>Nome</label><input className="input" autoFocus value={f.label} onChange={e=>set('label',e.target.value)} placeholder="Ex.: Meditação, Beber água, Tocar violão..."/></div>
        <div className="field"><label>Descrição curta <span style={{color:'var(--faint)',fontWeight:400}}>(opcional)</span></label><input className="input" value={f.sub} onChange={e=>set('sub',e.target.value)} placeholder="Ex.: 10 minutos por dia"/></div>
        <div className="field"><label>Ícone</label>
          <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
            {PRACTICE_ICONS.map(ic=>(
              <button key={ic} type="button" onClick={()=>set('icon',ic)} style={{width:38,height:38,borderRadius:10,border:'1.5px solid '+(f.icon===ic?f.color:'var(--border)'),background:f.icon===ic?`color-mix(in srgb,${f.color} 13%,#fff)`:'#fff',color:f.icon===ic?f.color:'var(--ink-2)',display:'grid',placeItems:'center',cursor:'pointer'}}><Icon name={ic} size={18}/></button>
            ))}
          </div>
        </div>
        <div className="field"><label>Cor</label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {PRACTICE_COLORS.map(c=>(
              <button key={c} type="button" onClick={()=>set('color',c)} style={{width:28,height:28,borderRadius:8,background:c,border:f.color===c?'2px solid var(--ink)':'2px solid transparent',cursor:'pointer',outline:f.color===c?'2px solid #fff':'none',outlineOffset:'-4px'}}></button>
            ))}
          </div>
        </div>
        <div className="field"><label>Meta semanal <span className="tnum" style={{color:'var(--olive-700)',fontWeight:650}}>{f.goal}× por semana</span></label>
          <input type="range" min="1" max="7" step="1" value={f.goal} onChange={e=>set('goal',parseInt(e.target.value))} style={{width:'100%',accentColor:'var(--olive)'}}/>
        </div>
      </div>
    </Modal>
  );
}
window.AperfeicoamentoView = AperfeicoamentoView;
