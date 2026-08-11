/* ===== Minha Vida — Finanças: Relatórios ===== */
function RelatoriosTab(){
  const { state } = useStore();
  const U=window.U;
  const [tipo,setTipo]=React.useState('financeiro'); // financeiro | compromissos | geral
  const [period,setPeriod]=React.useState('mes');
  const [chartView,setChartView]=React.useState('categoria'); // categoria (específico) | evolucao (geral)

  const inPeriod=(date)=>{
    const d=U.parseDate(date); const t=U.parseDate(U.TODAY);
    if(period==='mes') return d.getMonth()===t.getMonth()&&d.getFullYear()===t.getFullYear();
    if(period==='semestre') return d.getFullYear()===t.getFullYear() && (d.getMonth()<6)===(t.getMonth()<6);
    return d.getFullYear()===t.getFullYear();
  };
  const periodLabel={mes:'Junho de 2026',semestre:'1º semestre de 2026',ano:'Ano de 2026'}[period];

  const tx=state.tx.filter(t=>inPeriod(t.date));
  const incomes=tx.filter(t=>t.type==='income'), expenses=tx.filter(t=>t.type==='expense');
  const totalIn=incomes.reduce((a,t)=>a+t.amount,0), totalOut=expenses.reduce((a,t)=>a+t.amount,0);
  const saldo=totalIn-totalOut, tithe=totalIn*(state.settings.tithe/100);
  const byTag=(list,tags)=>{ const m={}; list.forEach(t=>m[t.tag]=(m[t.tag]||0)+t.amount); return tags.map(tg=>({...tg,value:m[tg.id]||0})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value); };
  const incSeg=byTag(incomes,state.incomeTags), expSeg=byTag(expenses,state.expenseTags);

  const coms=state.commitments.filter(c=>inPeriod(c.date)).sort((a,b)=>(a.date+'T'+(a.time||'00')).localeCompare(b.date+'T'+(b.time||'00')));
  const byProj={}; coms.forEach(c=>byProj[c.project]=(byProj[c.project]||0)+1);

  // evolução mensal (visão geral) — últimos 6 meses, independente do filtro de período acima
  const monthlyEvo = (()=>{
    const t=U.parseDate(U.TODAY); const months=[];
    for(let i=5;i>=0;i--) months.push(new Date(t.getFullYear(), t.getMonth()-i, 1));
    return months.map(d=>{
      const y=d.getFullYear(), m=d.getMonth();
      const inMonth=(x)=>{ const dd=U.parseDate(x.date); return dd.getFullYear()===y && dd.getMonth()===m; };
      const income=state.tx.filter(x=>x.type==='income'&&inMonth(x)).reduce((a,x)=>a+x.amount,0);
      const expense=state.tx.filter(x=>x.type==='expense'&&inMonth(x)).reduce((a,x)=>a+x.amount,0);
      return {label:U.MONTHS_SHORT[m], income, expense};
    });
  })();

  const Th=({children,r})=> <th style={{textAlign:r?'right':'left',padding:'7px 10px',fontSize:11,fontWeight:600,color:'var(--muted)',borderBottom:'1.5px solid var(--border)',textTransform:'uppercase',letterSpacing:'.03em'}}>{children}</th>;
  const Td=({children,r,b})=> <td style={{textAlign:r?'right':'left',padding:'8px 10px',fontSize:12.5,borderBottom:'1px solid var(--border-2)',fontWeight:b?650:400}} className={r?'tnum':''}>{children}</td>;

  const MonthlyBarChart=({data})=>{
    const max=Math.max(1,...data.flatMap(d=>[d.income,d.expense]));
    return (
      <div style={{overflowX:'auto'}}>
        <div style={{display:'flex',gap:16,alignItems:'flex-end',minWidth:data.length*64,padding:'0 4px'}}>
          {data.map((d,i)=>(
            <div key={i} style={{flex:'0 0 auto',width:56,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
              <div style={{display:'flex',gap:4,alignItems:'flex-end',height:140}}>
                <div title={'Recebido: '+U.brl(d.income)} style={{width:18,borderRadius:'4px 4px 0 0',background:'var(--ok)',height:Math.max(2,Math.round(d.income/max*140))}}></div>
                <div title={'Gasto: '+U.brl(d.expense)} style={{width:18,borderRadius:'4px 4px 0 0',background:'var(--danger)',height:Math.max(2,Math.round(d.expense/max*140))}}></div>
              </div>
              <div style={{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'capitalize'}}>{d.label}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:16,justifyContent:'center',marginTop:10,fontSize:11.5,color:'var(--muted)'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:5}}><span style={{width:9,height:9,borderRadius:3,background:'var(--ok)'}}></span>Recebido</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:5}}><span style={{width:9,height:9,borderRadius:3,background:'var(--danger)'}}></span>Gasto</span>
        </div>
      </div>
    );
  };

  const TagTable=({title,seg,total,sign})=>(
    <div style={{marginBottom:18,breakInside:'avoid'}}>
      <h4 style={{fontSize:13,fontWeight:650,marginBottom:8}}>{title}</h4>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><Th>Categoria</Th><Th r>Valor</Th><Th r>%</Th></tr></thead>
        <tbody>
          {seg.map(s=>(<tr key={s.id}><Td><span style={{display:'inline-flex',alignItems:'center',gap:7}}><span className="tag-dot" style={{background:s.color}}></span>{s.label}</span></Td><Td r>{sign}{U.brl(s.value)}</Td><Td r>{Math.round(s.value/(total||1)*100)}%</Td></tr>))}
          <tr><Td b>Total</Td><Td r b>{sign}{U.brl(total)}</Td><Td r b>100%</Td></tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {/* controls — not printed */}
      <div className="no-print" style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center',marginBottom:18}}>
        <div className="seg">
          {[['financeiro','Financeiro'],['compromissos','Compromissos'],['geral','Geral']].map(([k,l])=>
            <button key={k} className={tipo===k?'on':''} onClick={()=>setTipo(k)}>{l}</button>)}
        </div>
        <div className="seg">
          {[['mes','Mês'],['semestre','Semestre'],['ano','Ano']].map(([k,l])=>
            <button key={k} className={period===k?'on':''} onClick={()=>setPeriod(k)}>{l}</button>)}
        </div>
        <button className="btn btn-primary" style={{marginLeft:'auto'}} onClick={()=>window.print()}><Icon name="doc" size={16}/>Imprimir / Salvar PDF</button>
      </div>

      {/* the report sheet */}
      <div className="report-sheet card" style={{padding:'34px 38px',maxWidth:840,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:14,borderBottom:'2px solid var(--olive)',paddingBottom:18,marginBottom:22}}>
          <div className="brand-mark" style={{width:42,height:42,fontSize:19}}>MV</div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--olive)'}}>Minha Vida · Relatório {tipo==='financeiro'?'Financeiro':tipo==='compromissos'?'de Compromissos':'Geral'}</div>
            <h2 style={{fontSize:23,fontWeight:700,letterSpacing:'-.02em',marginTop:2}}>{periodLabel}</h2>
          </div>
          <div style={{textAlign:'right',fontSize:11,color:'var(--faint)'}}>Gerado em<br/><b style={{color:'var(--ink-2)'}}>{U.fmtDate(U.TODAY,'long')}</b></div>
        </div>

        {(tipo==='financeiro'||tipo==='geral') && <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
            {[['Recebido',U.brl(totalIn),'var(--ok)'],['Gasto',U.brl(totalOut),'var(--danger)'],['Saldo',U.brl(saldo),saldo>=0?'var(--olive)':'var(--danger)'],['Dízimo ('+state.settings.tithe+'%)',U.brl(tithe),'var(--olive-800)']].map(([l,v,c],i)=>(
              <div key={i} style={{border:'1px solid var(--border)',borderRadius:12,padding:'12px 14px'}}>
                <div style={{fontSize:10.5,color:'var(--muted)',fontWeight:550}}>{l}</div>
                <div className="tnum" style={{fontSize:17,fontWeight:700,color:c,marginTop:4,letterSpacing:'-.01em'}}>{v}</div>
              </div>
            ))}
          </div>
          {/* seletor de gráfico: específico (por categoria) ou geral (evolução no tempo) */}
          <div className="no-print" style={{display:'flex',alignItems:'center',gap:10,marginBottom:14,flexWrap:'wrap'}}>
            <span style={{fontSize:11.5,fontWeight:600,color:'var(--muted)'}}>Gráfico:</span>
            <div className="seg">
              <button className={chartView==='categoria'?'on':''} onClick={()=>setChartView('categoria')}>Por categoria (específico)</button>
              <button className={chartView==='evolucao'?'on':''} onClick={()=>setChartView('evolucao')}>Evolução mensal (geral)</button>
            </div>
          </div>
          {chartView==='categoria' ? (
            <div className="grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:22}}>
              <div><h4 style={{fontSize:13,fontWeight:650,marginBottom:8}}>Recebimentos por categoria</h4>
                {incSeg.length===0?<div style={{fontSize:12,color:'var(--faint)'}}>Sem dados no período.</div>:<BreakdownChart segments={incSeg} total={totalIn}/>}</div>
              <div><h4 style={{fontSize:13,fontWeight:650,marginBottom:8}}>Gastos por categoria</h4>
                {expSeg.length===0?<div style={{fontSize:12,color:'var(--faint)'}}>Sem dados no período.</div>:<BreakdownChart segments={expSeg} total={totalOut}/>}</div>
            </div>
          ) : (
            <div style={{marginBottom:22}}>
              <h4 style={{fontSize:13,fontWeight:650,marginBottom:8}}>Recebido × Gasto — últimos 6 meses</h4>
              <MonthlyBarChart data={monthlyEvo}/>
            </div>
          )}

          <div className="grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
            <TagTable title="Recebimentos por categoria" seg={incSeg} total={totalIn} sign="+ "/>
            <TagTable title="Gastos por categoria" seg={expSeg} total={totalOut} sign="− "/>
          </div>
          {/* cartões */}
          {(state.cards||[]).length>0 && <div style={{marginTop:6,breakInside:'avoid'}}>
            <h4 style={{fontSize:13,fontWeight:650,marginBottom:8}}>Cartões de crédito</h4>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr><Th>Cartão</Th><Th r>Fatura/mês</Th><Th r>Lançamentos</Th></tr></thead>
              <tbody>{state.cards.map(c=>{const m=cardMonthly(state.tx,c.id);const n=state.tx.filter(t=>t.card===c.id).length;return(<tr key={c.id}><Td><span style={{display:'inline-flex',alignItems:'center',gap:7}}><span className="tag-dot" style={{background:c.color}}></span>{c.name}</span></Td><Td r b>{U.brl(m)}</Td><Td r>{n}</Td></tr>);})}</tbody>
            </table>
          </div>}
        </>}

        {(tipo==='compromissos'||tipo==='geral') && <>
          <div style={{marginTop:tipo==='geral'?28:0,marginBottom:18}}>
            <h3 style={{fontSize:15,fontWeight:650,marginBottom:12,paddingTop:tipo==='geral'?18:0,borderTop:tipo==='geral'?'1px solid var(--border-2)':'none'}}>Compromissos — {periodLabel}</h3>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
              {Object.keys(byProj).map(k=>{const p=U.PROJ_BY_KEY[k];return <span key={k} className="chip" style={{fontSize:11}}><span className="dot" style={{background:p.color}}></span>{p.label} · {byProj[k]}</span>;})}
            </div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr><Th>Data</Th><Th>Compromisso</Th><Th>Projeto</Th><Th>Prioridade</Th><Th>Status</Th></tr></thead>
              <tbody>
                {coms.map(c=>{const p=U.PROJ_BY_KEY[c.project];const pr=window.priorityOf(c);return(
                  <tr key={c.id}>
                    <Td><span className="tnum">{U.fmtDate(c.date,'')}{c.time?' · '+c.time:''}</span></Td>
                    <Td>{c.title}{c.section?<span style={{color:'var(--faint)'}}> · {c.section}</span>:''}</Td>
                    <Td><span style={{display:'inline-flex',alignItems:'center',gap:6}}><span className="tag-dot" style={{background:p.color}}></span>{p.label}</span></Td>
                    <Td>{pr?window.PRIORITIES[pr].label:'—'}</Td>
                    <Td>{c.done?'Concluído':'Pendente'}</Td>
                  </tr>
                );})}
                {coms.length===0 && <tr><Td>—</Td><Td>Nenhum compromisso no período</Td><Td></Td><Td></Td><Td></Td></tr>}
              </tbody>
            </table>
          </div>
        </>}

        <div style={{marginTop:26,paddingTop:14,borderTop:'1px solid var(--border-2)',fontSize:10.5,color:'var(--faint)',textAlign:'center'}}>
          Minha Vida — painel pessoal · Relatório gerado automaticamente · {U.fmtDate(U.TODAY,'full')}
        </div>
      </div>
    </div>
  );
}
window.RelatoriosTab = RelatoriosTab;
