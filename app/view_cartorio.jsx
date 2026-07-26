/* ===== Minha Vida — Painel do Cartório ===== */
function CartorioView(){
  const { state, toggleConnect } = useStore();
  const U=window.U;
  const connected = !!state.settings.connected.cartorio;
  const SITE='https://cartoriocurralqueimado.netlify.app/';

  // dados reais: compromissos do cartório vindos da agenda
  const coms=state.commitments.filter(c=>c.project==='cartorio').sort((a,b)=>(a.date+'T'+(a.time||'00')).localeCompare(b.date+'T'+(b.time||'00')));
  const next=coms.filter(c=>!c.done&&U.daysFromToday(c.date)>=0);

  // métricas (preenchidas pelo site quando conectado; em branco até conectar)
  const metrics=[
    {label:'Registros no mês', value:connected?'34':'—', icon:'stamp', accent:'var(--c-cartorio)'},
    {label:'Certidões emitidas', value:connected?'128':'—', icon:'doc', accent:'var(--c-vdec)'},
    {label:'Pendências', value:connected?'5':'—', icon:'alert', accent:'var(--warn)'},
    {label:'Receita do mês', value:connected?'R$ 18,2k':'—', icon:'wallet', accent:'var(--ok)'},
  ];
  const servicos=connected?[
    {tipo:'Casamento', nome:'Habilitação — casal Souza', status:'Em análise', color:'var(--warn)'},
    {tipo:'Nascimento', nome:'Registro — bebê Oliveira', status:'Concluído', color:'var(--ok)'},
    {tipo:'Óbito', nome:'Registro e certidão', status:'Concluído', color:'var(--ok)'},
    {tipo:'Certidão', nome:'2ª via de nascimento', status:'Aguardando retirada', color:'var(--c-vdec)'},
  ]:[];

  return (
    <div className="view-enter">
      {/* header / conexão */}
      <div className="card" style={{padding:0,marginBottom:18,overflow:'hidden'}}>
        <div style={{height:6,background:'var(--c-cartorio)'}}></div>
        <div style={{padding:'20px 22px',display:'flex',gap:15,alignItems:'center',flexWrap:'wrap'}}>
          <span style={{width:48,height:48,borderRadius:12,background:'color-mix(in srgb,var(--c-cartorio) 14%,#fff)',color:'var(--c-cartorio)',display:'grid',placeItems:'center',flex:'0 0 48px'}}><Icon name="stamp" size={24}/></span>
          <div style={{flex:1,minWidth:0}}>
            <h2 style={{fontSize:20,fontWeight:650,letterSpacing:'-.02em'}}>Cartório Curral Queimado</h2>
            <a href={SITE} target="_blank" rel="noopener" className="link" style={{fontSize:12.5}}>cartoriocurralqueimado.netlify.app <Icon name="external" size={12} style={{verticalAlign:'-2px'}}/></a>
          </div>
          <span className="chip" style={{fontSize:11,color:connected?'var(--ok)':'var(--faint)',borderColor:connected?'color-mix(in srgb,var(--ok) 30%,#fff)':'var(--border)'}}><span className="dot" style={{background:connected?'var(--ok)':'var(--faint)'}}></span>{connected?'Conectado':'Não conectado'}</span>
          <button className={'btn '+(connected?'btn-ghost':'btn-primary')} onClick={()=>toggleConnect('cartorio')}>{connected?'Desconectar':<><Icon name="link" size={15}/>Conectar site</>}</button>
        </div>
      </div>

      {!connected && <div className="notice" style={{marginBottom:18}}><Icon name="alert"/><div><b>Painel aguardando conexão.</b> Conecte o site do cartório (com a ajuda do seu desenvolvedor) para este painel mostrar os registros, certidões e a receita reais automaticamente. <i>Requer conexão real.</i></div></div>}

      {/* métricas */}
      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:18}}>
        {metrics.map((m,i)=>(
          <div key={i} className="kpi" style={{position:'relative'}}>
            <div className="kpi-label"><Icon name={m.icon} size={14} style={{color:m.accent}}/>{m.label}</div>
            <div className="kpi-val tnum" style={{color:m.accent,filter:connected?'none':'none',opacity:connected?1:.5}}>{m.value}</div>
            <div className="kpi-meta">{connected?'dados do site':'aguardando conexão'}</div>
          </div>
        ))}
      </div>

      <div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:18,alignItems:'start'}}>
        {/* compromissos reais */}
        <Card>
          <SectionH title="Compromissos do cartório" sub={next.length+' próximos · da sua agenda'}/>
          {next.length===0 ? <div className="empty"><Icon name="calendar"/><div>Nada agendado.</div></div> :
            next.slice(0,8).map(c=>(
              <div key={c.id} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 0',borderBottom:'1px solid var(--border-2)'}}>
                <span style={{width:8,height:8,borderRadius:50,background:'var(--c-cartorio)',flex:'0 0 8px'}}></span>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:550}}>{c.title}</div><div style={{fontSize:11,color:'var(--faint)'}}>{U.fmtDate(c.date,'long')}{c.time?' · '+c.time:''}</div></div>
                <span style={{fontSize:11,color:'var(--olive-700)',fontWeight:600}}>{U.relDate(c.date)}</span>
              </div>
            ))}
        </Card>
        {/* serviços (do site quando conectado) */}
        <Card>
          <SectionH title="Serviços recentes" sub={connected?'do site':'requer conexão'}/>
          {servicos.length===0 ? <div className="empty"><Icon name="stamp"/><div>Conecte o site para ver os registros e serviços reais.</div></div> :
          servicos.map((s,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 0',borderBottom:i<servicos.length-1?'1px solid var(--border-2)':'none'}}>
              <span style={{width:30,height:30,borderRadius:8,background:`color-mix(in srgb,${s.color} 13%,#fff)`,color:s.color,display:'grid',placeItems:'center',flex:'0 0 30px',fontSize:9.5,fontWeight:700}}>{s.tipo.slice(0,3).toUpperCase()}</span>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:12.5,fontWeight:550}}>{s.nome}</div><div style={{fontSize:11,color:'var(--faint)'}}>{s.tipo}</div></div>
              <span className="chip" style={{fontSize:10,color:s.color,borderColor:`color-mix(in srgb,${s.color} 30%,#fff)`}}>{s.status}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
window.CartorioView = CartorioView;
