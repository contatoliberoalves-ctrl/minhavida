/* ===== Minha Vida — Utils ===== */
(function(){
const PROJ_BY_KEY = {};
(window.SEED?window.SEED.PROJECTS:[]).forEach(p=>PROJ_BY_KEY[p.key]=p);

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_SHORT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DOW = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DOW_LONG = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

function parseDate(s){ // 'YYYY-MM-DD' -> Date (local, noon to avoid tz)
  if(!s) return null;
  const [y,m,d]=s.split('-').map(Number);
  return new Date(y,m-1,d,12,0,0);
}
function toISO(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function fmtDate(s,opt){ // opt: 'short' | 'long' | 'full'
  const d=parseDate(s); if(!d) return '';
  if(opt==='long') return d.getDate()+' de '+MONTHS[d.getMonth()];
  if(opt==='full') return DOW_LONG[d.getDay()]+', '+d.getDate()+' de '+MONTHS[d.getMonth()]+' de '+d.getFullYear();
  if(opt==='dow') return DOW[d.getDay()]+', '+d.getDate()+' '+MONTHS_SHORT[d.getMonth()];
  return d.getDate()+' '+MONTHS_SHORT[d.getMonth()];
}
function brl(n){
  return 'R$ '+ (n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function brlShort(n){
  const v=n||0;
  if(Math.abs(v)>=1000) return 'R$ '+(v/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+'k';
  return 'R$ '+v.toLocaleString('pt-BR',{maximumFractionDigits:0});
}
const TODAY = '2026-06-13'; // data atual do projeto
function daysFromToday(s){
  const a=parseDate(TODAY), b=parseDate(s);
  return Math.round((b-a)/86400000);
}
function relDate(s){
  const n=daysFromToday(s);
  if(n===0) return 'Hoje';
  if(n===1) return 'Amanhã';
  if(n===-1) return 'Ontem';
  if(n>1 && n<7) return 'Em '+n+' dias';
  if(n<0) return 'Há '+(-n)+' dias';
  return fmtDate(s,'long');
}

window.U = { PROJ_BY_KEY, MONTHS, MONTHS_SHORT, DOW, DOW_LONG, parseDate, toISO, fmtDate, brl, brlShort, TODAY, daysFromToday, relDate };

// Prioridades dos compromissos
window.PRIORITIES = {
  urgente: { key:'urgente', label:'Urgente', color:'var(--danger)' },
  quase:   { key:'quase',   label:'Quase urgente', color:'var(--warn)' },
  espera:  { key:'espera',  label:'Dá pra esperar', color:'oklch(0.60 0.05 230)' },
};
window.priorityOf = (c)=> c.priority || (c.urgent ? 'urgente' : '');
window.sectionsFor = (pk, custom)=>{
  const p = window.U.PROJ_BY_KEY[pk];
  return [ ...((p && p.sections) || []), ...((custom && custom[pk]) || []) ];
};
})();
