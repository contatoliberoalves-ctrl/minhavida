/* ===== Minha Vida — Forms (Commitment + Transaction modals) ===== */
function fileToDataURL(file, max=1100, q=0.82){
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width,h=img.height;
        if(w>max||h>max){ const s=max/Math.max(w,h); w=Math.round(w*s); h=Math.round(h*s); }
        const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
        cv.getContext('2d').drawImage(img,0,0,w,h);
        try{ res(cv.toDataURL('image/jpeg',q)); }catch(e){ res(r.result); }
      };
      img.onerror=()=>res(r.result);
      img.src=r.result;
    };
    r.onerror=rej;
    r.readAsDataURL(file);
  });
}
function normalizeUrl(u){
  u=u.trim(); if(!u) return '';
  if(!/^https?:\/\//i.test(u) && !/^mailto:/i.test(u)) u='https://'+u;
  return u;
}
function urlLabel(u){
  try{ const h=new URL(u).hostname.replace(/^www\./,''); return h; }catch(e){ return u; }
}

function Attachments({links, images, onLinks, onImages}){
  const [url,setUrl]=React.useState('');
  const [drag,setDrag]=React.useState(false);
  const fileRef=React.useRef(null);
  const addLink=()=>{ const u=normalizeUrl(url); if(u){ onLinks([...(links||[]), u]); setUrl(''); } };
  const addFiles=async(fileList)=>{
    const arr=[...fileList].filter(f=>f.type.startsWith('image/')).slice(0,8);
    const urls=[]; for(const f of arr){ try{ urls.push(await fileToDataURL(f)); }catch(e){} }
    if(urls.length) onImages([...(images||[]), ...urls]);
  };
  return (
    <div className="field">
      <label>Anexos <span style={{color:'var(--faint)',fontWeight:400}}>(links e imagens)</span></label>
      {/* links */}
      <div style={{display:'flex',gap:8,marginBottom:(links&&links.length)?10:0}}>
        <div style={{position:'relative',flex:1}}>
          <Icon name="link" size={15} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--muted)'}}/>
          <input className="input" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addLink();}}}
            placeholder="Colar um link (Drive, Doc, vídeo...)" style={{paddingLeft:33}}/>
        </div>
        <button type="button" className="btn btn-subtle" onClick={addLink}><Icon name="plus" size={15}/>Link</button>
      </div>
      {links&&links.length>0 && <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:12}}>
        {links.map((l,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:9,background:'var(--surface-2)',border:'1px solid var(--border-2)',borderRadius:9,padding:'7px 11px'}}>
            <Icon name="link" size={14} style={{color:'var(--olive)',flex:'0 0 14px'}}/>
            <a href={l} target="_blank" rel="noopener" className="link" style={{flex:1,minWidth:0,fontSize:12.5,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{urlLabel(l)}</a>
            <button type="button" onClick={()=>onLinks(links.filter((_,j)=>j!==i))} style={{background:'none',border:'none',color:'var(--faint)',cursor:'pointer',padding:0}}><Icon name="x" size={14}/></button>
          </div>
        ))}
      </div>}
      {/* images */}
      <div onClick={()=>fileRef.current&&fileRef.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files);}}
        style={{border:'1.5px dashed '+(drag?'var(--olive)':'var(--border)'),borderRadius:11,padding:'14px',textAlign:'center',cursor:'pointer',background:drag?'var(--olive-50)':'var(--surface-2)',transition:'all .14s'}}>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>{addFiles(e.target.files);e.target.value='';}}/>
        <Icon name="camera" size={20} style={{color:'var(--muted)'}}/>
        <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>Arraste imagens aqui ou <span style={{color:'var(--olive-700)',fontWeight:600}}>clique para escolher</span></div>
      </div>
      {images&&images.length>0 && <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:10}}>
        {images.map((src,i)=>(
          <div key={i} style={{position:'relative',width:74,height:74,borderRadius:10,overflow:'hidden',border:'1px solid var(--border)'}}>
            <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            <button type="button" onClick={()=>onImages(images.filter((_,j)=>j!==i))}
              style={{position:'absolute',top:3,right:3,width:20,height:20,borderRadius:50,border:'none',background:'rgba(35,36,29,.7)',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}><Icon name="x" size={12} strokeWidth={2.5}/></button>
          </div>
        ))}
      </div>}
    </div>
  );
}

