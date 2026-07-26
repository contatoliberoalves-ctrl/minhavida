/* ===== Minha Vida — Alunos & Mentorados ===== */
const STU_STATUS = {
  ativo:{label:'Ativo', color:'var(--ok)'},
  pausado:{label:'Pausado', color:'var(--warn)'},
  concluido:{label:'Concluído', color:'var(--faint)'},
};
function sessionsOf(commitments, st){
  const n=(st.name||'').toLowerCase();
  return commitments.filter(c=> c.studentId===st.id || (n && c.title.toLowerCase().includes(n)));
}

function StudentModal({initial,onClose}){
  const { addStudent, updateStudent, removeStudent } = useStore();
  const isEdit=!!(initial&&initial.id);
  const courses=window.SEED.PROJECTS.filter(p=>['mentorias','vde1','vde2','vde_concursos','constitucional'].includes(p.key));
  const [f,setF]=React.useState(()=>({name:'',course:'mentorias',status:'ativo',value:'',paid:false,contact:'',notes:'',color:'var(--c-mentorias)',...(initial||{})}));
  const set=(k,v)=>setF(s=>({...s,[k]:v}));
  const save=()=>{ if(!f.name.trim())return; const payload={...f,value:parseFloat(String(f.value).replace(',','.'))||0}; if(isEdit)updateStudent(initial.id,payload); else addStudent(payload); onClose(); };
  return (
    <Modal title={isEdit?'Editar aluno':'Novo aluno'} icon="users" onClose={onClose}
      footer={<>
        {isEdit && <button className="btn btn-ghost" style={{marginRight:'auto',color:'var(--danger)',borderColor:'transparent'}} onClick={()=>{removeStudent(initial.id);onClose();}}><Icon name="trash" size={15}/>Excluir</button>}
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>{isEdit?'Salvar':'Adicionar'}</button>
      </>}>
      <div className="grid" style={{gap:15}}>
        <div className="field"><label>Nome</label><input className="input" autoFocus value={f.name} onChange={e=>set('name',e.target.value)} placeholder="Ex.: Gabriela"/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Curso / mentoria</label>
            <select className="input" value={f.course} onChange={e=>set('course',e.target.value)}>{courses.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}</select></div>
          <div className="field"><label>Status</label>
            <select className="input" value={f.status} onChange={e=>set('status',e.target.value)}>{Object.keys(STU_STATUS).map(k=><option key={k} value={k}>{STU_STATUS[k].label}</option>)}</select></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Valor mensal (R$)</label><input className="input tnum" value={f.value} onChange={e=>set('value',e.target.value)} placeholder="0,00"/></div>
          <div className="field"><label>Contato <span style={{color:'var(--faint)',fontWeight:400}}>(opcional)</span></label><input className="input" value={f.contact} onChange={e=>set('contact',e.target.value)} placeholder="WhatsApp, e-mail..."/></div>
        </div>
        <div className="field"><label>Anotações</label><textarea className="input" value={f.notes} onChange={e=>set('notes',e.target.value)} placeholder="Pontos de atenção, plano de estudo, combinados..."/></div>
        <Toggle on={f.paid} onClick={()=>set('paid',!f.paid)} icon="check" label="Mensalidade em dia" color="var(--ok)"/>
      </div>
    </Modal>
  );
}

