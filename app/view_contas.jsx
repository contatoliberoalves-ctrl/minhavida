/* ===== Minha Vida — Contas a pagar / receber ===== */
function BillModal({initial, defType, onClose}){
  const { state, addBill, updateBill, removeBill, addExpenseTag, addIncomeTag } = useStore();
  const isEdit=!!(initial&&initial.id);
  const [f,setF]=React.useState(()=>({type:defType||'pagar',desc:'',amount:'',due:window.U.TODAY,paid:false,tag:'',receipt:'',notes:'',...(initial||{})}));
  const set=(k,v)=>setF(s=>({...s,[k]:v}));
  const tags = f.type==='receber'?state.incomeTags:state.expenseTags;
  const save=()=>{ const amt=parseFloat(String(f.amount).replace(',','.'))||0; if(!f.desc.trim()||!amt)return; if(isEdit)updateBill(initial.id,{...f,amount:amt}); else addBill({...f,amount:amt}); onClose(); };
  const onReceipt=async(file)=>{ if(file){ try{ const d=await window.fileToDataURL(file,1200,0.8); set('receipt',d);}catch(e){} } };
  return (
    <Modal title={isEdit?'Editar conta':(f.type==='receber'?'Nova conta a receber':'Nova conta a pagar')} icon="wallet" onClose={onClose}
      footer={<>
        {isEdit && <button className="btn btn-ghost" style={{marginRight:'auto',color:'var(--danger)',borderColor:'transparent'}} onClick={()=>{removeBill(initial.id);onClose();}}><Icon name="trash" size={15}/>Excluir</button>}
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>{isEdit?'Salvar':'Adicionar'}</button>
      </>}>
      <div className="grid" style={{gap:15}}>
        <div className="field"><label>Tipo</label>
          <div className="seg" style={{width:'100%'}}>
            <button className={f.type==='pagar'?'on':''} style={{flex:1}} onClick={()=>set('type','pagar')}>A pagar</button>
            <button className={f.type==='receber'?'on':''} style={{flex:1}} onClick={()=>set('type','receber')}>A receber</button>
          </div></div>
        <div className="field"><label>Descrição</label><input className="input" autoFocus value={f.desc} onChange={e=>set('desc',e.target.value)} placeholder={f.type==='receber'?'Ex.: Mensalidade — aluno':'Ex.: Anuidade OAB'}/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Valor (R$)</label><input className="input tnum" value={f.amount} onChange={e=>set('amount',e.target.value)} placeholder="0,00"/></div>
          <div className="field"><label>Vencimento</label><input className="input" type="date" value={f.due} onChange={e=>set('due',e.target.value)}/></div>
        </div>
        <div className="field"><label>Tag</label>
          <TagPicker tags={tags} value={f.tag} onChange={v=>set('tag',v)}
            onCreate={(label,color)=>{ const inc=f.type==='receber'; const id=(inc?'it':'et')+Date.now(); (inc?addIncomeTag:addExpenseTag)({id,label,color}); set('tag',id); }}/>
        </div>
        <div className="field"><label>Comprovante <span style={{color:'var(--faint)',fontWeight:400}}>(opcional)</span></label>
          {f.receipt ? <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <img src={f.receipt} alt="" style={{width:60,height:60,borderRadius:9,objectFit:'cover',border:'1px solid var(--border)'}}/>
            <button className="btn btn-ghost btn-sm" onClick={()=>set('receipt','')}><Icon name="x" size={14}/>Remover</button>
          </div> : <label className="btn btn-ghost btn-sm" style={{cursor:'pointer'}}><Icon name="camera" size={14}/>Anexar comprovante<input type="file" accept="image/*" style={{display:'none'}} onChange={e=>onReceipt(e.target.files[0])}/></label>}
        </div>
        <Toggle on={f.paid} onClick={()=>set('paid',!f.paid)} icon="check" label={f.type==='receber'?'Já recebido':'Já pago'} color="var(--ok)"/>
      </div>
    </Modal>
  );
}