function CommitmentModal({initial, onClose}){
  const { addCommitment, updateCommitment, removeCommitment, state } = useStore();
  const isEdit = !!(initial && initial.id);
  const [f, setF] = React.useState(()=>({
    title:'', date: window.U.TODAY, time:'', project:'mentorias', desc:'', priority:'', section:'', meet:false, done:false, links:[], images:[], studentId:'',
    ...(initial||{}),
    priority: initial ? (initial.priority || (initial.urgent?'urgente':'')) : '',
    links: (initial&&initial.links)||[], images: (initial&&initial.images)||[],
  }));
  const set=(k,v)=>setF(s=>({...s,[k]:v}));
  const save=()=>{
    if(!f.title.trim()) return;
    const payload={...f, urgent: f.priority==='urgente'};
    if(isEdit) updateCommitment(initial.id, payload); else addCommitment(payload);
    onClose();
  };
  const projects = window.SEED.PROJECTS;
  const sections = window.sectionsFor(f.project, state.customSections);
  const PR = window.PRIORITIES;
  return (
    <Modal title={isEdit?'Editar compromisso':'Novo compromisso'} icon="calendar" onClose={onClose}
      footer={<>
        {isEdit && <button className="btn btn-ghost" style={{marginRight:'auto',color:'var(--danger)',borderColor:'transparent'}}
          onClick={()=>{ removeCommitment(initial.id); onClose(); }}><Icon name="trash" size={15}/>Excluir</button>}
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>{isEdit?'Salvar':'Adicionar'}</button>
      </>}>
      <div className="grid" style={{gap:15}}>
        <div className="field">
          <label>Título</label>
          <input className="input" autoFocus value={f.title} onChange={e=>set('title',e.target.value)} placeholder="Ex.: Mentoria — Gabriela"/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>Data</label>
            <input className="input" type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></div>
          <div className="field"><label>Horário <span style={{color:'var(--faint)',fontWeight:400}}>(opcional)</span></label>
            <input className="input" type="time" value={f.time} onChange={e=>set('time',e.target.value)}/></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns: sections.length?'1fr 1fr':'1fr',gap:13}}>
          <div className="field">
            <label>Projeto / área</label>
            <select className="input" value={f.project} onChange={e=>{set('project',e.target.value);set('section','');}}>
              {projects.map(p=><option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          {sections.length>0 && <div className="field">
            <label>Frente <span style={{color:'var(--faint)',fontWeight:400}}>(opcional)</span></label>
            <select className="input" value={f.section} onChange={e=>set('section',e.target.value)}>
              <option value="">— Sem frente —</option>
              {sections.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>}
        </div>
        {(()=>{ const studs=(state.students||[]).filter(x=>x.course===f.project); return studs.length>0 ? (
          <div className="field">
            <label>Aluno <span style={{color:'var(--faint)',fontWeight:400}}>(opcional)</span></label>
            <select className="input" value={f.studentId||''} onChange={e=>set('studentId',e.target.value)}>
              <option value="">— Nenhum —</option>
              {studs.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
        ) : null; })()}
        <div className="field">
          <label>Prioridade</label>
          <div className="pill-row">
            <button className="chip" onClick={()=>set('priority','')} style={{cursor:'pointer',borderColor:f.priority===''?'var(--ink-2)':'var(--border)',background:f.priority===''?'var(--surface-2)':'#fff',color:f.priority===''?'var(--ink)':'var(--muted)',fontWeight:f.priority===''?600:500,padding:'7px 13px'}}>Normal</button>
            {['espera','quase','urgente'].map(k=>(
              <button key={k} className="chip" onClick={()=>set('priority',k)} style={{cursor:'pointer',
                borderColor:f.priority===k?PR[k].color:'var(--border)',
                background:f.priority===k?`color-mix(in srgb,${PR[k].color} 13%,#fff)`:'#fff',
                color:f.priority===k?PR[k].color:'var(--ink-2)',fontWeight:f.priority===k?600:550,padding:'7px 13px'}}>
                <span className="dot" style={{background:PR[k].color}}></span>{PR[k].label}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Descrição <span style={{color:'var(--faint)',fontWeight:400}}>(opcional)</span></label>
          <textarea className="input" value={f.desc} onChange={e=>set('desc',e.target.value)} placeholder="Detalhes, pauta, links..."/>
        </div>
        <Attachments links={f.links} images={f.images} onLinks={v=>set('links',v)} onImages={v=>set('images',v)}/>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <Toggle on={f.meet} onClick={()=>set('meet',!f.meet)} icon="video" label="Criar link do Meet" color="var(--c-vdec)"/>
          <Toggle on={f.done} onClick={()=>set('done',!f.done)} icon="check" label="Concluído" color="var(--ok)"/>
        </div>
        {f.meet && <div className="notice"><Icon name="alert"/><div><b>Link do Meet & convite na Agenda:</b> ao conectar sua conta Google, este compromisso gera automaticamente o evento, o link do Meet e o lembrete. <i>Requer conexão real (aba Integrações).</i></div></div>}
      </div>
    </Modal>
  );
}

function Toggle({on, onClick, icon, label, color}){
  return (
    <button onClick={onClick} className="chip" style={{
      cursor:'pointer', borderColor:on?color:'var(--border)',
      background:on?`color-mix(in srgb,${color} 12%,#fff)`:'var(--surface)',
      color:on?color:'var(--ink-2)', fontWeight:on?600:550, padding:'7px 13px'
    }}>
      <Icon name={icon} size={15}/>{label}
    </button>
  );
}

const TAG_COLORS = [
  'oklch(0.62 0.13 28)','oklch(0.66 0.13 55)','oklch(0.70 0.12 85)','var(--olive)',
  'oklch(0.60 0.11 150)','oklch(0.60 0.09 195)','oklch(0.58 0.10 245)','oklch(0.55 0.11 285)',
  'oklch(0.56 0.12 320)','oklch(0.62 0.12 10)','oklch(0.52 0.05 280)','oklch(0.45 0.02 250)',
];
function TagPicker({tags, value, onChange, onCreate, allowRemove, onRemove}){
  const [creating,setCreating]=React.useState(false);
  const [name,setName]=React.useState('');
  const [color,setColor]=React.useState(TAG_COLORS[0]);
  const create=()=>{ if(name.trim()){ onCreate(name.trim(), color); setName(''); setCreating(false); } };
  return (
    <div>
      <div className="pill-row">
        {tags.map(t=>(
          <button key={t.id} type="button" className="chip" onClick={()=>onChange(t.id)} style={{
            cursor:'pointer', borderColor:value===t.id?t.color:'var(--border)',
            background:value===t.id?`color-mix(in srgb,${t.color} 14%,#fff)`:'#fff',
            color:value===t.id?t.color:'var(--ink-2)', fontWeight:value===t.id?600:550
          }}><span className="tag-dot" style={{background:t.color}}></span>{t.label}</button>
        ))}
        <button type="button" className="chip" onClick={()=>setCreating(c=>!c)} style={{cursor:'pointer',borderStyle:'dashed',color:'var(--muted)'}}><Icon name="plus" size={13}/>Nova tag</button>
      </div>
      {creating && (
        <div style={{marginTop:11,padding:'12px 13px',border:'1px solid var(--border)',borderRadius:11,background:'var(--surface-2)'}}>
          <input className="input" autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')create();}} placeholder="Nome da tag" style={{marginBottom:10}}/>
          <div style={{fontSize:11,fontWeight:550,color:'var(--ink-2)',marginBottom:7}}>Escolha uma cor</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
            {TAG_COLORS.map(c=>(
              <button key={c} type="button" onClick={()=>setColor(c)} style={{width:26,height:26,borderRadius:8,background:c,border:color===c?'2px solid var(--ink)':'2px solid transparent',cursor:'pointer',outline:color===c?'2px solid #fff':'none',outlineOffset:'-4px'}}></button>
            ))}
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setCreating(false)}>Cancelar</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={create}><Icon name="check" size={14}/>Criar tag</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TxModal({type, initial, onClose}){
  const { addTx, updateTx, removeTx, addExpenseTag, addIncomeTag, state } = useStore();
  const isEdit = !!(initial && initial.id);
  const tags = type==='income' ? state.incomeTags : state.expenseTags;
  const cards = state.cards||[];
  const [f,setF] = React.useState(()=>({
    type, date:window.U.TODAY, desc:'', amount:'', tag:tags[0]?.id||'',
    freq: type==='expense'?'mensal':undefined,
    card:'', parcelas:1, parcelaAtual:1, recorrente:false,
    ...(initial||{})
  }));
  const set=(k,v)=>setF(s=>({...s,[k]:v}));
  const onCard = type==='expense' && !!f.card;
  const save=()=>{
    const amt = parseFloat(String(f.amount).replace(',','.'))||0;
    if(!f.desc.trim()||!amt) return;
    let payload={...f, amount:amt};
    if(type==='expense'){
      if(f.card){ payload.freq='mensal'; if(f.recorrente){payload.parcelas=1;} }
      else { payload.card=''; payload.recorrente=false; payload.parcelas=1; }
    }
    if(isEdit) updateTx(initial.id, payload); else addTx(payload);
    onClose();
  };
  const isInc = type==='income';
  return (
    <Modal title={isEdit?'Editar lançamento':(isInc?'Novo recebimento':'Novo gasto')} icon={isInc?'arrowD':'arrowU'} onClose={onClose}
      footer={<>
        {isEdit && <button className="btn btn-ghost" style={{marginRight:'auto',color:'var(--danger)',borderColor:'transparent'}}
          onClick={()=>{ removeTx(initial.id); onClose(); }}><Icon name="trash" size={15}/>Excluir</button>}
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={15}/>{isEdit?'Salvar':'Adicionar'}</button>
      </>}>
      <div className="grid" style={{gap:15}}>
        <div className="field"><label>Descrição</label>
          <input className="input" autoFocus value={f.desc} onChange={e=>set('desc',e.target.value)} placeholder={isInc?'Ex.: Mensalidade VDE':'Ex.: Mercado, Netflix, Notebook...'}/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <div className="field"><label>{onCard&&!f.recorrente?'Valor da parcela (R$)':'Valor (R$)'}</label>
            <input className="input tnum" inputMode="decimal" value={f.amount} onChange={e=>set('amount',e.target.value)} placeholder="0,00"/></div>
          <div className="field"><label>Data</label>
            <input className="input" type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></div>
        </div>

        {type==='expense' && <>
          {/* forma de pagamento */}
          <div className="field"><label>Forma de pagamento</label>
            <div className="seg" style={{width:'100%'}}>
              <button className={!f.card?'on':''} style={{flex:1}} onClick={()=>set('card','')}>À vista / dinheiro</button>
              <button className={f.card?'on':''} style={{flex:1}} onClick={()=>set('card', f.card||cards[0]?.id||'')}>Cartão de crédito</button>
            </div>
          </div>

          {!onCard && <div className="field"><label>Tipo de gasto</label>
            <select className="input" value={f.freq} onChange={e=>set('freq',e.target.value)}>
              <option value="diario">Diário / avulso</option>
              <option value="mensal">Fixo mensal</option>
              <option value="semestral">Fixo semestral</option>
              <option value="anual">Fixo anual</option>
            </select></div>}

          {onCard && <div style={{background:'var(--surface-2)',border:'1px solid var(--border-2)',borderRadius:12,padding:14,display:'grid',gap:13}}>
            <div className="field" style={{margin:0}}><label>Cartão</label>
              {cards.length===0 ? <div style={{fontSize:12,color:'var(--muted)'}}>Nenhum cartão cadastrado. Cadastre na aba <b>Cartões</b> de Finanças.</div> :
              <div className="pill-row">
                {cards.map(c=>(
                  <button key={c.id} className="chip" onClick={()=>set('card',c.id)} style={{cursor:'pointer',borderColor:f.card===c.id?c.color:'var(--border)',background:f.card===c.id?`color-mix(in srgb,${c.color} 13%,#fff)`:'#fff',color:f.card===c.id?c.color:'var(--ink-2)',fontWeight:f.card===c.id?600:550}}>
                    <span className="tag-dot" style={{background:c.color}}></span>{c.name}</button>
                ))}
              </div>}
            </div>
            <div className="field" style={{margin:0}}><label>Cobrança</label>
              <div className="seg" style={{width:'100%'}}>
                <button className={f.recorrente?'on':''} style={{flex:1}} onClick={()=>set('recorrente',true)}>Assinatura mensal</button>
                <button className={!f.recorrente?'on':''} style={{flex:1}} onClick={()=>set('recorrente',false)}>Parcelado</button>
              </div>
            </div>
            {f.recorrente ? <div style={{fontSize:11.5,color:'var(--muted)',display:'flex',gap:7,alignItems:'center'}}><Icon name="clock" size={14}/>Cobrado todo mês até você cancelar (ex.: Netflix, Spotify).</div>
            : <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
                <div className="field" style={{margin:0}}><label>Nº de parcelas</label>
                  <input className="input tnum" type="number" min="1" max="48" value={f.parcelas} onChange={e=>set('parcelas',Math.max(1,parseInt(e.target.value)||1))}/></div>
                <div className="field" style={{margin:0}}><label>Parcela atual</label>
                  <input className="input tnum" type="number" min="1" max={f.parcelas} value={f.parcelaAtual} onChange={e=>set('parcelaAtual',Math.max(1,parseInt(e.target.value)||1))}/></div>
              </div>}
          </div>}
        </>}

        <div className="field"><label>Tag</label>
          <TagPicker tags={tags} value={f.tag} onChange={v=>set('tag',v)}
            onCreate={(label,color)=>{ const id=(isInc?'it':'et')+Date.now(); (isInc?addIncomeTag:addExpenseTag)({id,label,color}); set('tag',id); }}/>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { CommitmentModal, TxModal, Toggle });