function AlunosView(){
  const { state, toggleStudentPaid } = useStore();
  const U=window.U;
  const [open,setOpen]=React.useState(null);
  const [modal,setModal]=React.useState(null); // 'new' | student
  const [course,setCourse]=React.useState('todos');
  const [status,setStatus]=React.useState('ativo');

  let list=state.students.slice();
  if(course!=='todos') list=list.filter(s=>s.course===course);
  if(status!=='todos') list=list.filter(s=>s.status===status);

  const ativos=state.students.filter(s=>s.status==='ativo');
  const receita=ativos.reduce((a,s)=>a+(s.value||0),0);
  const pendentes=ativos.filter(s=>!s.paid);

  if(open){
    const st=state.students.find(s=>s.id===open);
    if(st) return <StudentDetail student={st} onBack={()=>setOpen(null)}/>;
  }

  const courses=[{key:'todos',label:'Todos'},...window.SEED.PROJECTS.filter(p=>['mentorias','vde1','vde2','vde_concursos','constitucional'].includes(p.key))];

  return (
    <div className="view-enter">
      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:18}}>
        <KPI label="Alunos ativos" icon="users" value={ativos.length} meta={state.students.length+' no total'}/>
        <KPI label="Receita mensal" icon="wallet" value={U.brlShort(receita)} meta="mentorias ativas" accent="var(--ok)"/>
        <KPI label="Pagamentos pendentes" icon="alert" value={pendentes.length} meta={pendentes.length?U.brlShort(pendentes.reduce((a,s)=>a+(s.value||0),0))+' a receber':'tudo em dia'} accent={pendentes.length?'var(--danger)':'var(--ok)'}/>
        <KPI label="Sessões na semana" icon="calendar" value={state.commitments.filter(c=>c.project==='mentorias'&&!c.done&&U.daysFromToday(c.date)>=0&&U.daysFromToday(c.date)<=7).length} meta="próximos 7 dias"/>
      </div>

      <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:18}}>
        <div className="seg">
          {[['ativo','Ativos'],['pausado','Pausados'],['concluido','Concluídos'],['todos','Todos']].map(([k,l])=>
            <button key={k} className={status===k?'on':''} onClick={()=>setStatus(k)}>{l}</button>)}
        </div>
        <select className="input" style={{width:'auto',padding:'7px 11px',fontSize:12.5}} value={course} onChange={e=>setCourse(e.target.value)}>
          {courses.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <button className="btn btn-primary" style={{marginLeft:'auto'}} onClick={()=>setModal('new')}><Icon name="plus" size={16}/>Novo aluno</button>
      </div>

      {list.length===0 ? <div className="empty"><Icon name="users"/><div>Nenhum aluno neste filtro.</div></div> :
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))'}}>
        {list.map(st=>{
          const p=U.PROJ_BY_KEY[st.course];
          const sess=sessionsOf(state.commitments,st);
          const next=sess.filter(c=>!c.done&&U.daysFromToday(c.date)>=0).sort((a,b)=>a.date.localeCompare(b.date))[0];
          const ss=STU_STATUS[st.status];
          return (
            <button key={st.id} onClick={()=>setOpen(st.id)} className="card" style={{textAlign:'left',cursor:'pointer',padding:16}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--sh-md)';}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--sh-sm)';}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                <span className="avatar" style={{width:42,height:42,fontSize:16,flex:'0 0 42px',background:`color-mix(in srgb,${st.color} 16%,#fff)`,color:st.color}}>{st.name[0]}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:14.5}}>{st.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
                    <span className="chip" style={{fontSize:10,padding:'1px 7px'}}><span className="dot" style={{background:p.color,width:5,height:5}}></span>{p.label}</span>
                  </div>
                </div>
                <span className="chip" style={{fontSize:10,padding:'1px 8px',color:ss.color,borderColor:`color-mix(in srgb,${ss.color} 30%,#fff)`}}><span className="dot" style={{background:ss.color}}></span>{ss.label}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12,paddingTop:11,borderTop:'1px solid var(--border-2)'}}>
                <div>
                  <div className="tnum" style={{fontWeight:650,fontSize:14}}>{st.value?U.brl(st.value):'—'}<span style={{fontSize:10,color:'var(--faint)',fontWeight:400}}>/mês</span></div>
                  <div onClick={e=>{e.stopPropagation();toggleStudentPaid(st.id);}} style={{fontSize:10.5,fontWeight:600,marginTop:2,color:st.paid?'var(--ok)':'var(--danger)',cursor:'pointer'}}>
                    <Icon name={st.paid?'check':'alert'} size={11} style={{verticalAlign:'-1px'}}/> {st.paid?'em dia':'pendente'}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:10.5,color:'var(--faint)'}}>{sess.length} sessões</div>
                  {next && <div style={{fontSize:11,fontWeight:600,color:'var(--olive-700)'}}>{U.relDate(next.date)}</div>}
                </div>
              </div>
            </button>
          );
        })}
      </div>}

      {modal && <StudentModal initial={modal==='new'?null:modal} onClose={()=>setModal(null)}/>}
    </div>
  );
}

