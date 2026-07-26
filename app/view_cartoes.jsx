/* ===== Minha Vida — Finanças: Cartões + Relatórios ===== */

function cardMonthly(tx, cardId){
  return tx.filter(t=>t.type==='expense'&&t.card===cardId).reduce((a,t)=>a+t.amount,0);
}

function CartoesTab(){
  const { state, addCard, removeCard } = useStore();
  const U=window.U;
  const [modal,setModal]=React.useState(null); // {type:'expense', initial}
  const [adding,setAdding]=React.useState(false);
  const [nf,setNf]=React.useState({name:'',limit:''});
  const cards=state.cards||[];
  const cardColors=['var(--c-vdec)','var(--c-pratflix)','var(--c-vde2)','var(--c-renato)','var(--c-conteudo)'];
  const tagMap={}; state.expenseTags.forEach(t=>tagMap[t.id]=t);

  const totalFatura=cards.reduce((a,c)=>a+cardMonthly(state.tx,c.id),0);

  return (
    <div>
      <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:18}}>
        <KPI label="Cartões" icon="wallet" value={cards.length} meta="cadastrados"/>
        <KPI label="Fatura estimada / mês" icon="arrowU" value={U.brlShort(totalFatura)} meta="assinaturas + parcelas" accent="var(--danger)"/>
        <KPI label="Assinaturas ativas" icon="clock" value={state.tx.filter(t=>t.recorrente).length} meta="cobranças recorrentes"/>
      </div>

      {cards.length===0 && <div className="empty"><Icon name="wallet"/><div>Nenhum cartão ainda. Adicione o primeiro.</div></div>}

      <div className="grid" style={{gridTemplateColumns:'1fr',gap:16}}>
        {cards.map(card=>{
          const exps=state.tx.filter(t=>t.type==='expense'&&t.card===card.id).sort((a,b)=>b.amount-a.amount);
          const monthly=cardMonthly(state.tx,card.id);
          const subs=exps.filter(e=>e.recorrente);
          const parcelados=exps.filter(e=>!e.recorrente);
          return (
            <Card key={card.id} pad={false}>
              <div style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:14,borderBottom:'1px solid var(--border-2)',background:`linear-gradient(110deg,color-mix(in srgb,${card.color} 9%,#fff),#fff 70%)`,borderRadius:'16px 16px 0 0'}}>
                <span style={{width:46,height:32,borderRadius:7,background:card.color,flex:'0 0 46px',display:'grid',placeItems:'center',color:'#fff'}}><Icon name="wallet" size={17}/></span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:650,fontSize:15}}>{card.name}</div>
                  <div style={{fontSize:11.5,color:'var(--muted)'}}>{exps.length} lançamento(s){card.limit?` · limite ${U.brl(card.limit)}`:''}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="tnum" style={{fontWeight:680,fontSize:18,color:'var(--ink)'}}>{U.brl(monthly)}</div>
                  <div style={{fontSize:11,color:'var(--faint)'}}>fatura/mês estimada</div>
                </div>
                <button className="btn btn-icon btn-ghost no-print" title="Remover cartão" onClick={()=>removeCard(card.id)} style={{color:'var(--faint)'}}><Icon name="trash" size={15}/></button>
              </div>
              {card.limit>0 && <div style={{padding:'0 20px',marginTop:-1}}>
                <div className="bar" style={{margin:'12px 0 0'}}><span style={{width:Math.min(100,monthly/card.limit*100)+'%',background:monthly/card.limit>0.85?'var(--danger)':card.color}}></span></div>
                <div style={{fontSize:10.5,color:'var(--faint)',marginTop:4}}>{Math.round(monthly/card.limit*100)}% do limite</div>
              </div>}
              <div style={{padding:'10px 20px 16px'}}>
                {subs.length>0 && <div style={{fontSize:11,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',color:'var(--faint)',margin:'8px 0 4px'}}>Assinaturas mensais</div>}
                {subs.map(e=><CardExpenseRow key={e.id} e={e} tag={tagMap[e.tag]} onEdit={()=>setModal({type:'expense',initial:e})}/>)}
                {parcelados.length>0 && <div style={{fontSize:11,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',color:'var(--faint)',margin:'12px 0 4px'}}>Compras parceladas / avulsas</div>}
                {parcelados.map(e=><CardExpenseRow key={e.id} e={e} tag={tagMap[e.tag]} onEdit={()=>setModal({type:'expense',initial:e})}/>)}
                {exps.length===0 && <div style={{fontSize:12.5,color:'var(--muted)',padding:'8px 0'}}>Nenhum gasto neste cartão ainda.</div>}
                <button className="btn btn-ghost btn-sm no-print" style={{marginTop:12}} onClick={()=>setModal({type:'expense',initial:{card:card.id}})}><Icon name="plus" size={14}/>Gasto no {card.name}</button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="no-print" style={{marginTop:16}}>
        {adding ? (
          <Card>
            <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
              <div className="field" style={{flex:'2 1 200px'}}><label>Nome do cartão</label><input className="input" autoFocus value={nf.name} onChange={e=>setNf({...nf,name:e.target.value})} placeholder="Ex.: Nubank, Inter..."/></div>
              <div className="field" style={{flex:'1 1 140px'}}><label>Limite (R$) <span style={{color:'var(--faint)',fontWeight:400}}>opcional</span></label><input className="input tnum" value={nf.limit} onChange={e=>setNf({...nf,limit:e.target.value})} placeholder="0,00"/></div>
              <button className="btn btn-ghost" onClick={()=>setAdding(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={()=>{ if(nf.name.trim()){ addCard({name:nf.name.trim(),limit:parseFloat(String(nf.limit).replace(',','.'))||0,color:cardColors[cards.length%cardColors.length]}); setNf({name:'',limit:''}); setAdding(false);} }}>Adicionar cartão</button>
            </div>
          </Card>
        ) : (
          <button className="btn btn-ghost" onClick={()=>setAdding(true)}><Icon name="plus" size={16}/>Adicionar cartão</button>
        )}
      </div>

      {modal && <TxModal type={modal.type} initial={modal.initial} onClose={()=>setModal(null)}/>}
    </div>
  );
}

function CardExpenseRow({e, tag, onEdit}){
  const U=window.U;
  return (
    <div onClick={onEdit} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 2px',borderBottom:'1px solid var(--border-2)',cursor:'pointer'}}>
      <span className="tag-dot" style={{width:10,height:10,background:tag?tag.color:'var(--faint)'}}></span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:550}}>{e.desc}</div>
        <div style={{fontSize:11,color:'var(--faint)',display:'flex',gap:8,alignItems:'center',marginTop:1}}>
          {tag && <span>{tag.label}</span>}
          {e.recorrente ? <span className="chip" style={{fontSize:9.5,padding:'0 7px',color:'var(--ok)'}}><Icon name="clock" size={10}/>assinatura mensal</span>
            : (e.parcelas>1 ? <span className="chip" style={{fontSize:9.5,padding:'0 7px'}}>parcela {e.parcelaAtual||1}/{e.parcelas}</span> : <span>à vista no cartão</span>)}
        </div>
      </div>
      <div style={{textAlign:'right'}}>
        <div className="tnum" style={{fontWeight:650,fontSize:13.5}}>{U.brl(e.amount)}<span style={{fontSize:10,color:'var(--faint)',fontWeight:400}}>/mês</span></div>
        {!e.recorrente && e.parcelas>1 && <div className="tnum" style={{fontSize:10.5,color:'var(--faint)'}}>total {U.brl(e.amount*e.parcelas)}</div>}
      </div>
    </div>
  );
}

window.CartoesTab = CartoesTab;