function ContasTab(){
  const { state, toggleBillPaid } = useStore();
  const U=window.U;
  const [modal,setModal]=React.useState(null);
  const [tab,setTab]=React.useState('todas');
  const tagMap={}; state.expenseTags.forEach(t=>tagMap['e_'+t.id]=t); state.incomeTags.forEach(t=>tagMap['i_'+t.id]=t);
  const getTag=(b)=> b.type==='receber'?tagMap['i_'+b.tag]:tagMap['e_'+b.tag];

  let bills=state.bills.slice();
  if(tab!=='todas') bills=bills.filter(b=>b.type===tab);
  bills.sort((a,b)=>(a.paid?1:0)-(b.paid?1:0) || (a.due||'').localeCompare(b.due||''));

  const pagar=state.bills.filter(b=>b.type==='pagar'&&!b.paid);
  const receber=state.bills.filter(b=>b.type==='receber'&&!b.paid);
  const overdue=state.bills.filter(b=>!b.paid && U.daysFromToday(b.due)<0);
  const soon=state.bills.filter(b=>!b.paid && U.daysFromToday(b.due)>=0 && U.daysFromToday(b.due)<=7);
  const sum=(arr)=>arr.reduce((a,b)=>a+b.amount,0);

  return (
    <div>
      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:18}}>
        <KPI label="A pagar" icon="arrowU" value={U.brlShort(sum(pagar))} meta={pagar.length+' contas'} accent="var(--danger)"/>
        <KPI label="A receber" icon="arrowD" value={U.brlShort(sum(receber))} meta={receber.length+' contas'} accent="var(--ok)"/>
        <KPI label="Vencidas" icon="alert" value={overdue.length} meta={overdue.length?U.brlShort(sum(overdue)):'nenhuma'} accent={overdue.length?'var(--danger)':'var(--ok)'}/>
        <KPI label="Vencem em 7 dias" icon="clock" value={soon.length} meta={U.brlShort(sum(soon))} accent="var(--warn)"/>
      </div>

      {overdue.length>0 && <div className="notice" style={{marginBottom:16,background:'color-mix(in srgb,var(--danger) 8%,#fff)',borderColor:'color-mix(in srgb,var(--danger) 28%,#fff)'}}>
        <Icon name="alert" style={{color:'var(--danger)'}}/><div><b>{overdue.length} conta(s) vencida(s)</b> — {overdue.map(b=>b.desc).slice(0,3).join(', ')}{overdue.length>3?'…':''}. Marque como paga ou ajuste o vencimento.</div></div>}

      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:16}}>
        <div className="seg">
          {[['todas','Todas'],['pagar','A pagar'],['receber','A receber']].map(([k,l])=><button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)}>{l}</button>)}
        </div>
        <button className="btn btn-primary" style={{marginLeft:'auto'}} onClick={()=>setModal({defType:tab==='receber'?'receber':'pagar'})}><Icon name="plus" size={16}/>Nova conta</button>
      </div>

      <Card pad={false}>
        {bills.length===0 ? <div className="empty"><Icon name="wallet"/><div>Nenhuma conta aqui.</div></div> :
        <div style={{padding:'4px 18px 10px'}}>
          {bills.map(b=>{
            const tg=getTag(b); const d=U.daysFromToday(b.due); const over=!b.paid&&d<0;
            const statusColor=b.paid?'var(--ok)':(over?'var(--danger)':(d<=7?'var(--warn)':'var(--muted)'));
            const statusTxt=b.paid?(b.type==='receber'?'recebido':'pago'):(over?'vencida há '+(-d)+'d':(d===0?'vence hoje':d===1?'vence amanhã':'vence em '+d+'d'));
            return (
              <div key={b.id} style={{display:'flex',alignItems:'center',gap:13,padding:'12px 2px',borderBottom:'1px solid var(--border-2)',opacity:b.paid?.6:1}}>
                <button onClick={()=>toggleBillPaid(b.id)} title="Marcar" style={{width:21,height:21,flex:'0 0 21px',borderRadius:7,border:'1.8px solid '+(b.paid?'var(--ok)':'var(--border)'),background:b.paid?'var(--ok)':'#fff',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}>{b.paid&&<Icon name="check" size={13} strokeWidth={2.5}/>}</button>
                <span style={{width:6,height:34,borderRadius:3,background:b.type==='receber'?'var(--ok)':'var(--danger)',flex:'0 0 6px',opacity:.5}}></span>
                <div style={{flex:1,minWidth:0,cursor:'pointer'}} onClick={()=>setModal({initial:b})}>
                  <div style={{fontSize:13.5,fontWeight:550}}>{b.desc}</div>
                  <div style={{fontSize:11.5,color:'var(--faint)',display:'flex',gap:8,alignItems:'center',marginTop:1}}>
                    <span style={{color:statusColor,fontWeight:600}}>{statusTxt}</span>
                    <span>· {U.fmtDate(b.due,'long')}</span>
                    {tg && <span>· {tg.label}</span>}
                    {b.receipt && <span className="chip" style={{fontSize:9.5,padding:'0 6px',color:'var(--olive-700)'}}><Icon name="camera" size={10}/>comprovante</span>}
                  </div>
                </div>
                {b.receipt && <img src={b.receipt} alt="" onClick={()=>setModal({initial:b})} style={{width:34,height:34,borderRadius:7,objectFit:'cover',border:'1px solid var(--border)',cursor:'pointer'}}/>}
                <div className="tnum" style={{fontWeight:650,fontSize:14,color:b.type==='receber'?'var(--ok)':'var(--ink)'}}>{b.type==='receber'?'+':'−'} {U.brl(b.amount)}</div>
              </div>
            );
          })}
        </div>}
      </Card>

      {modal && <BillModal initial={modal.initial} defType={modal.defType} onClose={()=>setModal(null)}/>}
    </div>
  );
}
window.ContasTab = ContasTab;
