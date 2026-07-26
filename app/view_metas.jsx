/* ===== Minha Vida — Metas ===== */
const GOAL_TYPES = {
  receita:{label:'Receita (R$)', money:true},
  alunos:{label:'Alunos ativos', money:false},
  posts:{label:'Posts publicados', money:false},
  custom:{label:'Personalizada', money:false},
};
function GoalModal({initial,onClose}){
  const { addGoal, updateGoal, removeGoal } = useStore();
  const isEdit=!!(initial&&initial.id);
  const colors=['var(--olive)','var(--c-vdec)','var(--c-conteudo)','var(--c-pratflix)','var(--c-vde2)','var(--c-renato)'];
  const [f,setF]=React.useState(()=>({label:'',type:'receita',target:'',current:0,period:'mes',color:'var(--olive)',money:false,...(initial||{})}));
  const set=(k,v)=>setF(s=>({...s,[k]:v}));
  const save=()=>{ if(!f.label.trim())return; if(isEdit)updateGoal(initial.id,{...f,target:parseFloat(String(f.target).replace(',','.'))||0}); else addGoal({...f,target:parseFloat(String(f.target).replace(',','.'))||0}); onClose(); };
  return (
    <Modal title={isEdit?'Editar meta':'Nova meta'} icon="target" onClose={onClose}
      footer={<>
        {isEdit && <button className="btn btn-ghost" style={{marginRight:'auto',color:'var(--danger)',borderColor:'transparent'}} onClick={()=>{removeGoal(initial.id);onClose();}}><Icon name="trash" size={15}/>Excluir</button>}
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>{isEdit?'Salvar':'Criar'}</button>
      </>}>
      <div className="grid" style={{gap:15}}>
        <div className="field"><label>Nome da meta</label><input className="input" autoFocus value={f.label} onChange={e=>set('label',e.target.value)} placeholder="Ex.: Receita do mês"/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Tipo</label><select className="input" value={f.type} onChange={e=>set('type',e.target.value)}>{Object.keys(GOAL_TYPES).map(k=><option key={k} value={k}>{GOAL_TYPES[k].label}</option>)}</select></div>
          <div className="field"><label>Meta (alvo)</label><input className="input tnum" value={f.target} onChange={e=>set('target',e.target.value)} placeholder="0"/></div>
        </div>
        {f.type==='custom' && <div className="field"><label>Progresso atual</label><input className="input tnum" value={f.current} onChange={e=>set('current',parseFloat(String(e.target.value).replace(',','.'))||0)} placeholder="0"/></div>}
        <div className="field"><label>Cor</label>
          <div className="pill-row">{colors.map(c=><button key={c} onClick={()=>set('color',c)} style={{width:28,height:28,borderRadius:8,background:c,border:f.color===c?'2px solid var(--ink)':'2px solid transparent',cursor:'pointer'}}></button>)}</div>
        </div>
        {f.type!=='custom' && <div className="notice"><Icon name="sparkles"/><div>O progresso desta meta é calculado automaticamente a partir dos seus dados ({GOAL_TYPES[f.type].label.toLowerCase()}).</div></div>}
      </div>
    </Modal>
  );
}

function MetasView(){
  const { state } = useStore();
  const U=window.U;
  const [modal,setModal]=React.useState(null);
  const thisMonth=(d)=>{ const x=U.parseDate(d),t=U.parseDate(U.TODAY); return x.getMonth()===t.getMonth()&&x.getFullYear()===t.getFullYear(); };
  const incomeM=state.tx.filter(t=>t.type==='income'&&thisMonth(t.date)).reduce((a,t)=>a+t.amount,0);
  const alunosAtivos=state.students.filter(s=>s.status==='ativo').length;
  const postsM=state.content.filter(c=>c.status==='publicado'&&thisMonth(c.date)).length;
  const titheM=(state.tithes||[]).filter(t=>thisMonth(t.date)).reduce((a,t)=>a+t.amount,0);
  const currentOf=(g)=>{
    if(g.type==='receita') return incomeM;
    if(g.type==='alunos') return alunosAtivos;
    if(g.type==='posts') return postsM;
    if(/ízimo|dizimo/i.test(g.label)) return titheM;
    return g.current||0;
  };
  const cumpridas=state.goals.filter(g=>currentOf(g)>=g.target&&g.target>0).length;

  return (
    <div className="view-enter">
      <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:18}}>
        <KPI label="Metas ativas" icon="target" value={state.goals.length} meta="acompanhando"/>
        <KPI label="Cumpridas" icon="check" value={cumpridas} meta={'de '+state.goals.length} accent="var(--ok)"/>
        <KPI label="Receita do mês" icon="trending" value={U.brlShort(incomeM)} meta="entrada atual" accent="var(--olive)"/>
      </div>

      <div style={{display:'flex',marginBottom:16}}>
        <button className="btn btn-primary" style={{marginLeft:'auto'}} onClick={()=>setModal('new')}><Icon name="plus" size={16}/>Nova meta</button>
      </div>

      {state.goals.length===0 ? <div className="empty"><Icon name="target"/><div>Nenhuma meta ainda. Crie a primeira.</div></div> :
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))'}}>
        {state.goals.map(g=>{
          const cur=currentOf(g); const t=GOAL_TYPES[g.type]||GOAL_TYPES.custom;
          const money=g.type==='receita'||/ízimo|dizimo|R\$/i.test(g.label);
          const fmt=money?(v=>U.brl(v||0)):(v=>(v||0).toLocaleString('pt-BR'));
          const p=g.target>0?Math.min(100,Math.round(cur/g.target*100)):0;
          const hit=cur>=g.target&&g.target>0;
          return (
            <button key={g.id} onClick={()=>setModal(g)} className="card" style={{textAlign:'left',cursor:'pointer',padding:18}}>
              <div style={{display:'flex',alignItems:'center',gap:18}}>
                <div style={{position:'relative',flex:'0 0 88px'}}>
                  <Donut size={88} thickness={11} segments={[{value:p,color:g.color},{value:100-p,color:'var(--border-2)'}]} center={p+'%'}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{g.label}</div>
                  <div className="tnum" style={{fontSize:17,fontWeight:700,color:g.color,letterSpacing:'-.01em'}}>{fmt(cur)}</div>
                  <div className="tnum" style={{fontSize:11.5,color:'var(--faint)'}}>meta: {fmt(g.target)}</div>
                  {hit ? <div style={{fontSize:11,fontWeight:600,color:'var(--ok)',marginTop:5}}><Icon name="check" size={12} style={{verticalAlign:'-2px'}}/> Meta cumprida!</div>
                  : <div style={{fontSize:11,color:'var(--muted)',marginTop:5}}>faltam {fmt(Math.max(0,g.target-cur))}</div>}
                </div>
              </div>
              {g.type!=='custom' && !/ízimo|dizimo/i.test(g.label) && <div style={{fontSize:10,color:'var(--faint)',marginTop:10,display:'flex',alignItems:'center',gap:5}}><Icon name="sparkles" size={11}/>cálculo automático</div>}
            </button>
          );
        })}
      </div>}

      {modal && <GoalModal initial={modal==='new'?null:modal} onClose={()=>setModal(null)}/>}
    </div>
  );
}
window.MetasView = MetasView;
