/* ===== Minha Vida — Finanças ===== */
function FinancasView(){
  const { state, setTithe } = useStore();
  const U=window.U;
  const [tab,setTab]=React.useState('visao'); // visao | gastos | recebimentos
  const [modal,setModal]=React.useState(null); // {type,initial}
  const [period,setPeriod]=React.useState('mes'); // mes | semestre | ano
  const [gastoFreq,setGastoFreq]=React.useState('todos');

  const tagMap={}; state.expenseTags.forEach(t=>tagMap[t.id]=t); state.incomeTags.forEach(t=>tagMap['inc_'+t.id]=t);

  // period filter (based on current date 2026-06)
  const inPeriod=(date)=>{
    const d=U.parseDate(date); const t=U.parseDate(U.TODAY);
    if(period==='mes') return d.getMonth()===t.getMonth()&&d.getFullYear()===t.getFullYear();
    if(period==='semestre') return d.getFullYear()===t.getFullYear() && (d.getMonth()<6)===(t.getMonth()<6);
    return d.getFullYear()===t.getFullYear();
  };
  const tx = state.tx.filter(t=>inPeriod(t.date));
  const incomes = tx.filter(t=>t.type==='income');
  const expenses = tx.filter(t=>t.type==='expense');
  const totalIn = incomes.reduce((a,t)=>a+t.amount,0);
  const totalOut = expenses.reduce((a,t)=>a+t.amount,0);
  const saldo = totalIn-totalOut;
  const tithe = totalIn*(state.settings.tithe/100);

  // breakdown by tag
  const byTag=(list,tags)=>{
    const m={}; list.forEach(t=>{ m[t.tag]=(m[t.tag]||0)+t.amount; });
    return tags.map(tg=>({...tg,value:m[tg.id]||0})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
  };
  const expSeg=byTag(expenses,state.expenseTags);
  const incSeg=byTag(incomes,state.incomeTags);

  // fixed expense monthly equivalent
  const fixedMonthly = expenses.filter(e=>e.freq&&e.freq!=='diario').reduce((a,e)=>{
    return a + (e.freq==='mensal'?e.amount:e.freq==='semestral'?e.amount/6:e.amount/12);
  },0);

  const periodLabel={mes:'este mês',semestre:'este semestre',ano:'este ano'}[period];

  const ListBlock=({list,tags,type})=>{
    let l=list.slice().sort((a,b)=>b.date.localeCompare(a.date));
    if(type==='expense'&&gastoFreq!=='todos') l=l.filter(e=>e.freq===gastoFreq);
    const tm={}; tags.forEach(t=>tm[t.id]=t);
    return (
      <Card pad={false}>
        <div style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid var(--border-2)'}}>
          <h3 style={{fontSize:14,fontWeight:600}}>{type==='income'?'Recebimentos':'Gastos'} · {periodLabel}</h3>
          {type==='expense' && <select className="input" style={{width:'auto',padding:'5px 9px',fontSize:12,marginLeft:6}} value={gastoFreq} onChange={e=>setGastoFreq(e.target.value)}>
            <option value="todos">Todos</option><option value="diario">Diários/avulsos</option><option value="mensal">Fixos mensais</option><option value="semestral">Fixos semestrais</option><option value="anual">Fixos anuais</option>
          </select>}
          <button className="btn btn-primary btn-sm" style={{marginLeft:'auto'}} onClick={()=>setModal({type})}><Icon name="plus" size={14}/>{type==='income'?'Recebimento':'Gasto'}</button>
        </div>
        {l.length===0?<div className="empty"><Icon name="wallet"/><div>Nada lançado {periodLabel}.</div></div>:
        <div style={{padding:'4px 18px 10px'}}>
          {l.map(t=>{
            const tg=tm[t.tag];
            return (
              <div key={t.id} onClick={()=>setModal({type,initial:t})} style={{display:'flex',alignItems:'center',gap:13,padding:'12px 2px',borderBottom:'1px solid var(--border-2)',cursor:'pointer'}}>
                <span className="tag-dot" style={{width:11,height:11,background:tg?tg.color:'var(--faint)'}}></span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13.5,fontWeight:550}}>{t.desc}</div>
                  <div style={{fontSize:11.5,color:'var(--faint)',marginTop:1,display:'flex',gap:8}}>
                    <span>{U.fmtDate(t.date,'long')}</span>
                    {tg && <span>· {tg.label}</span>}
                    {t.freq && t.freq!=='diario' && <span className="chip" style={{fontSize:9.5,padding:'0 6px'}}>{t.freq}</span>}
                    {t.card && <span className="chip" style={{fontSize:9.5,padding:'0 6px',color:'var(--c-vdec)'}}><Icon name="wallet" size={10}/>{t.recorrente?'assinatura':(t.parcelas>1?`${t.parcelaAtual||1}/${t.parcelas}`:'cartão')}</span>}
                  </div>
                </div>
                <div className="tnum" style={{fontWeight:650,fontSize:14,color:type==='income'?'var(--ok)':'var(--ink)'}}>
                  {type==='income'?'+':'−'} {U.brl(t.amount)}
                </div>
              </div>
            );
          })}
        </div>}
      </Card>
    );
  };

  return (
    <div className="view-enter">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <div className="seg">
          {[['visao','Visão geral'],['recebimentos','Recebimentos'],['gastos','Gastos'],['contas','Contas'],['cartoes','Cartões'],['relatorios','Relatórios']].map(([k,l])=>
            <button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)}>{l}</button>)}
        </div>
        {(tab==='visao'||tab==='recebimentos'||tab==='gastos') && <div className="seg" style={{marginLeft:'auto'}}>
          {[['mes','Mês'],['semestre','Semestre'],['ano','Ano']].map(([k,l])=>
            <button key={k} className={period===k?'on':''} onClick={()=>setPeriod(k)}>{l}</button>)}
        </div>}
      </div>

      {tab==='visao' && <>
        <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:18}}>
          <KPI label="Recebido" icon="arrowD" value={U.brlShort(totalIn)} meta={incomes.length+' lançamentos'} accent="var(--ok)"/>
          <KPI label="Gasto" icon="arrowU" value={U.brlShort(totalOut)} meta={expenses.length+' lançamentos'} accent="var(--danger)"/>
          <KPI label="Saldo" icon="wallet" value={U.brlShort(saldo)} meta={periodLabel} accent={saldo>=0?'var(--olive)':'var(--danger)'}/>
          <KPI label="Gasto fixo / mês" icon="settings" value={U.brlShort(fixedMonthly)} meta="equivalente mensal"/>
        </div>

        {/* dízimo */}
        <DizimoCard period={period} periodLabel={periodLabel} estimated={tithe} totalIn={totalIn} inPeriod={inPeriod}/>

        <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <Card>
            <SectionH title="Recebimentos por tag" sub={periodLabel}/>
            <BreakdownChart segments={incSeg} total={totalIn}/>
          </Card>
          <Card>
            <SectionH title="Gastos por tag" sub={periodLabel}/>
            <BreakdownChart segments={expSeg} total={totalOut}/>
          </Card>
        </div>
      </>}

      {tab==='recebimentos' && <ListBlock list={incomes} tags={state.incomeTags} type="income"/>}
      {tab==='gastos' && <ListBlock list={expenses} tags={state.expenseTags} type="expense"/>}
      {tab==='cartoes' && <CartoesTab/>}
      {tab==='contas' && <ContasTab/>}
      {tab==='relatorios' && <RelatoriosTab/>}

      {modal && <TxModal type={modal.type} initial={modal.initial} onClose={()=>setModal(null)}/>}
    </div>
  );
}

