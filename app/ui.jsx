/* ===== Minha Vida — Shared UI ===== */
const P = {
  home:'M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9',
  calendar:'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5zM4 9.5h16M8 3.5v3M16 3.5v3',
  folder:'M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5h7A1.5 1.5 0 0 1 19 9v8.5A1.5 1.5 0 0 1 17.5 19h-13A1.5 1.5 0 0 1 3 17.5z',
  wallet:'M3 7.5A1.5 1.5 0 0 1 4.5 6H18a1 1 0 0 1 1 1v1.5M3 7.5v9A1.5 1.5 0 0 0 4.5 18h14A1.5 1.5 0 0 0 20 16.5v-7A1.5 1.5 0 0 0 18.5 8H4.5M16 12.5h.01M14.5 12.5a1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 1-3 0',
  mail:'M3.5 7A1.5 1.5 0 0 1 5 5.5h14A1.5 1.5 0 0 1 20.5 7v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17zM4 7l8 6 8-6',
  search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4',
  plug:'M9 3v6M15 3v6M6 9h12v3a6 6 0 0 1-12 0zM12 18v3',
  users:'M8 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 8 11ZM2.5 19a5.5 5.5 0 0 1 11 0M16 10.5a3 3 0 0 0 0-6M17 19h4.5a5 5 0 0 0-4-4.9',
  target:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 12h.01',
  book:'M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM19 18v3H6.5A1.5 1.5 0 0 1 5 19.5',
  layers:'M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 16.5l9 5 9-5',
  play:'M7 4.5v15l13-7.5z',
  stamp:'M9 3.5h6a2 2 0 0 1 2 2c0 2-2 3-2 5h-6c0-2-2-3-2-5a2 2 0 0 1 2-2ZM5 16h14M5 20h14v-2.5a1.5 1.5 0 0 0-1.5-1.5h-11A1.5 1.5 0 0 0 5 17.5z',
  camera:'M4.5 8A1.5 1.5 0 0 1 6 6.5h1.5l1.2-2h6.6l1.2 2H18A1.5 1.5 0 0 1 19.5 8v9A1.5 1.5 0 0 1 18 18.5H6A1.5 1.5 0 0 1 4.5 17zM12 16a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 12 16Z',
  bookopen:'M12 6c-2-1.3-4.5-1.5-7-1v12c2.5-.5 5-.3 7 1 2-1.3 4.5-1.5 7-1V5c-2.5-.5-5-.3-7 1zM12 6v13',
  scale:'M12 3v18M7 7h10M12 7 8 14a3 3 0 0 0 6 0zM12 7l4 7a3 3 0 0 0 6 0zM12 7 8 14M5 21h14',
  megaphone:'M4 10v4a1 1 0 0 0 1 1h2l8 4V5L7 9H5a1 1 0 0 0-1 1ZM18 9a4 4 0 0 1 0 6',
  heart:'M12 20S4 14.5 4 9a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5.5-8 11-8 11Z',
  plus:'M12 5v14M5 12h14',
  check:'M5 12.5 10 17 19 7',
  x:'M6 6l12 12M18 6 6 18',
  chevronR:'M9 6l6 6-6 6',
  chevronL:'M15 6l-6 6 6 6',
  chevronD:'M6 9l6 6 6-6',
  star:'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5V12l3 2',
  alert:'M12 3 2.5 20h19zM12 10v4M12 17h.01',
  video:'M4.5 7.5A1.5 1.5 0 0 1 6 6h8a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 14 18H6a1.5 1.5 0 0 1-1.5-1.5zM15.5 10l4-2.5v9l-4-2.5',
  trash:'M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M6.5 7l.8 11A1.5 1.5 0 0 0 8.8 19.5h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7',
  edit:'M5 19h3l9.5-9.5a2 2 0 0 0-3-3L5 16zM14 6.5l3 3',
  trending:'M3 17l5.5-5.5 3.5 3.5L21 6M21 6h-5M21 6v5',
  link:'M9 15l6-6M10.5 6.5l1.8-1.8a3.5 3.5 0 0 1 5 5l-1.8 1.8M13.5 17.5l-1.8 1.8a3.5 3.5 0 0 1-5-5l1.8-1.8',
  sparkles:'M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6zM18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z',
  bell:'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM9.5 19a2.5 2.5 0 0 0 5 0',
  settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1Z',
  filter:'M4 6h16M7 12h10M10 18h4',
  arrowU:'M12 19V5M6 11l6-6 6 6',
  arrowD:'M12 5v14M6 13l6 6 6-6',
  send:'M21 4 3 11l6 2.5L12 20l3-7z',
  drive:'M8 4h8l8 14h-8zM8 4 1 18h8M9 18l4-7',
  doc:'M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM13 3v5h5M9 13h6M9 16h6',
  flag:'M5 21V4M5 4c3-1.5 6 1.5 9 0v8c-3 1.5-6-1.5-9 0',
  dollar:'M12 3v18M16 7a3.5 3.5 0 0 0-3.5-2.5h-1A3 3 0 0 0 11 10h2a3 3 0 0 1 0 6h-1A3.5 3.5 0 0 1 8.5 13',
  grid:'M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7zM4 13h7v7H4z',
  list:'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  copy:'M9 9h10v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  external:'M14 4h6v6M20 4l-8 8M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  activity:'M3 12h4l2.5-7 5 14 2.5-7H21',
  globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.5 12h17M12 3c2.6 2.4 2.6 15.6 0 18M12 3c-2.6 2.4-2.6 15.6 0 18',
  briefcase:'M4 8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5zM9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M4 12.5h16',
  sun:'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 2.5v2M12 19.5v2M4.5 4.5l1.5 1.5M18 18l1.5 1.5M2.5 12h2M19.5 12h2M4.5 19.5 6 18M18 6l1.5-1.5',
  flame:'M12 21c3.3 0 6-2.4 6-6 0-3-2-5-3-8-2 1.5-3 3-3 4.5C11 9 10 7 9.5 6 8 8 6 10 6 13.5 6 18 8.7 21 12 21Z',
  board:'M4.5 5A1.5 1.5 0 0 1 6 3.5h12A1.5 1.5 0 0 1 19.5 5v14A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19zM9.5 7v8M14.5 7v4',
};
function Icon({name, size=18, style, className, strokeWidth=1.7}){
  const d = P[name] || '';
  return React.createElement('svg',{width:size,height:size,viewBox:'0 0 24 24',fill:'none',
    stroke:'currentColor',strokeWidth,strokeLinecap:'round',strokeLinejoin:'round',style,className},
    d.split('M').filter(Boolean).map((seg,i)=>React.createElement('path',{key:i,d:'M'+seg})));
}