function StudentDetail({student, onBack}){
  const { state, updateStudent, toggleStudentPaid } = useStore();
  const U=window.U;
  const st=student;
  const p=U.PROJ_BY_KEY[st.course];
  const [modal,setModal]=React.useState(null); // commitment modal
  const [edit,setEdit]=React.useState(false);
  const [notes,setNotes]=React.useState(st.notes||'');
  React.useEffect(()=>setNotes(st.notes||''),[st.id]);
  const sess=sessionsOf(state.commitments,st).sort((a,b)=>(a.date+'T'+(a.time||'00')).localeCompare(b.date+'T'+(b.time||'00')));
  const next=sess.filter(c=>!c.done&&U.daysFromToday(c.date)>=0);
  const past=sess.filter(c=>c.done||U.daysFromToday(c.date)<0);
  const ss=STU_STATUS[st.status];

  return (
    <div className="view-enter">
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{marginBottom:16}}><Icon name="chevronL" size={15}/>Todos os alunos</button>

      <div className="card" style={{padding:'20px 22px',marginBottom:18,display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
        <span className="avatar" style={{width:54,height:54,fontSize:20,flex:'0 0 54px',background:`color-mix(in srgb,${st.color} 16%,#fff)`,color:st.color}}>{st.name[0]}</span>
        <div style={{flex:1,minWidth:0}}>
          <h2 style={{fontSize:20,fontWeight:650,letterSpacing:'-.02em'}}>{st.name}</h2>
          <div style={{display:'flex',gap:8,alignItems:'center',marginTop:4,flexWrap:'wrap'}}>
            <span className="chip" style={{fontSize:11}}><span className="dot" style={{background:p.color}}></span>{p.label}</span>
            <span className="chip" style={{fontSize:11,color:ss.color,borderColor:`color-mix(in srgb,${ss.color} 30%,#fff)`}}><span className="dot" style={{background:ss.color}}></span>{ss.label}</span>
            {st.contact && <span className="chip" style={{fontSize:11,color:'var(--muted)'}}><Icon name="mail" size={12}/>{st.contact}</span>}
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="tnum" style={{fontWeight:700,fontSize:20}}>{st.value?U.brl(st.value):'—'}<span style={{fontSize:11,color:'var(--faint)',fontWeight:400}}>/mês</span></div>
          <button onClick={()=>toggleStudentPaid(st.id)} className="chip" style={{cursor:'pointer',marginTop:6,fontSize:11,color:st.paid?'var(--ok)':'var(--danger)',borderColor:st.paid?'color-mix(in srgb,var(--ok) 30%,#fff)':'color-mix(in srgb,var(--danger) 30%,#fff)'}}>
            <Icon name={st.paid?'check':'alert'} size={12}/>{st.paid?'Mensalidade em dia':'Pagamento pendente'}</button>
        </div>
        <button className="btn btn-ghost" onClick={()=>setEdit(true)}><Icon name="edit" size={15}/>Editar</button>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1.6fr 1fr',gap:18,alignItems:'start'}}>
        <Card>
          <SectionH title="Sessões" sub={sess.length+' no total'}
            action={<button className="btn btn-primary btn-sm" onClick={()=>setModal({project:st.course,studentId:st.id,date:U.TODAY,title:'Mentoria — '+st.name})}><Icon name="plus" size={14}/>Sessão</button>}/>
          {next.length>0 && <div style={{fontSize:11,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',color:'var(--faint)',margin:'4px 0 2px'}}>Próximas</div>}
          {next.map(c=><CommitmentRow key={c.id} c={c} onEdit={setModal}/>)}
          {past.length>0 && <div style={{fontSize:11,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',color:'var(--faint)',margin:'14px 0 2px'}}>Histórico</div>}
          {past.slice().reverse().map(c=><CommitmentRow key={c.id} c={c} onEdit={setModal}/>)}
          {sess.length===0 && <div className="empty"><Icon name="calendar"/><div>Nenhuma sessão registrada ainda.</div></div>}
        </Card>
        <Card>
          <SectionH title="Anotações"/>
          <textarea className="input" value={notes} onChange={e=>setNotes(e.target.value)} onBlur={()=>updateStudent(st.id,{notes})}
            placeholder="Plano de estudo, pontos de atenção, combinados financeiros..." style={{minHeight:200}}/>
          <div style={{fontSize:11,color:'var(--faint)',marginTop:8}}>Salvo automaticamente ao sair do campo.</div>
        </Card>
      </div>

      {edit && <StudentModal initial={st} onClose={()=>setEdit(false)}/>}
      {modal && <CommitmentModal initial={modal} onClose={()=>setModal(null)}/>}
    </div>
  );
}
window.AlunosView = AlunosView;