function BreakdownChart({segments, total}){
  const U=window.U;
  if(!segments.length) return <div className="empty"><Icon name="trending"/><div>Sem dados no período.</div></div>;
  return (
    <div style={{display:'flex',alignItems:'center',gap:22,flexWrap:'wrap'}}>
      <Donut segments={segments.map(s=>({value:s.value,color:s.color}))} center={U.brlShort(total)}/>
      <div style={{flex:1,minWidth:160,display:'flex',flexDirection:'column',gap:9}}>
        {segments.map(s=>(
          <div key={s.id} style={{display:'flex',alignItems:'center',gap:9,fontSize:12.5}}>
            <span className="tag-dot" style={{background:s.color}}></span>
            <span style={{flex:1}}>{s.label}</span>
            <span className="tnum" style={{fontWeight:600}}>{U.brl(s.value)}</span>
            <span className="tnum" style={{color:'var(--faint)',fontSize:11,width:40,textAlign:'right'}}>{Math.round(s.value/total*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
window.FinancasView = FinancasView;

function DizimoCard({period, periodLabel, estimated, totalIn, inPeriod}){
  const { state, setTithe, addTithe, removeTithe } = useStore();
  const U=window.U;
  const [open,setOpen]=React.useState(false);
  const [reg,setReg]=React.useState(false);
  const dados=(state.tithes||[]).filter(t=>inPeriod(t.date)).sort((a,b)=>b.date.localeCompare(a.date));
  const entregue=dados.reduce((a,t)=>a+t.amount,0);
  const restante=Math.max(0, estimated-entregue);
  const pct=estimated>0?Math.min(100,entregue/estimated*100):0;
  const [f,setF]=React.useState({amount:'',date:U.TODAY,note:''});
  const openReg=()=>{ setF({amount:restante?restante.toFixed(2):'',date:U.TODAY,note:''}); setReg(true); setOpen(true); };
  const save=()=>{ const amt=parseFloat(String(f.amount).replace(',','.'))||0; if(!amt)return; addTithe({amount:amt,date:f.date,note:f.note}); setReg(false); };

  return (
    <Card style={{marginBottom:18, background:'linear-gradient(120deg,var(--olive-50),#fff 60%)'}}>
      <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
        <div style={{flex:'1 1 230px'}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:6}}>
            <span style={{width:34,height:34,borderRadius:10,background:'var(--olive)',color:'#fff',display:'grid',placeItems:'center'}}><Icon name="heart" size={18}/></span>
            <div><h3 style={{fontSize:15,fontWeight:650}}>Dízimo</h3><div style={{fontSize:12,color:'var(--muted)'}}>{periodLabel}</div></div>
          </div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:11,color:'var(--muted)',fontWeight:550}}>Estimado</div>
          <div className="tnum" style={{fontSize:26,fontWeight:700,color:'var(--olive-800)',letterSpacing:'-.02em'}}>{U.brl(estimated)}</div>
          <div style={{fontSize:11,color:'var(--faint)'}}>{state.settings.tithe}% de {U.brl(totalIn)}</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:11,color:'var(--muted)',fontWeight:550}}>Entregue</div>
          <div className="tnum" style={{fontSize:26,fontWeight:700,color:'var(--ok)',letterSpacing:'-.02em'}}>{U.brl(entregue)}</div>
          <div style={{fontSize:11,color:restante>0?'var(--danger)':'var(--ok)'}}>{restante>0?`faltam ${U.brl(restante)}`:'meta cumprida ✓'}</div>
        </div>
        <div style={{flex:'1 1 180px',minWidth:170}}>
          <label style={{fontSize:12,fontWeight:550,color:'var(--ink-2)',display:'flex',justifyContent:'space-between'}}>
            <span>Percentual</span><span className="tnum" style={{color:'var(--olive-700)',fontWeight:650}}>{state.settings.tithe}%</span></label>
          <input type="range" min="0" max="20" step="0.5" value={state.settings.tithe} onChange={e=>setTithe(parseFloat(e.target.value))} style={{width:'100%',accentColor:'var(--olive)',marginTop:8}}/>
        </div>
      </div>
      <div className="bar" style={{margin:'14px 0 6px'}}><span style={{width:pct+'%',background:'var(--olive)'}}></span></div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:11.5,color:'var(--muted)'}}>{Math.round(pct)}% entregue{dados.length>0 && <> · <button onClick={()=>setOpen(o=>!o)} className="link" style={{background:'none',border:'none',cursor:'pointer',padding:0,fontSize:11.5}}>{open?'ocultar histórico':`ver histórico (${dados.length})`}</button></>}</span>
        <button className="btn btn-primary btn-sm" style={{marginLeft:'auto'}} onClick={openReg}><Icon name="plus" size={14}/>Registrar dízimo</button>
      </div>

      {reg && <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid var(--olive-200)',display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
        <div className="field" style={{flex:'1 1 130px'}}><label>Valor (R$)</label><input className="input tnum" autoFocus value={f.amount} onChange={e=>setF({...f,amount:e.target.value})} placeholder="0,00"/></div>
        <div className="field" style={{flex:'1 1 130px'}}><label>Data</label><input className="input" type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/></div>
        <div className="field" style={{flex:'2 1 180px'}}><label>Observação <span style={{color:'var(--faint)',fontWeight:400}}>(opcional)</span></label><input className="input" value={f.note} onChange={e=>setF({...f,note:e.target.value})} placeholder="Igreja, oferta..."/></div>
        <button className="btn btn-ghost" onClick={()=>setReg(false)}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>Salvar</button>
      </div>}

      {open && dados.length>0 && <div style={{marginTop:14,paddingTop:6,borderTop:'1px solid var(--olive-200)'}}>
        {dados.map(t=>(
          <div key={t.id} style={{display:'flex',alignItems:'center',gap:11,padding:'9px 2px',borderBottom:'1px solid var(--border-2)'}}>
            <span style={{width:28,height:28,borderRadius:8,background:'color-mix(in srgb,var(--olive) 12%,#fff)',color:'var(--olive)',display:'grid',placeItems:'center',flex:'0 0 28px'}}><Icon name="heart" size={14}/></span>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:12.5,fontWeight:550}}>{U.fmtDate(t.date,'long')}</div>{t.note && <div style={{fontSize:11,color:'var(--faint)'}}>{t.note}</div>}</div>
            <span className="tnum" style={{fontWeight:650,fontSize:13.5,color:'var(--olive-800)'}}>{U.brl(t.amount)}</span>
            <button onClick={()=>removeTithe(t.id)} style={{background:'none',border:'none',color:'var(--faint)',cursor:'pointer',padding:0}}><Icon name="x" size={14}/></button>
          </div>
        ))}
      </div>}
    </Card>
  );
}