function ProjChip({pk, sm}){
  const p = window.U.PROJ_BY_KEY[pk];
  if(!p) return null;
  return (
    <span className="chip" style={{fontSize:sm?10.5:11.5, padding:sm?'2px 8px':'3px 10px'}}>
      <span className="dot" style={{background:p.color}}></span>{p.label}
    </span>
  );
}

function PriorityBadge({priority, sm}){
  const PR = window.PRIORITIES[priority];
  if(!PR) return null;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:sm?9.5:10.5,fontWeight:650,letterSpacing:'.02em',
      textTransform:'uppercase',color:PR.color,background:`color-mix(in srgb,${PR.color} 12%,#fff)`,padding:'2px 8px',borderRadius:20,whiteSpace:'nowrap'}}>
      <span style={{width:6,height:6,borderRadius:50,background:PR.color,flex:'0 0 6px'}}></span>{PR.label}
    </span>
  );
}

function Modal({title, icon, onClose, children, footer, wide}){
  React.useEffect(()=>{
    const h=(e)=>{ if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[]);
  return (
    <div className="modal-scrim" onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className={'modal'+(wide?' wide':'')}>
        <div className="modal-h">
          {icon && <span style={{width:34,height:34,borderRadius:10,background:'var(--olive-50)',color:'var(--olive)',display:'grid',placeItems:'center',flex:'0 0 34px'}}><Icon name={icon} size={19}/></span>}
          <h3 style={{flex:1}}>{title}</h3>
          <button className="btn btn-icon btn-subtle" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <div className="modal-b">{children}</div>
        {footer && <div className="modal-f">{footer}</div>}
      </div>
    </div>
  );
}

function KPI({label, icon, value, meta, accent}){
  return (
    <div className="kpi">
      <div className="kpi-label">{icon && <Icon name={icon} size={14} style={{color:accent||'var(--olive)'}}/>}{label}</div>
      <div className="kpi-val tnum" style={accent?{color:accent}:null}>{value}</div>
      {meta && <div className="kpi-meta">{meta}</div>}
    </div>
  );
}

function Card({children, className='', style, pad=true}){
  return <div className={'card '+className} style={style}>{pad?<div className="card-pad">{children}</div>:children}</div>;
}

function SectionH({title, sub, action}){
  return (
    <div className="card-h">
      <div>
        <h3>{title}</h3>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {action && <div style={{marginLeft:'auto'}}>{action}</div>}
    </div>
  );
}

// donut chart (svg) — segments: [{value,color,label}]
function Donut({segments, size=140, thickness=18, center}){
  const total = segments.reduce((a,s)=>a+s.value,0) || 1;
  const r = (size-thickness)/2, cx=size/2, cy=size/2, circ=2*Math.PI*r;
  let off=0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-2)" strokeWidth={thickness}/>
      {segments.map((s,i)=>{
        const len = (s.value/total)*circ;
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
          strokeDasharray={`${len} ${circ-len}`} strokeDashoffset={-off}
          transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt"/>;
        off += len; return el;
      })}
      {center && <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        style={{fontSize:15,fontWeight:700,fill:'var(--ink)',fontVariantNumeric:'tabular-nums'}}>{center}</text>}
    </svg>
  );
}

function Lightbox({images, index, onClose}){
  const [i,setI]=React.useState(index||0);
  React.useEffect(()=>{
    const h=(e)=>{ if(e.key==='Escape')onClose(); if(e.key==='ArrowRight')setI(v=>(v+1)%images.length); if(e.key==='ArrowLeft')setI(v=>(v-1+images.length)%images.length); };
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[images.length]);
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:200,background:'rgba(20,21,16,.86)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:40}}>
      <button onClick={onClose} style={{position:'absolute',top:20,right:24,width:40,height:40,borderRadius:50,border:'none',background:'rgba(255,255,255,.12)',color:'#fff',cursor:'pointer',display:'grid',placeItems:'center'}}><Icon name="x" size={20}/></button>
      {images.length>1 && <button onClick={e=>{e.stopPropagation();setI((i-1+images.length)%images.length);}} style={{position:'absolute',left:20,width:44,height:44,borderRadius:50,border:'none',background:'rgba(255,255,255,.12)',color:'#fff',cursor:'pointer',display:'grid',placeItems:'center'}}><Icon name="chevronL" size={22}/></button>}
      <img src={images[i]} alt="" onClick={e=>e.stopPropagation()} style={{maxWidth:'90%',maxHeight:'90%',borderRadius:12,boxShadow:'0 20px 60px rgba(0,0,0,.5)'}}/>
      {images.length>1 && <button onClick={e=>{e.stopPropagation();setI((i+1)%images.length);}} style={{position:'absolute',right:20,width:44,height:44,borderRadius:50,border:'none',background:'rgba(255,255,255,.12)',color:'#fff',cursor:'pointer',display:'grid',placeItems:'center'}}><Icon name="chevronR" size={22}/></button>}
      {images.length>1 && <div style={{position:'absolute',bottom:24,color:'rgba(255,255,255,.8)',fontSize:13,fontWeight:500}}>{i+1} / {images.length}</div>}
    </div>
  );
}

Object.assign(window, { Icon, ProjChip, PriorityBadge, Modal, KPI, Card, SectionH, Donut, Lightbox });
